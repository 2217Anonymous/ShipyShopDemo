import React, { useEffect } from "react";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  CloseButton,
  Col,
  Container,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import DataTable from "../../../helpers/Datatable";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { attributeConstants } from "../../../Components/constants/attributeConstants";
import AttributeServices from "../../../services/AttributeServices";
import { ToastRight } from "../../../helpers/Notification/notification";
import { useFormik } from "formik";
import * as Yup from "yup";
import SubmitButton from "../../../Components/Common/SubmitButton";
import ConfirmationModal from "../../../Components/Common/ConfirmationModel";

const Attributes = () => {
  document.title = "Attributes | Shipy Shop";
  const navigate = useNavigate()
  const [DATATABLE, setDATATABLE] = useState([]);
  const [confirmation, setConfirmation] = useState({
    id: null,
    isOpen: false,
    isClose: false,
  });
  const [statuses, setStatuses] = useState({});
  const [currentData, setCurrentData] = useState([]);

  const handleClose = () => {
    formik.resetForm();
  };

  const getAttributes = async () => {
    try {
      const data = await AttributeServices.getAllAttributes({
        type: "attribute",
        option: "Dropdown",
        option1: "Radio",
      });
      if (data.status) {
        setCurrentData(data.values);
        getTableData(data.values);
      } else {
        ToastRight(data.message, "Failed");
      }
    } catch (error) {
      ToastRight(error.message, "Failed");
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "show" ? "hide" : "show";
    setStatuses((prev) => ({ ...prev, [id]: newStatus }));
    await handlePublished(id, newStatus);
  };

  const handlePublished = async (id, status) => {
    try {
      const payload = { status };
      const response = await AttributeServices.updateStatus(id, payload);
      if (response?.status) {
        ToastRight(response.message, "success");
        getAttributes();
      } else {
        ToastRight("Failed to update status.", "Failed");
      }
    } catch (error) {
      ToastRight("Error updating status.", "Failed");
    }
  };

  const handleEdit = async (e, child) => {
    e.preventDefault();
    try {
      const data = await AttributeServices.getAttributeById(child._id);
      if (data.status) {
        const variants = data.values.variants.map((variant) => variant.name.en);
        formik.setValues({
          _id: data.values._id,
          title: { en: data.values.title.en },
          name: { en: data.values.name.en },
          variants: variants,
          option: data.values.option,
          type: "attribute",
          lang: "en",
        });
      } else {
        ToastRight(data.message, "Failed");
      }
    } catch (error) {
      ToastRight(error.message, "Failed");
    }
  };

  const getTableData = (data) => {
    if (data?.length > 0) {
      const tableData = data.map((child, i) => ({
        _id: i + 1,
        name: (
          <Link onClick={(e) => {
            e.preventDefault();
            navigate(`/attribute/${child._id}`);
          }}
          >
            {child.name.en}
          </Link>
        ),
        title: child.title.en,
        option: child.option,
        status: (
          <div className="mb-3 mx-3 d-flex align-items-center">
            <div className="form-check form-switch">
              <Input
                type="checkbox"
                className="form-check-input"
                id="statusSwitch"
                checked={child.status === "show"}
                onChange={() =>
                  handleStatusChange(
                    child._id,
                    statuses[child._id] || child.status
                  )
                }
              />
            </div>
          </div>
        ),
        Action: (
          <div className="hstack gap-3 flex-wrap">
            <Link
              onClick={(e) => {
                e.preventDefault();
                navigate(`/attribute/${child._id}`);
              }}
              className="link-primary fs-15"
            >
              <i className="ri-eye-line"></i>
            </Link>
            <Link
              onClick={(e) => handleEdit(e, child)}
              className="link-warning fs-15"
            >
              <i className="ri-edit-2-line"></i>
            </Link>
            <Link
              onClick={() =>
                setConfirmation({ payload: child._id, isOpen: true })
              }
              className="link-danger fs-15"
            >
              <i className="ri-delete-bin-line"></i>
            </Link>
          </div>
        ),
      }));
      setDATATABLE(tableData);
    }
  };

  const initialValues = {
    _id: "",
    title: { en: "" },
    name: { en: "" },
    variants: [],
    option: "",
    type: "attribute",
    lang: "en",
  };

  const validationSchema = Yup.object({
    name: Yup.object({
      en: Yup.string().required("Please enter a name"),
    }),
  });

  const handleSubmit = async (payload) => {
    try {
      if (payload._id) {
        const response = await AttributeServices.updateAttributes(
          payload._id,
          payload
        );
        if (response.status) {
          ToastRight(response.message, "success");
          getAttributes();
          handleClose();
        } else {
          ToastRight(response.message, "Failed");
        }
      } else {
        // Create new attribute
        const response = await AttributeServices.addAttribute(payload);
        if (response.status) {
          ToastRight(response.message, "success");
          getAttributes();
          handleClose();
        } else {
          ToastRight(response.message, "Failed");
        }
      }
    } catch (error) {
      ToastRight(error.message, "Failed");
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        title: { en: values.title.en },
        name: { en: values.name.en },
        variants: values.variants.map((variant) => ({ name: { en: variant } })),
        option: values.option,
        type: "attribute",
        lang: "en",
      };
      if (values._id) {
        payload._id = values._id;
      }
      handleSubmit(payload);
    },
  });

  const handleVariantKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const newValue = e.target.value.trim().toLowerCase();
      const existingVariants = formik.values.variants.map((v) =>
        v.toLowerCase()
      );
      if (!existingVariants.includes(newValue)) {
        formik.setFieldValue("variants", [
          ...formik.values.variants,
          e.target.value.trim(),
        ]);
      }
      e.target.value = "";
    }
  };

  const handleRemoveVariant = (index) => {
    const newVariants = formik.values.variants.filter((_, i) => i !== index);
    formik.setFieldValue("variants", newVariants);
  };

  useEffect(() => {
    getAttributes();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Attributes" pageTitle="Attributes" />
          <Row>
            <Col lg={8}>
              <Card>
                <CardHeader className="align-items-center d-flex justify-content-between">
                  <div className="flex-grow-1">
                    <h4 className="card-title mb-0">Attributes</h4>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="bg-light p-3">
                    <DataTable
                      Columns={attributeConstants.tableHead}
                      Data={DATATABLE}
                      pageSize={5}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={4}>
              <Card>
                <CardHeader className="align-items-center d-flex justify-content-between">
                  <div className="flex-grow-1">
                    <h4 className="card-title mb-0">Create Attribute</h4>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="bg-light p-3">
                    <Row>
                      <Col md={12}>
                        <div className="mb-3">
                          <Input
                            name="_id"
                            hidden
                            className="form-control"
                            type="text"
                            value={formik.values._id}
                          />
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="mb-3">
                          <Label className="form-label">
                            Attribute Title{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="name.en"
                            className="form-control"
                            placeholder="Color or Size or Dimension or Material or Fabric"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name.en}
                            invalid={
                              formik.touched.name?.en &&
                              !!formik.errors.name?.en
                            }
                          />
                          {formik.touched.name?.en &&
                            formik.errors.name?.en && (
                              <FormFeedback>
                                {formik.errors.name?.en}
                              </FormFeedback>
                            )}
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="mb-3">
                          <Label className="form-label">Display Name</Label>
                          <Input
                            name="title.en"
                            className="form-control"
                            placeholder="Display Name"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.title.en}
                            invalid={
                              formik.touched.title?.en &&
                              !!formik.errors.title?.en
                            }
                          />
                          {formik.touched.title?.en &&
                            formik.errors.title?.en && (
                              <FormFeedback>
                                {formik.errors.title.en}
                              </FormFeedback>
                            )}
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="mb-3">
                          <Label className="form-label">Options</Label>
                          <Input
                            type="select"
                            name="option"
                            className="form-control"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.option}
                          >
                            <option value="">Select an option</option>
                            <option value="Dropdown">Dropdown</option>
                            <option value="Radio">Radio</option>
                          </Input>
                          {formik.touched.option && formik.errors.option && (
                            <FormFeedback>{formik.errors.option}</FormFeedback>
                          )}
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="mb-3">
                          <Label className="form-label">Variants</Label>
                          <Input
                            type="text"
                            className="form-control"
                            placeholder="Type and press Enter"
                            onKeyDown={handleVariantKeyDown}
                          />
                          <div className="mt-2">
                            <Row>
                              {formik.values.variants.map((variant, index) => (
                                <Col
                                  xs={12}
                                  md={6}
                                  key={index}
                                  className="mb-2"
                                >
                                  <Badge className="d-flex bg-info align-items-center justify-content-between px-3 py-2 w-100">
                                    <span className="text-white text-truncate">
                                      {variant}
                                    </span>
                                    <CloseButton
                                      onClick={() => handleRemoveVariant(index)}
                                      className="ms-2"
                                      variant="white"
                                    />
                                  </Badge>
                                </Col>
                              ))}
                            </Row>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <SubmitButton
                      cancel={handleClose}
                      submit={formik.handleSubmit}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <ToastContainer />
          {confirmation.isOpen && (
            <ConfirmationModal
              show={confirmation.isOpen}
              userData={confirmation.payload}
              onClose={() => setConfirmation({ id: null, isOpen: false })}
              statusActionApi={AttributeServices.deleteAttribute}
              listActionApi={getAttributes}
              modalTitle="Delete Attribute"
              deleteAction={true}
            />
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Attributes;
