import "./index.scss"
import calculateTotalPrice from "../../../../utils/utils";
import { useDataContext } from "../../../../context api/DataContext";

export default function Index() {

  const { invoices } = useDataContext();
  
  return (
    <main className="parentContainer">
      <div className="realTimeUpdates">
        <div className="card">
          <h2>4.2k</h2>
          <p>Today's Total Revenue</p>
        </div>
        <div className="card">
          <h2>25</h2>
          <p>Total Customer Data</p>
        </div>
        <div className="card">
          <h2>3.6k</h2>
          <p>Total Pending Amount</p>
        </div>
        <div className="card">
          <h2>40₹</h2>
          <p>Monthly Expenses</p>
        </div>
      </div>
      <div className="extras">
        <div className="cards">
          <div className="card">
            <h2>4.2k</h2>
            <p>Weekly Revenue</p>
          </div>
          <div className="card">
            <h2>4.2k</h2>
            <p>Monthly Revenue</p>
          </div>
        </div>
        <div className="chart">

        </div>
      </div>

      <div className="tabularDisplay">
        <div className="head">
          <div>Name</div>
          <div>Status</div>
          <div>Price</div>
          <div>Date</div>
        </div>
        {invoices.map((item: any, index) => (
          <div key={index} className="row">
            <div>{item.customerName}</div>
            <div>
              <span className={item.status === true ? "green" : "red"}>
                {item.status === true ? "PAID" : "PENDING"}
              </span>
            </div>
            <div>{calculateTotalPrice(item.services)} ₹</div>
            <div>{new Date(item.$updatedAt).toLocaleDateString("en-GB")}</div>
          </div>
        ))}

        {/* {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
          </li>
        ))} */}
      </div>
    </main>
  )
}
