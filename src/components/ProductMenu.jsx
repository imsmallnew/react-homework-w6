export default function ProductMenu({
    state,
    productList,
    tempProduct,
    openProductModal,
    openDeleteModal,
    handleChangeOption,
    setTempProduct,
    setTempImgUrl,
    setState,
}) {
    return (
        <>
            <div className='row'>
                <div className='col-6 mt-2'>
                    <kbd>商品列表</kbd>
                </div>
                <div className='col-6'>
                    <button className="btn btn-outline-success me-2  float-end" type="button" id="checkBtn" disabled={state}
                        onClick={() => {
                            openProductModal("create")
                            setState(true)
                        }}>新增商品</button>
                </div>
            </div>
            <table className="table mt-3 table-hover">
                <thead>
                    <tr className="table-info border-2">
                        <th scope="col" >商品名稱</th>
                        <th scope="col" className="text-center">分類</th>
                        <th scope="col" className="text-center">原價</th>
                        <th scope="col" className="text-center">售價</th>
                        <th scope="col" className="text-center">是否啟用</th>
                        <th scope="col" className="text-center"></th>
                    </tr>
                </thead>
                <tbody className='align-middle'>
                    {productList?.map((item) => {
                        return (
                            <tr key={item.id}>
                                <td>{item.title}</td>
                                <td className="text-center"><span className="badge bg-danger">{item.category}</span></td>
                                <td className='text-center text-primary'>{item.origin_price}</td>
                                <td className='text-center text-primary'>{item.price}</td>
                                <td className={`text-center ${item.is_enabled === 1 ? "text-dark" : "text-danger"}`}>
                                    {item.is_enabled === 1 ? "已啟用" : "已停用"}<span> </span>
                                    <select value={item.is_enabled === 1 ? "Y" : "N"} onChange={(e) => handleChangeOption(e, item)}>
                                        <option value="Y">Y</option>
                                        <option value="N">N</option>
                                    </select>
                                </td>
                                <td className="">
                                    <div className="btn-group float-end">
                                        <button type="button" className={`btn ${item?.id === tempProduct?.id ? "btn-secondary btn-sm" : "btn-outline-secondary btn-sm"}`} onClick={(v) => {
                                            setTempProduct(item)
                                            setTempImgUrl(item.imageUrl)
                                        }}>檢視商品 <i className="fas fa-search"></i>
                                        </button>
                                        <button type="button" className="btn btn-outline-primary btn-sm"
                                            onClick={() => {
                                                openProductModal("edit", item)
                                                setState(true)
                                            }}>編輯 <i className="fas fa-edit"></i></button>
                                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => openDeleteModal(item)}>刪除 <i className="fas fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}