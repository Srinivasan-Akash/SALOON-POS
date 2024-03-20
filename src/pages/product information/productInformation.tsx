import React, { useEffect, useState } from "react";
import { FaHome, FaMinus, FaPlus, FaSpinner } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import profile from "../../assets/profile.webp"
import "./productInformation.scss"
import { databaseID, databases, inventoryCollection } from "../../appwrite/config";
import { useDataContext } from "../../context api/DataContext";

export default function ProductInformation() {
    const [searchParams] = useSearchParams();
    const { reFetch } = useDataContext();

    interface TabData {
        key: string;
        label: string;
    }

    const [productData, setProductData] = useState<any>({
        name: "",
        price: "",
        quantity: "",
        $id: "",
        liquid: "",
        remainingLiquid: "",
        $updatedAt: ""
    });

    const [loading, setLoading] = useState(true); // Added loading state
    const [activeTab, setActiveTab] = useState<string>("Adujust Product");
    const handleUpdate = (field: string, value: string) => {
        setProductData((prevData: any) => ({
            ...prevData,
            [field]: value
        }));
    };

    const updateProductValue = async (documentId: string) => {
        try {
            setLoading(true);
            await databases.updateDocument(databaseID, inventoryCollection, documentId, productData);
            reFetch("inventory");
            alert("Product details updated successfully");
        } catch (error) {
            alert("Error updating product details. Please try again.");
            console.error("Error updating product details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setProductData({
                    name: String(searchParams.get("name")),
                    price: String(searchParams.get("price")),
                    quantity: String(searchParams.get("quantity")),
                    $id: String(searchParams.get("$id")),
                    liquid: String(searchParams.get("liquid")),
                    remainingLiquid: String(searchParams.get("remainingLiquid")),
                    $updatedAt: String(searchParams.get("$updatedAt")),
                });
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const tabData: TabData[] = [
        { key: "Adujust Product", label: "Adujust Product" },
        { key: "Delete Product", label: "Delete Product" }
    ];

    return (
        <main className="customerProfileWindow">
            <div className="sidebar">
                {tabData.map((tab) => (
                    <h2
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={activeTab === tab.key ? "active" : ""}
                    >
                        <FaHome size={25} /> {tab.label}
                    </h2>
                ))}
            </div>
            <div className="customerProfile">
                <div className="profileCard">
                    <div>
                        <img src={profile} width={60} alt="Profile" />
                    </div>
                    <div>
                        <h2>{productData.name}</h2>
                        <p>{new Intl.DateTimeFormat('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                        }).format(new Date(String(searchParams.get("$updatedAt"))))}</p>
                    </div>
                </div>

                <div className="cards">
                    <div className="card">
                        <h2>{productData.price} ₹</h2>
                        <p>Unit Product Cost</p>
                    </div>
                    <div className="card">
                        <h2>{productData.quantity}</h2>
                        <p>Bottles In Stock</p>
                    </div>
                    <div className="card red">
                        <h2>{productData.liquid}</h2>
                        <p>Quantity In 1 Bottle</p>
                    </div>
                </div>
                {activeTab === "Adujust Product" && (
                    <>
                        <div className="form">
                            <div className="headline">
                                <h2 className="title">Update Product Information</h2>
                            </div>
                            <div className="formRow">
                                <div className="liquidUpdates">
                                    <button onClick={() => handleUpdate("remainingLiquid", String(parseFloat(productData.remainingLiquid) - 1))} style={{ borderRight: "2px solid #1b1f29" }}>
                                        <FaMinus size={12} />
                                    </button>
                                    <div className="INPUT_BOX">
                                        <input type="text" onChange={(e) => handleUpdate("remainingLiquid", e.target.value)} value={productData.remainingLiquid} />
                                        <span className="text"> {"/" + productData.liquid}</span>
                                    </div>
                                    <button onClick={() => handleUpdate("remainingLiquid", String(parseFloat(productData.remainingLiquid) + 1))} style={{ borderLeft: "2px solid #1b1f29" }}>
                                        <FaPlus size={12} />
                                    </button>
                                </div>

                                <div className="liquidUpdates">
                                    <button onClick={() => handleUpdate("price", String(parseFloat(productData.price) - 1))} style={{ borderRight: "2px solid #1b1f29" }}>
                                        <FaMinus size={12} />
                                    </button>
                                    <div className="INPUT_BOX">
                                        <input type="text" onChange={(e) => handleUpdate("price", e.target.value)} value={productData.price} />
                                        <span className="text text2"> {" Rs."}</span>
                                    </div>
                                    <button onClick={() => handleUpdate("price", String(parseFloat(productData.price) + 1))} style={{ borderLeft: "2px solid #1b1f29" }}>
                                        <FaPlus size={12} />
                                    </button>
                                </div>
                                <div className="liquidUpdates">
                                    <button onClick={() => handleUpdate("quantity", String(parseFloat(productData.quantity) - 1))} style={{ borderRight: "2px solid #1b1f29" }}>
                                        <FaMinus size={12} />
                                    </button>
                                    <div className="INPUT_BOX">
                                    <input type="text" onChange={(e) => handleUpdate("quantity", e.target.value)} value={productData.quantity} />
                                        <span className="text text2 text3"> {"bottles"}</span>
                                    </div>
                                    <button onClick={() => handleUpdate("quantity", String(parseFloat(productData.quantity) + 1))} style={{ borderLeft: "2px solid #1b1f29" }}>
                                        <FaPlus size={12} />
                                    </button>
                                </div>
                            </div>
                            <button className="update" onClick={() => updateProductValue(productData.$id)} disabled={loading}>
                                {loading && <FaSpinner className="spinner" />} Update Product Details
                            </button>
                        </div>
                    </>
                )}
                <div className="overlay"></div>
            </div>
        </main>
    )
}
