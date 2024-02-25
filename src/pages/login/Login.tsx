import './login.scss'
import loginImg from '../../assets/login.png'
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className='loginScreen'>
      <div className="bg"></div>
      <div className="loginContainer">
        <div className="left">
          <img src={loginImg}></img>
        </div>

        <div className="right">
          <h1>REGISTER NOW</h1>
          <div className='box'>
            <input type='email' placeholder='Enter your gmail' />
            <input type='password' placeholder='Enter your password' />
            <button>Create New Account</button>
          </div>
          <div className="or-container">
            <div className="or-line"></div>
            <div className="or-text">OR</div>
            <div className="or-line"></div>
          </div>
          <div className='box'>
            <button>Login Via Google</button>
            <button onClick={() => handleNavigation("/")}>
                Create A New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
