import "./customerProfile.scss"
import profile from "../../assets/profile.webp"

export default function customerProfile() {
    return (
        <div className="customerProfile">
            <div className="profileCard">
                <div>
                    <img src={profile} width={60} />
                </div>
                <div>
                    <h2>Akash Srinivasan</h2>
                    <p>qa.sixsigma@gmail.com</p>
                </div>
            </div>

            <div className="cards">
                <div className="card">
                    <h2>42</h2>
                    <p>Lifetime Billing</p>
                </div>
                <div className="card">
                    <h2>650</h2>
                    <p>Lifetime Credits</p>
                </div>
                <div className="card">
                    <h2>4.2k ₹</h2>
                    <p>Pending Amount</p>
                </div>
            </div>

<div className="btns">
<button className="newBill">ADD NEW BILL</button>
<button className="newBill">ADD NEW BILL</button>
</div>
            <div className="overlay"></div>
        </div>
    )
}
