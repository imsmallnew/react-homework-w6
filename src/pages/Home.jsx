import { useEffect} from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { NavLink } from 'react-router-dom';

export default function Home() {
    const { scrollYProgress } = useScroll();
    const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const textY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
    const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

    useEffect(() => {
        document.body.style.overflowX = "hidden"; // 禁止水平滾動
        return () => {
            document.body.style.overflowX = "auto"; // 解除限制（避免影響其他頁面）
        };
    }, []);

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.body.scrollHeight,  // 滾動到頁面底部
            behavior: 'smooth',  // 平滑滾動
        });
    };

    const event = [
        {
            title: '無酒精飲料一杯',
            imgUrl: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?q=80&w=1024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: '法式薯條 50% Off',
            imgUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=1024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: '經典甜點一份',
            imgUrl: 'https://images.unsplash.com/photo-1707070026861-ae45cb63d845?w=1024&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJyb3duaWV8ZW58MHx8MHx8fDA%3D',
        }
    ]

    return (
        <>
            <div className="position-relative" style={{ backgroundColor: "#1a202c", color: "white" }}>
                {/* Parallax Background Image */}
                <motion.div
                    className="position-absolute top-0 start-0 w-100 vh-100"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        scale: imageScale
                    }}
                />

                {/* Content Section */}
                <div className="position-relative d-flex flex-column align-items-center justify-content-center vh-100 text-center px-4">
                    <motion.h1
                        className="display-3 fw-bold text-shadow"
                        style={{ opacity: textOpacity, transform: `translateY(${textY}px)` }} // ✅ 改為 transform
                    >
                        Welcome to<br /> Daniel American Restaurent
                    </motion.h1>

                    <motion.p
                        className="mt-3 fs-4 w-50 text-shadow"
                        style={{ opacity: textOpacity, transform: `translateY(${textY}px)` }} // ✅ 改為 transform
                    >
                        Enjoy the finest burgers, crispy fries, and handcrafted milkshakes in an authentic American atmosphere.
                    </motion.p>

                    <div className="row d-flex">
                        <div className="arrow-container col-6">
                            <NavLink
                                to={"products"}
                                className="arrow-btn text-shadow"
                            >
                                開始點餐 <i className="fa fa-cutlery"></i>
                            </NavLink>
                        </div>

                        <div className="arrow-container col-6">
                            <button className="arrow-btn2 text-shadow" onClick={scrollToBottom}>
                                神秘優惠 <i className="fa fa-cutlery"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="position-relative vh-100 d-flex align-items-center justify-content-center text-center bg-secondary text-white overflow-hidden">
                    <motion.div
                        className="position-absolute top-0 start-0 w-100 h-100 bg-cover bg-center"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1632203171982-cc0df6e9ceb4?q=80&w=2500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            scale: imageScale
                        }}
                    />
                    <div className="position-relative d-flex flex-column gap-3 p-4 w-75">
                        <motion.h2
                            className="display-5 fw-bold text-shadow"
                            initial={{ x: -100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            來店打卡好禮三選一
                        </motion.h2>
                        <motion.p
                            className="fs-5 text-shadow"
                            initial={{ x: 100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            From delicious desserts to refreshing drinks, fresh salads, tasty sides, and hearty main courses, we have something for everyone!
                        </motion.p>
                        <motion.div
                            className="row d-flex flex-nowrap justify-content-center"
                            initial={{ y: -100, opacity: 0 }} // 初始位置在上方並且不可見
                            whileInView={{ y: 0, opacity: 1 }} // 滾動到視圖中時，移動到正常位置並顯示
                            transition={{ duration: 0.8 }} // 動畫持續時間
                        >
                            {event.map((item, index) => (
                                <motion.div
                                    className="card shadow p-3 mb-5 bg-body rounded col-4 mx-3"
                                    key={index}
                                    initial={{ y: -50, opacity: 0 }} // 每個卡片從上方進入並逐漸變得可見
                                    whileInView={{ y: 0, opacity: 1 }} // 滾動到視圖時卡片顯示
                                    transition={{ duration: 0.5, delay: index * 0.2 }} // 每個卡片延遲進場
                                >
                                    <img src={item.imgUrl} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} alt={item.title} />
                                    <div className="card-body">
                                        <h5 className="card-title">{item.title}</h5>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}