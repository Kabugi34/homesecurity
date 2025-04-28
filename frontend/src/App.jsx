import { BrowserRouter as Router  , Routes, Route} from "react-router-dom";
import Landing from "./pages/Landing";  
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Activity from "./pages/dashboard/Activity";
import LiveFeed from "./pages/dashboard/LiveFeed";
import AddPerson from "./pages/dashboard/AddPerson";
import RemovePerson from "./pages/dashboard/RemovePerson";
import Notifications from "./pages/dashboard/Notifications";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard/*" element={<Dashboard />}>
            <Route path="activity" element={<Activity />} />
            <Route path="livefeed" element={<LiveFeed />} />
            <Route path="addperson" element={<AddPerson />} />
            <Route path="removeperson" element={<RemovePerson />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Route>
      </Routes>
    
  );
}

export default App;
