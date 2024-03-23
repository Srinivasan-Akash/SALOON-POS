import "./reports.scss";
import { useDataContext } from "../../../../context api/DataContext";
import * as XLSX from "xlsx";

export default function Reports() {
  const { invoices } = useDataContext();
  const filterInvoices = (category: string, frequency: string) => {
    return invoices.filter((invoice: any) => {
      const invoiceDate = new Date(invoice.$createdAt);
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const currentQuarter = Math.floor((currentMonth - 1) / 3) + 1;

      if (category === "Revenue" && invoice.paidFor === "service") {
        if (frequency === "Yearly") {
          return invoiceDate.getFullYear() === currentYear;
        } else if (frequency === "Quarterly") {
          return Math.floor((invoiceDate.getMonth() - 1) / 3) + 1 === currentQuarter;
        } else if (frequency === "Monthly") {
          return invoiceDate.getMonth() + 1 === currentMonth;
        }
      } else if (category === "Inventory Sales" && invoice.paidFor === "product") {
          if (frequency === "Yearly") {
            return invoiceDate.getFullYear() === currentYear;
          } else if (frequency === "Quarterly") {
            return Math.floor((invoiceDate.getMonth() - 1) / 3) + 1 === currentQuarter;
          } else if (frequency === "Monthly") {
            return invoiceDate.getMonth() + 1 === currentMonth;
          }
        }
      });
  };

  console.log(filterInvoices("Revenue", "Monthly"), "FGHJK")

  const handleDownload = (category: string, frequency: string) => {
    const filteredInvoices = filterInvoices(category, frequency);
    const processedData = filteredInvoices.map((item: any) => {
      const timestamp = item.$createdAt;
      console.log(timestamp)
      const date = new Date(timestamp);

      const options: any = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        weekday: "long",
      };

      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
      return {
        "Invoice ID": item.$id,
        "Customer Name": item.customerName,
        "Phone Number": item.phone,
        "Customer Gmail": item.gmail,
        "Paid Amount": item.paidAmount,
        "Payment Mode": item.paymentMode,
        "Date": formattedDate
      };
    });

    console.log(processedData);

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(processedData);

    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Save the file
    XLSX.writeFile(wb, `reports_${category}_${frequency}.xlsx`);
  };


  return (
    <div className="reportsWindow">
      <div className="parent">
        <div>
          <h2>Download Revenue Reports</h2>
          <span>(ANNUALLY)</span>
        </div>
        <button onClick={() => handleDownload("Revenue", "Yearly")}>DOWNLOAD NOW</button>
      </div>

      <div className="parent">
        <div>
          <h2>Download Revenue Reports</h2>
          <span>(QUARTERLY)</span>
        </div>
        <button onClick={() => handleDownload("Revenue", "Quarterly")}>DOWNLOAD NOW</button>
      </div>

      <div className="parent">
        <div>
          <h2>Download Revenue Reports</h2>
          <span>(MONTHLY)</span>
        </div>
        <button onClick={() => handleDownload("Revenue", "Monthly")}>DOWNLOAD NOW</button>
      </div>

      <div className="or-container">
        <div className="or-line"></div>
        <div className="or-text">INVENTORY REPORTS (SALES)</div>
        <div className="or-line"></div>
      </div>

      <div className="parent">
        <div>
          <h2>Download Inventory Sales</h2>
          <span>(ANNUALLY)</span>
        </div>
        <button onClick={() => handleDownload("Inventory Sales", "Yearly")}>DOWNLOAD NOW</button>
      </div>

      <div className="parent">
        <div>
          <h2>Download Inventory Sales</h2>
          <span>(QUARTERLY)</span>
        </div>
        <button onClick={() => handleDownload("Inventory Sales", "Quarterly")}>DOWNLOAD NOW</button>
      </div>
      <div className="parent">
        <div>
          <h2>Download Inventory Sales</h2>
          <span>(MONTHLY)</span>
        </div>
        <button onClick={() => handleDownload("Inventory Sales", "Monthly")}>DOWNLOAD NOW</button>
      </div>
    </div>
  );
}
