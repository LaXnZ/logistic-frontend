import React, { useEffect, useState } from "react";
import { useApiClient } from "../api/apiClient";

function RecordsViewer() {
  const [records, setRecords] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const { fetchRecords, fetchCompanies } = useApiClient();

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
    <div
      className="p-6 mt-8 rounded-md"
      style={{ borderColor: "black", borderWidth: "0.5px" }}
    >
      <div className="flex items-center gap-3 mb-4">
        <label className="text-gray-700 font-medium whitespace-nowrap">
          Select Company:
        </label>
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="flex-1 border border-gray-300 rounded-sm p-2 focus:ring-2 focus:ring-blue-500"
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
      </div>

      {!selectedCompany ? (
        <p className="text-gray-600">
          Please select a company to view records.
        </p>
      ) : records.length === 0 ? (
        <p className="text-gray-600">No records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table
            className="w-full text-left rounded-sm"
            style={{ border: "0.5px solid black" }}
          >
            <thead
              className="bg-gray-100 text-gray-700"
              style={{ borderColor: "black", borderWidth: "0.5px" }}
            >
              <tr>
                <th
                  className="px-4 py-2 border-b"
                  style={{ borderColor: "black", borderWidth: "0.5px" }}
                >
                  Driver ID
                </th>
                <th
                  className="px-4 py-2 border-b"
                  style={{ borderColor: "black", borderWidth: "0.5px" }}
                >
                  Route
                </th>
                <th
                  className="px-4 py-2 border-b"
                  style={{ borderColor: "black", borderWidth: "0.5px" }}
                >
                  Status
                </th>
                <th
                  className="px-4 py-2 border-b"
                  style={{ borderColor: "black", borderWidth: "0.5px" }}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i} className="hover:bg-blue-50 transition-colors">
                  <td
                    className="px-4 py-2 border-b"
                    style={{ borderColor: "black", borderWidth: "0.5px" }}
                  >
                    {r.DriverID}
                  </td>
                  <td
                    className="px-4 py-2 border-b"
                    style={{ borderColor: "black", borderWidth: "0.5px" }}
                  >
                    {r.Route}
                  </td>
                  <td
                    className="px-4 py-2 border-b"
                    style={{ borderColor: "black", borderWidth: "0.5px" }}
                  >
                    {r.DeliveryStatus}
                  </td>
                  <td
                    className="px-4 py-2 border-b"
                    style={{ borderColor: "black", borderWidth: "0.5px" }}
                  >
                    {r.DeliveryDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecordsViewer;
