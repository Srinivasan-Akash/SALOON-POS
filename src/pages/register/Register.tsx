import './register.scss'
import loginImg from '../../assets/login.png'
import { useNavigate } from 'react-router-dom';
import { account } from '../../appwrite/config';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

export default function Register() {
  const navigate = useNavigate();
  const [saloonName, setSaloonName] = useState('');
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State to track loading status

  const createNewAccount = async (authType: string) => {
    try {
      setIsLoading(true);
  
      // Check if any field is empty
      if (!saloonName || !gmail || !password) {
        alert('Please fill in all fields');
      } else if (authType === 'email') {
        const response = await account.create(uuidv4(), gmail, password, saloonName);
        console.log(response); // Success
        alert('Successfully Registered');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      alert(error)
    } finally {
      setIsLoading(false);
    }
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
            <input
              type="text"
              placeholder="Enter your name"
              value={saloonName}
              onChange={(e) => setSaloonName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Enter your gmail"
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button disabled={isLoading} onClick={() => createNewAccount("email")}>
              {isLoading ? (
                <>
                  <FaSpinner className='spinner-icon' size={20}/> Registering Please Wait...
                </>
              ) : (
                'Create New Account'
              )}
            </button>
          </div>
          <div className="or-container">
            <div className="or-line"></div>
            <div className="or-text">OR</div>
            <div className="or-line"></div>
          </div>
          <div className='box'>
            <button onClick={() => createNewAccount("google")}>Login Via Google</button>
            <button onClick={() => navigate("/login")}>
              Already Have An Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
