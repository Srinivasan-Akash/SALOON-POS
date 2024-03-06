import { FaPlus, FaSearch, FaSync } from "react-icons/fa"
import "./inventory.scss"
import { useDataContext } from "../../../../context api/DataContext";

export default function Inventory() {
  const { inventory } = useDataContext();

  return (
    <main className="inventoryContainer">
      <div className="addItems">
        <h2 className="title">Search For The Product</h2>
        <p className="desc">Search via product name in the below search box provided</p>
        <div className="searchBox">
          <input type="text" placeholder="Enter the product name over here..." />
          <div className="btns">
            <button><FaSearch /></button>
            <button><FaSync /></button>
            <button onClick={() => window.open("#/productRegistration", "_blank", "width=800, height=500")}><FaPlus /></button>
          </div>
        </div>
      </div>

      {<div className="tabularDisplay">
        <div className="head">
          <div>Name</div>
          <div>Phone Number</div>
          <div>Gmail</div>
        </div>
        {inventory.map((product) => (
          <div key={product.$id} className="row" 
          // onClick={() => openCustomerProfile(customer)}
          >
            <div>{product.name}</div>
            <div>{product.phone}</div>
            <div>{product.gmail}</div>
          </div>
        ))}
      </div>}
    </main>
  )
}
