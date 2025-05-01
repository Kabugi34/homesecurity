import React,{useState,useEffect} from 'react';
import axios from 'axios';

const Notifications =() => {
  const [email,setEmail] = useState('');
  const[storedEmail,setStoredEmail] = useState('');
  const[intruders,setIntruders] = useState([]);
  const[status,setStatus] = useState('');

  useEffect(() => {
    // Load alert email and intruder logs
    axios.get("http://localhost:8000/notifications/email")
      .then(res => {
        setStoredEmail(res.data.email);
        setEmail(res.data.email);
      })
      .catch(() => {});
    
    axios.get("http://localhost:8000/notifications/intruders")
      .then(res => setIntruders(res.data))
      .catch(() => {});
  }, []);

  const updateEmail =async(e) =>{
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/notifications/email",
        new URLSearchParams({email})
      );
      setStoredEmail(email);
      setStatus('Email updated successfully!');
    }catch {
      setStatus('Error updating email!');
    }


  };
  return (
    <div className ="p-6">
      <h2 className="text-2xl font-bold mb-4">Notifications </h2>
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-2">set alert destination email</h3>
        <form onSubmit ={updateEmail} className ="flex flex-col gap-4  w-full max-w-md">
          <input
            type ="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className ="border p-2 rounded flex-2"
            placeholder="example@email.com"
            required
          />
          <button 
            
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-500">
                Save
              </button>
        </form>
        {status && <p className ="mt-2 text-green-500">{status}</p>}
        {storedEmail && (
          <p className ="text-sm text-gray-500 mt-2">
            current destination email:<span className ="font-medium">{storedEmail}</span>
          </p>
        )}
        
      </section>
      <section>
      <h3 className="text-lg font-semibold mb-2">Intruder Snapshots</h3>
        {intruders.length === 0 ? (
          <p className="text-gray-600">No intruders detected yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {intruders.map((entry) => (
              <div key={entry.id} className="bg-white shadow rounded p-4">
                <img
                  src={`http://localhost:8000${entry.image_url}`}
                  alt="intruder"
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <p><strong>Time:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
                <p><strong>Confidence:</strong> {entry.confidence}%</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Notifications;
// This code is a React component that manages notifications for the dashboard.
//  It allows users to set an alert email and displays intruder snapshots. 
// The component uses Axios to fetch and update data from a backend server. 
// The email input is validated, and the component provides feedback on the status of the email update.
//  Intruder snapshots are displayed in a grid format, with images and details about the detection time and confidence level.
