import { useEffect, useRef, useState } from 'react';
import { databaseID, databases, invoiceCollection } from '../../appwrite/config';
import "./invoicePage.scss"
import { useDataContext } from '../../context api/DataContext';
import InvoiceTemplate from '../customer profile/invoiceTemplate';
import { useSearchParams } from 'react-router-dom';

export default function InvoicePage() {
  const [invoice, setInvoice] = useState<any>();
  const [total, setTotal] = useState<any>()
  const searchParams = useSearchParams()

  const { reFetch } = useDataContext();
  const invoicePreviewRef = useRef<any>(null);

  const invoiceStyle: any = {
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '1em',
      borderRadius: '8px', // Adjusted border-radius
      overflow: 'hidden'
    },
    th: {
      border: '2px solid #1b1f29',
      padding: '0.5em',
      textAlign: 'left',
      background: '#1b1f29',
      color: '#fff',
    },
    td: {
      border: '2px solid #1b1f29',
      padding: '0.5em',
      borderRadius: '8px', // Adjusted border-radius
    },
    totalRow: {
      borderTop: '2px solid #1b1f29',
      fontWeight: 'bold',
    },
  }
  useEffect(() => {
    async function fetchDocument() {
      try {
        const id = String(searchParams[0].get('id')); // Extract 'id' from the query string
        console.log(id)
        const invoiceResponse = await databases.getDocument(databaseID, invoiceCollection, String(id));
        const GST = Math.round(18 / 100 * JSON.parse(invoiceResponse.services).reduce((sum: number, row: any) => sum + row.price, 0));
        const subTotal = JSON.parse(invoiceResponse.services).reduce((sum: number, row: any) => sum + row.price, 0) + GST - invoiceResponse.discount;
        setTotal(subTotal)
        setInvoice(invoiceResponse);
        console.log(invoiceResponse)
      } catch (error) {
        console.error('Error fetching invoice:', error);
        // Handle error as needed
      }
    }

    fetchDocument();
  }, []);

  const handleCloseBill = async (invoiceId: string) => {
    try {
      await databases.updateDocument(databaseID, invoiceCollection, invoiceId, {
        status: true,
      });
      // Reload the invoices after updating the status
      reFetch("invoices");
      alert("Invoice Closed")
    } catch (error) {
      console.error("Error closing the bill:", error);
      alert("Error closing the bill");
    }
  };

  const printInvoice = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write("<html><head><title>Invoice Preview</title></head><body>");
      printWindow.document.write(invoicePreviewRef.current.innerHTML);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Unable to open print window");
    }
  };
  return (
    <div>
      {invoice ? (
        <div className="container-bill">
          <h1 className='headline'>INVOICE PAGE</h1>
          <table style={invoiceStyle.table}>
            <thead>
              <tr>
                <th style={invoiceStyle.th}>Service Name</th>
                <th style={invoiceStyle.th}>Quantity</th>
                <th style={invoiceStyle.th}>Service Cost</th>
              </tr>
            </thead>
            <tbody>
              {

                JSON.parse(invoice.services).map((item: any, index: number) => {
                  return (<tr key={index}>
                    <td style={invoiceStyle.td}>{item.selectedService?.value || ""}</td>
                    <td style={invoiceStyle.td}>{item.quantity}</td>
                    <td style={invoiceStyle.td}>{item.price} ₹</td>
                  </tr>)
                })
              }


              <tr>
                <td style={invoiceStyle.td}>GST</td>
                <td style={invoiceStyle.td}>18% on flat</td>
                <td style={invoiceStyle.td}>{Math.round(18 / 100 * JSON.parse(invoice.services).reduce((sum:number, row: any) => sum + row.price, 0))} ₹</td>
              </tr>
              <tr>
                <td style={invoiceStyle.td}></td>
                <td style={invoiceStyle.td}>Discount</td>
                <td style={invoiceStyle.td}>-{invoice.discount} ₹</td>
              </tr>
              <tr style={invoiceStyle.totalRow}>
                <td style={{ border: 'none' }}></td>
                <td style={invoiceStyle.td}>TOTAL</td>
                <td style={invoiceStyle.td}>{total} ₹</td>
              </tr>
            </tbody>
          </table>
          <div className='btns'>
            <h2 className='headline' onClick={invoice.status !== true? () => handleCloseBill(invoice.$id): function() {}}>{invoice.status !== true ? `Close The Bill By Paying ${total - invoice.paidAmount} ₹`: "Already Paid & Closed"}</h2>
            <h2 className='headline' onClick={printInvoice}>Print The Final Bill</h2>
          </div>

          <div className="preview" ref={invoicePreviewRef}>
            <InvoiceTemplate data={invoice} services={JSON.parse(invoice.services)} total={total} GST={Math.round(18 / 100 * JSON.parse(invoice.services).reduce((sum: number, row:any) => sum + row.price, 0))} discount={invoice.discount} />
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
