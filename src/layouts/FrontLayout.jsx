import { Outlet, NavLink } from 'react-router-dom';

export default function FrontLayout() {

    const navList = [
        { path: "/", name: "首頁", navName: 'home' },
        { path: "/products", name: "商品列表", navName: 'products' },
        { path: "/cart", name: "檢視購物車", navName: 'cart' },
        { path: "/form", name: "結帳表單", navName: 'form' },
        { path: "login", name: "後台管理", navName: 'admin' },
    ];

    return (
        <>
            <nav className="navbar navbar-light navbar-expand text-primary navbar-toggleable fixed-top shadow">
                <div className="container">
                    <a className="navbar-brand">React W6</a>
                    <div className="d-flex">
                        {navList.map((route, index) => (
                            <NavLink
                                key={index}
                                to={route.path}
                                className={({ isActive }) =>
                                    `btn ${isActive ? "btn-secondary" : "btn-outline-secondary"} me-2`
                                }
                            >
                                {route.name}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </nav>
            <Outlet />
        </>
    )
}