import React, { useEffect, useState } from "react";
import { useApiClient } from "../api/apiClient";

function UploadStatus({ companyId }) {
  const [status, setStatus] = useState(null);
  const { fetchStatus } = useApiClient();

  useEffect(() => {
    fetchStatus(companyId).then((res) => setStatus(res.data));
  }, [companyId]);
  
  return (
    <div>
      <h4>Latest Upload</h4>
      {status ? (
        <pre>{JSON.stringify(status, null, 2)}</pre>
      ) : (
        "Loading..."
      )}
    </div>
  );
}

export default UploadStatus;
