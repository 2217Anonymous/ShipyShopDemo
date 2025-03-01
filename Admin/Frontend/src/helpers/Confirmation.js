import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Col, FormFeedback, Input, Modal, ModalBody, ModalHeader } from 'reactstrap';
import * as Yup from "yup";
import { useFormik } from "formik";
import { deactive_admin_module, list_admin_module } from '../slices/sortscript/Admin/module';
import { ToastRight } from './Notification/notification';
import { useDispatch, useSelector } from 'react-redux';

export default function Confirmation({show, userData,listApi,storeApi,onClose}) {
    const dispatch = useDispatch()
    const {loading,error} = useSelector(state => state.AdminModule)
    const handleClose = () => {
        setmodal_animationZoom(false); 
        if (onClose) {
            onClose();
        }
    };

    const initialValues = {password    : "",}
    const validationSchema = Yup.object({
        password    : Yup.string().required("Please Enter Your Password"),
    })

    const onSubmit = (userInputData,{resetForm}) => {
        const data = {...userInputData,userData};
        dispatch(storeApi(data)).then(data => {
            const res   = data.payload;
            const type  = res.result;
            const msg   = res.Msg;
            if (type === "success" && res.Data) {
                ToastRight(msg, type)
                dispatch(listApi())
                resetForm()
                onClose()
            } else if (type === 'Failed') {
                ToastRight(msg, type);
            }
        }).catch(error =>{
            ToastRight(error.message, 'Failed');
        })
    }
    
    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit,  
    });
  return (
    <>
        <Modal id="flipModal" isOpen={show} toggle={handleClose} modalClassName="zoomIn" centered >
            <ModalHeader className="modal-title" id="flipModalLabel" toggle={handleClose}>
              Password Confirmation
            </ModalHeader>
            <ModalBody className="modal-body text-center p-5">
                <lord-icon src="https://cdn.lordicon.com/pithnlch.json"
                    trigger="loop" colors="primary:#121331,secondary:#08a88a" style={{ width: "120px", height: "120px" }}>
                </lord-icon>
                <div className="mt-4">
                    <h4 className="mb-3">Please Enter Your Password</h4>
                    <Col lg={12}>
                        <div className="mb-3">
                            <Input
                                name="password"
                                type="password"
                                className="form-control"
                                id="steparrow-gen-info-password-input"
                                placeholder="Enter Password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password || ""}
                                invalid={
                                    formik.touched.password && formik.errors.password ? true : false
                                }
                            />
                      {formik.touched.password && formik.errors.password && (
                          <FormFeedback type="invalid">{formik.errors.password}</FormFeedback>
                      )}
                        </div>
                    </Col>
                    <div className="hstack gap-2 justify-content-center">
                        <Link className="btn btn-link link-danger fw-medium" onClick={handleClose}><i className="ri-close-line me-1 align-middle"></i> Close</Link>
                        <Link onClick={formik.handleSubmit} disabled className={`btn btn-success ${!loading ? 'btn-disable' : ''}`} >{loading?'Loading...':'Submited'}</Link>
                    </div>
                </div>
            </ModalBody>
        </Modal> 
    </>
  )
}
