import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

import {
  AiOutlineDashboard,
  AiOutlineShoppingCart
} from "react-icons/ai";

import { FaChevronDown, FaSlidersH } from "react-icons/fa";
import { BiSolidOffer } from "react-icons/bi";
import { FaProductHunt } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";




function Sidebar() {

  const [openMenu, setOpenMenu] = useState(null);
 
  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };


  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/";
  };

  return (
    <div className="sidebar">
      <h2 className="logo">Bakers Admin Panel</h2>

      <ul>

        {/* Dashboard */}
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <AiOutlineDashboard /> Dashboard
          </NavLink>
        </li>

        {/* Products */}
        <li>
          <div
            className="menu-item"
            onClick={() => toggleMenu("products")}
          >
            <FaProductHunt />
            <span>Products</span>

            <FaChevronDown
              className={`arrow ${openMenu === "products" ? "open" : ""}`}
            />
          </div>

          <ul className={`submenu ${openMenu === "products" ? "show" : ""}`}>

            <li>
              <NavLink to="/products/list">Products List</NavLink>
            </li>

            <li>
              <NavLink to="/products/add">Add Products</NavLink>
            </li>



            <li>
              <NavLink to="/category" className={({ isActive }) => (isActive ? "active" : "")}>Add Category</NavLink>
            </li>

          </ul>
        </li>

        {/* Banner */}
        <li>
          <div
            className="menu-item"
            onClick={() => toggleMenu("banner")}
          >
            <FaSlidersH />
            <span>Slider</span>

            <FaChevronDown
              className={`arrow ${openMenu === "banner" ? "open" : ""}`}
            />
          </div>

          <ul className={`submenu ${openMenu === "banner" ? "show" : ""}`}>
            <li>
              <NavLink to="/add-banner">Add Banner</NavLink>
            </li>
            <li>
              <NavLink to="/banner-list">Banner List</NavLink>
            </li>
          </ul>
        </li>
        <li>
          <div
            className="menu-item"
            onClick={() => toggleMenu("offers")}
          >
            <BiSolidOffer />
            <span>Offers</span>

            <FaChevronDown
              className={`arrow ${openMenu === "offers" ? "open" : ""}`}
            />
          </div>

          <ul className={`submenu ${openMenu === "offers" ? "show" : ""}`}>
            <li>
              <NavLink to="/offers" className={({ isActive }) => (isActive ? "active" : "")}>Add Offers</NavLink>
            </li>

            <li>
              <NavLink to="/offer-list" >View Offer List</NavLink>
            </li>
          </ul>
        </li>
        {/* Orders */}
        <li>
          <NavLink to="/orders">
            <AiOutlineShoppingCart /> Orders
          </NavLink>
        </li>

        <li onClick={handleLogout}>
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}> <LuLogOut />Logout</NavLink>
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;