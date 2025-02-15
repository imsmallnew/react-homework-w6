import { useState, useEffect, useRef  } from 'react'
import axios from 'axios';
import { Modal} from 'bootstrap';
import NavPage from './pages/NavPage';
import Login from './pages/Login';
import AdminProducts from './pages/AdminProducts';
import ProductsList from './pages/ProductsList';
import ProductModal from './components/ProductModal';
import DeleteModal from './components/DeleteModal';
import ClientProductModal from './components/ClientProductModal';
import Loading from './components/Loading';
import Toast from './components/Toast';
import Cart from './pages/Cart';
import Form from './pages/Form';

function App() {
  // 定義參數
  const [account, setAccount] = useState({
    username: "",
    password: ""
  });
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
  const [isAuth, setInsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(null);
  const [pageInfo, setPageInfo] = useState({});
  const [page, setPage] = useState(1);
  const [productList, setProductList] = useState([]);
  const [tempProduct, setTempProduct] = useState(defaultModalState);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [tempImgUrl, setTempImgUrl] = useState(null);
  const [state, setState] = useState(false);
  const [target, setTarget] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [navigation, setNavigation] = useState("menu");
  
  const [orderQty, setOrderQty] = useState(1);
  const [cartList, setCartList] = useState({});
  const [cartItem, setCartItem] = useState({});
  const productModalRef = useRef(null);
  const productModalInstanceRef = useRef(null);
  const deleteModalRef = useRef(null);
  const deleteModalInstanceRef = useRef(null);
  const clientProductModalRef = useRef(null);
  const clientProductModalInstanceRef = useRef(null);

  // 從.env取得API環境變數
  const API_URL = import.meta.env.VITE_BASE_URL;
  const AUTHOR = import.meta.env.VITE_API_PATH;

  // 登入按鈕
  const handleLogin = async(e) => {
    e.preventDefault(); // 取消原生submit事件
    setLoadingText("讀取中...")
    setIsLoading(true)

    try {
      await axios.post(`${API_URL}/v2/admin/signin`,account)
      .then((res) => {
        // 登入成功, 取得token,expired參數
        const { token, expired } = res.data
  
        // 寫入自定義reactW3Token至Cookies: 瀏覽器F12 => Application => Cookies
        document.cookie = `reactW3Token=${token}; expires=${new Date(expired)}`;
        axios.defaults.headers.common['Authorization'] = token;
        handleToastMsg("登入成功")
        getProducts();
        setInsAuth(true);
      })
    } catch (error) {
      alert(`使用者 ${account.username} 登入失敗`)
    } finally {
      setIsLoading(false)
    }
  }

  // 登出按鈕
  const handleLogout = async() => {
    setLoadingText("登出中...")
    setIsLoading(true)

    try {
      await axios.post(`${API_URL}/v2/logout`)
      .then((res) => {
        document.cookie = `reactW2Token=; expires=`; // 清除Cookie
        setInsAuth(false);
        handleToastMsg(`使用者 ${account.username} 已登出`)
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // 檢查登入狀態
  const checkUserLogin = async() => {
    setLoadingText("讀取中...")
    setIsLoading(true)

    try {
      await axios.post(`${API_URL}/v2/api/user/check`)
      .then((res) => {
        getProducts()
        setInsAuth(true);
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // 若有Cookie則直接驗證
  useEffect(()=>{
      const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)reactW3Token\s*\=\s*([^;]*).*$)|^.*$/,"$1",
      );
      axios.defaults.headers.common['Authorization'] = token;
      checkUserLogin()
  }, [])

  // 驗證成功取得商品資料, 並在每次切換頁碼取得新清單
  useEffect(()=>{
      isAuth && getProducts(page)
  }, [page])

  // 取得商品資料
  const getProducts = async(page = 1) => {
    setLoadingText("讀取中...")
    setIsLoading(true)

    try {
      await axios.get(`${API_URL}/v2/api/${AUTHOR}/admin/products?page=${page}`)
      .then((res) => {
        // 因API建立商品是最先建的num數字在後面,可重新排序顯示.sort((a, b) => b.num - a.num)
        let data = res.data.products;
        let categoriesData = [...new Set(data.map(item => item.category))];
        let unitsData = [...new Set(data.map(item => item.unit))];
        setProductList(data) // 商品資料
        setPageInfo(res.data.pagination) // 頁碼
        setCategories(categoriesData) // ProductModal中的已選分類清單
        setUnits(unitsData) // ProductModal中的已選單位清單
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // 新增商品資料
  const createProduct = async() => {
    setLoadingText("新增商品資料中...")
    setIsLoading(true)

    try {
      // 記得型別轉換
      await axios.post(`${API_URL}/v2/api/${AUTHOR}/admin/product`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          imagesUrl: tempProduct.imagesUrl?.length === 0 ? [""] : tempProduct.imagesUrl
        }
      })
      handleToastMsg("新增成功:" + tempProduct.title)
      getProducts(); // 重新取得商品清單
      closeProductModal(); // 關閉Modal
    } catch (error) {
      console.error(error)
      alert("新增商品失敗！\n\n" + error?.response.data.message.join("\n"))
    } finally {
      setIsLoading(false)
    }
  }

  // 更新商品資料
  const updateProduct = async(product) => {
    setLoadingText("更新商品資料中...")
    setIsLoading(true)

    try {
      // 記得型別轉換
      await axios.put(`${API_URL}/v2/api/${AUTHOR}/admin/product/${product.id}`, {
        data: {
          ...product,
          origin_price: Number(product.origin_price),
          price: Number(product.price),
          imagesUrl: product.imagesUrl?.length === 0 ? [""] : product.imagesUrl
        }
      })
      handleToastMsg("更新成功:" + tempProduct.title)
      getProducts(); // 重新取得商品清單
      closeProductModal(); // 關閉Modal
    } catch (error) {
      console.error(error)
      alert("更新商品失敗！\n\n" + error?.response.data.message.join("\n"))
    } finally {
      setIsLoading(false)
    }
  }

  // 刪除商品資料
  const deleteProduct = async(id) => {
    setLoadingText("刪除商品資料中...")
    setIsLoading(true)
    try {
      await axios.delete(`${API_URL}/v2/api/${AUTHOR}/admin/product/${tempProduct.id}`)
      handleToastMsg("刪除成功:" + tempProduct.title)
      getProducts();
      setTempProduct(defaultModalState)
      closeDeleteModal();
    } catch (error) {
      closeDeleteModal();
      console.error(error)
      alert("刪除商品失敗！\n\n" + error?.response.data.message.join("\n"))
    } finally {
      setIsLoading(false)
    }
  }

  

  // 取得購物車資料
  const getCartList = async() => {
    setLoadingText("讀取中...")
    setIsLoading(true)

    try {
      await axios.get(`${API_URL}/v2/api/${AUTHOR}/cart`)
      .then((res) => {
        let data = res.data?.data;
        setCartList(data)
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // 加入購物車
  const addCartItem = async(item, qty) => {
    // setLoadingText("加入購物車中...")
    // setIsLoading(true)

    try {
      await axios.post(`${API_URL}/v2/api/${AUTHOR}/cart`,{
        data:{
          product_id: item.id,
          qty: Number(qty)
        }
      })
      .then((res) => {
        handleToastMsg(`[${item.title}] 已加入購物車 ${qty} ${item.unit}`)
        setOrderQty(1); // 還原初始值數量
        setState(false); // 取消按鈕disabled
        closeClientProductModal() // 加入購物車後關閉商品詳情Modal
      })
    } catch (error) {
      console.error(error)
    } finally {
      // setIsLoading(false)
    }
  }

  // 更新購物車
  const updateCartItem = async(cartItem, qty) => {
    setLoadingText("更新購物車中...")
    setIsLoading(true)

    try {
      await axios.put(`${API_URL}/v2/api/${AUTHOR}/cart/${cartItem.id}`,{
        data:{
          product_id: cartItem.product.id,
          qty: Number(qty)
        }
      })
      .then((res) => {
        getCartList()
        handleToastMsg(`[${cartItem.product.title}] 數量已更新為 ${res.data?.data?.qty} ${cartItem.product.unit}`)
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // 刪除購物車單一商品
  const removeCartItem = async(cartItem) => {
    setLoadingText("移除購物車商品中...")
    setIsLoading(true)
    try {
      await axios.delete(`${API_URL}/v2/api/${AUTHOR}/cart/${cartItem.id}`)
      .then((res) => {
        closeDeleteModal()
        getCartList()
        handleToastMsg(`[${cartItem.product?.title}] 已從購物車移除`)
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // 刪除購物車所有商品
  const removeAllCart = async(cartItem) => {
    setLoadingText("清空購物車商品中...")
    setIsLoading(true)

    try {
      await axios.delete(`${API_URL}/v2/api/${AUTHOR}/carts`)
      .then((res) => {
        closeDeleteModal()
        getCartList()
        handleToastMsg(`購物車已清空`)
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    getCartList()
  },[['cart','form'].includes(navigation)])

  // 處理輸入框
  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target; 
    if(isAuth){
      // Modal Input
      setTempProduct({
        ...tempProduct,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value || "",
      })
    }else{
      // Login Input
      setAccount({
        ...account,
        [name]: value,
      })
    }
  }

  // ProductModal按下確定
  const handleModalUpdate = async (product) => {
    try {
      if (target === 'create') {
        await createProduct(); // 新增商品
      } else {
        await updateProduct(product); // 更新商品
      }
    } catch (error) {
      alert("更新商品失敗！\n\n" + error?.response.data.message.join("\n"))
    }
  }

  // 商品副圖連結更新
  const handleImageChange = (e, index) => {
    const { value } = e.target; 
    const newImage = [...tempProduct.imagesUrl]
    newImage[index] = value

    setTempProduct({
      ...tempProduct,
      imagesUrl: newImage,
    })
  }

  // ProductModal選取已有分類或單位
  const badgeReplace = (e) => {
    const { innerText, htmlFor } = e.target; 
    setTempProduct({
      ...tempProduct,
      [htmlFor]: innerText,
    })
  }

  // 商品列表啟用狀態改變時更新商品
  const handleChangeOption = async (e, item) => {
    const newValue = e.target.value === "Y" ? 1 : 0;
    const updateItem = { ...item, is_enabled: newValue };
    try {
      await updateProduct(updateItem); // 更新商品
      getProducts(); // 重新取得商品清單
      const status = updateItem.is_enabled === 1 ? "已啟用" : "已停用";
      handleToastMsg(`[商品]${updateItem.title}: ${status}`)
    } catch (error) {
      alert("更新啟用狀態失敗！\n\n" + error?.response.data.message)
    }
  };

  // ProductModal按下新增副圖
  const imagesUrlAdd = () => {
    const newImage = [...tempProduct.imagesUrl]
    newImage.push('') //新增空字串的輸入框

    setTempProduct({
      ...tempProduct,
      imagesUrl: newImage,
    })
  }

  // ProductModal按下刪除副圖
  const imagesUrlRemove = (index) => {
    const newImage = [...tempProduct.imagesUrl]
    newImage.splice(index, 1)

    setTempProduct({
      ...tempProduct,
      imagesUrl: newImage,
    })
  }

  // ProductModal處理圖片上傳
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    if(file){
      formData.append("file-to-upload", file)
      uploadImage(formData)
    }else{
      handleToastMsg("尚未取得圖片資料來源, 無法上傳!")
    }
  }

  // 圖片上傳
  const uploadImage = async(data) => {
    setLoadingText("上傳圖片中...")
    setIsLoading(true)

    try {
      const result = await axios.post(`${API_URL}/v2/api/${AUTHOR}/admin/upload`, data)
      const uploadImageURL = result.data.imageUrl
      handleToastMsg("圖片上傳成功")
      uploadImageURL && setTempProduct({
        ...tempProduct,
        imageUrl: uploadImageURL,
      })
    } catch (error) {
      console.error(error)
      alert("上傳圖片失敗！\n\n")
    } finally {
      setIsLoading(false)
    }
  }

  // 處理Toast訊息
  const handleToastMsg = (msg) => {
    setToastMsg(msg)
    setShowToast(true);
    setTimeout(()=>{
      setShowToast(false);
    },3000) // 三秒後關閉
  }

  // 確保模態框 DOM 已掛載後初始化 Modal 實例
  useEffect(() => {
    if (productModalRef.current) {
      productModalInstanceRef.current = new Modal(productModalRef.current, { backdrop: false });
    }
    if (deleteModalRef.current) {
      deleteModalInstanceRef.current = new Modal(deleteModalRef.current, { backdrop: false });
    }
    if (clientProductModalRef.current) {
      clientProductModalInstanceRef.current = new Modal(clientProductModalRef.current, { backdrop: false });
    }
  }, []);

  // 開啟 ProductModal
  const openProductModal = (type, item) => {
    setTarget(type) // create, edit
    setTempProduct(type === "edit" ? item : defaultModalState)
    setTimeout(()=>{
      setState(false)
    },500)
    if (productModalInstanceRef.current) {
      productModalInstanceRef.current.show(); // 確保 Modal 實例已初始化後調用 show()
    } else {
      console.error("Modal instance is not initialized.");
    }
  };

  // 關閉 ProductModal
  const closeProductModal = () => {
    if (productModalInstanceRef.current) {
      productModalInstanceRef.current.hide(); // 確保 Modal 實例已初始化後調用 hide()
    } else {
      console.error("Modal instance is not initialized.");
    }
  };

  // 開啟 DeleteModal
  const openDeleteModal = (item) => {
    navigation==='admin' ? setTempProduct(item) : setCartItem(item);
    setTimeout(()=>{
      setState(false)
    },500)
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

  // 開啟 ClientProductModal
  const openClientProductModal = (type, item) => {
    setTimeout(()=>{
      setState(false)
    },500)
    if (clientProductModalInstanceRef.current) {
      clientProductModalInstanceRef.current.show(); // 確保 Modal 實例已初始化後調用 show()
    } else {
      console.error("Modal instance is not initialized.");
    }
  };

  // 關閉 ClientProductModal
  const closeClientProductModal = () => {
    setOrderQty(1) // 還原
    if (clientProductModalInstanceRef.current) {
      clientProductModalInstanceRef.current.hide(); // 確保 Modal 實例已初始化後調用 hide()
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

      {/* 導覽列 */}
      <NavPage 
        navigation={navigation} 
        setNavigation={setNavigation} 
      />

      {/* 前台商品選單 */}
      {navigation === "menu" && 
        <ProductsList
          cartItem={cartItem}
          state={state}
          setTempProduct={setTempProduct}
          setTempImgUrl={setTempImgUrl}
          setLoadingText={setLoadingText}
          setIsLoading={setIsLoading}
          openClientProductModal={openClientProductModal}
          addCartItem={addCartItem}
          setState={setState}
          setCartItem={setCartItem}
        />
      }

      {/* 前台購物車 */}
      {navigation === "cart" && 
        <Cart 
          cartList={cartList}
          isLoading={isLoading}
          updateCartItem={updateCartItem}
          openDeleteModal={openDeleteModal}
          setNavigation={setNavigation}
        />
      }

      {/* 前台表單頁 */}
      {navigation === "form" && 
        <Form 
          cartList={cartList}
          setLoadingText={setLoadingText}
          setIsLoading={setIsLoading}
          getCartList={getCartList}
          handleToastMsg={handleToastMsg}
        />
      }

      {/* 後台管理商品頁 */}
      {navigation === "admin" && isAuth &&
        <AdminProducts
            productList={productList}
            tempProduct={tempProduct}
            tempImgUrl={tempImgUrl}
            pageInfo={pageInfo}
            state={state}
            handleLogout={handleLogout}
            openProductModal={openProductModal}
            openDeleteModal={openDeleteModal}
            setPage={setPage}
            handleChangeOption={handleChangeOption}
            setTempProduct={setTempProduct}
            setTempImgUrl={setTempImgUrl}
            setState={setState}
        /> 
      } 

       {/* 登入頁 */}
      {navigation === "admin" && !isAuth &&  
        <Login
          account={account}
          handleInputChange={handleInputChange}
          handleLogin={handleLogin}
        />
      }
      
      {/***  商品Modal ***/}
      <ProductModal 
        productModalRef={productModalRef}
        target={target}
        tempProduct={tempProduct}
        categories={categories}
        units={units}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleImageChange={handleImageChange}
        imagesUrlRemove={imagesUrlRemove}
        badgeReplace={badgeReplace}
        imagesUrlAdd={imagesUrlAdd}
        closeProductModal={closeProductModal}
        handleModalUpdate={handleModalUpdate}
      />

      {/***  刪除Modal ***/}
      <DeleteModal
        deleteModalRef={deleteModalRef}
        tempProduct={tempProduct}
        navigation={navigation}
        cartItem={cartItem}
        deleteProduct={deleteProduct}
        removeCartItem={removeCartItem}
        removeAllCart={removeAllCart}
        closeDeleteModal={closeDeleteModal}
      />

      {/* 客戶檢視商品Modal */}
      <ClientProductModal 
        clientProductModalRef={clientProductModalRef}
        tempImgUrl={tempImgUrl}
        tempProduct={tempProduct}
        orderQty={orderQty}
        setTempImgUrl={setTempImgUrl}
        setOrderQty={setOrderQty}
        closeClientProductModal={closeClientProductModal}
        addCartItem={addCartItem}
      />
    </>
  )
}

export default App
