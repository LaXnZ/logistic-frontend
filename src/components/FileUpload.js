import React, { useState } from "react";
import { useApiClient } from "../api/apiClient";
import { useAuth } from "react-oidc-context";

function FileUpload({ companyId }) {
  const auth = useAuth();
  const [file, setFile] = useState(null);
  const { uploadFile } = useApiClient();

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");
    try {
      await uploadFile(file, companyId, auth.user?.profile.email);
      alert("✅ Uploaded successfully!");
      setFile(null);
    } catch (error) {
      alert("❌ Upload failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <div
      className="bg-white p-6 rounded-lg border shadow-sm"
      style={{ borderColor: "black", borderWidth: "0.5px" }}
    >
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300"
      />
      <button
        onClick={handleUpload}
        className="mt-6 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium shadow-md border border-green-600 transition-all"
      >
        📤 Upload
      </button>
    </div>
  );
}

export default FileUpload;
