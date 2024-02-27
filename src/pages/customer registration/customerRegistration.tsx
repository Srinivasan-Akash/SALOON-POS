import "./customerRegistration.scss"
import profile from "../../assets/profile.webp"
export default function customerRegistration() {
    return (
        <div className="registrationContainer">
            <div className="profile">
                <img className="profilePic" src={profile} width={80} height={100} />
            </div>
            <div className="form">
                <input type="text" placeholder="Enter Customer Name"/>
                <input type="text" placeholder="Enter Customer Email"/>
                <input type="text" placeholder="Enter Customer Phone Number"/>
                <button>CREATE NEW CUSTOMER</button>
            </div>
            <div className="overlay"></div>
        </div>
    )
}
