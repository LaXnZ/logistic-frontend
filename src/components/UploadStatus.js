import React, { useEffect, useState } from "react";
import { useApiClient } from "../api/apiClient";

function UploadStatus() {
  const [status, setStatus] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const { fetchStatus, fetchCompanies } = useApiClient();

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const res = await fetchCompanies();
        const body = typeof res.data.body === "string"
          ? JSON.parse(res.data.body)
          : res.data.body;
        const list = body?.companies || [];
        setCompanies(list);
      } catch (err) {
        console.error("❌ Error loading companies:", err);
      }
    };
    loadCompanies();
  }, []);

  useEffect(() => {
    const loadStatus = async () => {
      if (!selectedCompany) return;
      try {
        const res = await fetchStatus(selectedCompany);
        const parsed = typeof res.data.body === "string"
          ? JSON.parse(res.data.body)
          : res.data.body;
        setStatus(parsed);
      } catch (err) {
        console.error("❌ Error loading upload status:", err);
        setStatus(null);
      }
    };
    loadStatus();
  }, [selectedCompany]);

  return (
    <div>
      <h4>Latest Upload</h4>

      <label>
        Select Company:{" "}
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="">-- Choose a company --</option>
          {companies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      {selectedCompany && status ? (
        <pre>{JSON.stringify(status, null, 2)}</pre>
      ) : selectedCompany ? (
        <p>Loading...</p>
      ) : (
        <p>Please select a company.</p>
      )}
    </div>
  );
}

export default UploadStatus;
