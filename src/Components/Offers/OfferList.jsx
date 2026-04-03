import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Category/Category.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { BiMenu } from "react-icons/bi";
import { toast } from "react-toastify";

const OfferList = () => {
    const [offers, setOffers] = useState([]);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [bulkAction, setBulkAction] = useState("");

    // ================= FETCH =================
    const fetchOffers = async () => {
        try {
            const res = await axios.get("https://shyambackend.onrender.com/api/offers");
            setOffers(res.data.offers);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    // ================= FILTER =================
    const filtered = offers.filter((o) =>
        o.title.toLowerCase().includes(search.toLowerCase())
    );

    // ================= DRAG =================
    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(offers);
        const [moved] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, moved);

        setOffers(items);

        try {
            await axios.put("https://shyambackend.onrender.com/api/offers/update-order", {
                offers: items.map((o, index) => ({
                    id: o._id,
                    order: index,
                })),
            });
        } catch {
            toast.error("Reorder failed");
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
        if (selectAll) setSelected([]);
        else setSelected(filtered.map((o) => o._id));
        setSelectAll(!selectAll);
    };

    // ================= ACTIONS =================

    // ✅ SOFT DELETE (trash flag)
    const handleDelete = async (id) => {
        try {
            await axios.put(`https://shyambackend.onrender.com/api/offers/delete/${id}`);
            toast.success("Moved to Trash 🗑️");
            fetchOffers();
        } catch {
            toast.error("Delete failed");
        }
    };

    // ✅ HIDE / UNHIDE
    const handleHide = async (id) => {
        try {
            await axios.put(`https://shyambackend.onrender.com/api/offers/toggle-hide/${id}`);
            fetchOffers();
        } catch {
            toast.error("Error");
        }
    };

    // ✅ BULK ACTION
    const handleBulk = async () => {
        if (!bulkAction || selected.length === 0) {
            toast.warning("Select action & items");
            return;
        }

        try {
            if (bulkAction === "delete") {
                await Promise.all(
                    selected.map((id) =>
                        axios.put(`https://shyambackend.onrender.com/api/offers/delete/${id}`)
                    )
                );
            }

            if (bulkAction === "hide") {
                await Promise.all(
                    selected.map((id) =>
                        axios.put(`https://shyambackend.onrender.com/api/offers/toggle-hide/${id}`)
                    )
                );
            }

            setSelected([]);
            setSelectAll(false);
            fetchOffers();
            toast.success("Bulk action applied ✅");
        } catch {
            toast.error("Error");
        }
    };

    // ================= UI =================
    return (
        <div className="admin-layout">
            <div className="right-panel" style={{ width: "100%" }}>
                {/* <h1>Offers</h1> */}

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
                            placeholder="Search offers"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* TABLE */}
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="offers">
                        {(provided) => (
                            <table
                                className="category-table"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <thead>
                                    <tr>
                                        <th>
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Date & Time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filtered.map((offer, index) => {
                                        const date = new Date(offer.createdAt);

                                        return (
                                            <Draggable
                                                key={offer._id}
                                                draggableId={offer._id}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <tr
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                    >
                                                        {/* CHECKBOX */}
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={selected.includes(offer._id)}
                                                                onChange={() => toggleSelect(offer._id)}
                                                            />
                                                        </td>

                                                        {/* IMAGE */}
                                                        <td>
                                                            <img
                                                                src={offer.image}
                                                                alt=""
                                                                style={{ width: "60px" }}
                                                            />
                                                        </td>

                                                        {/* TITLE */}
                                                        <td>{offer.title}</td>

                                                        {/* DATE */}
                                                        <td>
                                                            {date.toLocaleDateString()}{" "}
                                                            {date.toLocaleTimeString()}
                                                        </td>

                                                        {/* STATUS */}
                                                        <td>
                                                            {offer.hidden ? (
                                                                <span style={{ color: "red" }}>Hidden</span>
                                                            ) : (
                                                                <span style={{ color: "green" }}>Visible</span>
                                                            )}
                                                        </td>

                                                        {/* ACTIONS */}
                                                        <td>
                                                            <button className="edit">Edit</button>

                                                            <button
                                                                className="hide"
                                                                onClick={() => handleHide(offer._id)}
                                                            >
                                                                {offer.hidden ? "Unhide" : "Hide"}
                                                            </button>

                                                            <button
                                                                className="delete"
                                                                onClick={() => handleDelete(offer._id)}
                                                            >
                                                                Trash
                                                            </button>
                                                        </td>

                                                        {/* DRAG */}
                                                        <td {...provided.dragHandleProps}>
                                                            <BiMenu />
                                                        </td>
                                                    </tr>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
};

export default OfferList;