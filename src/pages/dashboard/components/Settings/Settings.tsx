import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import "./settings.scss";
import { MdDelete } from "react-icons/md";
import { useDataContext } from "../../../../context api/DataContext";
import { databaseID, databases, servicesCollection } from "../../../../appwrite/config";
import { v4 as uuidv4 } from 'uuid';

export default function Settings() {
  const { services, reFetch } = useDataContext();
  const [serviceForm, setServiceForm] = useState({
    serviceName: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");

  const handleAction = async () => {
    setLoading(true);

    try {
      if (!serviceForm.serviceName.trim() || !serviceForm.price.trim()) {
        throw new Error("Please enter both service name and price.");
      }

      const collection = servicesCollection;

      if (selectedItemId) {
        // Editing existing item
        await databases.updateDocument(databaseID, collection, selectedItemId, {
          serviceName: serviceForm.serviceName,
          price: Number(serviceForm.price)
        });
        setSelectedItemId("");
      } else {
        // Adding new item
        await databases.createDocument(databaseID, collection, uuidv4(), {
          serviceName: serviceForm.serviceName,
          price: Number(serviceForm.price)
        });
      }

      reFetch("services");
      setServiceForm({
        serviceName: "",
        price: "",
      });
    } catch (error) {
      console.error("Error performing action:", error);
      alert(`Failed to ${selectedItemId ? "edit" : "add"} item. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  async function deleteItem(documentId: string) {
    try {
      const collection = servicesCollection;
      await databases.deleteDocument(databaseID, collection, documentId);
      reFetch("services");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    }
  }

  async function editItem(documentId: string) {
    try {
      const items = services;
      const item = items.find((item: any) => item.$id === documentId);

      if (item) {
        setServiceForm({
          serviceName: item.serviceName,
          price: item.price.toString(),
        });
        setSelectedItemId(documentId);
      }
    } catch (error) {
      console.error("Error editing item:", error);
      alert("Failed to fetch item data. Please try again.");
    }
  }

  return (
    <div className="settingsWindow">
      
      {/* Display Services */}
      <div className="card">
        <div className="headline">
          <h2 className="title">Enter Service Details</h2>
          <div className="form">
            <input
              className="serviceInput"
              type="text"
              placeholder="Enter Service Name"
              value={serviceForm.serviceName}
              onChange={(e) => setServiceForm({ ...serviceForm, serviceName: e.target.value })}
            />
            <input
              className="priceInput"
              type="number"
              placeholder="Price"
              value={serviceForm.price}
              onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
            />
            <button onClick={handleAction} disabled={loading}>
              {loading ? (selectedItemId ? "Editing..." : "Adding...") : (selectedItemId ? "EDIT" : "ADD")}
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
                <span onClick={() => editItem(item.$id)}><FaEdit/></span>
                <span onClick={() => deleteItem(item.$id)}><MdDelete/></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
