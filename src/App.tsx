import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/register/Register';
import Dashboard from "./pages/dashboard/dashboard"
import Login from "./pages/login/Login"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Register />} /> */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}

        {/* TODO: Delete Below Code */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Register />} />

        {/* Add more routes for other components */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
