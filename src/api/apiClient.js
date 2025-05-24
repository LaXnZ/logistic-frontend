import axios from "axios";
import { useAuth } from "react-oidc-context";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useApiClient = () => {
  const auth = useAuth();

  const getAuthHeader = () => {
    const token = auth.user?.id_token;
    if (!token) {
      console.warn("⚠️ No ID token found. Using no auth header.");
      return {};
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchCompanies = () =>
  axios.get(`${API_BASE_URL}/companies`, {
    headers: getAuthHeader(),
  });

  const uploadFile = async (file, companyId) => {
    const base64File = await fileToBase64(file);
    return axios.post(
      `${API_BASE_URL}/upload`,
      {
        filename: file.name,
        file_data: base64File,
        company_id: companyId,
      },
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );
  };

  const fetchStatus = (companyId) =>
    axios.get(`${API_BASE_URL}/status`, {
      headers: getAuthHeader(),
      params: { company_id: companyId },
    });

  const fetchRecords = (companyId) => {
    console.log("🛰️ Calling fetchRecords with:", companyId);
    return axios.get(`${API_BASE_URL}/records`, {
      headers: getAuthHeader(),
      params: { company_id: companyId },
    });
  };

  return { uploadFile, fetchStatus, fetchRecords, fetchCompanies };
};

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });
