import { useState, useEffect } from "react";
import axios from "axios";
import "./ProductList.css";

function ProductList() {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {

    axios.get("https://shyambackend.onrender.com/api/products")
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  const productsPerPage = 10;

  // 🔎 Search Filter
  const filteredProducts = products.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const lastIndex = currentPage * productsPerPage;
  const firstIndex = lastIndex - productsPerPage;

  const currentProducts = filteredProducts.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (

    <div className="product-list">

      <div className="table-header">

        <h2>Products</h2>

        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />

      </div>

      <table>

        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Product Image</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {currentProducts.map((product, index) => (

            <tr key={product._id}>

              <td>{firstIndex + index + 1}</td>

              <td>
                <img
                  className="product-img"
                  src={product.image}
                  alt={product.title}
                />
              </td>

              <td>{product.title}</td>

              <td>{product.name}</td>

              <td>₹{product.price}</td>

              <td className="action-btns">
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <div className="pagination">

        <span>
          Showing {firstIndex + 1} to{" "}
          {Math.min(lastIndex, filteredProducts.length)} of{" "}
          {filteredProducts.length} entries
        </span>

        <div className="page-buttons">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>

          <span className="page-number">
            {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>

        </div>

      </div>

    </div>

  );
}

export default ProductList;