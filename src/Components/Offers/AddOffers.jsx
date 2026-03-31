import React, { useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import './AddOffers.css'
function AddOffers() {
    const [title, setTitle] = useState("");
    const [offerImage, setOfferImage] = useState(null);

    const imageInputRef = useRef();
    const [bannerImage, setBannerImage] = useState(null);
    const bannerInputRef = useRef();

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerImage({
                file,
                preview: URL.createObjectURL(file),
            });
        }
    };

    // Handle Image Upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setOfferImage({
                file,
                preview: URL.createObjectURL(file),
            });
        }
    };

    // Remove Image
    const handleRemoveImage = () => {
        setOfferImage(null);
        imageInputRef.current.value = "";
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);

        if (offerImage) formData.append("image", offerImage.file);
        if (bannerImage) formData.append("banner", bannerImage.file);

        try {
            await axios.post("https://shyambackend.onrender.com/api/offers/add-offer", formData);

            ("Offer Added ✅");

            setTitle("");
            setOfferImage(null);
            setBannerImage(null);

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="admin-form">
            <h2>Add Offer</h2>

            <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="form-group full">
                    <label>Offer Title</label>
                    <input
                        type="text"
                        placeholder="Enter offer title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                {/* Image Upload */}
                <div className="form-group full">
                    <label>
                        Offer Image <small>(Recommended Size: 200px X 300px)</small>
                    </label>

                    <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>

                        {/* Preview */}
                        {offerImage && (
                            <div className="image-upload-wrapper">
                                <div className="image-upload-box">
                                    <img src={offerImage.preview} alt="preview" />

                                    <div className="image-overlay">
                                        <div
                                            className="delete-icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveImage();
                                            }}
                                        >
                                            <MdDelete />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Upload Box */}
                        {!offerImage && (
                            <div
                                className="image-upload-box"
                                onClick={() => imageInputRef.current.click()}
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
                            hidden
                            ref={imageInputRef}
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>

                {/* Submit */}
                <button type="submit" className="submit-btn">
                    Save Offer
                </button>
            </form>
        </div>
    );
}

export default AddOffers;