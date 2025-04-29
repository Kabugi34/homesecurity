import React ,{useState} from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression'; // Import the image compression library

const AddPerson =() =>{
  const [name,setName] =useState('');
  const[images ,setImages] =useState([]);
  const[uploading,setUploading]=useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit=async(e) =>{
    e.preventDefault();
    if (!name || images.length ===0){
      setMessage('provide a name and at least four images')
      return;
    }
    const formData =new FormData();
    formData.append('name',name);
    for (let i = 0; i < images.length; i++) {
      const compressedFile=await imageCompression(images[i],{
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });
      formData.append("images", compressedFile, compressedFile.name);
    }
    try {
      setUploading(true);
      const response =await axios.post('http://localhost:8000/add_person',formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message||'Person added successfully!');
      setName('');
      setImages([]);
      
    }catch (error){
      console.error('Error details:', error);
      setMessage('Error adding person. Please try again.');

    }finally {
      setUploading(false);
    }
  
  };
  return (
    <div className ="p-6">
      <h2 className ="text-3x1 font-bold mb-6">Add a new person</h2>
      <form onSubmit ={handleSubmit} className="flex flex-col gap-4  w-full max-w-md">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          className="p-2 border border-gray-300 rounded"
          required
        />
        <input 
          type="file"
          accept="image/*"
          onChange={(e) => setImages(Array.from(e.target.files))}
          multiple
          className="p-2 border border-gray-300 rounded"
          required
        />
        <button
          type ="submit"
          disabled={uploading}
          className ="px-6 py-3 bg-green-600 text-white rounded hover:bg-gray-700 disabled:opacity-25"
        >
          {uploading ? 'Uploading...' : 'Add Person'}
        </button>
        {message && <p className="text-center text-sm text-gray-700 mt-2">{message}</p>}
      </form>
    </div>
  );
};
export default AddPerson;