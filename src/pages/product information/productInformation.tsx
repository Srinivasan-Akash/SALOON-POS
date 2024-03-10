import { useEffect, useState } from "react";
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
    const handleUpdate = (field: string, action: string) => {
        const currentFieldValue = productData[field];
        const numericValue = parseFloat(currentFieldValue);
    
        if (!isNaN(numericValue)) {
            let updatedValue = numericValue;
    
            if (action === "increment") {
                // Check if increasing will exceed the total liquid quantity
                if (updatedValue < parseFloat(productData.liquid)) {
                    updatedValue += 1;
                }
            } else if (action === "decrement") {
                if (updatedValue > 0) {
                    updatedValue -= 1;
                }
            }
    
            // If remainingLiquid is 0, set quantity to decrement by 1 and remainingLiquid to liquid
            if (field === "remainingLiquid" && updatedValue === 0) {
                setProductData((prevData: any) => ({
                    ...prevData,
                    quantity: prevData.quantity - 1,
                    remainingLiquid: prevData.liquid,
                }));
            } else {
                // Extract the unit (e.g., 'ml' or 'g') from the current field value
                const unitMatch = currentFieldValue.match(/[a-zA-Z]+/);
                const unit = unitMatch ? unitMatch[0] : '';
    
                // Append the unit back to the updated value
                setProductData((prevData: any) => ({
                    ...prevData,
                    [field]: `${updatedValue}${unit}`,
                }));
            }
        }
    };

    const updateProductValue = async (documentId: string) => {
        try {
            setLoading(true);
            await databases.updateDocument(databaseID, inventoryCollection, documentId, productData);
            reFetch("inventory")
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
                            <div className="formRow" >
                                <div className="liquidUpdates">
                                    <button onClick={() => handleUpdate("remainingLiquid", "decrement")} style={{ borderRight: "2px solid #1b1f29" }}>
                                        <FaMinus size={12} />
                                    </button>
                                    <input type="text" value={productData.remainingLiquid + "/" + productData.liquid} />
                                    <button onClick={() => handleUpdate("remainingLiquid", "increment")} style={{ borderLeft: "2px solid #1b1f29" }}>
                                        <FaPlus size={12} />
                                    </button>
                                </div>

                                <div className="liquidUpdates">
                                    <button onClick={() => handleUpdate("price", "decrement")} style={{ borderRight: "2px solid #1b1f29" }}>
                                        <FaMinus size={12} />
                                    </button>
                                    <input type="text" value={productData.price + " ₹"} />
                                    <button onClick={() => handleUpdate("price", "increment")} style={{ borderLeft: "2px solid #1b1f29" }}>
                                        <FaPlus size={12} />
                                    </button>
                                </div>
                                <div className="liquidUpdates">
                                    <button onClick={() => handleUpdate("quantity", "decrement")} style={{ borderRight: "2px solid #1b1f29" }}>
                                        <FaMinus size={12} />
                                    </button>
                                    <input type="text" value={productData.quantity + " bottles"} />
                                    <button onClick={() => handleUpdate("quantity", "increment")} style={{ borderLeft: "2px solid #1b1f29" }}>
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