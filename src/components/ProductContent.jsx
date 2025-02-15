export default function ProductContent({
    tempProduct,
    tempImgUrl,
    setTempImgUrl
}) {
    return (
        <>
            <kbd>商品內容</kbd>
            {tempProduct.title ? (
                <div className="card mt-3">
                    <div className="row">
                        {tempImgUrl ? <div className="col-md-12">
                            <div className="mainWrap">
                                <img src={tempImgUrl} className="object-fit-cover img-fluid w-100 h-100 p-3" alt="主圖" />
                            </div>
                        </div> : <h6 className='text-danger'><i className="fa-regular fa-image"></i> 主圖 尚未提供連結</h6>
                        }
                        <div className="col-md-12">
                            <div className="card-body pl-3 pr-3">
                                <h2 className="card-title">{tempProduct.title}</h2><h5><span className="badge bg-danger">{tempProduct.category}</span></h5>
                                <p className="card-text">商品描述: <small className="text-muted">{tempProduct.description}</small></p>
                                <p className="card-text">商品內容: <small className="text-muted">{tempProduct.content}</small></p>
                                <div className="d-flex">
                                    <h4 className="card-text text-danger fw-bold">{tempProduct.price} 元  / </h4><h4 className="card-text text-secondary"><del>{tempProduct.origin_price} 元</del></h4>
                                </div>
                                <p className="mt-3">更多圖片(點圖放大):</p>
                                <div className="row">
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
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-muted mt-3">請點選按鈕查看內容</div>
            )}
        </>
    )
}