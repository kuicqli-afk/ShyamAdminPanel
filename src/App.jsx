import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Sidebar from "./Components/Sidebar/Sidebar";
import AddProduct from "./Components/AddProducts/AddProduct";
import Dashboard from "./Components/Dashboard/Dashboard";
import ProductList from "./Components/ProductList/ProductsList";
import AddBanner from "./Components/Addbanner/AddBanner";
import Category from "./Components/Category/Category";
import BannerList from "./Components/Addbanner/BannerList";
import CategoryList from "./Components/Category/CategoryList";

function App() {
  return (
    <BrowserRouter>

      <div className="admin-layout">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="main-content">

          <Routes>

            <Route path="/" element={<Dashboard />} />

            <Route path="/products/add" element={<AddProduct />} />

            <Route path="/products/list" element={<ProductList />} />
            <Route path="/add-banner" element={<AddBanner />} />
            <Route path="/banner-list" element={<BannerList />} />
             <Route path="/category" element={<Category />} />
             <Route path="/category-list" element={<CategoryList />} />
           


          </Routes>

        </div>

      </div>

    </BrowserRouter>
  );
}

export default App;