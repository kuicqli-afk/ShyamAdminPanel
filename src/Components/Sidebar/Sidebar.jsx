import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

import {
  AiOutlineDashboard,
  AiOutlineAppstore,
  AiOutlineShoppingCart
} from "react-icons/ai";

import { FaBoxOpen, FaChevronDown } from "react-icons/fa";

function Sidebar() {

  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="sidebar">
      <h2 className="logo">Bakers Admin Panel</h2>

      <ul>

        {/* Dashboard */}
        <li>
          <NavLink
            to="/"
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
            <FaBoxOpen />
            <span>Products</span>

            <FaChevronDown
              className={`arrow ${openMenu === "products" ? "open" : ""}`}
            />
          </div>

          <ul className={`submenu ${openMenu === "products" ? "show" : ""}`}>
            <li>
              <NavLink to="/products/add">Add Products</NavLink>
            </li>

            <li>
              <NavLink to="/products/list">Products List</NavLink>
            </li>
          </ul>
        </li>

        {/* Banner */}
        <li>
          <div
            className="menu-item"
            onClick={() => toggleMenu("banner")}
          >
            <FaBoxOpen />
            <span>Banner</span>

            <FaChevronDown
              className={`arrow ${openMenu === "banner" ? "open" : ""}`}
            />
          </div>

          <ul className={`submenu ${openMenu === "banner" ? "show" : ""}`}>
            <li>
              <NavLink to="/add-banner">Add Banner</NavLink>
            </li>
             <li>
              <NavLink to="banner-list">Banner List</NavLink>
            </li>
          </ul>
        </li>

        {/* Categories */}
        <li>
          <div
            className="menu-item"
            onClick={() => toggleMenu("category")}
          >
            <AiOutlineAppstore />
            <span>Categories</span>

            <FaChevronDown
              className={`arrow ${openMenu === "category" ? "open" : ""}`}
            />
          </div>

          <ul className={`submenu ${openMenu === "category" ? "show" : ""}`}>
            <li>
              <NavLink to="/category" className={({ isActive }) => (isActive ? "active" : "")}>Add Category</NavLink>
            </li>

            <li>
              <NavLink to="/category-list" >View Categories</NavLink>
            </li>
          </ul>
        </li>

        {/* Orders */}
        <li>
          <NavLink to="/orders">
            <AiOutlineShoppingCart /> Orders
          </NavLink>
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;