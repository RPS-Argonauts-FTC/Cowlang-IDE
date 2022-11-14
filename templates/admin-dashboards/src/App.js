import React, { useState } from "react";
import Sidenav from "./components/modules/Sidenav";
import Navbar from "./components/modules/Navbar";
import { Routes, Route } from "react-router-dom";
import SEODashboard from "./components/views/SEODashboard";
import ECommerce1 from "./components/views/ECommerce1";
import ECommerce2 from "./components/views/ECommerce2";
import ChatApp from "./components/views/ChatApp";
import NotFound404 from "./components/views/NotFound404";
import ChangePassword from "./components/views/ChangePassword";
import ForgotPassword from "./components/views/ForgotPassword";
import LoginRegister from "./components/views/LoginRegister";
import UserManagement from "./components/views/UserManagement";
import UserProfile from "./components/views/UserProfile";
import InvoicePage from "./components/views/InvoicePage";
import MailboxApp from "./components/views/MailboxApp";
import OrderDashboard from "./components/views/OrderDashboard";
import TrafficDashboard from "./components/views/TrafficDashboard";
import AdsDashboard from "./components/views/AdsDashboard";

function App() {
  const [basicOpen, setBasicOpen] = useState(true);

  return (
    <>
      <header>
        <Sidenav basicOpen={basicOpen} setBasicOpen={setBasicOpen} />
        <Navbar updateSidenav={setBasicOpen} sidenavState={basicOpen} />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<SEODashboard />} />
          <Route path="/e-commerce1" element={<ECommerce1 />} />
          <Route path="/e-commerce2" element={<ECommerce2 />} />
          <Route path="/ads-dashboard" element={<AdsDashboard />} />
          <Route path="/order-dashboard" element={<OrderDashboard />} />
          <Route path="/traffic-dashboard" element={<TrafficDashboard />} />
          <Route path="/mailbox-app" element={<MailboxApp />} />
          <Route path="/chat-app" element={<ChatApp />} />
          <Route path="/invoice-page" element={<InvoicePage />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/login-register" element={<LoginRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/not-found404" element={<NotFound404 />} />
        </Routes>
      </main>
      <footer className="mt-5"></footer>
    </>
  );
}

export default App;
