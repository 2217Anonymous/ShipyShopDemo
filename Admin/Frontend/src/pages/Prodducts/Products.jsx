import React, { useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Input, Row } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import DataTable from '../../helpers/Datatable';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { ToastRight } from '../../helpers/Notification/notification';
import ConfirmationModal from '../../Components/Common/ConfirmationModel';
import { productConstants } from '../../Components/constants/productConstants';
import ProductServices from '../../services/ProductServices';
import avatar from '../../assets/images/users/avatar.jpg';


const Products = () => {
    document.title = "Products | Shipy Shop";
    const [DATATABLE, setDATATABLE] = useState([])
    const navigate = useNavigate()
    const [confirmation, setConfirmation] = useState({ id: null, isOpen: false, isClose: false });
    const [statuses, setStatuses] = useState({});

    const getProducts = (async () => {
        await ProductServices.getAllProducts({
            page: 0,
            limit: 0,
            category: "",
            title: "",
            price: "",
        }).then((data) => {
            if (data.status) {
                getTableData(data?.values?.products)
            } else {
                ToastRight(data.message, "Failed");
            }
        }).catch((error) => {
            ToastRight(error.message, "Failed");
        });
    })

    const handleStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === "show" ? "hide" : "show";
        setStatuses((prev) => ({ ...prev, [id]: newStatus }));
        await handlePublished(id, newStatus);
    };

    const handlePublished = async (id, status) => {
        const payload = { status }; // Correct payload format
        try {
            const response = await ProductServices.updateStatus(id, payload);
            if (response?.status) {
                ToastRight(response?.message, "success");
                getProducts()
            } else {
                console.error("Failed to update status.");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const getTableData = (data) => {
        if (data?.length > 0) {
            const sortedData = [...data].sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
            const tableData = sortedData?.map((child, i) => {
                return {
                    _id: i + 1,
                    title: (<>
                        <div className="d-flex gap-2 align-items-center">
                            <div className="flex-shrink-0">
                                <img src={child.image[0] || avatar} alt="" className="avatar-xs rounded-circle" />
                            </div>
                            {child.title.en}
                        </div>
                    </>),
                    // FIXED HERE
                    category: child.category?.name?.en || "N/A",
                    prices: child?.prices?.price,
                    stock: child.stock,
                    insertByRole: child.insertByRole,
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
                        <>
                            <div className="hstack gap-3 flex-wrap">
                                <Link onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/product-details/${child._id}`);
                                }} className="fs-15"><i className="ri-eye-line"></i></Link>
                                <Link onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/product/${child._id}`);
                                }} className="link-warning fs-15"><i className="ri-edit-2-line"></i></Link>
                                <Link
                                    onClick={() => setConfirmation({ payload: child._id, isOpen: true })}
                                    className="link-danger fs-15">
                                    <i className="ri-delete-bin-line"></i></Link>
                            </div>
                        </>
                    )
                }
            })
            setDATATABLE(tableData);
        }
    };

    useEffect(() => {
        getProducts()
    }, [])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Products" pageTitle="Products" />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader className="align-items-center d-flex justify-content-between">
                                    <div className="flex-grow-1">
                                        <h4 className="card-title mb-0">Products</h4>
                                    </div>
                                    <Link to={'/add-product'} className="btn btn-success btn-label right shadow">
                                        <i className=" ri-table-line label-icon align-middle rounded-pill fs-16 ms-2"></i> Create Product
                                    </Link>
                                </CardHeader>
                                <CardBody>
                                    <div className="bg-light p-3">
                                        <DataTable Columns={productConstants.tableHead} Data={DATATABLE} pageSize={10} />
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
                        statusActionApi={ProductServices.deleteProduct}
                        listActionApi={getProducts}
                        modalTitle="Admin User status change"
                        deleteAction={true}
                    />

                </Container>
            </div>
        </React.Fragment>
    );
};

export default Products;