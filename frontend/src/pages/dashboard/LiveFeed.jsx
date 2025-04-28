import React, { useRef, useState } from 'react';

const LiveFeed = () => {
  const videoRef = useRef(null);
  const [streaming, setStreaming] = useState(false);

  const startLiveFeed = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setStreaming(true);
    } catch (err) {
      console.error("Error starting webcam feed:", err);
    }
  };

  const stopLiveFeed = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setStreaming(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Live Webcam Feed</h2>

      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-2xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={startLiveFeed}
            disabled={streaming}
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Start Live Feed
          </button>
          <button
            onClick={stopLiveFeed}
            disabled={!streaming}
            className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Stop Live Feed
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;
