import { FaPlus, FaSearch, FaSync } from "react-icons/fa"
import "./inventory.scss"
import { useDataContext } from "../../../../context api/DataContext";

export default function Inventory() {
  const { inventory, reFetch } = useDataContext();

  return (
    <main className="inventoryContainer">
      <div className="addItems">
        <h2 className="title">Search For The Product</h2>
        <p className="desc">Search via product name in the below search box provided</p>
        <div className="searchBox">
          <input type="text" placeholder="Enter the product name over here..." />
          <div className="btns">
            <button><FaSearch /></button>
            <button onClick={() => reFetch("inventory")}><FaSync /></button>
            <button onClick={() => window.open("#/productRegistration", "_blank", "width=500, height=400")}><FaPlus /></button>
          </div>
        </div>
      </div>

      <div className="cards">

        {inventory.map((product: any) => (
          // <div key={product.$id} className="row" 
          // // onClick={() => openCustomerProfile(customer)}
          // >
          //   <div>{product.name}</div>
          //   <div>{product.phone}</div>
          //   <div>{product.gmail}</div>
          // </div>
          <>
            <div className="card">
              <div className="progress">
                <div className="finished"></div>
              </div>
              <div className="content">
                <h2 className="productName">{product.name}</h2>
                <div className="boxes">
                  <p className="box">80/100 ml</p>
                  <p className="box">120.0 ₹</p>
                  <p className="box">80 bottles</p>
                </div>
                {/* <div className="or-container">
                    <div className="or-line"></div>
                    <div className="or-text">ACTIONS</div>
                    <div className="or-line"></div>
                </div> */}
                  <button className="green">ADD</button>
                  <button className="red">REMOVE</button>
                <button>SELL</button>
              </div>
            </div>

          </>
        ))}


      </div>
    </main>
  )
}
