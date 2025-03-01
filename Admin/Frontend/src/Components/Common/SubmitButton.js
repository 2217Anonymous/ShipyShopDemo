import React from 'react'
import { Button, Spinner } from 'reactstrap'

export default function SubmitButton({ loading, cancel, submit }) {
    return (
        <>
            <div className='d-flex justify-content-end'>
                <Button color="danger" onClick={cancel} className="btn-label right mx-2">
                    <i className=" ri-close-circle-line label-icon align-middle rounded-pill fs-16 ms-2"></i> Cancel
                </Button>
                {
                    loading ? (
                        <Button color="success" className="btn-load">
                            <span className="d-flex align-items-center">
                                <Spinner size="sm" type="grow" className="flex-shrink-0"> Loading... </Spinner>
                                <span className="flex-grow-1 ms-2">
                                    Loading...
                                </span>
                            </span>
                        </Button>
                    ) : (
                        <Button color="success" onClick={submit} className="btn-label right">
                            <i className="ri-check-double-line label-icon align-middle rounded-pill fs-16 ms-2"></i> Success
                        </Button>
                    )
                }
            </div>
        </>
    )
}
