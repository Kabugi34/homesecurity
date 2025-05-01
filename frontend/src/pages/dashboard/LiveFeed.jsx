import React, { useRef, useState } from 'react';
import axios from 'axios';

const LiveFeed = () => {
  const videoRef = useRef(null);
  const canvasRef=useRef(null);
  const intervalref =useRef(null);
  const [streaming, setStreaming] = useState(false);
  const[lastResult,setLastResult]=useState(null);
  const[error,setError]=useState();


  const startLiveFeed = async () => {
    setError(null);
    if (streaming) return; // Prevent multiple streams
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setStreaming(true);

      //capture frames every 1 second
      intervalref.current=setInterval(captureAndRecognize, 2000);
    } catch (err) {
      console.error("Error starting webcam feed:", err);
    }
  };

  const stopLiveFeed = () => {
    //stop polling video feed
    if (intervalref.current) {
      clearInterval(intervalref.current);
      intervalref.current = null;
    }
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
      setStreaming(false);
  };
  const captureAndRecognize = async () => {
    if (!videoRef.current||!canvasRef.current) return;

    const video=videoRef.current;
    const canvas=canvasRef.current;
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;
    const ctx=canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    //convert canvas to blob
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const formData = new FormData();
      formData.append('file', blob, 'snapshot.jpg');

      try {
        await axios.post('http://localhost:8000/recognize_live', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }).then(res => {
          setLastResult(res.data);
        });
        setError(null);
      } catch (err) {
        console.error("Recognition failed:", err);
        setError("Recognition failed. Try again.");
      }
    }, 'image/jpeg',0.8);
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Live Feed Recognition</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-2xl">
          <video
            ref={videoRef}
            className="w-full rounded-lg shadow-lg bg-black"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={startLiveFeed}
            disabled={streaming}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Start Live Feed
          </button>
          <button
            onClick={stopLiveFeed}
            disabled={!streaming}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Stop Live Feed
          </button>
        </div>

        {/* Hidden canvas for captures */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Latest Recognition Result */}
        {lastResult && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow inner-w-full max-w-md">
            <p>
              <strong>Name:</strong> {lastResult.predicted_name}
            </p>
            <p>
              <strong>Confidence:</strong> {lastResult.confidence}
            </p>
            {lastResult.type && (
              <p>
                <strong>Type:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    lastResult.type === "Intruder"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {lastResult.type}
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveFeed;