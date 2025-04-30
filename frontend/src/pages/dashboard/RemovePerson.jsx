import React ,{useState} from 'react';
import axios from 'axios';

const RemovePerson =() =>{
  const [personName, setPersonName] = useState('');
  const [message,setMessage] =useSate('');

  const handleRemove =async(e) =>{
    e.preventDefault();
    try{
      const response = await axios.post('http://localhost:8000/remove_person', {name:personName});
      setMessage(response.data.message);
      setPersonName('');
    }catch(error){
      console.error('Error removing person:', error);
      setMessage('Failed to remove person, check the name and try again');
    }
    };

    return (
      <div className ="p-6">
        <h2 className="text-2xl font-bold mb-4">Remove  known Person</h2>
        <form onSubmit ={handleRemove} className ="space-y-4">
          <input 
            type ="text"
            placeholder ="enter person's name to remove"
            value={personName}
            onChange={(e) =>setPersonName(e.target.value)}
            className ="border p-2 w-full rounded"
            required
          />

          <button
            type ="submit"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Remove person
          </button>
        </form>
        {message && <p className="mt-4 text-green-500">{message}</p>}

      </div>
    );
  };

  export default RemovePerson;
