import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./Components/Sidebar/Sidebar";
import AddProduct from "./Components/AddProducts/AddProduct";
import Dashboard from "./Components/Dashboard/Dashboard";
import ProductList from "./Components/ProductList/ProductsList";
import AddBanner from "./Components/Addbanner/AddBanner";
import Category from "./Components/Category/Category";
import BannerList from "./Components/Addbanner/BannerList";
import AddOffers from "./Components/Offers/AddOffers";
import LoginPage from "./Components/Login/LoginPage";
import OfferList from "./Components/Offers/OfferList";

function App() {

  const [isLogin, setIsLogin] = useState(null);

 
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    if (loginStatus === "true") {
      setIsLogin(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer />


      {!isLogin ? (
        <Routes>
          <Route path="*" element={<LoginPage setIsLogin={setIsLogin} />} />
        </Routes>
      ) : (
        
        <div className="admin-layout">

          <Sidebar />

          <div className="main-content">
            <Routes>

              <Route path="/" element={<Navigate to="/dashboard" />} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products/add" element={<AddProduct />} />
              <Route path="/products/list" element={<ProductList />} />
              <Route path="/add-banner" element={<AddBanner />} />
              <Route path="/banner-list" element={<BannerList />} />
              <Route path="/category" element={<Category />} />
              <Route path="/offers" element={<AddOffers />} />
              <Route path="/offer-list" element={<OfferList />} />

            </Routes>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;