import React, { useEffect, useState } from "react";
import { useApiClient } from "../api/apiClient";

function RecordsViewer() {
  const [records, setRecords] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(""); // No default selection
  const { fetchRecords, fetchCompanies } = useApiClient();

  // Load company list once
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const res = await fetchCompanies();
        const body =
          typeof res.data.body === "string"
            ? JSON.parse(res.data.body)
            : res.data.body;
        const list = body?.companies || [];

        if (Array.isArray(list)) {
          setCompanies(list);
        }
      } catch (err) {
        console.error("❌ Error loading companies:", err);
      }
    };

    loadCompanies();
  }, []);

  // Load records only when a company is selected
  useEffect(() => {
    const loadRecords = async () => {
      if (!selectedCompany) return;
      console.log("📡 Fetching records for:", selectedCompany);

      try {
        const res = await fetchRecords(selectedCompany);

        const parsed = (() => {
          if (res.data.records) return res.data;
          if (typeof res.data.body === "string")
            return JSON.parse(res.data.body);
          return res.data.body || {};
        })();

        setRecords(parsed.records || []);
      } catch (err) {
        console.error("❌ Error fetching records:", err);
        setRecords([]);
      }
    };

    loadRecords();
  }, [selectedCompany]);

  return (
    <div>
      <h4>Processed Records</h4>

      <label>
        Select Company:{" "}
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="" disabled>
            -- Choose a company --
          </option>
          {companies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>
      </label>

      {!selectedCompany ? (
        <p style={{ marginTop: "1rem" }}>Please select a company to view records.</p>
      ) : records.length === 0 ? (
        <p style={{ marginTop: "1rem" }}>No records found.</p>
      ) : (
        <table
          border="1"
          style={{ marginTop: "1rem", width: "100%", textAlign: "left" }}
        >
          <thead>
            <tr>
              <th>Driver ID</th>
              <th>Route</th>
              <th>Status</th>
              <th>Date</th>
           
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i}>
                <td>{r.DriverID}</td>
                <td>{r.Route}</td>
                <td>{r.DeliveryStatus}</td>
                <td>{r.DeliveryDate}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RecordsViewer;
