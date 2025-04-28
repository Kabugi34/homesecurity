import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Activity from './dashboard/Activity';
import LiveFeed from './dashboard/LiveFeed';
import AddPerson from './dashboard/AddPerson';
import RemovePerson from './dashboard/RemovePerson';
import Notifications from './dashboard/Notifications';
import Recognize from './dashboard/Recognize';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/activity" />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/livefeed" element={<LiveFeed />} />
          <Route path="/addperson" element={<AddPerson />} />
          <Route path="/removeperson" element={<RemovePerson />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/recognize" element={<Recognize />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
