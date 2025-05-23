import React, { useState } from "react";
import { useApiClient } from "../api/apiClient";

function FileUpload({ companyId }) {
  const [file, setFile] = useState(null);
  const { uploadFile } = useApiClient();

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");
    await uploadFile(file, companyId);
    alert("Uploaded successfully!");
  };

  return (
    <div>
      <h3>Upload Excel File</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default FileUpload;
