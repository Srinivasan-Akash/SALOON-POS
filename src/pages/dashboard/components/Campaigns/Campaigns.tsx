import { useState } from "react";
import "./campaign.scss";
import { whatsapp_endpoint } from "../../../../appwrite/config";
import { useDataContext } from "../../../../context api/DataContext";
import { FaSpinner } from "react-icons/fa";

export default function Campaigns() {
  const [promoMessage, setPromoMessage] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const { customers } = useDataContext();

  const handleSendMessage = async () => {
    // Validate that the promoMessage is not empty
    if (!promoMessage.trim()) {
      alert("Please enter a promo message before sending.");
      return;
    }
 
    // Toggle loading state to true before sending messages
    setLoading(true);

    // Iterate through customers and send the promoMessage to each customer's phone
    for (const customer of customers) {
      const phoneNumber = customer.phone;
      console.log(phoneNumber)
      // Assuming phone is a property of the customer object
      const url = `${whatsapp_endpoint}/send-message?number=${phoneNumber}&message=${encodeURIComponent(promoMessage)}`;

      try {
        const messageResponse = await fetch(url);
        const result = await messageResponse.text();
        console.log('Response for', phoneNumber, ':', result);
        // Handle the response as needed

      } catch (error) {
        console.error('Error sending message to', phoneNumber, ':', error);
        // Handle the error if needed
      }
    }

    // Toggle loading state to false after sending messages
    setLoading(false);

    // Notify the user after sending messages
    alert("Messages sent to all customers!");
  };

  return (
    <div className="campaignsWindow">
      <div className="card">
        <div className="title">
          <h2>Enter Promo Message</h2>
          <button onClick={handleSendMessage} disabled={loading}>
            {loading ? (
              <>
                <FaSpinner className="loading-icon" /> Sending...
              </>
            ) : (
              `Send Messages`
            )}
          </button>

        </div>
        <textarea
          placeholder="Enter Your Promo Message....."
          value={promoMessage}
          onChange={(e) => setPromoMessage(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
}
