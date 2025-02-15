export default function ClientProductModal({
    clientProductModalRef,
    tempImgUrl,
    tempProduct,
    orderQty,
    setOrderQty,
    setTempImgUrl,
    closeClientProductModal,
    addCartItem,
}) {
    // 客戶商品Modal選擇數量
    const handleItemQtyChange = async (e) => {
        setOrderQty(Number(e.target.value))
    };
    return (
        <>
            <div id="clientProductModal" ref={clientProductModalRef} className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 shadow">

                        <div className="modal-body">
                            <div className="card">
                                <div className="row">
                                    {tempImgUrl ? <div className="col-md-5">
                                        <div className="mainWrap">
                                            <img src={tempImgUrl} className="object-fit-cover img-fluid w-100 h-100 p-3" alt="主圖" />
                                        </div>
                                        <p className="ps-3">更多圖片(點圖放大):</p>
                                        <div className="row ps-3 pe-3">
                                            {tempProduct.imageUrl && <div className="col-md-4 mb-3">
                                                <div className="subWrap">
                                                    <div className="imgFrame">
                                                        <img src={tempProduct.imageUrl} className="card-img w-100 h-100 text-start object-fit-cover" alt="副圖" onClick={() => { setTempImgUrl(tempProduct.imageUrl) }} />
                                                    </div>
                                                </div>
                                            </div>}
                                            {tempProduct?.imagesUrl?.map((item, index) => {
                                                if (!item) return null; // 副圖連結為空時不顯示圖片
                                                return (
                                                    <div key={index} className="col-md-4 mb-3">
                                                        <div className="subWrap">
                                                            <div className="imgFrame">
                                                                <img src={item} className="card-img w-100 h-100 text-start object-fit-cover" alt="副圖" onClick={() => { setTempImgUrl(item) }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div> : <h6 className='text-danger'><i className="fa-regular fa-image"></i> 主圖 尚未提供連結</h6>
                                    }
                                    <div className="col-md-7">
                                        <div className="card-body pl-3 pr-3">
                                            <h2 className="card-title">{tempProduct.title}</h2><h5><span className="badge bg-danger">{tempProduct.category}</span></h5>
                                            <p className="card-text">商品描述: <small className="text-muted">{tempProduct.description}</small></p>
                                            <p className="card-text">商品內容: <small className="text-muted">{tempProduct.content}</small></p>
                                            <div className="d-flex">
                                                <h4 className="card-text text-primary fw-bold">{tempProduct.price} 元  / </h4><h4 className="card-text text-secondary"><del>{tempProduct.origin_price} 元</del></h4>
                                            </div>
                                            <label htmlFor="price" className="form-label me-2">
                                                訂購數量:
                                            </label>
                                            <select value={orderQty} onChange={(e) => handleItemQtyChange(e)}>
                                                {Array.from({ length: 10 }).map((_, index) => {
                                                    return (<option key={index} value={index + 1}>
                                                        {index + 1}
                                                    </option>)
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer border-top bg-light">
                            <button type="button" className="btn btn-secondary" onClick={() => closeClientProductModal()}>
                                取消
                            </button>
                            <button type="button" className={`btn btn-danger`} onClick={() => addCartItem(tempProduct, orderQty)}>
                                加入購物車
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}