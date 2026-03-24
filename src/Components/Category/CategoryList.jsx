import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CategoryList.css";

function CategoryList() {

  const [categories, setCategories] = useState([]);

  useEffect(() => {

    axios.get("http://localhost:5000/api/categories/category-list")
      .then((res) => {
        setCategories(res.data.categories);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  return (

    <div className="categorylist-container">

      <h2 className="categorylist-title">Category List</h2>

      <table className="categorylist-table">

        <thead>
          <tr>
            <th>Sr.No</th>
            <th>Category Image</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {categories.map((category, index) => (

            <tr key={category._id}>

              <td>{index + 1}</td>

              <td>
                <img
                  className="categorylist-image"
                  src={`http://localhost:5000/uploads/${category.image}`}
                  alt={category.name}
                />
              </td>

              <td>{category.name}</td>

              <td>
                <button className="categorylist-edit">Edit</button>
                <button className="categorylist-delete">Delete</button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default CategoryList;