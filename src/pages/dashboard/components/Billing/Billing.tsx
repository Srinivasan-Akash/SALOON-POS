import "./billing.scss";
import { databases } from "../../../../appwrite/config";
import { useEffect, useRef, useState } from "react";
import { Query } from "appwrite";

export default function Billing() {
  interface Customer {
    name: string;
    phone: string;
    gmail: string;
    $id: string;
  }

  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await databases.listDocuments('65dffc2a989e2a914a6c', '65dffc41a023e7961f61');
        const data: Customer[] = response.documents;
        console.log(data);
        setCustomerData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setIsLoading(false);
        alert("Error fetching customer data");
      }
    };

    fetchData();
  }, []);

  const findUsers = async () => {
    const input: string = searchField.current?.value || '';
    let searchIndex: string = "";

    switch (true) {
      case /^\d{10}$/.test(input):
        searchIndex = "phone";
        break;
      case /^[a-zA-Z\s]+$/.test(input):
        searchIndex = "name";
        break;
      case /@gmail\.com$/.test(input):
        searchIndex = "gmail";
        break;
      default:
        alert("Invalid input");
        return;
    }

    try {
      const response = await databases.listDocuments(
        '65dffc2a989e2a914a6c',
        '65dffc41a023e7961f61',
        [Query.equal(searchIndex, input)]
      );

      const data: any = response.documents;
      console.log(data, input);
      setCustomerData(data);
    } catch (error) {
      console.error("Error searching for customers:", error);
      alert("Error searching for customers");
    }
  };

  const openPage = (item: Record<string, any>) => {
    const queryParams = Object.entries(item)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
  
    const url = `/customerProfile?${queryParams}`;
    window.open(url, '_blank', 'width=800, height=500');
  };

  const openNewUserPage = () => {
    window.open("/customerRegistration", "_blank", "width=300, height=380");
  };
  
  return (
    <div className="billingContainer">
      <div className="searchCard">
        <h2 className="title">Search For The Customer</h2>
        <p className="desc">Search via phone number or name in the below search box provided</p>
        <div className="searchBox">
          <input ref={searchField} type="text" placeholder="Enter User gmail, name, or phone number" />
          <div className="btns">
            <button onClick={findUsers}>FIND</button>
            <button onClick={openNewUserPage}>NEW</button>
          </div>
        </div>
      </div>
      {!isLoading && (
        <div className="tabularDisplay">
          <div className="head">
            <div>Name</div>
            <div>Phone Number</div>
            <div>Gmail</div>
          </div>
          {customerData.map((customer) => (
            <div key={customer.$id} className="row" onClick={() => openPage(customer)}>
              <div>{customer.name}</div>
              <div>{customer.phone}</div>
              <div>{customer.gmail}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
