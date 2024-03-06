import { FaSpinner } from "react-icons/fa";
import "./productRegistration.scss";
import { useState } from "react";
import { databaseID, databases, inventoryCollection } from "../../appwrite/config";
import { v4 as uuidv4 } from 'uuid';

export default function ProductRegistration() {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [liquid, setLiquid] = useState(""); // Changed from 'ml' to 'liquid'
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    // Access the form data using individual state values
    if (!productName || quantity === 0 || !liquid || price === 0) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    // Set loading state if needed
    setLoading(true);

    // Access the form data using individual state values

    const promise = databases.createDocument(databaseID, inventoryCollection, uuidv4(), {
      name: productName,
      quantity: quantity,
      liquid: liquid, // Updated from 'ml' to 'liquid'
      price: price,
    });

    promise
      .then(() => {
        alert("Product Added Successfully");
        window.close();
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
        window.close();
      });

  };

  return (
    <div className="productRegistration">
      <h1 className="productTitle">Product Registration</h1>
      <div className="form">
        <div className="headline">
          <h2 className="title">Enter Product Details</h2>
        </div>

        <div className="formRow">
          <input
            className="productNameInput"
            placeholder="Enter Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <div className="formRow">
          <input
            type="number"
            placeholder="Quantity"
            value={quantity === 0 ? "" : quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <input
            type="text"
            placeholder="grams or ml"
            value={liquid}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLiquid(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={price === 0 ? "" : price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>

        <button disabled={loading} className="total" onClick={handleSubmit}>
          {loading ? (
            <>
              <FaSpinner className="loading-icon" /> LOADING PLEASE WAIT...
            </>
          ) : (
            `ADD PRODUCT TO INVENTORY`
          )}
        </button>
      </div>

      <div className="overlay"></div>
    </div>
  );
}
