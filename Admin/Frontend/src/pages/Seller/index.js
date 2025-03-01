import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Row,
    Modal,
    ModalHeader,
    ModalBody,
    Badge,
    Button,
    FormGroup,
    Input,
    Label
} from "reactstrap";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import DataTable from "../../helpers/Datatable";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { sellerConstats } from "../../Components/constants/sellerConstants";
import SellerServices from "../../services/SellerServices";
import { ToastRight } from "../../helpers/Notification/notification";

const Sellers = () => {
    document.title = "Sellers | Shipy Shop";
    const [DATATABLE, setDATATABLE] = useState([]);
    const [detailsModal, setDetailsModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [sellerDetails, setSellerDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [actionType, setActionType] = useState({ type: "", section: "" });
    const [rejectReason, setRejectReason] = useState("");

    const statusBadge = (status) => {
        const statusMap = {
            0: "warning",
            1: "success",
            2: "danger"
        };
        return <Badge className={`bg-${statusMap[status]}`}>{{
            0: "Pending",
            1: "Approved",
            2: "Rejected"
        }[status]}</Badge>;
    };

    const getSellers = async () => {
        try {
            const data = await SellerServices.getAllSeller();
            data.status && getTableData(data.details);
        } catch (error) {
            ToastRight(error.message, "Failed");
        }
    };

    const handleView = async (seller) => {
        try {
            setLoading(true);
            const response = await SellerServices.viewSingleSeller({ id: seller?.seller_id });
            if (response.status) {
                setSellerDetails(response.details);
                setDetailsModal(true);
            }
        } catch (error) {
            ToastRight(error.message, "Failed");
        } finally {
            setLoading(false);
        }
    };

    const handleActionClick = (section, type) => {
        setActionType({ section, type });
        setConfirmModal(true);
    };

    const handleApproveReject = async () => {
        const payload = {
            type: actionType.section,
            reason: actionType.type === "reject" ? rejectReason : "Verified by admin",
            id: sellerDetails.seller_id,
            status: actionType.type === "approve" ? 1 : 2
        };

        try {
            const response = await SellerServices.ApproveRejectUpdate(payload);
            if (response.status) {
                ToastRight(response.message, "success");
                getSellers();
                setDetailsModal(false);
            }
        } catch (error) {
            ToastRight(error.message, "Failed");
        } finally {
            setConfirmModal(false);
            setRejectReason("");
            setActionType({ type: "", section: "" });
        }
    };

    const getTableData = (data) => {
        const tableData = data?.map((seller, index) => ({
            _id: index + 1,
            name: seller.name,
            email: seller.email,
            phoneno: seller.phone,
            GSTINnumber: seller.GSTINnumber,
            createdAt: seller.createdAt.split("T")[0].toString(),
            status: <Badge className={`bg-${seller.status === "Active" ? "success" : "danger"}`}>
                {seller.status}
            </Badge>,
            Action: (
                <div className="hstack gap-3">
                    <Link
                        to="#"
                        onClick={() => handleView(seller)}
                        className="link-primary fs-16"
                    >
                        <i className="ri-eye-line" />
                    </Link>
                </div>
            )
        }));
        setDATATABLE(tableData || []);
    };

    const SectionCard = ({ title, data, statusKey, type }) => (
        <Card className="mb-3">
            <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{title}</h5>
                <div className="d-flex gap-2">
                    <Button
                        color="success"
                        size="sm"
                        onClick={() => handleActionClick(type, "approve")}
                        disabled={data[statusKey] === 1}
                    >
                        Approve
                    </Button>
                    <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleActionClick(type, "reject")}
                        disabled={data[statusKey] === 2}
                    >
                        Reject
                    </Button>
                </div>
            </CardHeader>
            <CardBody>
                {Object.entries(data).map(([key, value]) => (
                    key !== statusKey && (
                        <p key={key} className="mb-1">
                            <strong>{key}:</strong> {value.toString()}
                        </p>
                    )
                ))}
                <div className="mt-2">
                    Status: {statusBadge(data[statusKey])}
                </div>
            </CardBody>
        </Card>
    );

    useEffect(() => {
        getSellers();
    }, []);

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb title="Sellers" pageTitle="Management" />
                <Row>
                    <Col lg={12}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Seller List</h4>
                            </CardHeader>
                            <CardBody>
                                <DataTable
                                    Columns={sellerConstats.tableHead}
                                    Data={DATATABLE}
                                    pageSize={10}
                                    pagination={true}
                                    loading={loading}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* Details Modal */}
                <Modal isOpen={detailsModal} toggle={() => setDetailsModal(false)} size="lg">
                    <ModalHeader toggle={() => setDetailsModal(false)}>
                        Seller Details - {sellerDetails?.name}
                    </ModalHeader>
                    <ModalBody>
                        {sellerDetails ? (
                            <>
                                <SectionCard
                                    title="Address Details"
                                    data={sellerDetails?.addressDetails}
                                    statusKey="status"
                                    type="address"
                                />
                                <SectionCard
                                    title="Business Details"
                                    data={sellerDetails?.bussinessDetails}
                                    statusKey="status"
                                    type="business"
                                />
                                <SectionCard
                                    title="Bank Details"
                                    data={sellerDetails?.bankDetails}
                                    statusKey="status"
                                    type="bank"
                                />
                                <SectionCard
                                    title="Signature"
                                    data={sellerDetails?.signature}
                                    statusKey="status"
                                    type="signature"
                                />
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <p><strong>Account Status:</strong> {sellerDetails?.status}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p><strong>Registration Date:</strong>
                                            {new Date(sellerDetails?.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-4">Loading details...</div>
                        )}
                    </ModalBody>
                </Modal>

                {/* Confirmation Modal */}
                <Modal isOpen={confirmModal} toggle={() => setConfirmModal(false)}>
                    <ModalHeader toggle={() => setConfirmModal(false)}>
                        {actionType.type === "approve" ? "Confirm Approval" : "Confirm Rejection"}
                    </ModalHeader>
                    <ModalBody>
                        {actionType.type === "approve" ? (
                            <p>Are you sure you want to approve this {actionType.section}?</p>
                        ) : (
                            <>
                                <p>Are you sure you want to reject this {actionType.section}?</p>
                                <FormGroup>
                                    <Label>Reason for rejection</Label>
                                    <Input
                                        type="textarea"
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        placeholder="Enter reason"
                                        required
                                    />
                                </FormGroup>
                            </>
                        )}
                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <Button color="secondary" onClick={() => {
                                setConfirmModal(false);
                                setRejectReason("");
                            }}>
                                Cancel
                            </Button>
                            <Button 
                                color={actionType.type === "approve" ? "success" : "danger"}
                                onClick={handleApproveReject}
                                disabled={actionType.type === "reject" && !rejectReason}
                            >
                                Confirm
                            </Button>
                        </div>
                    </ModalBody>
                </Modal>

                <ToastContainer />
            </Container>
        </div>
    );
};

export default Sellers;