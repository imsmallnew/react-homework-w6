import { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { Modal } from 'bootstrap';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import DeleteModal from '../components/DeleteModal';

export default function Cart() {
  const API_URL = import.meta.env.VITE_BASE_URL;
  const AUTHOR = import.meta.env.VITE_API_PATH;

  const timeoutRef = useRef(null);
  const defaultModalState = {
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imageUrl: "",
    imagesUrl: []
  };
  const [cartList, setCartList] = useState({});
  const [state, setState] = useState(false);
  const [tempProduct, setTempProduct] = useState(defaultModalState);
  const [cartItem, setCartItem] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [navigation, setNavigation] = useState("cart");
  const deleteModalRef = useRef(null);
  const deleteModalInstanceRef = useRef(null);

  // 確保模態框 DOM 已掛載後初始化 Modal 實例
  useEffect(() => {
    if (deleteModalRef.current) {
      deleteModalInstanceRef.current = new Modal(deleteModalRef.current, { backdrop: false });
    }
  }, []);

  // 開啟 DeleteModal
  const openDeleteModal = (item) => {
    setCartItem(item);
    setTimeout(() => {
      setState(false)
    }, 500)
    if (deleteModalInstanceRef.current) {
      deleteModalInstanceRef.current.show(); // 確保 Modal 實例已初始化後調用 show()
    } else {
      console.error("Modal instance is not initialized.");
    }
  };

  // 關閉 DeleteModal
  const closeDeleteModal = () => {
    if (deleteModalInstanceRef.current) {
      deleteModalInstanceRef.current.hide(); // 確保 Modal 實例已初始化後調用 hide()
    } else {
      console.error("Modal instance is not initialized.");
    }
  };

  // 將焦點從 modal 中移除
  window.addEventListener('hide.bs.modal', () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });

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

  // 更新購物車
  const updateCartItem = async (cartItem, qty) => {
    setLoadingText("更新購物車中...")
    setIsLoading(true)

    try {
     const res = await axios.put(`${API_URL}/v2/api/${AUTHOR}/cart/${cartItem.id}`, {
        data: {
          product_id: cartItem.product.id,
          qty: Number(qty)
        }
      })
      getCartList()
      handleToastMsg(`[${cartItem.product.title}] 數量已更新為 ${res.data?.data?.qty} ${cartItem.product.unit}`)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // 刪除購物車單一商品
  const removeCartItem = async (cartItem) => {
    setLoadingText("移除購物車商品中...")
    setIsLoading(true)
    try {
      const res = await axios.delete(`${API_URL}/v2/api/${AUTHOR}/cart/${cartItem.id}`)
      closeDeleteModal()
      getCartList()
      handleToastMsg(`[${cartItem.product?.title}] 已從購物車移除`)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // 刪除購物車所有商品
  const removeAllCart = async (cartItem) => {
    setLoadingText("清空購物車商品中...")
    setIsLoading(true)

    try {
      const res = await axios.delete(`${API_URL}/v2/api/${AUTHOR}/carts`)
      closeDeleteModal()
      getCartList()
      handleToastMsg(`購物車已清空`)
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
        <div className="mt-4">
          <table className="table mt-3 table-hover">
            <thead>
              <tr className="table-warning border-2 text-center">
                <th>圖片</th>
                <th>商品名稱</th>
                <th>分類</th>
                <th style={{ width: '150px' }}>訂購數量</th>
                <th>單價</th>
                <th>小計</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartList?.carts?.map((cartItem, index) => (
                <tr key={cartItem.id} className='align-middle text-center'>

                  <td><img src={cartItem?.product?.imageUrl} className="object-fit-cover p-1" alt="主圖" width='100' /></td>
                  <td>{cartItem.product.title}</td>
                  <td><span className="badge bg-danger">{cartItem.product.category}</span></td>
                  <td>
                    <div className='btn-group' role='group'>
                      <button type='button'
                        disabled={cartItem.qty === 1 || isLoading}
                        className='btn btn-secondary btn-sm'
                        onClick={() => updateCartItem(cartItem, cartItem.qty - 1)}
                      >-</button>
                      <span className='btn border border-secondary' style={{ width: "50px", cursor: "auto" }}>
                        {cartItem.qty}
                      </span>
                      <button type='button'
                        disabled={isLoading}
                        className='btn btn-secondary btn-sm'
                        onClick={() => updateCartItem(cartItem, cartItem.qty + 1)}
                      >+</button>
                    </div>
                  </td>
                  <td className='text-primary'><h6>{cartItem.product.price}</h6></td>
                  <td className='text-primary'><h6>{cartItem.total}</h6></td>
                  <td>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => {
                      openDeleteModal(cartItem)
                    }}>
                      <i className="fas fa-remove"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="6" className="text-end">總計</td>
                <td className="text-end"><h4>{cartList.total} 元</h4></td>
              </tr>
              <tr>
                <td colSpan="6" className="text-end text-success">折扣價</td>
                <td className="text-end text-success"><h4>{cartList.final_total} 元</h4></td>
              </tr>
            </tfoot>
          </table>
          <div className="text-end">
            <Link className="btn btn-outline-danger me-2" type="button" to={'/products'}>繼續購物</Link>
            {cartList?.carts?.length !== 0 && <button className="btn btn-outline-danger me-2" type="button" onClick={() => {
              openDeleteModal({})
            }}>清空購物車</button>}
            <Link className="btn btn-outline-danger" type="button" to={'/form'}>結帳表單</Link>
          </div>
        </div>
      </div>

      {/***  刪除Modal ***/}
      <DeleteModal
        deleteModalRef={deleteModalRef}
        tempProduct={tempProduct}
        navigation={navigation}
        cartItem={cartItem}
        removeCartItem={removeCartItem}
        removeAllCart={removeAllCart}
        closeDeleteModal={closeDeleteModal}
      />
    </>

  )
}