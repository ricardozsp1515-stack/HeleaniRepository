import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import RequestAppointment from "./pages/RequestAppointment";
import VetAppointments from "./pages/VetAppointments";
import Register from "./pages/Register";
import Login from "./pages/Login";
import TermsAndConditions from "./pages/TermsAndConditions";
import Profile from "./pages/Profile";
import AddPet from "./pages/AddPet";
import PetProfile from "./pages/PetProfile";
import ConfigureProfile from "./pages/ConfigProfile";
import VetProfile from "./pages/VetProfile";
import ClinicProfile from "./pages/ClinicProfile";
import ManageClinics from "./pages/ManageClinics";
import VetVerification from "./pages/VetVerification";
import ClinicVerification from "./pages/ClinicVerification";
import Information from "./pages/Information";
import AdminDashboard from "./pages/AdminDashboard";
import SearchResults from "./pages/SearchResults";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/appointments/new" element={<RequestAppointment />} />
        <Route path="/vet-appointments" element={<VetAppointments />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-pet" element={<AddPet />} />
        <Route path="/pet-profile/:id"element={<PetProfile />}/>
        <Route path="/configure-profile" element={<ConfigureProfile />}/>
        <Route path="/vet-profile/:id" element={<VetProfile />}/>
        <Route path="/clinic-profile/:id" element={<ClinicProfile />}/>
        <Route path="/manage-clinics" element={<ManageClinics />}/>
        <Route path="/vet-verification" element={<VetVerification />}/>
        <Route path="/clinic-verification" element={<ClinicVerification />}/>
        <Route path="/information" element={<Information />}/>
        <Route path="/admin" element={<AdminDashboard />}/>
        <Route path="/search" element={<SearchResults />}/>
        <Route path="/user-profile/:id" element={<UserProfile />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;