import React, { useState, useRef } from "react";
import "./Category.css";
import { FiUpload } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import axios from "axios";

const initialCategory = {
    name: "",
    categoryImage: null,
    bannerImages: [],
};

const Category = () => {
    const [category, setCategory] = useState(initialCategory);
    const [categoryPreview, setCategoryPreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState([]);
    const [uploadStatus, setUploadStatus] = useState("idle");
    const [errors, setErrors] = useState({});

    // ✅ FIX: separate refs
    const categoryRef = useRef();
    const bannerRef = useRef();

    // ================= HANDLERS =================

    const handleChange = (e) => {
        setCategory((prev) => ({ ...prev, name: e.target.value }));
    };

    // ✅ Category Image (Single)
    const handleCategoryImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setCategory((prev) => ({ ...prev, categoryImage: file }));
        setCategoryPreview(URL.createObjectURL(file));
    };

    // ✅ Banner Images (Multiple Max 5)
    const handleBannerImages = (e) => {
        const files = Array.from(e.target.files);

        if (!files.length) return;

        if (files.length + category.bannerImages.length > 5) {
            alert("Maximum 5 banner images allowed");
            return;
        }

        const newPreviews = files.map((file) => URL.createObjectURL(file));

        setCategory((prev) => ({
            ...prev,
            bannerImages: [...prev.bannerImages, ...files],
        }));

        setBannerPreview((prev) => [...prev, ...newPreviews]);
    };

    // ✅ Remove Category Image
    const removeCategoryImage = () => {
        setCategory((prev) => ({ ...prev, categoryImage: null }));
        setCategoryPreview(null);
    };

    // ✅ Remove Banner Image
    const removeBannerImage = (index) => {
        const updatedImages = [...category.bannerImages];
        const updatedPreview = [...bannerPreview];

        updatedImages.splice(index, 1);
        updatedPreview.splice(index, 1);

        setCategory((prev) => ({
            ...prev,
            bannerImages: updatedImages,
        }));

        setBannerPreview(updatedPreview);
    };

    // ================= VALIDATION =================

    const validateForm = () => {
        const newErrors = {};

        if (!category.name.trim()) {
            newErrors.name = "Category name required";
        }

        if (!category.categoryImage) {
            newErrors.categoryImage = "Category image required";
        }

        if (category.bannerImages.length === 0) {
            newErrors.bannerImages = "At least one banner image required";
        }

        return newErrors;
    };

    // ================= SUBMIT =================

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        setUploadStatus("uploading");

        const formData = new FormData();

        // ✅ required fields
        formData.append("name", category.name);
        formData.append("categoryImage", category.categoryImage);

        // ✅ multiple images (ONLY THIS LOOP)
        category.bannerImages.forEach((img) => {
            formData.append("bannerImages", img);
        });

        try {
            await axios.post(
                "http://localhost:5000/api/categories/add-category",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            setUploadStatus("success");

            // Reset
            setCategory(initialCategory);
            setCategoryPreview(null);
            setBannerPreview([]);
            setErrors({});

            setTimeout(() => setUploadStatus("idle"), 2000);
        } catch (err) {
            console.error(err);
            setUploadStatus("error");
            setTimeout(() => setUploadStatus("idle"), 2000);
        }
    };

    // ================= UI =================

    return (
        <div className="admin-category-container">
            <form className="product-form" onSubmit={handleSubmit}>
                <h2>Add Categories</h2>

                {/* Category Name */}
                <div className="form-group">
                    <label>Category Name</label>
                    <input
                        type="text"
                        value={category.name}
                        onChange={handleChange}
                        placeholder="Enter category name"
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                </div>

                {/* Banner Images */}
                <div className="form-group full">
                    <label>Banner Images</label>

                    <div style={{ display: "flex", gap: "60px", flexWrap: "wrap" }}>
                        {/* Images */}
                        {bannerPreview.map((img, index) => (
                            <div key={index} className="image-upload-wrapper">
                                <div className="image-upload-box">
                                    <img src={img} alt="banner" />

                                    <div className="image-overlay">
                                        <div
                                            className="delete-icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeBannerImage(index);
                                            }}
                                        >
                                            <MdDelete />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Upload Box */}
                        {bannerPreview.length < 5 && (
                            <div
                                className="image-upload-box"
                                onClick={() => bannerRef.current.click()}
                            >
                                <div className="upload-placeholder">
                                    <span><FiUpload /></span>
                                    <p>Upload</p>
                                </div>
                            </div>
                        )}

                        {/* Hidden Input */}
                        <input
                            type="file"
                            multiple
                            hidden
                            ref={bannerRef}
                            accept="image/*"
                            onChange={handleBannerImages}
                        />
                    </div>

                    {/* Error */}
                    {errors.bannerImages && (
                        <p className="error">{errors.bannerImages}</p>
                    )}
                </div>



                {/* Category Image */}
                <div className="form-group">
                    <label>Category Image</label>

                    <div className="image-upload-wrapper">
                        {categoryPreview ? (
                            <div className="image-preview">
                                <img src={categoryPreview} alt="category" />
                                <div className="image-overlay">
                                    <div
                                        className="delete-icon"
                                        onClick={removeCategoryImage}
                                    >
                                        <MdDelete />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="upload-placeholders"
                                onClick={() => categoryRef.current.click()}
                            >
                                <FiUpload />
                                <p>Upload Category</p>
                            </div>
                        )}

                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            ref={categoryRef}
                            onChange={handleCategoryImage}
                        />
                    </div>

                    {errors.categoryImage && (
                        <p className="error">{errors.categoryImage}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={uploadStatus === "uploading"}
                    className="submit-btn"
                >
                    {uploadStatus === "idle"
                        ? "Add Category"
                        : uploadStatus === "uploading"
                            ? "Uploading..."
                            : uploadStatus === "success"
                                ? "Uploaded!"
                                : "Error!"}
                </button>
            </form >
        </div >
    );
};

export default Category;