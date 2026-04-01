import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

import {
  AiOutlineDashboard,
  AiOutlineAppstore,
  AiOutlineShoppingCart
} from "react-icons/ai";

import { FaChevronDown, FaSlidersH } from "react-icons/fa";
import { BiCategory, BiCategoryAlt, BiLogIn, BiSolidOffer } from "react-icons/bi";
import { FaProductHunt } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";



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
              <NavLink to="banner-list">Banner List</NavLink>
            </li>
          </ul>
        </li>

        {/* Categories */}
        {/* <li>
          <div
            className="menu-item"
            onClick={() => toggleMenu("category")}
          >
            <BiCategoryAlt />
            <span>Categories</span>

            <FaChevronDown
              className={`arrow ${openMenu === "category" ? "open" : ""}`}
            />
          </div>


        </li> */}
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

            {/* <li>
              <NavLink to="/category-list" >View Categories</NavLink>
            </li> */}
          </ul>
        </li>

        <li>
          <div
            className="menu-item"
            onClick={() => toggleMenu("login")}
          >
            <BiLogIn />
            <span>Login</span>

            <FaChevronDown
              className={`arrow ${openMenu === "login" ? "open" : ""}`}
            />
          </div>

          <ul className={`submenu ${openMenu === "login" ? "show" : ""}`}>
            <li>
              <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>Login</NavLink>
            </li>

            {/* <li>
              <NavLink to="/logout" >Logout</NavLink>
            </li> */}
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