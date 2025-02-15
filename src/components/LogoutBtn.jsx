import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Loading from '../components/Loading';
import Toast from '../components/Toast';

export default function LogoutBtn() {
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

    // 登出按鈕
    const handleLogout = async () => {
        setLoadingText("登出中...")
        setIsLoading(true)

        try {
            const res = await axios.post(`${API_URL}/v2/logout`)
            document.cookie = `reactHWToken=; expires=`; // 清除Cookie
            handleToastMsg(`使用者 ${account.username} 已登出`)
            navigate("/login");
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

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

            <div className="nav float-end">
                <button className="btn btn-outline-secondary" type="button" id="logoutBtn" onClick={handleLogout}>登出後台</button>
            </div>
        </>
    )
}