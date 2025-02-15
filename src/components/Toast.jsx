function Toast ({
    toastMsg
}) {
    return(
        <div aria-live="polite" aria-atomic="true" className="d-flex justify-content-center align-items-center w-100">
            <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-body">
                    {toastMsg}
                    <button type="button" className="btn-close float-end" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>
    )
}

export default Toast