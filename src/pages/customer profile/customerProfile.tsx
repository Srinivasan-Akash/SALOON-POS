import "./customerProfile.scss";
import profile from "../../assets/profile.webp";
import { FaHome } from "react-icons/fa";
import { useEffect, useState } from "react";
import { PayNewBill } from "./payNewBill";
import { databaseID, databases, invoiceCollection } from "../../appwrite/config";
import { Query } from "appwrite";
import calculateTotalPrice from "../../utils/utils";
import { useSearchParams } from 'react-router-dom';

interface TabData {
    key: string;
    label: string;
}

export default function CustomerProfile() {
    const [activeTab, setActiveTab] = useState<string>("Profile Info");
    const [searchParams] = useSearchParams();

    const [customerData, setCustomerData] = useState({
        name: "",
        phone: "",
        gmail: "",
        $id: "",
        lifeTimeBilling: 0,
        credits: 0,
    });
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const fetchData = async () => {
            try {
                setCustomerData({
                    name: String(searchParams.get("name")),
                    gmail: String(searchParams.get("gmail")),
                    phone: String(searchParams.get("phone")),
                    $id: String(searchParams.get("$id")),
                    lifeTimeBilling: Number(searchParams.get("lifeTimeBilling")),
                    credits: Number(searchParams.get("credits")),
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
                    <div>
                        <Profile data={customerData} showBills={true} />
                    </div>
                )}
                {activeTab === "Add New Bill" && <PayNewBill data={customerData} />}
                <div className="overlay"></div>
            </div>
        </main>
    );
}

export function Profile({ data, showBills }: { data: any, showBills?: boolean }) {
    const [invoices, setInvoices] = useState([]);
    const [pendingAmount, setPendingAmount] = useState<number>(0);
    const [loadingInvoices, setLoadingInvoices] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const invoiceResponse: any = await databases.listDocuments(
                    databaseID,
                    invoiceCollection,
                    [Query.equal("customerID", data.$id)]
                );
                const invoiceData = invoiceResponse.documents;
                setInvoices(invoiceData.reverse());
            } catch (error) {
                console.error("Error fetching invoices:", error);
                alert("Error fetching invoices");
            } finally {
                setLoadingInvoices(false);
            }
        };
        fetchInvoices();
    }, [data.$id, showBills]);

    useEffect(() => {
        if (invoices && invoices.length > 0) {
            const pendingInvoices = invoices.filter((item: any) => item.status === false);
            const newPendingAmount = pendingInvoices.reduce(
                (acc: number, item: any) => acc + calculateTotalPrice(item.services),
                0
            );
            setPendingAmount(newPendingAmount);
        }
    }, [invoices]);

    if (loadingInvoices) {
        return (
            <div style={{ width: '100%', zIndex: 999, height: '100%', position: 'absolute', top: 0, left: 0, background: '#a075fb', display: 'grid', placeItems: "center" }}>
                <iframe style={{ width: '50%', height: '50%', border: "none" }} src="https://lottie.host/embed/7b73a424-0826-45e0-a529-f358017c61f6/vSFsr02cuR.json"></iframe>
            </div>
        );
    }

    function openInvoicePage(id: string) {
        const queryParams = `id=${encodeURIComponent(id)}`;
        const url = `#/invoicePage?${queryParams}`;
        window.open(url, '_blank', 'width=700, height=500');
    }

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
                    <h2>{pendingAmount} ₹</h2>
                    <p>Pending Amount</p>
                </div>
            </div>

            {
                showBills ?
                    (
                        <div className="tabularDisplay">
                            <div className="head">
                                <div>Status</div>
                                <div>Price</div>
                                <div>Date</div>
                            </div>
                            {invoices.map((item: any, index: number) => (
                                <div key={index} className="row" onClick={() => openInvoicePage(item.$id)}>
                                    <div>
                                        <span className={item.status === true ? "green" : "red"}>{item.status === true ? "PAID" : "PENDING"}</span>
                                    </div>
                                    <div>{calculateTotalPrice(item.services)} ₹</div>
                                    <div>{new Date(item.$updatedAt).toLocaleDateString("en-GB")}</div>
                                </div>
                            ))}
                        </div>
                    ) : <></>
            }


        </>
    );
}