import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Input, Label, Row, Button, Form, FormFeedback } from 'reactstrap';
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
import * as Yup from "yup";
import { useFormik } from "formik";
import logoDark from "../../assets/images/logo/shipy.png";
import { ToastContainer } from 'react-toastify';
import { admin_login, seller_login } from '../../slices/auth/login/reducer';
import { ToastRight } from '../../helpers/Notification/notification';
import AuthSlider from '../AuthenticationInner/authCarousel';

const Login = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [passwordShow, setPasswordShow] = useState(false);
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().required("Please Enter Your Email"),
            password: Yup.string().required("Please Enter Your Password"),
        }),
        onSubmit: (userData) => {
            const values = { ...userData, loginType: 'Admin' }
            dispatch(seller_login(values))
                .then((data) => {                    
                    const res = data.payload;
                    const msg = res.message;
                    const token = res.token;
                    if (msg === "Login success") {
                        ToastRight(msg, "success");
                        localStorage.setItem("accessToken", token);
                        props.router.navigate('/dashboard');
                    } else {
                        ToastRight(res.error, "Failed");
                    }
                })
                .catch((error) => {
                    ToastRight(`Login failed: ${error.message}`, "Failed");
                });
        }
    });

    useEffect(() => {
        const keyDownHandler = event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                formik.handleSubmit()
            }
        };
        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [])

    document.title = "SignIn | Shipy Shop";
    return (
        <>
            {/* <ParticlesAuth> */}
            <ToastContainer />
            <div className="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
                <div className="bg-overlay"></div>
                <div className="auth-page-content overflow-hidden">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <Card className="overflow-hidden m-0">
                                    <Row className="justify-content-center g-0">
                                        <AuthSlider />
                                        <Col lg={6}>
                                            <Row>
                                                <Col lg={12}>
                                                    <div className="text-center mt-sm-5 text-white-50">
                                                        <div>
                                                            <Link to="/" className="d-inline-block auth-logo">
                                                                <img src={logoDark} alt="" height="50" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div className="p-lg-5 p-4">
                                                <div className="text-center mt-2">
                                                    <h5>Welcome Back !</h5>
                                                    <p className="text-muted">Sign in to continue to <b>Shipy.</b></p>
                                                </div>

                                                <Form>
                                                    <div className="mb-3">
                                                        <Label htmlFor="email" className="form-label">Email</Label>
                                                        <Input
                                                            name="email"
                                                            className="form-control"
                                                            placeholder="Enter email"
                                                            type="email"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.email || ""}
                                                            invalid={
                                                                formik.touched.email && formik.errors.email ? true : false
                                                            }
                                                        />
                                                        {formik.touched.email && formik.errors.email ? (
                                                            <FormFeedback type="invalid">{formik.errors.email}</FormFeedback>
                                                        ) : null}
                                                    </div>

                                                    <div className="mb-3">
                                                        <div className="float-end">
                                                            <Link to="/forgot-password">Forgot password?</Link>
                                                        </div>
                                                        <Label className="form-label" htmlFor="password-input">Password</Label>
                                                        <div className="position-relative auth-pass-inputgroup mb-3">
                                                            <Input
                                                                name="password"
                                                                value={formik.values.password || ""}
                                                                type={passwordShow ? "text" : "password"}
                                                                className="form-control pe-5"
                                                                placeholder="Enter Password"
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                invalid={
                                                                    formik.touched.password && formik.errors.password ? true : false
                                                                }
                                                            />
                                                            {formik.touched.password && formik.errors.password ? (
                                                                <FormFeedback type="invalid">{formik.errors.password}</FormFeedback>
                                                            ) : null}
                                                            <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" type="button" id="password-addon" onClick={() => setPasswordShow(!passwordShow)}><i className="ri-eye-fill align-middle"></i></button>
                                                        </div>
                                                    </div>

                                                    <div className="form-check">
                                                        <Input className="form-check-input" type="checkbox" value="" id="auth-remember-check" />
                                                        <Label className="form-check-label" htmlFor="auth-remember-check">Remember me</Label>
                                                    </div>

                                                    <div className="mt-4">
                                                        <Button color="success" className="btn btn-success w-100" onClick={formik.handleSubmit}>
                                                            Sign In
                                                        </Button>
                                                    </div>
                                                </Form>

                                                <div className="mt-5 text-center">
                                                    <p className="mb-0">Don't have an account ? <Link to="/seller-register" className="fw-semibold text-primary text-decoration-underline"> Signup</Link> </p>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>

                        </Row>
                    </Container>
                </div>

                <footer className="footer">
                    <Container>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="text-center">
                                    <p className="mb-0">{new Date().getFullYear()} Ship Shop. Crafted with <i className="mdi mdi-heart text-danger"></i> by Tek-Partners</p>
                                </div>
                            </div>
                        </div>
                    </Container>
                </footer>
            </div>
            {/* </ParticlesAuth> */}
        </>
    );
};

export default withRouter(Login);