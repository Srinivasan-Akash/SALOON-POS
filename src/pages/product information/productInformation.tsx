import { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import profile from "../../assets/profile.webp"
import "./productInformation.scss"

export default function ProductInformation() {
    const [searchParams] = useSearchParams();
    interface TabData {
        key: string;
        label: string;
    }

    const [productData, setProductData] = useState({
        name: "",
        price: "",
        quantity: "",
        $id: "",
        liquid: "",
        remainingLiquid: "",
        $updatedAt: ""
    });
    const [loading, setLoading] = useState(true); // Added loading state
    const [activeTab, setActiveTab] = useState<string>("Profile Info");

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
        { key: "Profile Info", label: "Profile Info" },
        { key: "Add New Bill", label: "Add New Bill" },
        { key: "Pay Advance Bill", label: "Advance Bill" },
        { key: "Pay Pending Bill", label: "Pay Pending Bill" },
    ];

    if (loading) {
        return (
            <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: '#a075fb', display: 'grid', placeItems: "center" }}>
                <iframe style={{ width: '50%', height: '50%', border: "none" }} src="https://lottie.host/embed/7b73a424-0826-45e0-a529-f358017c61f6/vSFsr02cuR.json"></iframe>
            </div>
        );
    }

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
                {activeTab === "Profile Info" && (
                    <>
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
                                }).format(new Date(productData.$updatedAt))}</p>
                            </div>
                        </div>

                        <div className="cards">
                            <div className="card">
                                <h2>6</h2>
                                <p>Lifetime Billing</p>
                            </div>
                            <div className="card">
                                <h2>52</h2>
                                <p>Lifetime Credits</p>
                            </div>
                            <div className="card red">
                                <h2>128 ₹</h2>
                                <p>Pending Amount</p>
                            </div>
                        </div>

                        <div className="productCard">
                            <div className="progress">
                                <div
                                    className="finished"
                                    style={{
                                        height: `${(Number(productData.remainingLiquid.replace("ml", "").replace("g", "")) /
                                            Number(productData.liquid.replace("ml", "").replace("g", ""))) *
                                            100
                                            }%`,
                                    }}
                                ></div>
                            </div>
                            <div className="content">
                                <h2 className="productName">{productData.name}</h2>
                                <div className="boxes">
                                    <p className="box">{productData.remainingLiquid}/{productData.liquid}</p>
                                    <p className="box">{productData.price} ₹</p>
                                    <p className="box">{productData.quantity} bottles</p>
                                </div>
                                <button onClick={() => openProductInfo(productData)}>ADJUST PRODUCT QUANTITY</button>
                                <button>SELL PRODUCT COMMERCIALLY</button>
                            </div>
                        </div>
                    </>
                )}
                {activeTab === "Add New Bill" && <div></div>}
                <div className="overlay"></div>
            </div>
        </main>
    )
}
