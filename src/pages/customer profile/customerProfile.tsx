import "./customerProfile.scss";
import profile from "../../assets/profile.webp";
import { FaHome } from "react-icons/fa";
import { useEffect, useState } from "react";
import { PayNewBill } from "./payNewBill";

interface TabData {
    key: string;
    label: string;
    component: JSX.Element;
}

export default function CustomerProfile() {
    const [activeTab, setActiveTab] = useState<string>("Profile Info");
    const [customerData, setCustomerData] = useState({name: "", phone: "", gmail: "", $id: "", lifeTimeBilling: 0, credits: 0})

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        // Decode and retrieve specific parameters
        setCustomerData({
            name: String(urlParams.get('name')),
            gmail: String(urlParams.get('gmail')),
            phone: String(urlParams.get('phone')),
            $id: String(urlParams.get('$id')),
            lifeTimeBilling: Number(urlParams.get('lifeTimeBilling')),
            credits: Number(urlParams.get('credits'))
        })
    }, [])
    const tabData: TabData[] = [
        { key: "Profile Info", label: "Profile Info", component: <div /> },
        { key: "Add New Bill", label: "Add New Bill", component: <div /> },
        { key: "Pay Advance Bill", label: "Advance Bill", component: <div /> },
        { key: "Pay Pending Bill", label: "Pay Pending Bill", component: <div /> },
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
                {activeTab === "Profile Info" && <Profile data={customerData}/>}
                {activeTab === "Add New Bill" && <PayNewBill data={customerData}/>}
                <div className="overlay"></div>
            </div>
        </main>
    );
}

export function Profile({data}: {data: any}) {
    return (
        <>
            <div className="profileCard">
                <div>
                    <img src={profile} width={60} />
                </div>
                <div>
                    <h2>{data.name}</h2>
                    <p>{data.gmail}</p>
                </div>
            </div>

            <div className="cards">
                <div className="card">
                    <h2>{data.lifeTimeBilling}</h2>
                    <p>Lifetime Billing</p>
                </div>
                <div className="card">
                    <h2>650</h2>
                    <p>Lifetime Credits</p>
                </div>
                <div className="card red">
                    <h2>4.2k ₹</h2>
                    <p>Pending Amount</p>
                </div>
            </div>
        </>
    );
}
