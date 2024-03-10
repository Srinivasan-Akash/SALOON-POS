import { FaPlus, FaSearch, FaSync } from "react-icons/fa";
import "./inventory.scss";
import { useDataContext } from "../../../../context api/DataContext";
import { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

export default function Inventory() {
  const { inventory, reFetch, replenishedInventory, filterInventory } = useDataContext();
  const [searchTerm, setSearchTerm] = useState("");

  const openProductInfo = (item: Record<string, any>) => {
    const queryParams = Object.entries(item)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
    console.log(queryParams)

    const url = `#/productInformation?${queryParams}`;
    window.open(url, '_blank', 'width=800, height=500');
  };

  return (
    <main className="inventoryContainer">

      <Swiper className="swiper">
        {replenishedInventory.map((product: any) => {
          const completionPercentage =
            (Number(product.remainingLiquid.replace("ml", "").replace("g", "")) /
              Number(product.liquid.replace("ml", "").replace("g", ""))) *
            100;

          return (<SwiperSlide className="cardContainer" key={product.$id}>
            <div className="remainingCard">
              <div className="progress">
                <div
                  className="finished"
                  style={{
                    height: `${completionPercentage}%`,
                  }}
                ></div>
              </div>
              <div className="content">
                <h2 className="productName">{product.name}</h2>
                <div className="boxes">
                  <p className="box">{product.remainingLiquid}/{product.liquid}</p>
                  <p className="box">{product.price} ₹</p>
                  <p className="box">{product.quantity} bottles</p>
                </div>
                <button onClick={() => openProductInfo(product)}>ADJUST PRODUCT QUANTITY</button>
                {/* <button>SELL PRODUCT COMMERCIALLY</button> */}
              </div>
            </div>
          </SwiperSlide>)
        })}
      </Swiper>

      <div className="addItems">
        <h2 className="title">Search For The Product</h2>
        <p className="desc">Search via product name in the below search box provided</p>
        <div className="searchBox">
          <input
            type="text"
            placeholder="Enter the product name over here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="btns">
            <button onClick={() => filterInventory(searchTerm)}><FaSearch /></button>
            <button onClick={() => reFetch("inventory")}><FaSync /></button>
            <button onClick={() => window.open("#/productRegistration", "_blank", "width=500, height=400")}><FaPlus /></button>
          </div>
        </div>
      </div>


      <div className="cards">
        {inventory.map((product: any) => {
          const completionPercentage =
            (Number(product.remainingLiquid.replace("ml", "").replace("g", "")) /
              Number(product.liquid.replace("ml", "").replace("g", ""))) *
            100;

          return (<div className="card" key={product.$id}>
            <div className="progress">
              <div
                className="finished"
                style={{
                  height: `${completionPercentage}%`,
                  backgroundColor: completionPercentage < 35 ? '#fb7575be' : '#a075fb',
                }}
              ></div>
            </div>
            <div className="content">
              <h2 className="productName">{product.name}</h2>
              <div className="boxes">
                <p className="box">{product.remainingLiquid}/{product.liquid}</p>
                <p className="box">{product.price} ₹</p>
                <p className="box">{product.quantity} bottles</p>
              </div>
              <button onClick={() => openProductInfo(product)}>ADJUST PRODUCT QUANTITY</button>
              {/* <button>SELL PRODUCT COMMERCIALLY</button> */}
            </div>
          </div>)
        })}
      </div>
    </main>
  );
}
