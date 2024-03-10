import { useRef, useState } from "react";
import { Profile } from "./customerProfile";
import { FaMinus, FaPlus, FaSpinner } from "react-icons/fa";
import Select from "react-select";
import InvoiceTemplate from "./invoiceTemplate";
import { customerCollection, databaseID, databases, invoiceCollection, invoicesBucket, projectId, storage, whatsapp_endpoint } from "../../appwrite/config";
import { v4 as uuidv4 } from 'uuid';
import { customStyles, dataURLtoBlob } from "../../utils/utils";
import html2canvas from "html2canvas";

interface Option {
    value: string;
    price?: number;
    label: string;
}

interface FormRow {
    selectedService: Option | null;
    selectedStaff: Option | null;
    quantity: number;
    price: number; // Add the price property
}

export function PayNewBill({ data }: { data: any }) {
    const options: Option[] = [
        { value: 'Hair Cut', label: 'Hair Cut', price: 40 },
        { value: 'Hair Dye', label: 'Hair Dye', price: 45 },
        { value: 'Hair Wash', label: 'Hair Wash', price: 45 },
        { value: 'Hair Cut', label: 'Hair Cut', price: 405 },
        { value: 'Hair Dye', label: 'Hair Dye', price: 405 },
        { value: 'Hair Wash', label: 'Hair Wash', price: 406 },
    ];

    const staff: Option[] = [
        { value: 'Akash', label: 'Akash' },
        { value: 'Indratej', label: 'Indratej' },
        { value: 'Ram', label: 'Ram' },
        { value: 'Sham', label: 'Sham' },
        { value: 'Harvindhar', label: 'Harvindhar' },
        { value: 'Tanjiro', label: 'Tanjiro' },
        // ...more options
    ];

    const paymentMode: Option[] = [
        { value: "Cash", label: "Cash" },
        { value: "UPI", label: "UPI" },
        { value: "Card", label: "Card" },
        { value: "Crypto", label: "Crypto" },
    ]

    const paymentStatus: Option[] = [
        { value: "PAID", label: "PAID" },
        { value: "PENDING", label: "PENDING" }
    ]

    const invoicePreviewRef = useRef<any>(null);
    const discountField = useRef<any>(null)
    const [discount, setDiscount] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(false); // Add loading state
    const [paymentModeInput, setPaymentModeInput] = useState<Option | null>(null);
    const [paidAmount, setPaidAmount] = useState<string>("");
    const [paymentStatusInput, setPaymentStatusInput] = useState<Option | null>(null);

    const [formRows, setFormRows] = useState<FormRow[]>([
        { selectedService: null, selectedStaff: null, quantity: 0, price: 0 }
    ]);

    const addNewFormRow = () => {
        setFormRows([...formRows, { selectedService: null, selectedStaff: null, quantity: 0, price: 0 }]);
    };

    const removeFormRow = () => {
        if (formRows.length > 1) {
            const updatedFormRows: FormRow[] = [...formRows];
            updatedFormRows.pop(); // Remove the last element
            setFormRows(updatedFormRows);
        }
    };

    const printInvoice = async () => {
        const printWindow = window.open("", "_blank");
    
        if (printWindow) {
            try {
                console.log(data)
                // Generate the HTML content for the invoice preview
                printWindow.document.write("<html><head><title>Invoice Preview</title></head><body>");
                printWindow.document.write(invoicePreviewRef.current.innerHTML);
                printWindow.document.write("</body></html>");
                printWindow.document.close();
                printWindow.print();
    
                // Capture the content of the print window as an image
                const body: any = printWindow.document.querySelector("body")
                const canvas = await html2canvas(body);
                const imageData = canvas.toDataURL("image/png");
                const blobData = dataURLtoBlob(imageData);
                const id = uuidv4();
    
                // Create a File from the image data
                const file = new File([blobData], 'invoice.png', { type: 'image/png' });
    
                // Use promises for asynchronous file creation
                const response: {$id: string} = await new Promise((resolve, reject) => {
                    storage.createFile(invoicesBucket, id, file)
                        .then(resolve)
                        .catch(reject);
                });
    
                // Construct the URL for the message

                const fileId = response?.$id;
                const url = `
👋 Hello ${data.name}!
                
Here Is Your Bill: 
📎 https://cloud.appwrite.io/v1/storage/buckets/${invoicesBucket}/files/${fileId}/view?project=${projectId}&mode=admin
                
Thank you for choosing our services! If you have any questions, feel free to reach out. 😊`;    
    
                // Send a message using promises
                // const messageResponse = await fetch(`https://whatsapp-api-6d8q.onrender.com/message?phoneNumber=${"91" + data.phone}&message=${encodeURIComponent(url)}`);
                const messageResponse = await fetch(`${whatsapp_endpoint}/message?phoneNumber=${"91" + data.phone}&message=${encodeURIComponent(url)}`);
                const result = await messageResponse.text();
    
                alert(result); // Output the server response
                // Handle the response as needed
    
                // Handle the response from the external endpoint if needed
                console.log('External endpoint response:', messageResponse);
            } catch (error) {
                console.error("Error:", error);
                // Handle the error as needed
            }
        } else {
            console.error("Unable to open print window");
        }
    };
    
    
    const handleServiceChange = (selectedOption: Option | null, index: number, field: string) => {
        const updatedFormRows: any = [...formRows];
        const selectedService = options.find((option) => option.value === selectedOption?.value);
        updatedFormRows[index][field] = selectedOption;

        // Set the price based on the selected service
        if (selectedService) {
            updatedFormRows[index].price = selectedService.price;
            updatedFormRows[index].quantity = 1
        } else {
            updatedFormRows[index].price = undefined;
            updatedFormRows[index].quantity += ""
        }

        setFormRows(updatedFormRows);
    };

    const addTransaction = async () => {
        setIsLoading(true)
        try {
            const res = await databases.createDocument(databaseID, invoiceCollection, uuidv4(), {
                customerName: data.name,
                gmail: data.gmail,
                phone: data.phone,
                customerID: data.$id,
                status: paymentStatusInput?.value === "PAID", // Store as true or false
                services: JSON.stringify(formRows),
                paymentMode: paymentModeInput?.value || "",
                paidAmount: String(paidAmount) || String(total),
                discount: Math.round(appliedDiscount)
            });

            const res2 = await databases.updateDocument(databaseID, customerCollection, data.$id, {
                credits: Math.round(total / 100),
                lifeTimeBilling: data.lifeTimeBilling + 1
            });

            console.log(res, res2)
            alert("Invoice Registered Successfully");
        } catch (error) {
            alert(error);
        } finally {
            setIsLoading(false);
        }
    }



    const handleStaffChange = (selectedOption: Option | null, index: number) => {
        const updatedFormRows: any = [...formRows];
        updatedFormRows[index].selectedStaff = selectedOption;
        setFormRows(updatedFormRows);
    };

    const subTotal = formRows.reduce((sum, row) => sum + row.price, 0);
    const GST = Math.round((18 / 100) * subTotal);
    
    const appliedDiscount: number = !discount
      ? 0
      : discount.includes('%')
      ? subTotal * (parseFloat(discount.replace('%', '')) / 100)
      : parseFloat(discount);
    
    const total = Math.round(subTotal + GST - appliedDiscount);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedFormRows = [...formRows];
        updatedFormRows[index].price = parseFloat(e.target.value) || 0;
        setFormRows(updatedFormRows);
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedFormRows: any = [...formRows];
        const quantity = parseInt(e.target.value, 10) || 0;

        updatedFormRows[index].quantity = quantity;
        if (updatedFormRows[index].selectedService) {
            updatedFormRows[index].price = updatedFormRows[index].selectedService.price * quantity;
        }

        setFormRows(updatedFormRows);
    };



    return (
        <div className="window">
            <Profile data={data} />

            <div className="form">
                <div className="headline">
                    <h2 className="title">Enter Billing Details</h2>
                    <div style={{ "display": "flex", "gap": ".5em" }}>
                        <div onClick={removeFormRow}><FaMinus size={12} /></div>
                        <div onClick={addNewFormRow}><FaPlus size={12} /></div>
                    </div>
                </div>
                {formRows.map((row, index) => {
                    console.log(row)
                    return (

                        <div className="formRow" key={index}>
                            <div className="dropdown">
                                <Select
                                    styles={customStyles}
                                    options={options}
                                    value={row.selectedService}
                                    onChange={(selectedOption) => handleServiceChange(selectedOption, index, 'selectedService')}
                                    placeholder="Select Services"
                                    isClearable
                                />
                            </div>

                            <input
                                type="number"
                                placeholder="Quantity"
                                value={row.quantity !== 0 ? row.quantity : ""}
                                onChange={(e) => handleQuantityChange(e, index)}
                            />

                            <input type="number" value={row.price !== 0 ? row.price : ""} placeholder="Price" onChange={(e) => handlePriceChange(e, index)} />

                            <div className="dropdown">
                                <Select
                                    styles={customStyles}
                                    options={staff}
                                    value={row.selectedStaff}
                                    onChange={(selectedOption) => handleStaffChange(selectedOption, index)}
                                    placeholder="Select Staff"
                                    isClearable
                                />
                            </div>
                        </div>
                    )
                })}

                <div className="or-container">
                    <div className="or-line"></div>
                    <div className="or-text">EXTRA INFORMTION</div>
                    <div className="or-line"></div>
                </div>

                <div className="offers">
                    <div className="discount">
                        <input type="text" ref={discountField} placeholder="Enter Desired Discount in % or Rs" />
                        <button onClick={() => setDiscount(discountField.current.value)}>ADD DISCOUNT</button>
                    </div>
                </div>

                <div className="detailsToKnow">
                    <div>
                        <Select
                            styles={customStyles}
                            options={paymentMode}
                            value={paymentModeInput}
                            onChange={(selectedOption) => setPaymentModeInput(selectedOption)}
                            placeholder="Payment Mode"
                            isClearable
                        />
                    </div>
                    <div>
                        <Select
                            styles={customStyles}
                            options={paymentStatus}
                            value={paymentStatusInput}
                            onChange={(selectedOption) => setPaymentStatusInput(selectedOption)}
                            placeholder="Payment Status"
                            isClearable
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Paid Amount"
                            value={paidAmount}
                            onChange={(e) => setPaidAmount(e.target.value)}
                        />
                    </div>
                </div>

                <button className="total" disabled={isLoading} onClick={addTransaction}>{isLoading ? (
                    <>
                        <FaSpinner className="loading-icon" /> LOADING PLEASE WAIT...
                    </>
                ) : (
                    `ADD TRANSACTION OF ${total} ₹`
                )}
                </button>

            </div>

            <div className="form">
                <div className="headline">
                    <h2 className="title">Invoice Preview</h2>
                    <div style={{ "display": "flex", "gap": ".5em" }}>
                        <button onClick={printInvoice}>PRINT</button>
                    </div>
                </div>
                <div className="preview" ref={invoicePreviewRef}>
                    <InvoiceTemplate data={data} services={formRows} total={total} GST={GST} discount={Math.round(appliedDiscount)} />
                </div>
            </div>
        </div>
    );
}