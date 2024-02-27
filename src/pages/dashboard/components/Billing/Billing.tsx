import "./billing.scss"

export default function Billing() {
  const openNewUserPage = () => {
    window.open("/customerRegistration", "_blank", "width=300, height=380");
  };

  const findUsers = () => {

  }

  const openPage = (items) => {
    window.open("/customerProfile", "_blank", "width=500, height=500");
  }
  return (
    <div className="billingContainer">
      <div className="searchCard">
        <h2 className="title">Search For The Customer</h2>
        <p className="desc">Search via phone number or name in the below search box provided</p>
        <div className="searchBox">
          <input type="text" placeholder="Enter Use gmail, name or phone number" />

          <div className="btns">
            <button onClick={findUsers}>FIND</button>
            <button onClick={openNewUserPage}>New</button>
          </div>
        </div>
      </div>
      <div className="tabularDisplay">
        <div className="head">
          <div>Name</div>
          <div>Phone Number</div>
          <div>Gmail</div>
        </div>
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => {
            return (
              <div key={index} className="row" onClick={() => openPage(item)} >
                <div>Akash Srinivasan</div>
                <div>91+ 7676856815</div>
                <div>qa.sixsigma@gmail.com</div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
