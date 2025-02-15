import ReactLoading from 'react-loading';

function Loading({
    loadingText
}) {
    return (
        <>
            {/* ReactLoading */}
            <div className='loading'>
                <h3 className='me-2'><ReactLoading type={"spin"} color={"#000000"} height={40} width={40} /></h3>
                <h3 className='text-dark'>{loadingText}</h3>
            </div>

            {/* 純css loading */}
            {/* <div className='loading'>
          <h3><span className="spinner-border spinner-border-lg me-3" role="status" aria-hidden="true"></span>
            {loadingText}</h3>
        </div> */}
        </>
    )
}

export default Loading