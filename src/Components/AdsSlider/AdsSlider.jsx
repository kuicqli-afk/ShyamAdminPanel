import React, { useState } from "react";
import axios from "axios";

function AdsSlider() {

    const [image, setImage] = useState("");
    const [link, setLink] = useState("");
    const [category, setCategory] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:5000/api/ads/add", {
                image,
                link,
                category
            });

            alert("Ad Added ✅");

            setImage("");
            setLink("");
            setCategory("");

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <h2>Add Ads Slider</h2>

            <form onSubmit={handleSubmit}>

                <input
                    placeholder="Image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                />

                <input
                    placeholder="Redirect Link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />

                <input
                    placeholder="Category (e.g. cake, pizza)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <button type="submit">Add Ad</button>

            </form>
        </div>
    );
}

export default AdsSlider;