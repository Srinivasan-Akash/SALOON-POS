import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa'; // Import the spinner icon
import "./customerRegistration.scss";
import profile from "../../assets/profile.webp";
import { customerCollection, databaseID, databases } from '../../appwrite/config';
import { v4 as uuidv4 } from 'uuid';
import { useDataContext } from '../../context api/DataContext';

export default function CustomerRegistration() {
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { reFetch } = useDataContext();

    const handleFormSubmit = () => {
        if (!customerName || !customerEmail || !customerPhoneNumber) {
            alert("Please fill in all the fields");
            return;
        }

        // Set loading state to true
        setIsLoading(true);

        const promise = databases.createDocument(databaseID, customerCollection, uuidv4(), {
            name: customerName,
            gmail: customerEmail,
            phone: customerPhoneNumber
        });

        promise
            .then(() => {
                alert("Customer Registered Successfully");
                reFetch("customers")
                window.close()
            })
            .catch((error) => {
                alert(error);
            })
            .finally(() => {
                // Set loading state back to false, regardless of success or failure
                setIsLoading(false);

                // Optionally, you can reset the form fields after submission
                setCustomerName('');
                setCustomerEmail('');
                setCustomerPhoneNumber('');
            });
    };

    return (
        <div className="registrationContainer">
            <div className="profile">
                <img className="profilePic" src={profile} width={80} height={100} alt="Profile" />
            </div>
            <div className="form">
                <input type="text" placeholder="Enter Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                <input type="text" placeholder="Enter Customer Email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                <input type="text" placeholder="Enter Customer Phone Number" value={customerPhoneNumber} onChange={(e) => setCustomerPhoneNumber(e.target.value)} />
                <button onClick={handleFormSubmit} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <FaSpinner className='spinner-icon' /> Registering Please Wait...
                        </>
                    ) : (
                        'CREATE NEW CUSTOMER'
                    )}
                </button>
            </div>
            <div className="overlay"></div>
        </div>
    );
}
