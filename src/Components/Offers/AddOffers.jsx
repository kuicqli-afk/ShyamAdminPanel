import React, { useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import './AddOffers.css';
import { toast } from "react-toastify";

function AddOffers() {

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [offerImage, setOfferImage] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);

    const imageInputRef = useRef();
    const bannerInputRef = useRef();

    // 🔥 Auto slug generate
    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);
        setSlug(value.toLowerCase().replace(/\s+/g, "-"));
    };

    // Offer image
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setOfferImage({
                file,
                preview: URL.createObjectURL(file),
            });
        }
    };

    // Banner image
    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerImage({
                file,
                preview: URL.createObjectURL(file),
            });
        }
    };

    // Remove images
    const removeOfferImage = () => {
        setOfferImage(null);
        imageInputRef.current.value = "";
    };

    const removeBannerImage = () => {
        setBannerImage(null);
        bannerInputRef.current.value = "";
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("slug", slug);

        if (offerImage) formData.append("image", offerImage.file);
        if (bannerImage) formData.append("banner", bannerImage.file);

        try {
            await axios.post(
                "https://shyambackend.onrender.com/api/offers/add-offer",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast.success("Offer Added ✅");

            setTitle("");
            setSlug("");
            setOfferImage(null);
            setBannerImage(null);

        } catch (err) {
            console.log("ERROR:", err.response?.data || err.message);
        }
    };

    return (
        <div className="admin-form">
            <h2>Add Offer</h2>

            <form onSubmit={handleSubmit}>

                {/* Title */}
                <div className="form-group full">
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Enter title"
                        required
                    />
                </div>

                {/* Slug */}
                <div className="form-group full">
                    <label>Slug</label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="auto-generated"
                        required
                    />
                </div>

                {/* Offer Image */}
                <div className="form-group full">
                    <label>Offer Image</label>

                    {offerImage ? (
                        <div className="image-upload-box">
                            <img src={offerImage.preview} alt="" />
                            <MdDelete onClick={removeOfferImage} />
                        </div>
                    ) : (
                        <div
                            className="image-upload-box"
                            onClick={() => imageInputRef.current.click()}
                        >
                            <FiUpload />
                            <p>Upload Offer</p>
                        </div>
                    )}

                    <input
                        type="file"
                        hidden
                        ref={imageInputRef}
                        onChange={handleImageChange}
                    />
                </div>

                {/* Banner Image */}
                <div className="form-group full">
                    <label>Banner Image</label>

                    {bannerImage ? (
                        <div className="image-upload-box">
                            <img src={bannerImage.preview} alt="" />
                            <MdDelete onClick={removeBannerImage} />
                        </div>
                    ) : (
                        <div
                            className="image-upload-box"
                            onClick={() => bannerInputRef.current.click()}
                        >
                            <FiUpload />
                            <p>Upload Banner</p>
                        </div>
                    )}

                    <input
                        type="file"
                        hidden
                        ref={bannerInputRef}
                        onChange={handleBannerChange}
                    />
                </div>

                <button type="submit" className="submit-btn">
                    Save Offer
                </button>

            </form>
        </div>
    );
}

export default AddOffers;