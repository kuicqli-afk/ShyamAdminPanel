import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BannerList.css";

function BannerList() {

    const [banners, setBanners] = useState([]);

    useEffect(() => {

        axios.get("https://shyambackend.onrender.com/api/banner")
            .then((res) => {
                setBanners(res.data.banners);
            })
            .catch((err) => {
                console.log(err);
            });

    }, []);

    return (

        <div className="bannerlist-container">

            <h2 className="bannerlist-title">Banner List</h2>

            <table className="bannerlist-table">

                <thead>
                    <tr>
                        <th>Sr.No</th>
                        <th>Banner Images</th>
                        <th>Title</th>
                        <th>Discount %</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {banners.map((banner, index) => (

                        <tr key={banner._id}>

                            <td>{index + 1}</td>

                            <td>
                                <td className="bannerlist-images">
                                    {banner.images.map((img, i) => (
                                        <img
                                            key={i}
                                            className="bannerlist-image"
                                            src={`http://localhost:5000/uploads/${img}`}
                                            alt="banner"
                                        />
                                    ))}
                                </td>
                            </td>
                            <td>{banner.title}</td>
                            <td>{banner.off}</td>

                            <td>
                                <button className="bannerlist-edit">Edit</button>
                                <button className="bannerlist-delete">Delete</button>
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );
}

export default BannerList;