import "./billing.scss";
import { useRef, useState } from "react";
import { useDataContext } from "../../../../context api/DataContext";

export default function Billing() {
  const searchField = useRef<HTMLInputElement>(null);
  const { customers, filterCustomers, reFetch } = useDataContext();
  const [isFiltering, setIsFiltering] = useState(false);

  const findUsers = async () => {
    const input: string = searchField.current?.value || '';

    if (input.trim() === '') {
      // If the search input is empty, display all customers
      setIsFiltering(false);
      reFetch('customers'); // Fetch all customers again
    } else {
      // If there is a search input, filter customers
      setIsFiltering(true);
      filterCustomers(input);
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
      {<div className="tabularDisplay">
        <div className="head">
          <div>Name</div>
          <div>Phone Number</div>
          <div>Gmail</div>
        </div>
        {isFiltering
          ? customers.map((customer) => (
            <div key={customer.$id} className="row" onClick={() => openPage(customer)}>
              <div>{customer.name}</div>
              <div>{customer.phone}</div>
              <div>{customer.gmail}</div>
            </div>
          ))
          : customers.map((customer) => (
            <div key={customer.$id} className="row" onClick={() => openPage(customer)}>
              <div>{customer.name}</div>
              <div>{customer.phone}</div>
              <div>{customer.gmail}</div>
            </div>
          ))}
      </div>}
    </div>
  );
}
