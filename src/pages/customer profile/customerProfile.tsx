import "./customerProfile.scss";
import profile from "../../assets/profile.webp";
import { FaHome } from "react-icons/fa";
import { useEffect, useState } from "react";
import { PayNewBill } from "./payNewBill";
import { databaseID, databases, invoiceCollection } from "../../appwrite/config";
import { Query } from "appwrite";

interface TabData {
    key: string;
    label: string;
}

export default function CustomerProfile() {
    const [activeTab, setActiveTab] = useState<string>("Profile Info");
    const [customerData, setCustomerData] = useState({
        name: "",
        phone: "",
        gmail: "",
        $id: "",
        lifeTimeBilling: 0,
        credits: 0,
    });
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);

                // Decode and retrieve specific parameters
                setCustomerData({
                    name: String(urlParams.get("name")),
                    gmail: String(urlParams.get("gmail")),
                    phone: String(urlParams.get("phone")),
                    $id: String(urlParams.get("$id")),
                    lifeTimeBilling: Number(urlParams.get("lifeTimeBilling")),
                    credits: Number(urlParams.get("credits")),
                });

                const invoiceResponse: any = await databases.listDocuments(
                    databaseID,
                    invoiceCollection,
                    [Query.equal("customerID", String(urlParams.get("$id")))]
                );
                const invoiceData = invoiceResponse.documents;
                setInvoices(invoiceData);
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Error fetching data");
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
                    <div>
                        <Profile data={customerData} invoices={invoices} />
                        <Bills invoices={invoices} />
                    </div>
                )}
                {activeTab === "Add New Bill" && <PayNewBill data={customerData} invoices={invoices} />}
                <div className="overlay"></div>
            </div>
        </main>
    );
}

export function Profile({ data, invoices }: { data: any, invoices?: any }) {
    const [lifetimeSpent, setLifetimeSpent] = useState<number>(0);

    useEffect(() => {
      if (invoices && invoices.length > 0) {
        // Filter invoices with status set to false
        const pendingInvoices = invoices.filter((item: any) => item.status === false);
  
        // Calculate total pending amount for filtered invoices
        const newLifetimeSpent = pendingInvoices.reduce(
          (acc: number, item: any) => acc + calculateTotalPrice(item.services),
          0
        );
  
        // Update lifetime spent state
        setLifetimeSpent(newLifetimeSpent);
      }
    }, [invoices]);

    return (
        <>
            <div className="profileCard">
                <div>
                    <img src={profile} width={60} alt="Profile" />
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
                    <h2>{data.credits}</h2>
                    <p>Lifetime Credits</p>
                </div>
                <div className="card red">
                    <h2>{lifetimeSpent} ₹</h2>
                    <p>Pending Amount</p>
                </div>
            </div>
        </>
    );
}

export function Bills({ invoices }: { invoices: any[] }) {
    console.log(invoices)
    return (
        <div className="tabularDisplay">
            <div className="head">
                <div>Status</div>
                <div>Price</div>
                <div>Date</div>
            </div>
            {invoices.map((item, index) => (
                <div key={index} className="row">
                    <div>
                        <span className={item.status === true ? "green" : "red"}>{item.status === true ? "PAID" : "PENDING"}</span>
                    </div>
                    <div>{calculateTotalPrice(item.services)} ₹</div>
                    <div>{new Date(item.$updatedAt).toLocaleDateString("en-GB")}</div>
                </div>
            ))}
        </div>
    );
}

function calculateTotalPrice(services: string): number {
    const parsedServices = JSON.parse(services);
    const totalPrice = parsedServices.reduce((acc: number, service: any) => acc + service.price, 0);
    return totalPrice;
}