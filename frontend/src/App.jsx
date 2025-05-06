import {  Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardHome from './pages/dashboard/DashboardHome';
import Dashboard from './pages/Dashboard';
import Activity from './pages/dashboard/Activity';
import LiveFeed from './pages/dashboard/LiveFeed';
import AddPerson from './pages/dashboard/AddPerson';
import RemovePerson from './pages/dashboard/RemovePerson';
import Notifications from './pages/dashboard/Notifications';
import Recognize from './pages/dashboard/Recognize';
import RetrainModel from "./pages/dashboard/RetrainModel";
import Reports from "./pages/dashboard/Reports";

function App() {
  return (
    
    
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
         {/* protected dashboard */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* index = default when you hit /dashboard */}
          <Route index element={<DashboardHome />} />
          {/* nested routes */}

          <Route index element={<Activity />} />
          <Route path="activity" element={<Activity />} />
          <Route path="livefeed" element={<LiveFeed />} />
          <Route path="addperson" element={<AddPerson />} />
          <Route path="removeperson" element={<RemovePerson />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="recognize" element={<Recognize />} />
          <Route path="RetrainModel" element={<RetrainModel/>} />
          <Route path="Reports" element={<Reports />} />
           {/* catch‑all under /dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
        {/* global catch‑all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
  );
}

export default App;
