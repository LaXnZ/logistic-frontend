import React, { useState } from "react";
import { useApiClient } from "../api/apiClient";

function FileUpload({ companyId }) {
  const [file, setFile] = useState(null);
  const { uploadFile } = useApiClient();

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");
    await uploadFile(file, companyId);
    alert("✅ Uploaded successfully!");
  };

  return (
    <div
      className="p-6 mt-8 rounded-md"
      style={{ borderColor: "black", borderWidth: "0.5px" }}
    >
      <input
        type="file"
        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        onClick={handleUpload}
        className="mt-4 w-full bg-green-200  hover:bg-green-400 text-black font-medium py-2 px-4 rounded-sm transition-all"
      >
        Upload
      </button>
    </div>
  );
}

export default FileUpload;
