import PropTypes from "prop-types";
import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { ToastRight } from "../../helpers/Notification/notification";
import { useDispatch } from "react-redux";

const ConfirmationModal = ({
  show,
  userData,
  onClose,
  statusActionApi,
  listActionApi,
  deleteAction
}) => {
  const dispatch = useDispatch()
  const handleClick = (async (param) => {
    const data = { param }
    await statusActionApi(param).then((data) => {
      const msg = data.message;
      ToastRight(msg, "success");
        ToastRight(msg, "success");
        onClose()
        listActionApi()
    })
      .catch((error) => {
        ToastRight(error.message, 'Failed');
      });
  })

  return (
    <Modal isOpen={show} toggle={onClose} centered={true}>
      <ModalBody className="py-3 px-5">
        <div className="mt-2 text-center">
          <div>
            <lord-icon
              src="https://cdn.lordicon.com/gsqxdxog.json"
              trigger="loop"
              colors="primary:#f7b84b,secondary:#fa896b"
              style={{ inlineSize: "100px", blockSize: "100px" }}
            ></lord-icon>
          </div>
          <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
            <h4>Are you sure ?</h4>
            <p className="text-muted mx-4 mb-0">
              {`Are you sure you want to ${deleteAction ? 'remove' : 'change'} this record ?`}
            </p>
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <button type="button" className="btn w-sm btn-light" data-bs-dismiss="modal" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn w-sm btn-danger " id="delete-record" onClick={() => handleClick(userData)}>
            {`Yes, ${deleteAction ? 'Delete' : 'Change'} It!`}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  onClose: PropTypes.func,
  show: PropTypes.any,
};

export default ConfirmationModal;