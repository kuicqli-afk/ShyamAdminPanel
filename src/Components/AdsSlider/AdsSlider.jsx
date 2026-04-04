import React, { useState } from "react";
import axios from "axios";
import "./AdsSlider.css";

function AdsSlider() {
  const [imageFile, setImageFile] = useState(null);
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("link", link);
    formData.append("category", category);

    try {
      await axios.post("http://localhost:5000/api/ads/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Ad Added ✅");

      setImageFile(null);
      setLink("");
      setCategory("");

    } catch (err) {
      console.error(err);
      alert("Failed to add ad");
    }
  };

  return (
    <div className="ads-slider-container">
      <h2 className="ads-slider-title">Ads Slider</h2>
      <form className="ads-slider-form" onSubmit={handleSubmit}>
        <label className="ads-slider-label">
          Upload Image
          <input
            type="file"
            accept="image/*"
            className="ads-slider-input"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>

        <label className="ads-slider-label">
          Redirect Link
          <input
            type="text"
            placeholder="Enter URL"
            className="ads-slider-input"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </label>

        <label className="ads-slider-label">
          Category
          <input
            type="text"
            placeholder="e.g., cake, pizza"
            className="ads-slider-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </label>

        <button type="submit" className="ads-slider-button">
          Save
        </button>
      </form>
    </div>
  );
}

export default AdsSlider;