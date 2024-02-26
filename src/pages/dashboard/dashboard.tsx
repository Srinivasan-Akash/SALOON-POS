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

  return (
    <div className="container">
      <div className="sideBar">
        <h2 onClick={() => setActiveTab("Dashboard")}><FaHome size={25} /> Dashboard</h2>
        <h2 onClick={() => setActiveTab("Billing")}><FaHome size={25}/> Quick Billing</h2>
        <h2 onClick={() => setActiveTab("Customer Data")}><FaHome size={25}/> Customer Data</h2>
        <h2 onClick={() => setActiveTab("Employee Data")}><FaHome size={25}/> Employee Data</h2>
        <h2 onClick={() => setActiveTab("Our Campaigns")}><FaHome size={25}/> Our Campaigns</h2>
        <h2 onClick={() => setActiveTab("All Reports")} ><FaHome size={25}/> All Reports</h2>
        <h2 onClick={() => setActiveTab("Store Inventory")}><FaHome size={25}/> Store Inventory</h2>
        <h2 onClick={() => setActiveTab("Settings")}><FaHome size={25}/> Settings</h2>
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
