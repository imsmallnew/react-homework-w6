import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Loading from '../components/Loading';
import Toast from '../components/Toast';

export default function Form() {
  const API_URL = import.meta.env.VITE_BASE_URL;
  const AUTHOR = import.meta.env.VITE_API_PATH;

  const timeoutRef = useRef(null);
  const [cartList, setCartList] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    const { message, ...user } = data;
    const userInfo = {
      data: {
        user,
        message
      }
    }
    if (Object.keys(errors).length === 0) {
      checkout(userInfo)
    }
  }

  // 結帳表單
  const checkout = async (data) => {
    setLoadingText("表單傳送中...")
    setIsLoading(true)
    try {
      const res = await axios.post(`${API_URL}/v2/api/${AUTHOR}/order`, data)
      reset()
      getCartList()
      handleToastMsg(`表單已傳送成功, 請回商品列表繼續購物`)
    } catch (error) {
      alert('結帳失敗')
    } finally {
      setIsLoading(false)
    }
  }

  // 取得購物車資料
  const getCartList = async () => {
    setLoadingText("讀取中...")
    setIsLoading(true)

    try {
      const res = await axios.get(`${API_URL}/v2/api/${AUTHOR}/cart`)
      let data = res.data?.data;
      setCartList(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getCartList()
  }, [])

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

      <div className="container main">
        <div className='text-center'>
          {cartList?.carts?.length === 0 && <span className='badge bg-warning p-2 pe-3 ps-3 text-dark fs-6 text-center'>購物車目前為空, 請先回到商品列表選取商品後才能[送出訂單]</span>}
        </div>
        <div className="mt-4 row justify-content-center">
          <form onSubmit={handleSubmit(onSubmit)} className="col-md-8">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                <kbd>收件人姓名</kbd>
              </label>
              <input
                id="name"
                type="text"
                className={`form-control ${errors.name && 'is-invalid'}`}
                placeholder="請輸入姓名"
                {...register("name", {
                  required: "收件人姓名必填"
                })}
              />
              {errors.name && (
                <p className="text-danger">{errors.name.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                <kbd>Email</kbd>
              </label>
              <input
                id="email"
                type="email"
                className={`form-control ${errors.email && 'is-invalid'}`}
                placeholder="請輸入 Email"
                {...register("email", {
                  required: "Email必填",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Email 格式不正確。"
                  },
                })}
              />
              {errors.email && (
                <p className="text-danger">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">
                <kbd>收件人電話</kbd>
              </label>
              <input
                id="tel"
                type="tel"
                className={`form-control ${errors.tel && 'is-invalid'}`}
                placeholder="請輸入電話"
                {...register("tel", {
                  required: "收件人電話必填",
                  minLength: {
                    value: 8,
                    message: "電話號碼至少需要8碼",
                  },
                  pattern: {
                    value: /^\d+$/,
                    message: "電話號碼格式不正確，僅限數字。",
                  },
                })}
              />
              {errors.tel && <p className="text-danger">{errors.tel.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                <kbd>收件人地址</kbd>
              </label>
              <input
                id="address"
                type="text"
                className={`form-control ${errors.address && 'is-invalid'}`}
                placeholder="請輸入地址"
                {...register("address", {
                  required: "收件人地址必填"
                })}
              />
              {errors.address && (
                <p className="text-danger">{errors.address.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                <kbd>留言</kbd>
              </label>
              <textarea
                id="message"
                className="form-control"
                placeholder="請輸入留言"
                rows="3"
                {...register("message")}
              />
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-danger" disabled={cartList?.carts?.length === 0}>送出訂單</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
