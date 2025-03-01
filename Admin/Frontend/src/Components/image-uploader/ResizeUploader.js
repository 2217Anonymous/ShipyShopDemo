import React, { useEffect, useState } from "react";
import { t } from "i18next";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiXCircle } from "react-icons/fi";
import AWS from 'aws-sdk';
import { Modal } from "react-responsive-modal";
//internal import
import { FiX } from "react-icons/fi";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Container from "./Container";
import Resizer from "react-image-file-resizer";
import Uploader from "./Uploader";
import { ToastRight } from "../../helpers/Notification/notification";

let replaceimg = []

const Displayvalue = ({ openModal,onCloseModal,files,setFiles,handleSelectImage }) => {
  return <div> 
    <Modal
    open={openModal}
    onClose={onCloseModal}
    center
    closeIcon={
  <div className="absolute top-0 right-0 text-red-500 focus:outline-none active:outline-none text-xl border-0">
    <FiX className="text-3xl" />
  </div>
    }
  >
    <div className="cursor-pointer">
      <Uploader
        product
        folder="product"
        imageUrl={files}
        setImageUrl={setFiles}
        handleSelectImage={handleSelectImage}
        type="productreplace"
      />
    </div>
  </Modal>
     </div>;
};

const ResizeUploader = ({ setImageUrl, imageUrl, product, folder ,handleSelectImage,type,resizeUrl,setResizeUrl}) => {
  
  AWS.config.update({
    accessKeyId: process.env.REACT_APP_S3_API_ACCESS_ID, 
    secretAccessKey: process.env.REACT_APP_S3_API_ACCESS_KEY,
    region: process.env.REACT_APP_S3_API_ACCESS_REGION
  });

  const s3 = new AWS.S3();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState("");
  const [openModal,setOpenModal] = useState(false)

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: "image/*",
    multiple: product ? true : false,
    maxSize: 1000000,            // this is bytes ( 1000000 is 1 mb)
    maxFiles: 2,
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

  const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      200,
      "PNG",
      40,
      0,
      (uri) => {
        const resizedFile = new File([uri], file.name, { type: file.type },file.preview,file.preview);
        resolve(resizedFile)
      },
      "base64"
    );
  });

  const handleReplaceImageModal =(image)=>{
    replaceimg = image
    setOpenModal(true)
  }
