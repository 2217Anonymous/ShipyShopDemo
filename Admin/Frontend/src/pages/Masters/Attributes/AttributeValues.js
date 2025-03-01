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
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import DataTable from "../../../helpers/Datatable";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { attributeValueConstants } from "../../../Components/constants/attributeConstants";
import AttributeServices from "../../../services/AttributeServices";
import { ToastRight } from "../../../helpers/Notification/notification";
import { useFormik } from "formik";
import * as Yup from "yup";
import SubmitButton from "../../../Components/Common/SubmitButton";
import ConfirmationModal from "../../../Components/Common/ConfirmationModel";

const AttributeValues = () => {
    document.title = "Attributes | Shipy Shop";
    const { param } = useParams();
    const [DATATABLE, setDATATABLE] = useState([]);
    const [confirmation, setConfirmation] = useState({
        id: null,
        isOpen: false,
        isClose: false,
    });
    const [statuses, setStatuses] = useState({});
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    const handleClose = () => {
        formik.resetForm();
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

    const getAttributes = async () => {
        try {
            const data = await AttributeServices.getAttributeById(param);
            if (data.status) {
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
            const response = await AttributeServices.updateChildStatus(id, payload);
            if (response?.status) {
                ToastRight(response.message, "Success");
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
            const payload = {
                id: param,
                ids: child
            }
            const data = await AttributeServices.getChildAttributeById(payload);
            if (data.status) {
                formik.setValues({
                    _id: data.values._id,
                    name: { en: data.values.name.en },
                    status: data.values.status,
                });
            } else {
                ToastRight(data.message, "Failed");
            }
        } catch (error) {
            ToastRight(error.message, "Failed");
        }
    };

    const getTableData = (data) => {
        if (data?.variants?.length > 0) {
            const tableData = data?.variants
                .map((child, i) => ({
                    _id: i + 1,
                    name: child.name.en,
                    type: data.option,
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
                                onClick={(e) => handleEdit(e, child._id)}
                                className="link-warning fs-15"
                            >
                                <i className="ri-edit-2-line"></i>
                            </Link>
                            <Link
                                onClick={() =>
                                    setConfirmation({ payload: { "id": param, "ids": child._id }, isOpen: true })
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
        name: { en: "" },
        status: "show",
    };

    const validationSchema = Yup.object({
        name: Yup.object({
            en: Yup.string().required("Please enter a name"),
        }),
    });

    const handleSubmit = async (data) => {
        try {
            if (data._id) {
                const payload = {
                    id: param,
                    ids: data._id
                }
                const response = await AttributeServices.updateChildAttributes(
                    payload,
                    data
                );
                if (response.status) {
                    ToastRight(response.message, "Success");
                    getAttributes();
                    handleClose();
                } else {
                    ToastRight(response.message, "Failed");
                }
            } else {
                // Create new attribute
                const response = await AttributeServices.addChildAttribute(param, data);
                if (response.status) {
                    ToastRight(response.message, "Success");
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
                name: { en: values.name.en },
                status: values.status,
            };
            if (values._id) {
                payload._id = values._id;
            }
            handleSubmit(payload);
        },
    });

    useEffect(() => {
        getAttributes();
    }, []);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Attribute Values" pageTitle="Attribute Values" />
                    <Row>
                        <Col lg={8}>
                            <Card>
                                <CardHeader className="align-items-center d-flex justify-content-between">
                                    <div className="flex-grow-1">
                                        <h4 className="card-title mb-0">Attribute Values</h4>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div className="bg-light p-3">
                                        <DataTable
                                            Columns={attributeValueConstants.tableHead}
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
                                        <h4 className="card-title mb-0">Create Values</h4>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div className="bg-light p-3">
                                        <Row>
                                            <Col md={12}>
                                                <div className="mb-3">
                                                    <Label className="form-label">
                                                        Display Name{" "}
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
                                                <div className="mb-3 d-flex align-items-center">
                                                    <Label className="form-label me-3">Status</Label>
                                                    <div className="form-check form-switch">
                                                        <Input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            id="statusSwitch"
                                                            checked={formik.values.status === "show"}
                                                            onChange={(e) =>
                                                                formik.setFieldValue(
                                                                    'status',
                                                                    e.target.checked ? 'show' : 'hide'
                                                                )
                                                            }
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
                    {confirmation.isOpen && (
                        <ConfirmationModal
                            show={confirmation.isOpen}
                            userData={confirmation.payload}
                            onClose={() => setConfirmation({ id: null, isOpen: false })}
                            statusActionApi={AttributeServices.deleteChildAttribute}
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

export default AttributeValues;
