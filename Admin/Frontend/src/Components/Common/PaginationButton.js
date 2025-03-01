import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Row } from "reactstrap";

const PaginationButtons = ({ itemsPerPage, totalItems, paginate }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }
    return (
        <>
            {pageNumbers.map((number) => (
                <li key={number} className="page-item">
                    <button onClick={() => paginate(number)} className="page-link">
                        {number}
                    </button>
                </li>
            ))}
        </>
    );
};

export default PaginationButtons