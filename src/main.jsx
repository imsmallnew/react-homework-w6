import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'; // 引入Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // 引入Bootstrap JS
import '@fortawesome/fontawesome-free/css/all.min.css'; // 引入Font Awesome 圖標庫
import './index.css'
// import App from './App.jsx'
import { createHashRouter, RouterProvider } from 'react-router-dom';
import routes from './routes/index.jsx';

const router = createHashRouter(routes, {
  future: {
    v7_startTransition: true, // 避免 React Router 7 的 startTransition 警告
    v7_relativeSplatPath: true // 避免 Splat routes 警告
  }
});

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  // <App />
  <RouterProvider router={router} />
  // </StrictMode>,
)
