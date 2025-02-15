import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import Toast from '../components/Toast';

export default function ProductDetail() {
    const API_URL = import.meta.env.VITE_BASE_URL;
    const AUTHOR = import.meta.env.VITE_API_PATH;

    const { id: product_id } = useParams();
    const navigate = useNavigate();
    const timeoutRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState(null);
    const [product, setProduct] = useState({});
    const [productImgUrl, setProductImgUrl] = useState(null);
    const [clientProductList, setClientProductList] = useState([]);
    const [prevProductId, setPrevProductId] = useState(null);
    const [nextProductId, setNextProductId] = useState(null);
    const [state, setState] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState(null);
    const [orderQty, setOrderQty] = useState(1);

    // 取得所有商品資料
    const getClientProducts = async () => {
        setLoadingText("讀取中...")
        setIsLoading(true)

        try {
            const res = await axios.get(`${API_URL}/v2/api/${AUTHOR}/products/all`)
            let data = res.data.products;
            setClientProductList(data);
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    // 取得指定商品資料
    const getProductDetail = async () => {
        setLoadingText("讀取中...")
        setIsLoading(true)

        try {
            const res = await axios.get(`${API_URL}/v2/api/${AUTHOR}/product/${product_id}`)
            let data = res.data.product;
            setProduct(data) // 商品資料
            setProductImgUrl(data.imageUrl)
            setOrderQty(1)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    // 計算上一個 / 下一個商品 ID
    useEffect(() => {
        if (clientProductList.length === 0) return;

        const currentIndex = clientProductList.findIndex((v) => v.id === product_id);
        const prevId = currentIndex > 0 ? clientProductList[currentIndex - 1].id : null;
        const nextId = currentIndex < clientProductList.length - 1 ? clientProductList[currentIndex + 1].id : null;

        setPrevProductId(prevId);
        setNextProductId(nextId);
    }, [clientProductList, product_id]);

    useEffect(() => {
        getClientProducts();
    }, []);

    useEffect(() => {
        getProductDetail();
    }, [product_id]);

    // 加入購物車
    const addCartItem = async (item, qty) => {
        setLoadingText("加入購物車中...")
        setIsLoading(true)
        try {
            const res = await axios.post(`${API_URL}/v2/api/${AUTHOR}/cart`, {
                data: {
                    product_id: item.id,
                    qty: Number(qty)
                }
            })
            handleToastMsg(`[${item.title}] 已加入購物車 ${qty} ${item.unit}`)
            setOrderQty(1); // 還原初始值數量
            setState(false); // 取消按鈕disabled
            setTimeout(() => {
                navigate(-1);
            }, 1000) // 1秒後返回商品清單

        } catch (error) {
            console.error(error)
        }
    }

    // 選擇數量
    const handleItemQtyChange = async (e) => {
        setOrderQty(Number(e.target.value))
    };

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
            {isLoading && <Loading loadingText={loadingText} />}

            {/* 通知訊息 */}
            {showToast && <Toast toastMsg={toastMsg} />}

            {/* 商品詳情 */}
            <div className="container main">
                <div className='row'>
                {/* 左側箭頭 (如果不是第一個商品) */}
                    <div className='col-1 d-flex align-items-center justify-content-center'>
                        {prevProductId && (
                            <button
                                type="button"
                                className="arrow-btn3 left"
                                onClick={() => navigate(`/products/${prevProductId}`)}
                            />
                        )}
                    </div>
                    <div className='col-10'>
                        <div className="card shadow">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="mainWrap">
                                        <img src={productImgUrl} className="object-fit-cover img-fluid w-100 h-100 p-3" alt="主圖" />
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body pl-3 pr-3">
                                        <h2 className="card-title">{product.title}</h2><h5><span className="badge bg-danger">{product.category}</span></h5>
                                        <p className="card-text">商品描述: <small className="text-muted">{product.description}</small></p>
                                        <p className="card-text">商品內容: <small className="text-muted">{product.content}</small></p>
                                        <div className="d-flex">
                                            <h4 className="card-text text-primary fw-bold">{product.price} 元  / </h4><h4 className="card-text text-secondary"><del>{product.origin_price} 元</del></h4>
                                        </div>
                                        <label htmlFor="price" className="form-label me-2">
                                            訂購數量:
                                        </label>
                                        <select value={orderQty} onChange={(e) => handleItemQtyChange(e)}>
                                            {Array.from({ length: 10 }).map((_, index) => {
                                                return (<option key={index} value={index + 1}>
                                                    {index + 1}
                                                </option>)
                                            })}
                                        </select>
                                        <div className='d-flex float-end'>
                                            <button type="button" className="btn btn-secondary me-3" onClick={() => navigate(-1)}>
                                                返回商品列表
                                            </button>
                                            <button type="button" className={`btn btn-danger`} onClick={() => addCartItem(product, orderQty)}>
                                                加入購物車
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {productImgUrl ? <div className="col-md-12">
                                    <p className="ps-3">更多圖片(點圖放大):</p>
                                    <div className="row ps-3 pe-3">
                                        {product.imageUrl && <div className="col-md-2 mb-3">
                                            <div className="subWrap">
                                                <div className="imgFrame">
                                                    <img src={product.imageUrl} className="card-img w-100 h-100 text-start object-fit-cover" alt="副圖" onClick={() => { setProductImgUrl(product.imageUrl) }} />
                                                </div>
                                            </div>
                                        </div>}
                                        {product?.imagesUrl?.map((item, index) => {
                                            if (!item) return null; // 副圖連結為空時不顯示圖片
                                            return (
                                                <div key={index} className="col-md-2 mb-3">
                                                    <div className="subWrap">
                                                        <div className="imgFrame">
                                                            <img src={item} className="card-img w-100 h-100 text-start object-fit-cover" alt="副圖" onClick={() => { setProductImgUrl(item) }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div> : <h6 className='text-danger'><i className="fa-regular fa-image"></i> 主圖 尚未提供連結</h6>
                                }
                            </div>

                        </div>
                    </div>
                    <div className='col-1 d-flex align-items-center justify-content-center'>
                        {/* 右側箭頭 (如果不是最後一個商品) */}
                        {nextProductId && (
                            <button
                                type="button"
                                className="arrow-btn3 right"
                                onClick={() => navigate(`/products/${nextProductId}`)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}