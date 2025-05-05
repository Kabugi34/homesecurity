import React from "react";
import { useTrainModel } from "../../hooks/UseTrainModel";
export default function RetrainModel() {
    const { progress, status, train } = useTrainModel();
    
    return (
        <div className="p-6 max-w-sm mx-auto space y-4 rounded ">
        <h1 className="text-3xl font-bold mb-4">Retrain Model</h1>
        <p className="mb-4">Progress: {progress}%</p>
        <button
        onClick={train}
        disabled={status === "running"}
        className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {status === "running" ? "Retraining…" : "Retrain Now"}
      </button>
      {status !== "idle" && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          {status === "success" && <p className="text-green-600">Done!</p>}
          {status === "error"   && <p className="text-red-600">Failed to retrain.</p>}
        </div>

      )}
      </div>
    );
}