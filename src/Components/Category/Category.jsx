import React, { useEffect, useState, useRef } from "react";
import "./Category.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FiUpload } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { BiMenu } from "react-icons/bi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const initialCategory = {
    name: "",
    categoryImage: null,
    bannerImages: [],
};

const Category = () => {
    const [category, setCategory] = useState(initialCategory);

    const [categories, setCategories] = useState([]);
    const [uploadStatus, setUploadStatus] = useState("idle");
    const [errors, setErrors] = useState({});
    const [statusFilter, setStatusFilter] = useState("all");
    const categoryRef = useRef();

    const [categoryImage, setCategoryImage] = useState(null);
    const galleryInputRef = useRef();

    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [bulkAction, setBulkAction] = useState("");
    const [subName, setSubName] = useState("");
    const [parentCategory, setParentCategory] = useState("");

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4); // change as needed


    // === editing cate ===

    const [editingCategory, setEditingCategory] = useState(null);

    const handleEditClick = (cat) => {
        setEditingCategory(cat);
        setCategory({
            name: cat.name || "",
            categoryImage: null,
            bannerImages: [],
            displayType: cat.displayType || "default",
        });

        setParentCategory(cat.parent || "");


        if (cat.image) {
            setCategoryImage({
                preview: `https://shyambackend.onrender.com/uploads/${cat.image}`,
                file: null,
            });
        }
    };

    // ================= FETCH =================
    const fetchCategories = () => {
        axios
            .get("https://shyambackend.onrender.com/api/categories/category-list")
            .then((res) => {
                setCategories(res.data.categories);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

    // ================= HANDLERS =================
    const handleChange = (e) => {
        setCategory((prev) => ({ ...prev, name: e.target.value }));
    };

    const handleCategoryImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setCategory((prev) => ({ ...prev, categoryImage: file }));
        setCategoryPreview(URL.createObjectURL(file));
    };
    const handleGalleryChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const image = {
            file,
            preview: URL.createObjectURL(file),
        };

        setCategoryImage(image);

        // also store for backend
        setCategory((prev) => ({
            ...prev,
            categoryImage: file,
        }));
    };

    const handleRemoveGalleryImage = () => {
        setCategoryImage(null);

        setCategory((prev) => ({
            ...prev,
            categoryImage: null,
        }));
    };

    // ================= VALIDATION =================
    const validateForm = () => {
        const errors = {};

        if (!category.name.trim()) errors.name = "Category name required";
        if (!category.categoryImage && !editingCategory) {
            errors.categoryImage = "Image required";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = validateForm();
        setErrors(validation);
        if (Object.keys(validation).length > 0) return;

        setUploadStatus("uploading");

        const formData = new FormData();
        formData.append("name", category.name);
        if (category.categoryImage) formData.append("categoryImage", category.categoryImage);
        formData.append("displayType", category.displayType);
        formData.append("parentCategory", parentCategory);

        try {
            if (editingCategory) {
                await axios.put(
                    `https://shyambackend.onrender.com/api/categories/update/${editingCategory._id}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                toast.success("Category updated successfully ✅");
            } else {
                // CREATE new category
                await axios.post(
                    "https://shyambackend.onrender.com/api/categories/add-category",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                toast.success("Category Added successfully ✅");
            }

            setUploadStatus("success");
            setCategory(initialCategory);
            setCategoryImage(null);
            setEditingCategory(null); // reset editing
            fetchCategories();
            setTimeout(() => setUploadStatus("idle"), 2000);
        } catch (err) {
            console.log(err);
            setUploadStatus("error");
            toast.error("Something went wrong ❌");
        }
    };

    // ================= DELETE =================

    const handleDelete = async (id) => {

        try {
            await axios.delete(
                `https://shyambackend.onrender.com/api/categories/delete/${id}`
            );
            toast.success("Category deleted 🗑️");
            fetchCategories();
        } catch (err) {
            toast.error("Delete failed ❌");
        }
    };


    /// table 

    const filteredCategories = categories
        .filter((cat) => {
            if (statusFilter === "hidden") return cat.hidden;
            if (statusFilter === "visible") return !cat.hidden;
            return true;
        })
        .filter((cat) =>
            cat.name.toLowerCase().includes(search.toLowerCase())
        );


    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(categories);
        const [moved] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, moved);

        setCategories(items);

        try {
            await axios.put(
                "https://shyambackend.onrender.com/api/categories/update-order",
                {
                    categories: items.map((cat, index) => ({
                        id: cat._id,
                        order: index,
                    })),
                }
            );
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong")
        }
    };

    const toggleSelect = (id) => {
        let updated;

        if (selected.includes(id)) {
            updated = selected.filter((i) => i !== id);
        } else {
            updated = [...selected, id];
        }

        setSelected(updated);

        // update selectAll checkbox
        if (updated.length === filteredCategories.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    };
    // slected
    const handleSelectAll = () => {
        if (selectAll) {
            setSelected([]);
        } else {
            setSelected(filteredCategories.map((cat) => cat._id));
        }
        setSelectAll(!selectAll);
    };

    // bulck action 

    const handleBulkAction = async () => {
        if (!bulkAction) {
            toast.warning("Select action first");
            return;
        }

        if (selected.length === 0) {
            toast.warning("No categories selected");
            return;
        }

        try {
            if (bulkAction === "delete") {
                if (!window.confirm("Delete selected categories?")) return;

                await Promise.all(
                    selected.map((id) =>
                        axios.delete(`https://shyambackend.onrender.com/api/categories/delete/${id}`)
                    )
                );

            }

            if (bulkAction === "hide") {
                await Promise.all(
                    selected.map((id) =>
                        axios.put(`https://shyambackend.onrender.com/api/categories/toggle-hide/${id}`)
                    )
                );
            }

            // RESET
            setSelected([]);
            setSelectAll(false);
            fetchCategories();
            toast.success("Bulk action applied ✅");
        } catch (err) {
            console.log(err);
            toast.error("Error")
        }
    };

    const handleHide = async (id) => {
        try {
            await axios.put(
                `https://shyambackend.onrender.com/api/categories/toggle-hide/${id}`
            );
            toast.info("Category hidden");
            fetchCategories();
        } catch (err) {
            toast.error("Category hidden Error");
        }
    };

    const handleUnhide = async (id) => {
        try {
            await axios.put(
                `https://shyambackend.onrender.com/api/categories/toggle-hide/${id}`
            );
            toast.info("Category visible");
            fetchCategories();
        } catch (err) {
            toast.error("Category Unhide Error");
        }
    };

    const handleAddSub = async () => {
        if (!subName || !parentCategory) {
            toast.warning("Fill all fields");
            return;
        }

        try {
            await axios.post("https://shyambackend.onrender.com/api/subcategory/add", {
                name: subName,
                category: parentCategory
            });

            toast.success("Subcategory Added Successfuly");
            setSubName("");
            setParentCategory("");

        } catch (err) {
            console.log(err);
        }
    };

    // ✅ FIRST define function
    const buildTree = (data) => {
        const map = {};
        const roots = [];

        data.forEach(cat => {
            map[cat._id] = { ...cat, children: [] };
        });

        data.forEach(cat => {
            if (cat.parent && map[cat.parent]) {
                map[cat.parent].children.push(map[cat._id]);
            } else {
                // 👇 fallback → always show
                roots.push(map[cat._id]);
            }
        });

        return roots;
    };

    // 1. Build tree first
    const categoryTree = buildTree(categories);

    // 2. Pagination indexes
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;

    // 3. Paginated data
    const paginatedTree = categoryTree.slice(indexOfFirst, indexOfLast);

    // 4. Total pages
    const totalPages = Math.ceil(categoryTree.length / itemsPerPage);

    const renderTree = (nodes, level = 0) => {
        return nodes.map((cat, index) => {

            if (
                (statusFilter === "hidden" && !cat.hidden) ||
                (statusFilter === "visible" && cat.hidden) ||
                !cat.name.toLowerCase().includes(search.toLowerCase())
            ) {
                return null;
            }
            const date = new Date(cat.createdAt);

            return (
                <React.Fragment key={cat._id}>
                    <Draggable draggableId={cat._id} index={index}>
                        {(provided) => (
                            <tr ref={provided.innerRef} {...provided.draggableProps}>

                                {/* Checkbox */}
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(cat._id)}
                                        onChange={() => toggleSelect(cat._id)}
                                    />
                                </td>

                                {/* Image */}
                                <td>
                                    <img src={`http://localhost:5000/uploads/${cat.image}`} alt="" />
                                </td>

                                {/* Name with hierarchy */}
                                <td
                                    className="name-link"
                                    style={{ paddingLeft: `${level * 25}px` }}
                                >
                                    {level > 0 && "— "}
                                    {cat.name}
                                </td>

                                {/* Date */}
                                <td>
                                    {date.toLocaleDateString()} {date.toLocaleTimeString()}
                                </td>

                                {/* Status */}
                                <td>
                                    {cat.hidden ? (
                                        <span style={{ color: "red" }}>Hidden</span>
                                    ) : (
                                        <span style={{ color: "green" }}>Visible</span>
                                    )}
                                </td>

                                {/* Actions */}
                                <td>
                                    <button className="edit" onClick={() => handleEditClick(cat)}>
                                        Edit
                                    </button>

                                    {cat.hidden ? (
                                        <button className="hide" onClick={() => handleUnhide(cat._id)}>
                                            Unhide
                                        </button>
                                    ) : (
                                        <button className="hide" onClick={() => handleHide(cat._id)}>
                                            Hide
                                        </button>
                                    )}

                                    <button className="delete" onClick={() => handleDelete(cat._id)}>
                                        Delete
                                    </button>
                                </td>

                                {/* Drag */}
                                <td>
                                    <div className="menu" {...provided.dragHandleProps}>
                                        <BiMenu />
                                    </div>
                                </td>
                            </tr>
                        )}
                    </Draggable>

                    {/* 👇 CHILDREN */}
                    {cat.children && renderTree(cat.children, level + 1)}
                </React.Fragment>
            );
        });
    };

    const renderCategoryOptions = (nodes, level = 0) => {
        return nodes.map((cat) => (
            <React.Fragment key={cat._id}>
                <option value={cat._id}>
                    {"— ".repeat(level)} {cat.name}
                </option>

                {cat.children &&
                    renderCategoryOptions(cat.children, level + 1)}
            </React.Fragment>
        ));
    };
    // ================= UI =================

    return (
        <div className="admin-layout">
            {/* LEFT SIDE FORM */}
            <div className="left-panel">
                <form className="product-form" onSubmit={handleSubmit}>

                    <h2>Product Categories</h2>
                    {/* NAME */}
                    <label>Name</label>
                    <input
                        type="text"
                        placeholder="Enter category name"
                        value={category.name}
                        onChange={handleChange}
                    />

                    {/* PARENT CATEGORY */}
                    <label>Parent Category</label>
                    <select
                        value={parentCategory}
                        onChange={(e) => setParentCategory(e.target.value)}
                    >
                        <option value="">None</option>
                        {renderCategoryOptions(categoryTree)}
                    </select>

                    {/* DISPLAY TYPE */}
                    <label>Display Type</label>
                    <select
                        value={category.displayType || "default"}
                        onChange={(e) =>
                            setCategory((prev) => ({
                                ...prev,
                                displayType: e.target.value,
                            }))
                        }
                    >
                        <option value="default">Default</option>
                        <option value="products">Products</option>
                        <option value="subcategories">Subcategories</option>
                        <option value="both">Both</option>
                    </select>

                    {/* Category Image */}
                    <div className="form-group full">
                        <label>Category Image</label><small>Category Image Size 160px X 160px</small>

                        <div style={{ display: "flex", gap: "60px", flexWrap: "wrap" }}>

                            {categoryImage && (
                                <div className="image-upload-wrapper">
                                    <div className="image-upload-box">
                                        <img src={categoryImage.preview} alt="preview" />

                                        <div className="image-overlay">
                                            <div
                                                className="delete-icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveGalleryImage();
                                                }}
                                            >
                                                <MdDelete />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!categoryImage && (
                                <div
                                    className="image-upload-box"
                                    onClick={() => galleryInputRef.current.click()}
                                >
                                    <div className="upload-placeholder">
                                        <span><FiUpload /></span>
                                        <p>Upload</p>
                                    </div>
                                </div>
                            )}

                            <input
                                type="file"
                                hidden
                                ref={galleryInputRef}
                                accept="image/*"
                                onChange={handleGalleryChange}
                            />
                        </div>
                    </div>

                    {/* SUBMIT */}
                    <button type="submit" className="primary-btn">
                        {uploadStatus === "uploading"
                            ? editingCategory ? "Updating..." : "Adding..."
                            : editingCategory ? "Update Category" : "Add New Category"}
                    </button>
                </form>
            </div>

            {/* RIGHT SIDE TABLE */}
            <div className="right-panel">

                <div className="table-header">
                    <div className="left-actions">
                        <select onChange={(e) => setBulkAction(e.target.value)}>
                            <option value="">Bulk actions</option>
                            <option value="delete">Delete</option>
                            <option value="hide">Hide</option>
                        </select>
                        <button className="apply-btn" onClick={handleBulkAction}>
                            Apply
                        </button>
                    </div>

                    <div className="right-actions">
                        <input
                            type="text"
                            placeholder="Search categories"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="search-btn">Search</button>
                    </div>
                </div>

                {/* DRAG TABLE */}
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="categories">
                        {(provided) => (
                            <table
                                className="category-table"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                <thead>
                                    <tr>
                                        <th>
                                            <input type="checkbox" checked={selectAll}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Date & time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {/* {renderTree(categoryTree)} */}
                                    {renderTree(paginatedTree)}
                                </tbody>
                            </table>
                        )}
                    </Droppable>
                </DragDropContext>
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>

                    <span>Page {currentPage} of {totalPages}</span>

                    <button
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>

                {/* BOTTOM BULK */}
                <div className="table-footer">
                    <select>
                        <option>Bulk actions</option>
                        <option value="delete">Delete</option>
                        <option value="hide">Hide</option>
                    </select>
                    <button className="apply-btn" onClick={handleBulkAction}>
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Category;