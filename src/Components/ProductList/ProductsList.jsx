import { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { BiMenu } from "react-icons/bi";
import { toast } from "react-toastify";
import "./ProductList.css";

function ProductList() {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [bulkAction, setBulkAction] = useState("");

  // ================= FETCH =================
  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://shyambackend.onrender.com/api/products");
      setProducts(res.data.products);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= FILTER =================
  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  // ================= DRAG =================
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(products);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setProducts(items);

    try {
      await axios.put("https://shyambackend.onrender.com/api/products/update-order", {
        products: items.map((p, index) => ({
          id: p._id,
          order: index,
        })),
      });
    } catch {
      toast.error("Order update failed");
    }
  };

  // ================= SELECT =================
  const toggleSelect = (id) => {
    const updated = selected.includes(id)
      ? selected.filter((i) => i !== id)
      : [...selected, id];

    setSelected(updated);
    setSelectAll(updated.length === filtered.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(filtered.map((p) => p._id));
    }
    setSelectAll(!selectAll);
  };

  // ================= ACTIONS =================

  // ✅ SOFT DELETE
  const handleDelete = async (id) => {
    try {
      await axios.put(`https://shyambackend.onrender.com/api/products/delete/${id}`);
      toast.success("Moved to trash 🗑️");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ✅ HIDE / UNHIDE
  const handleHide = async (id) => {
    await axios.put(`https://shyambackend.onrender.com/api/products/toggle-hide/${id}`);
    fetchProducts();
  };

  // ✅ BULK
  const handleBulk = async () => {
    if (!bulkAction || selected.length === 0) {
      toast.warning("Select action & products");
      return;
    }

    try {
      if (bulkAction === "delete") {
        await Promise.all(
          selected.map((id) =>
            axios.put(`https://shyambackend.onrender.com/api/products/delete/${id}`)
          )
        );
      }

      if (bulkAction === "hide") {
        await Promise.all(
          selected.map((id) =>
            axios.put(`https://shyambackend.onrender.com/api/products/toggle-hide/${id}`)
          )
        );
      }

      setSelected([]);
      setSelectAll(false);
      fetchProducts();
      toast.success("Bulk action applied");
    } catch {
      toast.error("Error");
    }
  };
  // const date = new Date(cat.createdAt);
  // ================= UI =================
  return (
    <div className="admin-layout">
      <div className="right-panel" style={{ width: "100%" }}>

        <h2>Products</h2>

        {/* HEADER */}
        <div className="table-header">
          <div className="left-actions">
            <select onChange={(e) => setBulkAction(e.target.value)}>
              <option value="">Bulk actions</option>
              <option value="delete">Move to Trash</option>
              <option value="hide">Hide</option>
            </select>
            <button className="apply-btn" onClick={handleBulk}>
              Apply
            </button>
          </div>

          <div className="right-actions">
            <input
              placeholder="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="products">
            {(provided) => (
              <table
                className="category-table"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                    </th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((product, index) => (
                    <Draggable key={product._id} draggableId={product._id} index={index}>
                      {(provided) => (
                        <tr ref={provided.innerRef} {...provided.draggableProps}>

                          {/* Checkbox */}
                          <td>
                            <input
                              type="checkbox"
                              checked={selected.includes(product._id)}
                              onChange={() => toggleSelect(product._id)}
                            />
                          </td>

                          {/* Image */}
                          <td>
                            <img className="product-img" src={product.image} alt="" />
                          </td>

                          {/* Name */}
                          <td>{product.title}</td>

                          {/* Price */}
                          <td>₹{product.price}</td>

                          <td>{product.category?.name}</td>

                          <td>
                            {/* {date.toLocaleDateString()} {date.toLocaleTimeString()} */}

                          </td>

                          {/* Status */}
                          <td>
                            {product.hidden ? (
                              <span style={{ color: "red" }}>Hidden</span>
                            ) : (
                              <span style={{ color: "green" }}>Visible</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td>
                            <button className="edit-btn"
                              onClick={() => window.location.href = `/products/add/${product._id}`}
                            >
                              Edit
                            </button>

                            <button
                              className="hide"
                              onClick={() => handleHide(product._id)}
                            >
                              {product.hidden ? "Unhide" : "Hide"}
                            </button>

                            <button
                              className="delete-btn"
                              onClick={() => handleDelete(product._id)}
                            >
                              Trash
                            </button>
                          </td>
                          {/* Drag */}
                          <td {...provided.dragHandleProps}>
                            <BiMenu />
                          </td>

                        </tr>
                      )}
                    </Draggable>
                  ))}
                </tbody>

              </table>
            )}
          </Droppable>
        </DragDropContext>

      </div>
    </div>
  );
}

export default ProductList;