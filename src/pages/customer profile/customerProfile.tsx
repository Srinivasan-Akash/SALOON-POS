import "./customerProfile.scss";
import profile from "../../assets/profile.webp";
import { FaHome, FaPlus, FaMinus } from "react-icons/fa";
import { useRef, useState } from "react";
import Select, { StylesConfig } from "react-select";
import InvoiceTemplate from "./invoiceTemplate";

interface TabData {
    key: string;
    label: string;
    component: JSX.Element;
}

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

export default function CustomerProfile() {
    const [activeTab, setActiveTab] = useState<string>("Profile Info");
    const tabData: TabData[] = [
        { key: "Profile Info", label: "Profile Info", component: <div /> },
        { key: "Add New Bill", label: "Add New Bill", component: <div /> },
        { key: "Pay Advance Bill", label: "Advance Bill", component: <div /> },
        { key: "Pay Pending Bill", label: "Pay Pending Bill", component: <div /> },
    ];

    return (
        <main className="customerProfileWindow">
            <div className="sidebar">
                {tabData.map((tab) => (
                    <h2
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={activeTab === tab.key ? "active" : ""}
                    >
                        <FaHome size={25} /> {tab.label}
                    </h2>
                ))}
            </div>
            <div className="customerProfile">
                {activeTab === "Profile Info" && <Profile />}
                {activeTab === "Add New Bill" && <PayNewBill />}
                <div className="overlay"></div>
            </div>
        </main>
    );
}

export function Profile() {
    return (
        <>
            <div className="profileCard">
                <div>
                    <img src={profile} width={60} />
                </div>
                <div>
                    <h2>Akash Srinivasan</h2>
                    <p>qa.sixsigma@gmail.com</p>
                </div>
            </div>

            <div className="cards">
                <div className="card">
                    <h2>42</h2>
                    <p>Lifetime Billing</p>
                </div>
                <div className="card">
                    <h2>650</h2>
                    <p>Lifetime Credits</p>
                </div>
                <div className="card red">
                    <h2>4.2k ₹</h2>
                    <p>Pending Amount</p>
                </div>
            </div>
        </>
    );
}

export function PayNewBill() {
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
    
    const invoicePreviewRef = useRef(null);
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

    const handleChange = (selectedOption: Option | null, index: number, field: string) => {
        const updatedFormRows = [...formRows];
        const selectedService = options.find((option) => option.value === selectedOption?.value);

        // @ts-ignore
        updatedFormRows[index][field] = selectedOption;

        // Set the price based on the selected service
        if (selectedService) {
            // @ts-ignore
            updatedFormRows[index].price = selectedService.price;
        } else {
            // @ts-ignore
            updatedFormRows[index].price = undefined;
        }

        setFormRows(updatedFormRows);
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedFormRows = [...formRows];
        updatedFormRows[index].quantity = parseInt(e.target.value, 10) || 0;
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
            maxHeight: "200px",
            overflowY: "scroll",
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
            <Profile />

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
                                    onChange={(selectedOption) => handleChange(selectedOption, index, 'selectedService')}
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

                            <input type="number" value={row.price !== 0 ? row.price : ""} placeholder="Price" />

                            <div className="dropdown">
                                <Select
                                    styles={customStyles}
                                    options={staff}
                                    value={row.selectedStaff}
                                    onChange={(selectedOption) => handleChange(selectedOption, index, 'selectedStaff')}
                                    placeholder="Select Staff"
                                    isClearable
                                />
                            </div>
                        </div>
                    )
                })}

                <div className="discount">
                <input type="text" placeholder="Enter Desired Discount in % or Rs"/>
                <button>ADD DISCOUNT</button>
                </div>
            </div>

            <div className="form">
                <div className="headline">
                    <h2 className="title">Invoice Preview</h2>
                    <div style={{ "display": "flex", "gap": ".5em" }}>
                        <button onClick={printInvoice}>PRINT</button>
                    </div>
                </div>

                <div className="preview" ref={invoicePreviewRef}>
                    <InvoiceTemplate data={"12"}/>
                </div>
            </div>
        </div>
    );
}