const handleUploadimage = async (type)=>{
 if(files){
  if (fileRejections) {
    fileRejections.map(({ file, errors }) => (
      <li key={file.path}>
        {file.path} - {file.size} bytes
        <ul>
          {errors.map((e) => (
            <li key={e.code}>
              {e.code === "too-many-files"
                ? ToastRight("Maximum 2 Image Can be Upload!","Failed")              
                : ToastRight(e.message,"Failed")}
            </li>
          ))}
        </ul>
      </li>
    ));
  }
  if (files) {
    files.forEach(async(file) => {
      if (
        product &&
        imageUrl?.length + files?.length >
          2
      ) {
        return ToastRight("Maximum 2 Image Can be Upload!","Failed")
      }

      setLoading(true);
      setError("Uploading....");
      if (product) {
        const result = imageUrl?.find(
          (img) => img === `${process.env.REACT_APP_CLOUDINARY_URL}`
        );
        if (result) return setLoading(false);
      }
      const name = file.name.replaceAll(/\s/g, "");
      const key = folder+ "/" + name
      const keyvalue = 'resize'+ "/" + name
      let splittedar = file.path.split(".");
      let Extentarray = ["jpg", "png", "jpeg"];
      if (Extentarray.indexOf(splittedar[splittedar.length - 1]) === -1) {
        ToastRight('Invalid filetype',"Failed")
        setLoading(false);
        return false;
      }else{
        if(type ==="newUpload"){
          var params = {Bucket: process.env.REACT_APP_S3_NAME, Key: key , Body:  file , ContentDisposition : "attachment"}
          await s3.upload(params,async function(error,result) {
            if(error) {
              ToastRight(err.Message,"Failed")
              setLoading(false);
            } else {
              ToastRight("Image Replace successfully!","success");                
              setLoading(false);
                if (product && result.Location && result) {
                  setImageUrl((imgUrl) => [...imgUrl, result.Location]);
                } else {
                  setImageUrl(result.Location);
                } 
            }
          })
          const  image=  await resizeFile(file)
          var paramsdata = {Bucket: process.env.REACT_APP_S3_NAME, Key: keyvalue , Body: image , ContentDisposition : "attachment"}
          await s3.upload(paramsdata,async function(error,result) {
            if(error) {
              ToastRight(err.Message,"Failed")
            } else {
              ToastRight("Image resize successfully!","success");                
                if (product && result.Location && result) {
                  setResizeUrl((imgUrl) => [...imgUrl, result.Location]);
                } else {
                  setResizeUrl(result.Location);
                } 
            }
          })
      }else{
        try{
          const url = replaceimg?.split("/").pop();
          const public_id = `${folder}/${url}`;
          var params = {Bucket: process.env.REACT_APP_S3_NAME, Key: public_id , Body:  file , ContentDisposition : "attachment"}
           await s3.upload(params,async function(error,result) {
             if(error) {
               ToastRight(err.Message,"Failed")
               setLoading(false);
             } else {
               ToastRight("Image Replace successfully!","success");                
               setOpenModal(false)
               setLoading(false);
                 if (product && result.Location && result) {
                  replaceimg=[]
                   setImageUrl((imgUrl) => [...imgUrl, result.Location]);
                 } else {
                   setImageUrl(result.Location);
                 } 
                 
             }
           })
        }
        catch(err){
        }
        }
      }

     
    });
  }
 }
}

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <div>
        <img
          className="inline-flex border-2 border-gray-100 w-24 max-h-24"
          src={file.preview}
          alt={file.name}
        />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const handleRemoveImage = async (img) => {
    try {
      const url = img.split("/").pop().split(".")[0];
      const public_id = `${folder}/${url}`;
      var params = {Bucket: process.env.REACT_APP_S3_NAME, Key: public_id}
      s3.deleteObject(params,function (err,data){
        if(err){
          setLoading(false);
          ToastRight(err,"Failed")
        }else{
          if (product) {
            const result = imageUrl?.filter((i) => i !== img);
            setImageUrl(result);
          } else {
            setImageUrl("");
          }
        }
      })
    } catch (err) {
      console.error("err", err);
      ToastRight(err.message,"Failed")
      setLoading(false);
    }
  };

  const onCloseModal =()=>{
    setOpenModal(false)
  }

  return (
    <div className="w-full text-center">
           <Displayvalue  openModal={openModal} onCloseModal={onCloseModal} files = {files} setFiles={setFiles} handleSelectImage={handleSelectImage}/>
      <div
        className="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 pt-5 pb-6"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <span className="mx-auto flex justify-center">
          <FiUploadCloud className="text-3xl text-green-500" />
        </span>
        <p className="text-sm mt-2">{t("DragYourImage")}</p>
        <em className="text-xs text-gray-400">{t("imageFormat")}</em>
        <p className="text-xs text-gray-400">{t("imageSize")}</p>
     
      </div>
     {type === 'product' ||type === "templeteImage" ||type === "category" ||type === "coupon" ? <button
         type="button"
         className="text-white focus:outline-none bg-green-600 w-40 mt-2"
         onClick={() => handleUploadimage("newUpload")}
        > upload</button>:""}
        
      <div className="text-green-500">{loading && err}</div>
      <aside className="flex flex-row flex-wrap mt-4">
        {product ? (
          <>
           <DndProvider backend={HTML5Backend}>
            <Container
              setImageUrl={setImageUrl}
              imageUrl={imageUrl}
              handleRemoveImage={handleRemoveImage}
              handleReplaceImageModal={handleReplaceImageModal}
            />
          </DndProvider>
          
          </>
         
          
        ) : !product && imageUrl ? (
          <div className="relative">
            {" "}
            <img
              className="inline-flex border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2"
              src={imageUrl}
              alt="product"
            />
            <button
              type="button"
              className="absolute top-0 right-0 text-red-500 focus:outline-none"
              onClick={() => handleRemoveImage(imageUrl)}
            >
              <FiXCircle />
            </button>
          </div>
        ) : (
          thumbs
        )}

       
      </aside>
      {folder === "productcombination" &&
         <button
         type="button"
         className="text-white focus:outline-none bg-green-600 w-40"
         onClick={() => handleSelectImage(imageUrl)}
        > Update</button>
         }
         {type === "productreplace" &&
         <button
         type="button"
         className="text-white focus:outline-none bg-green-600 w-40"
         onClick={() => handleUploadimage('Replace')}
        > Replace</button>
         }
    </div>
  );
};

export default ResizeUploader;





