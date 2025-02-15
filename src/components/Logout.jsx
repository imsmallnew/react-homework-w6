export default function Logout({
    handleLogout
}) {
    return (
        <>
            {/* 供 App.jsx 使用, 可移除 */}
            <form className="container-fluid ">
                <div className="nav float-end">
                    <button className="btn btn-outline-secondary" type="button" id="logoutBtn" onClick={handleLogout}>登出系統</button>
                </div>
            </form>
        </>
    )
}