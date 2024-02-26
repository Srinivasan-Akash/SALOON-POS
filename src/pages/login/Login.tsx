import { useState } from 'react';
import './login.scss';
import loginImg from '../../assets/login.png';
import { useNavigate } from 'react-router-dom';
import { account } from '../../appwrite/config';
import { FaSpinner } from 'react-icons/fa'; // Import the loading spinner icon

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogin = (authType: string) => {
    if (authType === 'email') {
      setIsLoading(true); // Set loading to true when starting the login process

      const promise = account.createEmailSession(email, password);
      promise.then(
        function (response) {
          console.log(response); // Success
          alert('Logged In Successfully');
          navigate("/dashboard")
        },
        function (error) {
          console.log(error); // Failure
          alert(error);
        }
      ).finally(() => {
        setIsLoading(false); // Set loading to false whether the process succeeds or fails
      });
    }
  };

  return (
    <div className='loginScreen'>
      <div className="bg"></div>
      <div className="loginContainer">
        <div className="left">
          <img src={loginImg} alt='Login' />
        </div>

        <div className="right">
          <h1>ACCESS YOUR ACCOUNT</h1>
          <div className='box'>
            <input
              type='email'
              placeholder='Enter your gmail'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type='password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={() => handleLogin('email')} disabled={isLoading}>
              {isLoading ? (
                <>
                  <FaSpinner className='spinner-icon' /> Logging In Please Wait...
                </>
              ) : (
                'Login To Your Account'
              )}
            </button>
          </div>
          <div className="or-container">
            <div className="or-line"></div>
            <div className="or-text">OR</div>
            <div className="or-line"></div>
          </div>
          <div className='box'>
            <button onClick={() => handleLogin('google')} disabled={isLoading}>
              Login Via Google
            </button>
            <button onClick={() => handleNavigation("/")}>
              Create A New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
