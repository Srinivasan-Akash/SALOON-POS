import { useEffect, useState } from "react";
import "./index.scss"
import { databaseID, databases, invoiceCollection } from "../../../../appwrite/config";
import calculateTotalPrice from "../../../../utils/utils";

export default function Index() {

  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invoiceResponse: any = await databases.listDocuments(
          databaseID,
          invoiceCollection
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

  return (
    <main className="parentContainer">
      <div className="realTimeUpdates">
        <div className="card">
          <h2>4.2k</h2>
          <p>Daily Revenue</p>
        </div>
        <div className="card">
          <h2>25+</h2>
          <p>Total Customers</p>
        </div>
        <div className="card">
          <h2>3.6k</h2>
          <p>Pending Amount</p>
        </div>
        <div className="card">
          <h2>40₹</h2>
          <p>Total Expenses</p>
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
        {
          invoices.map((item: any, index) => {
            return (
              <div key={index} className="row">
                <div>{item.customerName}</div>
                <div>                        
                  <span className={item.status === true ? "green" : "red"}>{item.status === true ? "PAID" : "PENDING"}</span>
                </div>
                <div>{calculateTotalPrice(item.services)} ₹</div>
                <div>{new Date(item.$updatedAt).toLocaleDateString("en-GB")}</div>
              </div>
            )
          })
        }
      </div>
    </main>
  )
}
