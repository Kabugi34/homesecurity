import React , { useState } from 'react';
import axios from 'axios';
const Recognize =() =>{
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [previewURL,setPreviewURL] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange =(e) =>{
    const file = e.target.files[0];
    setSelectedFile(file);
    setResult(null);
    setError(null);

    if (file){
      const url=URL.createObjectURL(file);
      setPreviewURL(url);

    }
    else{
      setPreviewURL(null);
    }

  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile){
      setError("Please select an image to upload.");
      return;
    }
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response =await axios.post('http://localhost:8000/recognize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data.result);
      setError("");

    } catch(err){
      setError("Error recognizing the image. Please try again.");
      console.error("axios error:", err);
    }
  };
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Recognize from image upload</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
          required
        />
        {previewURL && (
          <div className="mb-4">
            <p className ="text-sm font-medium text-gray-900">image Preview:</p>
              <img 
                src={previewURL} 
                alt="Preview" 
                className="w-64 h-auto rounded shadow-md mt-2 border"
              />
          </div>
        )}
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
          >
          Recognize
        </button>
      </form>
      {result && (
        <div className="mt-6 border rounded bg-green-100 text-green-800">
          <p><strong>Name:</strong>{result.name}</p>
          <p><strong>confidence:</strong>{result.confidence.toFixed(2)}%</p>
        </div>
      )}
      {error && (
        <div className="mt-6 border rounded bg-red-100 text-red-800">
          <p>{error}</p>
        </div>
      )}
    </div>
  );


};
export default Recognize;