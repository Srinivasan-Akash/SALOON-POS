import "./dashboard.scss"
import { FaHome } from "react-icons/fa";
import Index from "./components/Index/Index";
import { useState } from "react";
import Billing from "./components/Billing/Billing";
import CustomerData from "./components/Customer Data/CustomerData";
import EmployeeData from "./components/Employee Data/EmployeeData";
import Campaigns from "./components/Campaigns/Campaigns";
import Reports from "./components/Reports/Reports";
import Inventory from "./components/Inventory/Inventory";
import Settings from "./components/Settings/Settings";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("Dashboard")
  const tabData = [
    { key: "Dashboard", label: "Dashboard", component: <Index /> },
    { key: "Billing", label: "Quick Billing", component: <Billing /> },
    { key: "Customer Data", label: "Customer Data", component: <CustomerData /> },
    { key: "Employee Data", label: "Employee Data", component: <EmployeeData /> },
    { key: "Our Campaigns", label: "Our Campaigns", component: <Campaigns /> },
    { key: "All Reports", label: "All Reports", component: <Reports /> },
    { key: "Store Inventory", label: "Store Inventory", component: <Inventory /> },
    { key: "Settings", label: "Settings", component: <Settings /> },
  ];

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
          {activeTab === "Customer Data" && <CustomerData />}
          {activeTab === "Employee Data" && <EmployeeData />}
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
