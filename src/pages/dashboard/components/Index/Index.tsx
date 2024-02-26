import "./index.scss"

export default function Index() {
  return (
    <main className="parentContainer">
      <div className="realTimeUpdates">
        <div className="card">
          <h2>4.2k</h2>
          <p>Paid Amount</p>
        </div>
        <div className="card">
          <h2>25+</h2>
          <p>Total Customers</p>
        </div>
        <div className="card">
          <h2>3.6k</h2>
          <p>Pending Amount</p>
        </div>
        <div className="card">
          <h2>40₹</h2>
          <p>Employee Tips</p>
        </div>
      </div>
      <div className="extras">
        <div className="cards">
          <div className="card">
            <h2>4.2k</h2>
            <p>Paid Amount</p>
          </div>
          <div className="card">
            <h2>4.2k</h2>
            <p>Paid Amount</p>
          </div>
        </div>
        <div className="chart">

        </div>
      </div>

      <div className="tabularDisplay">
        <div className="head">
          <div>Name</div>
          <div>Status</div>
          <div>Price</div>
          <div>Date</div>
        </div>
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => {
            return (
              <div key={index} className="row">
                <div>Akash Srinivasan</div>
                <div><span className="green">PAID</span></div>
                <div>4,050 ₹</div>
                <div>11/5/2023</div>
              </div>
            )
          })
        }
      </div>
    </main>
  )
}
