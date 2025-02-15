function NavPage({ 
    navigation, 
    setNavigation, 
}) {
    return(
        <>
            {/* 供 App.jsx 使用, 可移除 */}
            <nav className="navbar navbar-light navbar-expand text-primary navbar-toggleable fixed-top shadow" >
                <div className="container">
                    <a className="navbar-brand">React W5</a>
                    <form className="d-flex">
                        <button className={`btn ${navigation === "menu" ? "btn-secondary" : "btn-outline-secondary"} me-2`} type="button" onClick={()=>setNavigation("menu")}>商品列表</button>
                        <button className={`btn ${navigation === "cart" ? "btn-secondary" : "btn-outline-secondary"} me-2`} type="button" onClick={()=>setNavigation("cart")} >檢視購物車</button>
                        <button className={`btn ${navigation === "form" ? "btn-secondary" : "btn-outline-secondary"} me-2`} type="button" onClick={()=>setNavigation("form")}>結帳表單</button>
                        <button className={`btn ${navigation === "admin" ? "btn-secondary" : "btn-outline-secondary"} me-2`} type="button" onClick={()=>setNavigation("admin")} >後台管理</button>
                    </form>
                </div>
            </nav>
        </>
        
    )
}

export default NavPage
