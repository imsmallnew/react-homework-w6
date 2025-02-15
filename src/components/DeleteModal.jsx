export default function DeleteModal({
    deleteModalRef,
    tempProduct,
    navigation,
    cartItem,
    deleteProduct,
    closeDeleteModal,
    removeCartItem,
    removeAllCart
}) {
    return (
        <div className="modal fade" ref={deleteModalRef} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-danger">
                        <h5 className="modal-title text-white" id="exampleModalLabel">{navigation === 'admin' ? '請確認是否刪除商品:' : cartItem?.product?.title ? '請確認是否移除此商品:' : '請確認是否清空購物車?'}</h5>
                        <button type="button" className="btn-close bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {navigation === 'admin' ? (<>
                            <p>商品名稱: {tempProduct?.title}</p>
                            <p>{tempProduct?.id}</p>
                        </>) :
                            cartItem?.product?.title ? (
                                <>
                                    <p>商品名稱: {cartItem?.product?.title}</p>
                                    <p>{cartItem?.id}</p>
                                </>
                            ) : (
                                <p>注意: 購物車清空不可復原</p>
                            )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => closeDeleteModal()}>
                            取消
                        </button>
                        {navigation === 'admin' ? (
                            <button type="button" className={`btn btn-danger`} onClick={() => deleteProduct(tempProduct.id)}>
                                確認刪除
                            </button>) : (
                            <button type="button" className={`btn btn-danger`} onClick={() => {
                                cartItem?.product?.title ? removeCartItem(cartItem) : removeAllCart()
                            }}>
                                {cartItem?.product?.title ? '確認刪除' : '確認清空'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}