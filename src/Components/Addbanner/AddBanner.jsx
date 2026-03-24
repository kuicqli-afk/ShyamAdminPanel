// AddBanner.jsx
import React, { useState, useRef } from "react";
import axios from "axios";
import "./AddBanner.css";

import { FiUpload } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

function AddBanner() {
  const [title, setTitle] = useState("");
  const [off, setOff] = useState(""); // discount value
  const [sliderType, setSliderType] = useState(""); // "offer", "flat", "combo", "weekend"
  const [galleryImages, setGalleryImages] = useState([]);

  const galleryInputRef = useRef();

  // Add Images
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setGalleryImages((prev) => [...prev, ...newImages]);
  };

  // Remove Image
  const handleRemoveGalleryImage = (index) => {
    const updatedImages = [...galleryImages];
    updatedImages.splice(index, 1);
    setGalleryImages(updatedImages);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!sliderType) {
      alert("Please select a slider type");
      return;
    }
    if (!title) {
      alert("Please enter banner title");
      return;
    }
    if (sliderType === "offer" && (!off || off <= 0)) {
      alert("Please enter a valid discount for offer slider");
      return;
    }
    if (galleryImages.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("off", sliderType === "offer" ? off : 0); // discount only for offer
    formData.append("type", sliderType);

    galleryImages.forEach((img) => formData.append("images", img.file));

    try {
      const res = await axios.post(
        "http://localhost:5000/api/banner/add-banner",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log(res.data);
      alert("Banner Added Successfully");

      // Reset form
      setTitle("");
      setOff("");
      setSliderType("");
      setGalleryImages([]);
    } catch (error) {
      console.error(error);
      alert("Error uploading banner");
    }
  };

  return (
    <div className="add-banner-container">
      <form className="product-form" onSubmit={handleSubmit}>
        <h2>Add Banner</h2>

        {/* Slider Type */}
        <div className="form-group">
          <label>Banner Type</label>
          <select
            value={sliderType}
            onChange={(e) => setSliderType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            <option value="offer">Offer</option>
            <option value="flat">Flat</option>
            <option value="combo">Combo</option>
            <option value="weekend">Weekend</option>
          </select>
        </div>

        {/* Title */}
        <div className="form-group">
          <label>Banner Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter banner title"
            required
          />
        </div>

        {/* Discount - only for offer */}
        {sliderType === "offer" && (
          <div className="form-group">
            <label>Discount %</label>
            <input
              type="number"
              value={off}
              onChange={(e) => setOff(e.target.value)}
              placeholder="Enter discount %"
              min={1}
              required
            />
          </div>
        )}

        {/* Image Upload */}
        <div className="full-width">
          <label>Banner Images</label>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            {galleryImages.map((img, index) => (
              <div key={index} className="image-upload-box">
                <img src={img.preview} alt="banner" />
                <div className="image-overlay">
                  <div
                    className="delete-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveGalleryImage(index);
                    }}
                  >
                    <MdDelete />
                  </div>
                </div>
              </div>
            ))}

            {/* Upload Box */}
            <div
              className="image-upload-box"
              onClick={() => galleryInputRef.current.click()}
            >
              <div className="upload-placeholder">
                <span>
                  <FiUpload />
                </span>
                <p>Upload</p>
              </div>
            </div>

            <input
              type="file"
              multiple
              hidden
              ref={galleryInputRef}
              accept="image/*"
              onChange={handleGalleryChange}
            />
          </div>
        </div>

        <button className="submit-btn">Add Banner</button>
      </form>
    </div>
  );
}

export default AddBanner;