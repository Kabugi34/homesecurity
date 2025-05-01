import React, { useState } from "react";
import axios from "axios";

const RecognizeFromUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setResult(null);
    setError("");

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewURL(url);
    } else {
      setPreviewURL(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://localhost:8000/recognize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data);
      setError("");
    } catch (err) {
      setError("Recognition failed. Try another image.");
      console.error("Axios error:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Recognize from File Upload</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4  w-full max-w-md">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
        />

        {previewURL && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-600">Image Preview:</p>
            <img
              src={previewURL}
              alt="Preview"
              className="w-64 h-auto rounded shadow-md mt-2 border"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Recognize
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 border rounded bg-green-100 text-green-800">
          <p><strong>Name:</strong> {result.predicted_name}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
          {result.message && <p><strong>Note:</strong> {result.message}</p>}
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 border rounded bg-red-100 text-red-800">
          {error}
        </div>
      )}
    </div>
  );
};

export default RecognizeFromUpload;
