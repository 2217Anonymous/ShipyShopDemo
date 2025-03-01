import React, { useEffect, useState } from "react";
import { Container, Spinner } from "reactstrap";

const PageLoader = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    if (!loading) return null;

    return (
        // <div className="d-flex justify-content-center align-items-center vh-100">
        //     <Spinner color="success" size="lg" />
        // </div>
        <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <Spinner color="success" style={{ width: "3rem", height: "3rem" }} />
        </Container>
    );
};

export default PageLoader;
