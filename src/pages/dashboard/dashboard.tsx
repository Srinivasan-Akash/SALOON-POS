import "./dashboard.scss"
import { FaHome } from "react-icons/fa";
import Index from "./components/Index/Index";

export default function Dashboard() {
  return (
    <div className="container">
      <div className="sideBar">
          <h2><FaHome size={25}/> Dashboard</h2>
          <h2><FaHome size={25}/> Quick Billing</h2>
          <h2><FaHome size={25}/> Customer Data</h2>
          <h2><FaHome size={25}/> Employee Data</h2>
          <h2><FaHome size={25}/> Our Campaigns</h2>
          <h2><FaHome size={25}/> All Reports</h2>
          <h2><FaHome size={25}/> Store Inventory</h2>
          <h2><FaHome size={25}/> Settings</h2>
      </div>

      <div className="content">
        <nav>
          <h2>DASHBOARD</h2>
          <button className="logout">
            <img src="https://lh3.googleusercontent.com/-oK3iCxrOKiM/AAAAAAAAAAI/AAAAAAAAAAA/ALKGfkkTWVRrFHqGk-LMj8xnHTrYsR_5hQ/photo.jpg?sz=46"/>
            LOG OUT
          </button>
        </nav>
        <div className="data">
          <Index/>
          <div className="overlay"></div>
        </div>
      </div>
    </div>
  )
}
