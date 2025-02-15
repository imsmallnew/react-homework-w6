import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/"); // 3 秒後導航到首頁
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return(
        <>
            <div className="position-relative" style={{ backgroundColor: "#1a202c", color: "white" }}>
                <div
                    className="position-absolute top-0 start-0 w-100 vh-100"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                />

                <div className="position-relative d-flex flex-column align-items-center justify-content-center vh-100 text-center px-4">
                <h1 className="display-3 fw-bold text-shadow"> Page not found </h1> 
                <p className="mt-3 fs-4 w-50 text-shadow" > 
                    您是否在美食的道路上迷失方向?<br /> 即將為您給予最好的建議... 
                </p>
                </div>
            </div>
        </>
    )
}