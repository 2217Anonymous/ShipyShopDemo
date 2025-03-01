import React, { useEffect, useState } from "react";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import DataTable from "../../../helpers/Datatable";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useFormik } from "formik";
import * as Yup from "yup";
import SubmitButton from "../../../Components/Common/SubmitButton";
import CategoryServices from "../../../services/CategoryServices";
import { ToastRight } from "../../../helpers/Notification/notification";
import Tree from "rc-tree";
import { showingTranslateValue } from "../../../helpers/translate";
import { categoryConstats } from "../../../Components/constants/categoryConstants";
import avatar from "../../../assets/images/users/avatar.jpg";
import ConfirmationModal from "../../../Components/Common/ConfirmationModel";
import Uploader from "../../../Components/image-uploader/Uploader";

const Categories = () => {
  document.title = "Categories | Shipy Shop";
  const [DATATABLE, setDATATABLE] = useState([]);
  const [confirmation, setConfirmation] = useState({
    id: null,
    isOpen: false,
    isClose: false,
  });
  const [checked, setChecked] = useState("");
  const [treeData, setTreeData] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [selectCategoryName, setSelectCategoryName] = useState("");
  const [selectCategoryId, setSelectCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [parentsOnly, setParentsOnly] = useState(true);
  const [currentData, setCurrentData] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const handleClose = () => {
    formik.resetForm();
    setImageUrl([])
    setSelectCategoryName("")
  };

  const handleSelect = async (key) => {
    if (!key) return;
    setChecked(key);
    const obj = treeData[0];
    const result = findObject(obj, key);
    setSelectCategoryName(showingTranslateValue(result?.name, "en"));
    setSelectCategoryId(result?._id);
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "show" ? "hide" : "show";
    await handlePublished(id, newStatus);
  };

  const motion = {
    motionName: "node-motion",
    motionAppear: false,
    onAppearStart: (node) => ({ height: 0 }),
    onAppearActive: (node) => ({ height: node.scrollHeight }),
    onLeaveStart: (node) => ({ height: node.offsetHeight }),
    onLeaveActive: () => ({ height: 0 }),
  };

  const STYLE = `
        .rc-tree-child-tree {
            display: hidden;
        }
        .node-motion {
            transition: all .3s;
            overflow-y: hidden;
        }
    `;

  const renderCategories = (categories) => {
    let myCategories = [];
    if (categories.length !== 0) {
      for (let category of categories) {
        myCategories.push({
          title: showingTranslateValue(category.name, "en"),
          key: category._id,
          children:
            category.children && category.children.length > 0
              ? renderCategories(category.children)
              : [],
        });
      }
      return myCategories;
    }
  };

  const findObject = (obj, target) => {
    return obj._id === target
      ? obj
      : obj?.children?.reduce(
        (acc, obj) => acc ?? findObject(obj, target),
        undefined
      );
  };

  const handleChildCategories = (category) => {
    if (category.children && category.children.length > 0) {
      setBreadcrumbs([...breadcrumbs, category]);
      setCurrentData(category.children);
      getTableData(category.children);
    } else {
      setDATATABLE([]);
    }
  };

  const handleBack = () => {
    if (breadcrumbs.length > 0) {
      const newBreadcrumbs = [...breadcrumbs];
      newBreadcrumbs.pop();
      const newData =
        newBreadcrumbs.length > 0
          ? newBreadcrumbs[newBreadcrumbs.length - 1].children
          : treeData;
      setBreadcrumbs(newBreadcrumbs);
      setCurrentData(newData);
      getTableData(newData);
    }
  };

  const getTableData = (data) => {
    console.log(data);

    if (data?.length > 0) {

      const tableData = data.map((child, i) => ({
        _id: i + 1,
        icon: (
          <div className="d-flex gap-2 align-items-center">
            <div className="flex-shrink-0">
              <img
                src={child.icon || avatar}
                alt=""
                className="avatar-xs rounded-circle"
              />
            </div>
          </div>
        ),
        name: (
          <>
            <Link onClick={() => handleChildCategories(child)}>
              {child.name.en}
            </Link>
            {parentsOnly && child.children.length > 0 && (
              <ul>
                {child.children.map((subChild) => (
                  <li key={subChild._id}>
                    <Link onClick={() => handleChildCategories(subChild)}>
                      {subChild.name.en}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        ),
        description: child.description.en,
        status:
          child.status === "show" ? (
            <Badge
              color="success"
              className="badge bg-success-subtle text-success badge-border"
            >
              <i className="mdi mdi-circle-medium"></i> Active
            </Badge>
          ) : (
            <Badge
              color="danger"
              className="badge bg-danger-subtle text-danger badge-border"
            >
              <i className="mdi mdi-circle-medium"></i> De Active
            </Badge>
          ),
        Action: (
          <div className="hstack gap-3 flex-wrap">
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

  const handleEdit = async (e, child) => {
    e.preventDefault();
    await CategoryServices.getCategoryById(child._id)
      .then((data) => {
        if (data.status) {
          formik.setValues({
            _id: data.values._id,
            name: { en: data.values.name.en },
            description: { en: data.values.description.en },
            parentId: data.values.parentId || "",
            parentName: data.values.parentName || "",
            icon: data.values.icon || "",
            status: data.values.status,
            lang: "en",
          });
          setSelectCategoryId(data.values.parentId);
          setSelectCategoryName(data.values.parentName);
          setImageUrl(data.values.icon);
        } else {
          ToastRight(data.message, "Failed");
        }
      })
      .catch((error) => {
        ToastRight(error.message, "Failed");
      });
  };

  const initialValues = {
    _id: "",
    name: { en: "" },
    description: { en: "" },
    parentId: "",
    parentName: "",
    icon: "",
    status: "show",
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
        const response = await CategoryServices.updateCategory(
          payload._id,
          payload
        );
        if (response.status) {
          ToastRight(response.message, "success");
          getCategorys();
          handleClose();
        } else {
          ToastRight(response.message, "Failed");
        }
      } else {
        // Create new attribute
        const response = await CategoryServices.addCategory(payload);
        if (response.status) {
          ToastRight(response.message, "success");
          getCategorys();
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
        name: { en: values.name.en },
        description: { en: values.description.en },
        parentId: selectCategoryId || "",
        parentName: selectCategoryName || "",
        icon: imageUrl || "",
        status: values.status,
        lang: "en",
      };
      if (values._id) {
        payload._id = values._id;
      }
      handleSubmit(payload);
    },
  });

  const handlePublished = async (id, status) => {
    try {
      const payload = { status };
      const response = await CategoryServices.updateStatus(id, payload);
      if (response?.status) {
        ToastRight(response.message, "success");
        getCategorys();
      } else {
        ToastRight("Failed to update status.", "Failed");
      }
    } catch (error) {
      ToastRight("Error updating status.", "Failed");
    }
  };

  const getCategorys = async () => {
    await CategoryServices.getAllCategory()
      .then((data) => {
        if (data.status) {
          setTreeData(data.values);
          setCurrentData(data.values);
          getTableData(data.values);
        } else {
          ToastRight(data.message, "Failed");
        }
      })

  };

  useEffect(() => {
    getCategorys();
  }, [parentsOnly]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Categories" pageTitle="Categories" />
          <Row>
            <Col lg={8}>
              <Card>
                <CardHeader className="align-items-center d-flex justify-content-between">
                  <div className="d-flex flex-grow-1 justify-content-between">
                    <h4 className="card-title mb-0">Categories</h4>
                    <div className="form-check form-switch form-switch-success mb-3">
                      <label
                        className="form-check-label"
                        htmlFor="SwitchCheck3"
                      >
                        Parents only
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="SwitchCheck3"
                        checked={parentsOnly}
                        onChange={() => setParentsOnly(!parentsOnly)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="bg-light p-3">
                    <DataTable
                      Columns={categoryConstats.tableHead}
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
                    <h4 className="card-title mb-0">Create Category</h4>
                  </div>
                </CardHeader>

                <CardBody>
                  <div className="bg-light p-3">
                    <Row>
                      {/* Name Field */}
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
                            Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="name.en"
                            className="form-control"
                            placeholder="Enter name"
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
                                {formik.errors.name.en}
                              </FormFeedback>
                            )}
                        </div>
                      </Col>

                      {/* Description Field */}
                      <Col md={12}>
                        <div className="mb-3">
                          <Label className="form-label">Description</Label>
                          <textarea
                            name="description.en"
                            placeholder="Enter description"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description.en}
                            className="form-control"
                            rows="3"
                          ></textarea>
                        </div>
                      </Col>

                      <Col md={12}>
                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="steparrow-gen-info-location-input"
                          >
                            Parent Category{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="parentName"
                            className="form-control"
                            placeholder="Enter name"
                            type="test"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={
                              selectCategoryName ? selectCategoryName : "Home"
                            }
                            invalid={
                              formik.touched?.parentName &&
                                formik.errors?.parentName
                                ? true
                                : false
                            }
                          />
                          {formik.touched?.parentName &&
                            formik.errors?.parentName ? (
                            <FormFeedback type="invalid">
                              {formik.errors?.parentName}
                            </FormFeedback>
                          ) : null}
                          <div className="draggable-demo capitalize">
                            <style
                              dangerouslySetInnerHTML={{ __html: STYLE }}
                            />
                            <Tree
                              expandAction="click"
                              treeData={renderCategories(treeData)}
                              selectedKeys={[checked]}
                              onSelect={(v) => handleSelect(v[0])}
                              motion={motion}
                              animation="slide-up"
                            />
                          </div>
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="mb-3">
                          <label
                            className="form-label"
                            htmlFor="product-image-input"
                          >
                            Category Image{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <div className="text-center">
                            <Uploader
                              imageUrl={imageUrl}
                              setImageUrl={setImageUrl}
                              folder="category"
                              type="category"
                            />
                          </div>
                        </div>
                      </Col>

                      {/* Status Switch */}
                      <Col md={12}>
                        <div className="mb-3 d-flex align-items-center">
                          <Label className="form-label me-3">Status</Label>
                          <div className="form-check form-switch">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="statusSwitch"
                              checked={formik.values.status === "show"}
                              onChange={(e) => {
                                formik.setFieldValue("status", e.target.checked ? "show" : "hide");
                              }}
                            />
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
          <ConfirmationModal
            show={confirmation.isOpen}
            userData={confirmation.payload}
            onClose={() => setConfirmation({ id: null, isOpen: false })}
            statusActionApi={CategoryServices.deleteCategory}
            listActionApi={getCategorys}
            modalTitle="Admin User status change"
            deleteAction={false}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Categories;
