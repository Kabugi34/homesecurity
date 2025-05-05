import {  Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
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
        
        {/* Dashboard and nested  inner pages */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Activity />} />
          <Route path="activity" element={<Activity />} />
          <Route path="livefeed" element={<LiveFeed />} />
          <Route path="addperson" element={<AddPerson />} />
          <Route path="removeperson" element={<RemovePerson />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="recognize" element={<Recognize />} />
          <Route path="RetrainModel" element={<RetrainModel/>} />
          <Route path="Reports" element={<Reports />} />
        </Route>

      </Routes>
  );
}

export default App;
