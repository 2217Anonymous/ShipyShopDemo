import React, { useEffect, useState } from "react";
import { t } from "i18next";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiXCircle, FiX } from "react-icons/fi";
import AWS from "aws-sdk";
import { Modal, ModalHeader, ModalBody, Button, Card, CardBody, Row, Col, Spinner } from "reactstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Container from "./Container";
import { ToastRight } from "../../helpers/Notification/notification";
import { Link } from "react-router-dom";

let replaceimg = [];

const Displayvalue = ({ openModal, onCloseModal, files, setFiles, handleSelectImage }) => {
  return (
    <Modal isOpen={openModal} toggle={onCloseModal} centered>
      <ModalHeader toggle={onCloseModal}>Replace Image</ModalHeader>
      <ModalBody>
        <Uploader
          product
          folder="product"
          imageUrl={files}
          setImageUrl={setFiles}
          handleSelectImage={handleSelectImage}
          type="productreplace"
        />
      </ModalBody>
    </Modal>
  );
};

const Uploader = ({ setImageUrl, imageUrl, product, folder, handleSelectImage, type, resizeUrl, setResizeUrl }) => {
  AWS.config.update({
    accessKeyId: process.env.REACT_APP_S3_API_ACCESS_ID,
    secretAccessKey: process.env.REACT_APP_S3_API_ACCESS_KEY,
    region: process.env.REACT_APP_S3_API_ACCESS_REGION,
  });

  const s3 = new AWS.S3();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (type === 'variant' && files.length > 0) {
      handleUploadimage();
    }
  }, [files]);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: "image/*",
    multiple: product ? true : false,
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const handleReplaceImageModal = (image) => {
    replaceimg = image;
    setOpenModal(true);
  };

  const handleUploadimage = async (type) => {
    if (files) {
      if (fileRejections && fileRejections.length > 0) {
        fileRejections.forEach(({ errors }) => {
          errors.forEach((e) => {
            if (e.code === "too-many-files") {
              ToastRight(`Maximum 5 Image Can be Upload!`, "Failed");
            } else {
              ToastRight(e.message, "Failed");
            }
          });
        });
        return;
      }
    }
    if (files.length > 0) {
      setLoading(true);
      setError("Uploading....");
      try {
        const uploadPromises = files.map(async (file) => {
          const name = file.name.replaceAll(/\s/g, "");
          const key = folder + "/" + name;
          const splittedar = file.name.split(".");
          const Extentarray = ["jpg", "png", "jpeg"];
          if (!Extentarray.includes(splittedar[splittedar.length - 1].toLowerCase())) {
            ToastRight("Invalid file type", "Failed");
            return null;
          }
          const params = { Bucket: process.env.REACT_APP_S3_NAME, Key: key, Body: file, ContentDisposition: "attachment" };
          const result = await s3.upload(params).promise();
          return result.Location;
        });
        const uploadedUrls = (await Promise.all(uploadPromises)).filter(url => url !== null);
        if (uploadedUrls.length === 0) {
          setLoading(false);
          return;
        }
        ToastRight("Images Uploaded successfully!", "success");
        if (product) {
          setImageUrl((prevUrls) => [...prevUrls, ...uploadedUrls]);
          setResizeUrl((prev) => [...prev, ...files]);
        } else {
          setImageUrl(uploadedUrls[0]);
          if (type === 'variant' && handleSelectImage) {
            handleSelectImage(uploadedUrls[0]);
          }
        }
      } catch (error) {
        console.error("Upload error:", error); // Log upload errors
        ToastRight(error.message, "Failed");
      } finally {
        setLoading(false);
        setFiles([]);
      }
    }

  };

  const thumbs = files.map((file, index) => (
    <Col key={file.name} md="4" className="mb-3 relative">
      <Card>
        <CardBody className="p-2 relative">
          <img src={file.preview} alt={file.name} className="img-fluid" />
          <Link
            onClick={() => handleRemove(index)}
            className="link-danger fs-15"
          >
            <i className="ri-delete-bin-line"></i>
          </Link>
        </CardBody>
      </Card>
    </Col>
  ));

  const handleRemove = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const handleRemoveImage = async (img) => {
    try {
      const url = img.split("/").pop();
      const public_id = `${folder}/${url}`;
      const params = { Bucket: process.env.REACT_APP_S3_NAME, Key: public_id };
      await s3.deleteObject(params).promise();
      if (product) {
        setImageUrl((prev) => prev.filter((i) => i !== img));
      } else {
        setImageUrl("");
      }
      ToastRight("Image removed successfully!", "success");
    } catch (err) {
      ToastRight("Failed to remove image", "Failed");
    }
  };

  const onCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="w-full text-center">
      <Displayvalue openModal={openModal} onCloseModal={onCloseModal} files={files} setFiles={setFiles} handleSelectImage={handleSelectImage} />

      {type !== 'variant' ? (
        <Card className="mb-3">
          <CardBody {...getRootProps()} className="text-center p-5">
            <input {...getInputProps()} />
            <FiUploadCloud className="text-3xl text-success mb-3" />
            <p className="mb-1">{t("DragYourImage")}</p>
            <p className="text-muted small">{t("imageFormat")}</p>
            <p className="text-muted small">{t("imageSize")}</p>
          </CardBody>
        </Card>
      ) : (
        <div className="profile-user position-relative d-inline-block mx-auto mb-4">
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            {imageUrl ? (
              <img
                src={imageUrl}
                className="rounded-circle avatar-md img-thumbnail user-profile-image"
                alt="user-profile"
              />
            ) : (
              <div className="rounded-circle avatar-md img-thumbnail bg-light d-flex align-items-center justify-content-center">
                <FiUploadCloud className="text-muted text-xl" />
              </div>
            )}
            <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
              <div className="profile-photo-edit avatar-xs">
                <span className="avatar-title rounded-circle bg-light text-body">
                  <i className="ri-camera-fill"></i>
                </span>
              </div>
            </div>
          </div>
          {imageUrl && (
            <Button
              color="danger"
              size="sm"
              className="position-absolute top-0 start-100 translate-middle"
              onClick={() => handleRemoveImage(imageUrl)}
              style={{ borderRadius: '50%', padding: '4px 8px' }}
            >
              <FiX className="w-3 h-3" />
            </Button>
          )}
        </div>
      )}

      {(type === "product" || type === "templeteImage" || type === "category" || type === "coupon") && (
        <Button color="success" className="w-100 mb-3" onClick={() => handleUploadimage("newUpload")}>
          Upload
        </Button>
      )}

      {loading && <Spinner color="success" className="mb-3" />}

      <Row className="mt-3">
        {product ? (
          <DndProvider backend={HTML5Backend}>
            <Container
              setImageUrl={setImageUrl}
              imageUrl={imageUrl}
              handleRemoveImage={handleRemoveImage}
              handleReplaceImageModal={handleReplaceImageModal}
            />
          </DndProvider>
        ) : !product && imageUrl && type !== 'variant' ? (
          <div className="flex justify-center w-full">
            {console.log(type)}
            <div className="relative">
              <img
                src={typeof imageUrl === 'string' ? imageUrl : imageUrl[0]}
                alt="upload"
                className={`${type === 'variant' ? 'h-16 w-16 rounded-full border-2 border-gray-200' :
                  type === 'category' ? 'h-25 w-25 rounded-lg shadow-md' : 'h-24 w-24 rounded-lg shadow-md'
                  } object-cover`}
              />
              {type !== 'category' && (
                <Button
                  color="danger"
                  size="sm"
                  className="absolute top-0 right-0 p-0.5"
                  onClick={() => handleRemoveImage(imageUrl)}
                >
                  <i className="ri-delete-bin-line"></i>

                </Button>
              )}
            </div>
          </div>
        ) : (
          thumbs
        )}
      </Row>

      {type === "variant" && loading && <Spinner color="success" className="mb-3" />}

      {folder === "productcombination" && (
        <Button color="success" className="w-100 mb-3" onClick={() => handleSelectImage(imageUrl)}>
          Update
        </Button>
      )}

      {type === "productreplace" && (
        <Button color="success" className="w-100 mb-3" onClick={() => handleUploadimage("Replace")}>
          Replace
        </Button>
      )}
    </div>
  );
};

export default Uploader;