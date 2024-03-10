import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import "./settings.scss";
import { MdDelete } from "react-icons/md";
import { useDataContext } from "../../../../context api/DataContext";
import { databaseID, databases, servicesCollection } from "../../../../appwrite/config";
import { v4 as uuidv4 } from 'uuid';

export default function Settings() {
  const { services, reFetch } = useDataContext();
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState("");

  const handleServiceAction = async () => {
    setLoading(true);

    try {
      if (!serviceName.trim() || !price.trim()) {
        throw new Error("Please enter both service name and price.");
      }

      if (selectedServiceId) {
        // Editing existing service
        await databases.updateDocument(databaseID, servicesCollection, selectedServiceId, {
          serviceName: serviceName,
          price: Number(price)
        });
        setSelectedServiceId("");
      } else {
        // Adding new service
        await databases.createDocument(databaseID, servicesCollection, uuidv4(), {
          serviceName: serviceName,
          price: Number(price)
        });
      }

      reFetch("services");
      setServiceName("");
      setPrice("");
    } catch (error) {
      console.error("Error performing service action:", error);
      alert(`Failed to ${selectedServiceId ? "edit" : "add"} service. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  async function deleteService(documentId: string) {
    try {
      await databases.deleteDocument(databaseID, servicesCollection, documentId);
      reFetch("services");
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service. Please try again.");
    }
  }

  async function editService(documentId: string) {
    try {
      const service = services.find((item: any) => item.$id === documentId);
      if (service) {
        setServiceName(service.serviceName);
        setPrice(service.price.toString());
        setSelectedServiceId(documentId);
      }
    } catch (error) {
      console.error("Error editing service:", error);
      alert("Failed to fetch service data. Please try again.");
    }
  }

  return (
    <div className="settingsWindow">
      <div className="card">
        <div className="headline">
          <h2 className="title">Enter Services Details</h2>
          <div className="form">
            <input
              className="serviceInput"
              type="text"
              placeholder="Enter Service Name"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />
            <input
              className="priceInput"
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <button onClick={handleServiceAction} disabled={loading}>
              {loading ? (selectedServiceId ? "Editing..." : "Adding...") : (selectedServiceId ? "EDIT" : "ADD")}
            </button>
          </div>
        </div>

        <div className="rows">
          {services.map((item: any, index: number) => (
            <div className="row" key={index}>
              <p className="title">
                {item.serviceName} - {item.price} ₹
              </p>
              <div className="options">
                <span><FaEdit onClick={() => editService(item.$id)} /></span>
                <span><MdDelete onClick={() => deleteService(item.$id)} /></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="title">
          <h2>Employee Settings</h2>
        </div>
      </div>

      <div className="card">
        <div className="title">
          <h2>Services Settings</h2>
        </div>
      </div>
    </div>
  );
}
