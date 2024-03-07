import { FaPlus, FaSearch, FaSync } from "react-icons/fa"
import "./inventory.scss"
import { useDataContext } from "../../../../context api/DataContext";

export default function Inventory() {
  const { inventory, reFetch } = useDataContext();

  async function searchProduct() {
    
  }

  return (
    <main className="inventoryContainer">
      <div className="addItems">
        <h2 className="title">Search For The Product</h2>
        <p className="desc">Search via product name in the below search box provided</p>
        <div className="searchBox">
          <input type="text" placeholder="Enter the product name over here..." />
          <div className="btns">
            <button onClick={searchProduct}><FaSearch /></button>
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
                <div className="finished" style={{
                  height: `${(Number(product.remainingLiquid.replace("ml", "").replace("g", "")) /
                      Number(product.liquid.replace("ml", "").replace("g", ""))) *
                    100
                    }%`
                }}></div>
              </div>
              <div className="content">
                <h2 className="productName">{product.name}</h2>
                <div className="boxes">
                  <p className="box">{product.remainingLiquid}/{product.liquid}</p>
                  <p className="box">{product.price} ₹</p>
                  <p className="box">{product.quantity} bottles</p>
                </div>
                <div className="btns">
                  <button className="green">ADD</button>
                  <button className="red">REMOVE</button>
                </div>
                <button>SELL</button>
              </div>
            </div>

          </>
        ))}


      </div>
    </main>
  )
}
