import { useRef, useState } from "react";
import { Profile } from "./customerProfile";
import { FaMinus, FaPlus, FaSpinner } from "react-icons/fa";
import Select, { StylesConfig } from "react-select";
import InvoiceTemplate from "./invoiceTemplate";
import { customerCollection, databaseID, databases, invoiceCollection } from "../../appwrite/config";
import { v4 as uuidv4 } from 'uuid';

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
                paidAmount: String(paidAmount) || "0",
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

    const GST = Math.round(18 / 100 * formRows.reduce((sum, row) => sum + row.price, 0));
    const subTotal = formRows.reduce((sum, row) => sum + row.price, 0) + GST;
    const appliedDiscount: number = !discount ? 0 : discount.includes('%') ? subTotal * (parseFloat(discount.replace('%', '')) / 100) : parseFloat(discount);

    const total = Math.round(subTotal - appliedDiscount);

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

    const customStyles: StylesConfig<Option, false> = {
        container: (provided) => ({
            ...provided,
            position: 'relative',
            border: '2px solid #1b1f29',
            borderRadius: '5px',
            outline: 'none',
            fontSize: ".8rem",
        }),
        control: () => ({
            display: "flex",
            borderRadius: '5px',
            outline: 'none',
        }),
        menu: (provided) => ({
            ...provided,
            position: 'absolute',
            top: '90%',
            left: '50%',
            transform: "translate(-50%, 0)",
            width: '120%',
            backgroundColor: '#fff',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            maxHeight: "150px",
            overflowY: "auto",
            border: '2px solid #1b1f29',
            padding: '5px',
            borderRadius: "5px",
        }),
        option: (provided, { isSelected }: { isSelected: boolean }) => ({
            ...provided,
            color: isSelected ? '#fff' : '#1b1f29',
            backgroundColor: isSelected ? '#1b1f29' : '#fff',
            border: '2px solid #1b1f29',
            borderRadius: '5px',
            marginTop: '.25em',
            cursor: 'pointer',
        }),
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
                    <InvoiceTemplate data={data} services={formRows} total={total} GST={GST} discount={appliedDiscount} />
                </div>
            </div>
        </div>
    );
}