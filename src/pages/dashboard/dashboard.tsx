import "./dashboard.scss"
import { FaHome } from "react-icons/fa";
import Index from "./components/Index/Index";
import { useState } from "react";
import Billing from "./components/Billing/Billing";
import Campaigns from "./components/Campaigns/Campaigns";
import Reports from "./components/Reports/Reports";
import Inventory from "./components/Inventory/Inventory";
import Settings from "./components/Settings/Settings";
import { useDataContext } from "../../context api/DataContext";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("Dashboard")
  const { intialLoading } = useDataContext();

  const tabData = [
    { key: "Dashboard", label: "Dashboard", component: <Index /> },
    { key: "Billing", label: "Quick Billing", component: <Billing /> },
    { key: "Our Campaigns", label: "Our Campaigns", component: <Campaigns /> },
    { key: "All Reports", label: "All Reports", component: <Reports /> },
    { key: "Store Inventory", label: "Store Inventory", component: <Inventory /> },
    { key: "Settings", label: "Settings", component: <Settings /> },
  ];

  if (intialLoading.customers || intialLoading.invoices) {
    return (
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: '#a075fb', display: 'grid', placeItems: "center" }}>
        <iframe style={{ width: '50%', height: '50%', border: "none" }} src="https://lottie.host/embed/7b73a424-0826-45e0-a529-f358017c61f6/vSFsr02cuR.json"></iframe>
      </div>
    )
  } else {
    return (
      <div className="container">

        <div className="sideBar">
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

        <div className="content">
          <nav>
            <h2>{activeTab}</h2>
            <button className="logout">
              <img src="https://lh3.googleusercontent.com/-oK3iCxrOKiM/AAAAAAAAAAI/AAAAAAAAAAA/ALKGfkkTWVRrFHqGk-LMj8xnHTrYsR_5hQ/photo.jpg?sz=46" />
              LOG OUT
            </button>
          </nav>
          <div className="data">
            {activeTab === "Dashboard" && <Index />}
            {activeTab === "Billing" && <Billing />}
            {activeTab === "Our Campaigns" && <Campaigns />}
            {activeTab === "All Reports" && <Reports />}
            {activeTab === "Store Inventory" && <Inventory />}
            {activeTab === "Settings" && <Settings />}

            <div className="overlay"></div>
          </div>
        </div>
      </div>
    )
  }

}
