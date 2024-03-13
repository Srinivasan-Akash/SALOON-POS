import "./index.scss"
import calculateTotalPrice from "../../../../utils/utils";
import { useDataContext } from "../../../../context api/DataContext";

export default function Index() {

  const { invoices, customers } = useDataContext();
  console.log(invoices)

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  const today = new Date();
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

  const dailyInvoices = invoices.filter((item) => isSameDay(new Date(item.$updatedAt), today));
  const weeklyInvoices = invoices.filter((item) => new Date(item.$updatedAt) >= oneWeekAgo && new Date(item.$updatedAt) <= today);
  const monthlyInvoices = invoices.filter((item) => new Date(item.$updatedAt) >= oneMonthAgo && new Date(item.$updatedAt) <= today);

  const dailyRevenue = dailyInvoices.reduce((total, invoice) => total + Number(invoice.paidAmount), 0)
  const weeklyRevenue = weeklyInvoices.reduce((total, invoice) => total + Number(invoice.paidAmount), 0)
  const monthlyRevenue = monthlyInvoices.reduce((total, invoice) => total + Number(invoice.paidAmount), 0)

  const pendingInvoices = invoices.filter((item: any) => item.status === false);
  const newPendingAmount = pendingInvoices.reduce(
    (acc: number, item: any) => acc + calculateTotalPrice(item.services),
    0
  );
  console.log(dailyInvoices)
  return (
    <main className="parentContainer">
      <div className="realTimeUpdates">
        <div className="card">
          <h2>{dailyRevenue.toLocaleString('en-IN')} ₹</h2>
          <p>Today's Total Revenue</p>
        </div>
        <div className="card">
          <h2>{customers.length.toString().padStart(2, '0')}</h2>
          <p>Total Customer Data</p>
        </div>
        <div className="card">
          <h2>{newPendingAmount.toLocaleString('en-IN')} ₹</h2>
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
            <h2>{(weeklyRevenue / 1000).toFixed(1) + "k"} ₹</h2>
            <p>Weekly Revenue</p>
          </div>
          <div className="card">
            <h2>{(monthlyRevenue / 1000).toFixed(1) + "k"} ₹</h2>
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
