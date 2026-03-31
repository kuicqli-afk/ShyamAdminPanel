import React, { useRef, useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import "./AddProduct.css";

function AddProduct() {

  const initialState = {
    category: "",
    banner: "",
    title: "",
    portion: "",
    desc: "",
    rating: "",
    reviews: "",
    orders: "",
    status: "",
    view: "",
    type: "veg",
    price: "",
    offer: "",
    off: "",
    slots: "",
    isOpen: true,
    image: null,
    images: []
  };

  const [product, setProduct] = useState(initialState);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [categories, setCategories] = useState([]);
  const [banner, setBanner] = useState([]);
  useEffect(() => {

    axios.get("https://shyambackend.onrender.com/api/categories/category-list")
      .then((res) => {
        setCategories(res.data.categories);
      })
      .catch((err) => console.log(err));

    axios.get("https://shyambackend.onrender.com/api/banner")
      .then((res) => {
        setBanner(res.data.banners);
      })
      .catch((err) => console.log(err));

  }, []);
  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prev) => {
      const updated = {
        ...prev,
        [name]: name === "isOpen" ? value === "true" : value
      };

      const mrp = Number(updated.offer);
      const price = Number(updated.price);

      if (mrp && price) {
        const discount = ((mrp - price) / mrp) * 100;
        updated.off = Math.round(discount);
      }

      return updated;
    });
  };
  
  const mainImageRef = useRef();
  const galleryInputRef = useRef();
  const [errors, setErrors] = useState({});

  const [mainPreview, setMainPreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProduct((prev) => ({ ...prev, image: file }));
    setMainPreview(URL.createObjectURL(file));
  };

  const removeMainImage = () => {
    setProduct((prev) => ({ ...prev, image: null }));
    setMainPreview(null);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setGalleryImages((prev) => [...prev, ...newImages]);
    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleRemoveGalleryImage = (index) => {
    const updated = [...galleryImages];
    updated.splice(index, 1);
    setGalleryImages(updated);

    const files = [...product.images];
    files.splice(index, 1);
    setProduct((prev) => ({ ...prev, images: files }));
  };


  // validation
  const validateForm = () => {
    const newErrors = {};
    if (!product.category) newErrors.category = "Category required";
    if (!product.title.trim()) newErrors.title = "Product name required";
    if (!product.price) newErrors.price = "Price required";
    if (!product.image) newErrors.image = "Main image required";

    return newErrors;
  };
  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors); // show errors

    if (Object.keys(validationErrors).length > 0) return; // stop if invalid
    // Start uploading
    setUploadStatus("uploading");

    const slotArray = product.slots
      ? product.slots.split(",").map((s) => s.trim())
      : [];

    const formData = new FormData();
    Object.keys(product).forEach((key) => {
      if (key !== "images" && key !== "image" && key !== "slots") {
        formData.append(key, product[key]);
      }
    });
    formData.append("slots", slotArray.join(","));
    if (product.image) formData.append("image", product.image);
    product.images.forEach((img) => formData.append("images", img));

    try {
      await axios.post(
        "https://shyambackend.onrender.com/api/products/add-product",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUploadStatus("success");
      setProduct(initialState);
      setMainPreview(null);
      setGalleryImages([]);
      setErrors({});
      setTimeout(() => setUploadStatus("idle"), 2000);
    } catch (err) {
      console.error(err);
      setUploadStatus("idle");
    }
  };
  return (
    <div className="add-product-container">



      <form className="product-form" onSubmit={handleSubmit}>
        <h2>Add Product</h2>
        <div className="form-grid">
          <div className="form-group">

            <label>Category</label>

            <select
              name="category"
              value={product.category}
              onChange={handleChange}
            >

              <option value="">{categories.length === 0 ? "Loading..." : "Select Category"}</option>

              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}

            </select>
            {errors.category && <p className="error">{errors.category}</p>}

          </div>
          <div className="form-group">

            <label>Banner</label>

            <select
              name="banner"
              value={product.banner}
              onChange={handleChange}
            >

              <option value="">
                {banner.length === 0 ? "Loading..." : "Select Banner"}
              </option>

              {banner.map((ban) => (
                <option key={ban._id} value={ban._id}>
                  <span>{ban.type}</span>
                </option>
              ))}

            </select>

          </div>
          <div className="form-group">
            <label>Product Name</label>
            <input type="text" name="title" value={product.title} onChange={handleChange} />
            {errors.title && <p className="error">{errors.title}</p>}
          </div>
    
          <div className="form-group">
            <label>Quantity</label>
            <input type="text" name="portion" value={product.portion} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Product Type</label>
            <select name="type" value={product.type} onChange={handleChange}>
              <option value="veg">Veg</option>
              <option value="nonveg">Non Veg</option>
            </select>
          </div>

          

          <div className="form-group">
            <label>Price</label>
            <input type="number" name="price" value={product.price} onChange={handleChange} />
            {errors.price && <p className="error">{errors.price}</p>}
          </div>

          <div className="form-group">
            <label>M.R.P Price</label>
            <input type="number" name="offer" value={product.offer} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Discount %</label>
            <input
              type="number"
              name="off"
              value={product.off}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Rating</label>
            <input type="number" name="rating" value={product.rating} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Reviews</label>
            <input type="text" name="reviews" value={product.reviews} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Orders</label>
            <input type="text" name="orders" value={product.orders} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Views</label>
            <input type="text" name="view" value={product.view} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Status</label>
            <input type="text" name="status" value={product.status} onChange={handleChange} />
          </div>
          {/* 
          <div className="form-group">
            <label>Restaurant ID</label>
            <input type="text" name="restaurantId" value={product.restaurantId} onChange={handleChange} />
          </div> */}

          <div className="form-group">
            <label>Slots</label>
            <input
              type="text"
              name="slots"
              placeholder="10:00-11:00,12:00-1:00"
              value={product.slots}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Product Status</label>
            <select name="isOpen" value={product.isOpen} onChange={handleChange}>
              <option value={true}>Open</option>
              <option value={false}>Close</option>
            </select>
          </div>

          <div className="form-group full">
            <label>Description</label>
            <textarea name="desc" value={product.desc} onChange={handleChange}></textarea>
          </div>

          <div className="form-group">
            <label>Main Image</label>
            <div className="image-upload-wrapper">
              {mainPreview ? (
                <div className="image-upload-box">
                  <img src={mainPreview} alt="main" />
                  <div className="image-overlay">
                    <div className="delete-icon" onClick={removeMainImage}>
                      <MdDelete />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="image-upload-box" onClick={() => mainImageRef.current.click()}>
                  <div className="upload-placeholder">
                    <span><FiUpload /></span>
                    <p>Upload</p>
                  </div>
                </div>
              )}
              <input type="file" hidden accept="image/*" ref={mainImageRef} onChange={handleMainImage} />
              {errors.image && <p className="error">{errors.image}</p>}
            </div>
          </div>

          <div className="form-group full">
            <label>Gallery Images</label>
            <div style={{ display: "flex", gap: "60px", flexWrap: "wrap" }}>
              {galleryImages.map((img, index) => (
                <div key={index} className="image-upload-wrapper">
                  <div className="image-upload-box">
                    <img src={img.preview} alt="gallery" />
                    <div className="image-overlay">
                      <div
                        className="delete-icon"
                        onClick={(e) => { e.stopPropagation(); handleRemoveGalleryImage(index); }}
                      >
                        <MdDelete />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="image-upload-box" onClick={() => galleryInputRef.current.click()}>
                <div className="upload-placeholder">
                  <span><FiUpload /></span>
                  <p>Upload</p>
                </div>
              </div>
              <input type="file" multiple hidden ref={galleryInputRef} accept="image/*" onChange={handleGalleryChange} />
            </div>
          </div>

        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={uploadStatus === "uploading"}
        >
          {uploadStatus === "idle" ? "Add Product" : "Uploading Products..."}
        </button>
      </form>

    </div>
  );
}

export default AddProduct;