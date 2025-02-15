import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactLoading from 'react-loading';
import Loading from '../components/Loading';
import Toast from '../components/Toast';

export default function ProductsList() {
  const API_URL = import.meta.env.VITE_BASE_URL;
  const AUTHOR = import.meta.env.VITE_API_PATH;

  const timeoutRef = useRef(null);
  const [cartItem, setCartItem] = useState({});
  const [state, setState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(null);
  const [clientProductList, setClientProductList] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [navigation, setNavigation] = useState("menu");

  // 取得客戶商品資料
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

  useEffect(() => {
    getClientProducts()
  }, [['menu'].includes(navigation)])

  // 加入購物車
  const addCartItem = async (item, qty) => {
    try {
      const res = await axios.post(`${API_URL}/v2/api/${AUTHOR}/cart`, {
        data: {
          product_id: item.id,
          qty: Number(qty)
        }
      })
      handleToastMsg(`[${item.title}] 已加入購物車 ${qty} ${item.unit}`)
      setState(false); // 取消按鈕disabled
    } catch (error) {
      console.error(error)
    } finally {
      // setIsLoading(false)
    }
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

      {/* 商品列表 */}
      <div className="container main">
        <div className="mt-4">
          <table className="table mt-3 table-hover">
            <thead>
              <tr className="table-success border-2 text-center">
                <th scope="col" >圖片</th>
                <th scope="col" >商品名稱</th>
                <th scope="col" className="text-center">分類</th>
                <th scope="col-2" className="text-center">售價 / 原價</th>
                <th scope="col" className="text-center"></th>
              </tr>
            </thead>
            <tbody className='align-middle'>
              {clientProductList?.map((item) => {
                return (
                  <tr key={item.id} className='text-center'>
                    <td><img src={item?.imageUrl} className="object-fit-cover p-1" alt="主圖" width='100' /></td>
                    <td>{item.title}</td>
                    <td><span className="badge bg-danger">{item.category}</span></td>
                    <td>
                      <h4 className="card-text text-primary d-inline">{item.price} 元  / </h4><h6 className="card-text text-secondary d-inline"><del>{item.origin_price} 元</del></h6>
                    </td>
                    <td>
                      <div className="btn-group">
                        <Link
                          className={`btn btn-outline-success btn-sm`}
                          to={`/products/${item.id}`}
                        >
                          商品詳情 <i className="fas fa-search"></i>
                        </Link>
                        <button type="button" className={`btn btn-outline-danger btn-sm ${cartItem && state && item.id === cartItem.id && "d-flex"}`}
                          disabled={cartItem && state && item.id === cartItem.id}
                          onClick={() => {
                            setCartItem(item)
                            addCartItem(item, 1)
                            setState(true)
                          }}>加到購物車 {cartItem && state && item.id === cartItem.id ?
                            <ReactLoading
                              type={"spin"}
                              color={"#FF0000"}
                              height={"1rem"}
                              width={"1rem"}
                            /> :
                            <i className="fa-solid fa-cart-shopping"></i>}</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}