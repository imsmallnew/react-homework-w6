export default function ProductModal({
    productModalRef,
    target,
    tempProduct,
    categories,
    units,
    handleInputChange,
    handleFileChange,
    handleImageChange,
    imagesUrlRemove,
    badgeReplace,
    imagesUrlAdd,
    closeProductModal,
    handleModalUpdate,
}) {
    return (
        <div id="productModal" ref={productModalRef} className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content border-0 shadow">
                    <div className={`modal-header border-bottom ${target === "create" ? "bg-success" : "bg-primary"}`}>
                        <h5 className="modal-title fs-4 text-white">{target === "create" ? "新增商品" : "編輯商品"}</h5>
                        <button type="button" className="btn-close bg-white" aria-label="Close" onClick={() => closeProductModal()}></button>
                    </div>

                    <div className="modal-body p-4">
                        <div className="row g-4">
                            <div className="col-md-10">
                                <div className='row'>
                                    <div className='col-12 col-md-6'>
                                        <div className="mb-3">
                                            <label htmlFor="title" className="form-label">
                                                商品名稱
                                            </label>
                                            <input
                                                name="title"
                                                id="title"
                                                type="text"
                                                className="form-control"
                                                placeholder="請輸入商品名稱"
                                                onChange={handleInputChange}
                                                value={tempProduct.title}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-6 pb-4'>
                                        <label className="form-check-label" htmlFor="isEnabled">
                                            是否啟用
                                        </label>
                                        <div className="form-check ms-2">
                                            <input
                                                name="is_enabled"
                                                type="checkbox"
                                                className={`form-check-input ${target === "create" && tempProduct.is_enabled === 1 ? "bg-success" : ""}`}
                                                id="isEnabled"
                                                onChange={handleInputChange}
                                                checked={tempProduct.is_enabled === 1}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12 col-md-6'>
                                        <div className="mb-3">
                                            <label htmlFor="category" className="form-label">
                                                分類
                                            </label>
                                            <input
                                                name="category"
                                                id="category"
                                                type="text"
                                                className="form-control"
                                                placeholder="請輸入分類"
                                                onChange={handleInputChange}
                                                value={tempProduct.category}
                                            />
                                            <div className='mt-2'>
                                                {categories.map(value => (
                                                    <label className="badge bg-danger m-1" htmlFor="category" key={value} onClick={(e) => badgeReplace(e)}>{value}</label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-6'>
                                        <div className="mb-3">
                                            <label htmlFor="unit" className="form-label">
                                                單位
                                            </label>
                                            <input
                                                name="unit"
                                                id="unit"
                                                type="text"
                                                className="form-control"
                                                placeholder="請輸入單位"
                                                onChange={handleInputChange}
                                                value={tempProduct.unit}
                                            />
                                            <div className='mt-2'>
                                                {units.map(value => (
                                                    <label className="badge bg-danger m-1" htmlFor="unit" key={value} onClick={(e) => badgeReplace(e)}>{value}</label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-3 mb-3">
                                    <div className="col-6">
                                        <label htmlFor="origin_price" className="form-label">
                                            原價
                                        </label>
                                        <input
                                            name="origin_price"
                                            id="origin_price"
                                            type="number"
                                            className="form-control"
                                            placeholder="請輸入原價"
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                if (value >= 0) {
                                                    handleInputChange(e); // 呼叫原始處理函式
                                                } else {
                                                    alert("原價不能小於 0");
                                                    e.target.value = 0; // 可選：將輸入框值設為 0
                                                }
                                            }}
                                            value={tempProduct.origin_price}
                                            min="0" // 加入限制
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="price" className="form-label">
                                            售價
                                        </label>
                                        <input
                                            name="price"
                                            id="price"
                                            type="number"
                                            className="form-control"
                                            placeholder="請輸入售價"
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                if (value >= 0) {
                                                    handleInputChange(e); // 呼叫原始處理函式
                                                } else {
                                                    alert("售價不能小於 0");
                                                    e.target.value = 0; // 可選：將輸入框值設為 0
                                                }
                                            }}
                                            value={tempProduct.price}
                                            min="0" // 加入限制
                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12 col-md-6'>
                                        <div className="mb-3">
                                            <label htmlFor="description" className="form-label">
                                                商品描述
                                            </label>
                                            <textarea
                                                name="description"
                                                id="description"
                                                className="form-control"
                                                rows={4}
                                                placeholder="請輸入商品描述"
                                                onChange={handleInputChange}
                                                value={tempProduct.description}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-6'>
                                        <div className="mb-3">
                                            <label htmlFor="content" className="form-label">
                                                說明內容
                                            </label>
                                            <textarea
                                                name="content"
                                                id="content"
                                                className="form-control"
                                                rows={4}
                                                placeholder="請輸入說明內容"
                                                onChange={handleInputChange}
                                                value={tempProduct.content}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* 圖片網址編輯區 */}
                                <div className='mb-3'>
                                    <ul className="list-group">
                                        <li key="imageUrl" className={`list-group-item active ${target === "create" ? "bg-success" : ""}`} aria-current="true">
                                            <div className="row">
                                                <label htmlFor="primary-image" className="col-sm-1 col-form-label">
                                                    主圖
                                                </label>
                                                <div className="col-sm-11">
                                                    <div className='column'>
                                                        <input
                                                            type="file"
                                                            accept=".jpg,.jpeg,.png"
                                                            className="form-control"
                                                            id="fileInput"
                                                            name="file-to-upload"
                                                            onChange={(e) => handleFileChange(e)}
                                                        />
                                                        <input
                                                            name="imageUrl"
                                                            type="text"
                                                            id="primary-image"
                                                            className="form-control mt-2"
                                                            placeholder="請輸入主圖連結"
                                                            onChange={handleInputChange}
                                                            value={tempProduct.imageUrl}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        {tempProduct?.imagesUrl?.map((image, index) => (
                                            <li key={`imagesUrl_${index + 1}_${image}`} className={`list-group-item mt-1 ${target === "create" ? "bg-success bg-opacity-25" : "bg-primary bg-opacity-25"}`}>
                                                <div className="row">
                                                    <label htmlFor={`imagesUrl-${index + 1}`} className="col-sm-1 col-form-label">
                                                        副圖{index + 1}
                                                    </label>
                                                    <div className="col-sm-10">
                                                        <input
                                                            id={`imagesUrl-${index + 1}`}
                                                            type="text"
                                                            placeholder={`請輸入副圖${index + 1}連結`}
                                                            className="form-control"
                                                            onChange={(e) => handleImageChange(e, index)}
                                                            value={tempProduct.imagesUrl[index]}
                                                        />
                                                    </div>
                                                    <button type="button" className="btn btn-danger btn-sm col-sm-1" onClick={() => imagesUrlRemove(index)}>
                                                        刪除 <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4 text-center">
                                        <button type="button" className={`btn btn-lg ${target === "create" ? "btn-outline-success" : "btn-outline-primary"}`} disabled={tempProduct?.imagesUrl?.length === 5} onClick={imagesUrlAdd}>
                                            {tempProduct?.imagesUrl?.length === 5 ? "已達上限無法新增副圖" : "新增副圖"} ({tempProduct?.imagesUrl?.length}/5) <i className="fa-regular fa-image"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* 圖片顯示區 */}
                            <div className="col-md-2 modalImgWrap">
                                <div className="mb-2">
                                    {tempProduct.imageUrl ? (
                                        <>
                                            <label
                                                htmlFor="primary-image"
                                                className="form-label border border-2 border-dashed rounded-3 ps-1 pe-1 m-1 bg-dark bg-opacity-50 text-white"
                                            >
                                                主圖
                                            </label>
                                            <img src={tempProduct.imageUrl} alt={tempProduct.title} className="img-fluid" />
                                        </>
                                    ) : (
                                        <>
                                            <h6 className="text-danger">
                                                <i className="fa-regular fa-image"></i> 主圖 尚未提供連結
                                            </h6>
                                        </>
                                    )}
                                </div>

                                {/* 副圖 */}
                                {tempProduct?.imagesUrl?.map((image, index) => (
                                    <div
                                        key={`image-wrap-${index}`}
                                        className="modalImgWrap"
                                    >
                                        {image ? (
                                            <>
                                                <label
                                                    htmlFor={`imagesUrl-${index + 1}`}
                                                    className="form-label border border-2 border-dashed rounded-3 ps-1 pe-1 m-1 bg-dark bg-opacity-50 text-white"
                                                >
                                                    副圖 {index + 1}
                                                </label>
                                                <img
                                                    src={image}
                                                    alt={`副圖 ${index + 1}`}
                                                    className="img-fluid mb-2"
                                                />
                                            </>
                                        ) : (
                                            <h6 className="text-danger">
                                                <i className="fa-regular fa-image"></i> 副圖{index + 1}尚未提供連結
                                            </h6>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer border-top bg-light">
                        <button type="button" className="btn btn-secondary" onClick={() => closeProductModal()}>
                            取消
                        </button>
                        <button type="button" className={`btn ${target === "create" ? "btn-success " : "btn-primary"}`} onClick={() => handleModalUpdate(tempProduct)}>
                            確認
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}