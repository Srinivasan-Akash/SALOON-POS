import { HashRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/register/Register';
import Dashboard from "./pages/dashboard/dashboard"
import Login from "./pages/login/Login"
import CustomerProfile from './pages/customer profile/customerProfile';
import { DataContextProvider } from './context api/DataContext';
import InvoicePage from './pages/invoice page/invoicePage';
import ProductRegistration from './pages/product registration/productRegistration';
import CustomerRegistration from './pages/customer registration/customerRegistration';
// import CustomerBill from './pages/customer bill/customerBill';
function App() {
  return (
    <DataContextProvider>

      <HashRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/customerRegistration" element={<CustomerRegistration />} />
          <Route path="/customerProfile" element={<CustomerProfile />} />
          <Route path="/invoicePage" element={<InvoicePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productRegistration" element={<ProductRegistration />} />
          
          {/* TODO: Delete Below Code */}
          {/* <Route path="/" element={<Dashboard />} /> */}
          {/* <Route path="/dashboard" element={<Register />} /> */}

          {/* Add more routes for other components */}
        </Routes>
      </HashRouter>
    </DataContextProvider>

  )
}

export default App
