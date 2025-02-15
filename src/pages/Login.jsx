import { useState, useEffect, useRef } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import axios from 'axios';
import Loading from '../components/Loading';
import Toast from '../components/Toast';

export default function Login() {
    const API_URL = import.meta.env.VITE_BASE_URL;
    const AUTHOR = import.meta.env.VITE_API_PATH;

    const navigate = useNavigate();
    const timeoutRef = useRef(null);
    const [account, setAccount] = useState({
        username: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState(null);

    // 登入按鈕
    const handleLogin = async (e) => {
        e.preventDefault(); // 取消原生submit事件
        setLoadingText("讀取中...")
        setIsLoading(true)

        try {
            const res = await axios.post(`${API_URL}/v2/admin/signin`, account)
            // 登入成功, 取得token,expired參數
            const { token, expired } = res.data

            // 寫入自定義reactHWToken至Cookies: 瀏覽器F12 => Application => Cookies
            document.cookie = `reactHWToken=${token}; expires=${new Date(expired)}`;
            axios.defaults.headers.common['Authorization'] = token;

            handleToastMsg("登入成功")
            navigate("/admin");
        } catch (error) {
            console.error(error)
            alert(`使用者 ${account.username} 登入失敗`)
        } finally {
            setIsLoading(false)
        }
    }

    // 檢查登入狀態
    const checkUserLogin = async () => {
        setLoadingText("讀取中...")
        setIsLoading(true)

        try {
            const res = await axios.post(`${API_URL}/v2/api/user/check`)
            navigate("/admin");
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    // 若有Cookie則直接驗證
    useEffect(() => {
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)reactHWToken\s*\=\s*([^;]*).*$)|^.*$/, "$1",
        );
        if(token.length > 0){
            axios.defaults.headers.common['Authorization'] = token;
            checkUserLogin()
        }
    }, [])

    // 處理輸入框
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAccount({
            ...account,
            [name]: value,
        })
    }

    // 處理Toast訊息
    const handleToastMsg = (msg) => {
        setToastMsg(msg)
        setShowToast(true);
        // 先清除舊的計時器，避免多次點擊產生多個 `setTimeout`
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setShowToast(false);
            timeoutRef.current = null; // 清空 reference
        }, 3000); // 三秒後關閉
    }

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <>
            {/* 讀取效果 */}
            {isLoading && <Loading
                loadingText={loadingText}
            />}

            {/* 通知訊息 */}
            {showToast && <Toast
                toastMsg={toastMsg}
            />}

            <nav className="navbar navbar-light navbar-expand text-primary navbar-toggleable fixed-top shadow bg-dark" data-bs-theme="dark">
                <div className="container">
                    <a className="navbar-brand">React W6</a>
                    <div className="d-flex">
                        <NavLink
                            to={"/"}
                            className={({ isActive }) =>
                                `btn ${isActive ? "btn-secondary" : "btn-outline-secondary"} me-2`
                            }
                        >
                            {"返回首頁"}
                        </NavLink>
                    </div>
                </div>
            </nav>
            <div className="container">
                <div className="container-fluid">
                    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
                        <h1 className="mb-5">商品管理系統</h1>
                        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
                            <div className="form-floating mb-3">
                                <input type="email" name="username" onChange={handleInputChange} className="form-control" id="username" placeholder="" value={account.username} />
                                <label htmlFor="username">Email address</label>
                            </div>
                            <div className="form-floating">
                                <input type="password" name="password" onChange={handleInputChange} className="form-control" id="password" placeholder="" value={account.password} />
                                <label htmlFor="password">Password</label>
                            </div>
                            <button className="btn btn-primary">登入</button>
                        </form>
                        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
                    </div>
                </div>
            </div>
        </>
    )
}
