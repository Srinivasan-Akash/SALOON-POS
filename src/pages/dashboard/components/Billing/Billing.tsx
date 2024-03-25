import "./billing.scss";
import { useRef, useState } from "react";
import { useDataContext } from "../../../../context api/DataContext";
import { FaSearch } from "react-icons/fa";
import { FaSync } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { customerCollection, databaseID, databases } from "../../../../appwrite/config";

export default function Billing() {
  const searchField = useRef<HTMLInputElement>(null);
  const { customers, filterCustomers, reFetch } = useDataContext();
  const [isFiltering, setIsFiltering] = useState(false);

  const findUsers = async () => {
    const input: string = searchField.current?.value || "";

    if (input.trim() === "") {
      setIsFiltering(false);
    } else {
      setIsFiltering(true);
      filterCustomers(input);
    }
  };

  const resetSearch = () => {
      setIsFiltering(false);
      reFetch("customers");
    
  };

  const deleteCustomer = async (id: string) => {
    try {
      await databases.deleteDocument(databaseID, customerCollection, id);
      reFetch("customers");
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const openCustomerProfile = (item: Record<string, any>) => {
    const queryParams = Object.entries(item)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
      .join("&");
    console.log(queryParams);

    const url = `#/customerProfile?${queryParams}`;
    window.open(url, "_blank", "width=800, height=500");
  };

  return (
    <div className="billingContainer">
      <div className="searchCard">
        <h2 className="title">Search For The Customer</h2>
        <p className="desc">
          Search via phone number or name in the below search box provided
        </p>
        <div className="searchBox">
          <input
            ref={searchField}
            type="text"
            placeholder="Enter User gmail, name, or phone number"
          />
          <div className="btns">
            <button onClick={findUsers}>
              <FaSearch />
            </button>
            <button onClick={resetSearch}>
              <FaSync />
            </button>
            <button
              onClick={() =>
                window.open(
                  "#/customerRegistration",
                  "_blank",
                  "width=300, height=400"
                )
              }
            >
              <FaPlus />
            </button>
          </div>
        </div>
      </div>
      {
        <div className="tabularDisplay">
          <div className="head">
            <div>Name</div>
            <div>Phone Number</div>
            <div>Gmail</div>
            <div>Actions</div>
          </div>
          {isFiltering
            ? customers.map((customer) => (
                <div
                  key={customer.$id}
                  className="row"
                  onClick={() => openCustomerProfile(customer)}
                >
                  <div>{customer.name}</div>
                  <div>{customer.phone || "NOT GIVEN"}</div>
                  <div>{customer.gmail || "NOT GIVEN"}</div>
                  <div className="actions">
                    <button
                      className="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCustomer(customer.$id);
                      }}
                    >
                      DELETE
                    </button>
                    {/* <button className="edit">EDIT</button> */}
                  </div>
                </div>
              ))
            : customers.map((customer) => (
                <div
                  key={customer.$id}
                  className="row"
                  onClick={() => openCustomerProfile(customer)}
                >
                  <div>{customer.name}</div>
                  <div>{customer.phone || "NOT GIVEN"}</div>
                  <div>{customer.gmail || "NOT GIVEN"}</div>
                  <div className="actions">
                    <button className="delete" 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCustomer(customer.$id);
                    }}>
                      DELETE
                    </button>
                    {/* <button className="edit">EDIT</button> */}
                  </div>
                </div>
              ))}
        </div>
      }
    </div>
  );
}
