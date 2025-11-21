import React, { useState } from "react";

export default function UpdateContact() {
    const [currentName, setCurrentName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [message, setMessage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [responseMsg, setResponseMsg] = useState("");

    const handleUpdateContact = async (e) => {
        e.preventDefault();
        setResponseMsg("");

        const trimmedCurrentName = currentName.trim();
        if (!trimmedCurrentName) {
            setResponseMsg("Current contact name is required.");
            return;
        }

        // Build update object with only filled fields
        const updateData = {};
        if (phoneNumber.trim()) updateData.phone_number = phoneNumber.trim();
        if (message.trim()) updateData.message = message.trim();
        if (imageUrl.trim()) updateData.image_url = imageUrl.trim();

        // Check if at least one field is being updated
        if (Object.keys(updateData).length === 0) {
            setResponseMsg("Please provide at least one field to update.");
            return;
        }

        try {
            const encodedName = encodeURIComponent(trimmedCurrentName);
            const res = await fetch(`http://localhost:8081/contacts/${encodedName}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });

            const data = await res.json().catch(() => null);

            if (res.status === 200) {
                setResponseMsg(data?.message || "Contact updated successfully!");
                // Clear fields after successful update
                setCurrentName("");
                setPhoneNumber("");
                setMessage("");
                setImageUrl("");
            } else {
                setResponseMsg(data?.message || `Error: HTTP ${res.status}`);
            }
        } catch (error) {
            console.log("PUT error:", error);
            setResponseMsg("Network error: Could not connect to the server.");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Update Contact</h2>
            <form onSubmit={handleUpdateContact}>
                <input
                    type="text"
                    placeholder="Current Contact Name (required)"
                    value={currentName}
                    onChange={(e) => setCurrentName(e.target.value)}
                    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                />
                <br />
                <hr />
                <p style={{ fontSize: "14px", color: "#666" }}>
                    Fill in only the fields you want to update:
                </p>
                <input
                    type="text"
                    placeholder="New Phone Number (optional)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                />
                <br />
                <input
                    type="text"
                    placeholder="New Message (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                />
                <br />
                <input
                    type="text"
                    placeholder="New Image URL (optional)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                />
                <br />
                <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
                    Update Contact
                </button>
            </form>
            {responseMsg && (
                <p style={{ 
                    marginTop: "15px", 
                    color: responseMsg.includes("successfully") ? "green" : "red",
                    fontWeight: "bold" 
                }}>
                    {responseMsg}
                </p>
            )}
        </div>
    );
}