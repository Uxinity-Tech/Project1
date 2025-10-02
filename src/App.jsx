import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DoctorSidebar from "./components/DoctorSidebar";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Admin Pages
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import DoctorList from "./pages/DoctorList";
import DoctorRegistration from "./pages/DoctorRegistration";
import AdminPrescription from "./pages/AdminPrescription";


// Doctor Pages
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientList from "./pages/PatientList";
import PatientDetails from "./pages/PatientDetails";
import AppointmentSchedule from "./pages/AppointmentSchedule";
import ConsultationForm from "./pages/ConsultationForm";
import PrescriptionPage from "./pages/PrescriptionPage";
import FollowUpList from "./pages/FollowUpList";
import Inventory from "./pages/Inventory";

// Shared Components
import PatientForm from "./components/PatientForm";
import AppointmentForm from "./components/AppointmentForm";
import BillingTable from "./components/BillingTable";

// Login Page for Both Roles
import LoginAdmin from "./Log/LoginAdmin";

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="*" element={<Navigate to="/login-admin" />} />
      </Routes>
    );
  }

  return (
    <div className="flex">
{user.role === "admin" ? <Sidebar /> : <DoctorSidebar />}
      <main className="flex-1 bg-gray-50 min-h-screen p-6 overflow-y-auto">
        <Routes>
          {/* Admin Routes */}
          {user.role === "admin" && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/doctor-registration" element={<DoctorRegistration />}/>
              <Route path="/patients" element={<Patients />} />
              <Route path="/doctor" element={<DoctorList />} />
              <Route path="/admin-prescriptions" element={<AdminPrescription />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/add-patient" element={<PatientForm />} />
              <Route path="/new-appointment" element={<AppointmentForm />} />
              <Route path="/view-bill" element={<BillingTable />} />
              <Route path="/inventory" element={<Inventory />} />
            

            </>
          )}

          {/* Doctor Routes */}
          {user.role === "doctor" && (
          <>
  <Route path="/dashboard" element={<DoctorDashboard />} />
  <Route path="/patient-list" element={<PatientList />} />
  <Route path="/patient-details/:id" element={<PatientDetails />} />
  <Route path="/appointments" element={<AppointmentSchedule />} />
  <Route path="/consultation" element={<ConsultationForm />} />
  <Route path="/prescription" element={<PrescriptionPage />} />
  <Route path="/followups" element={<FollowUpList />} />
  <Route path="/inventory" element={<Inventory />} /> {/* Added Inventory route */}
</>

          )}

          {/* Default fallback */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
