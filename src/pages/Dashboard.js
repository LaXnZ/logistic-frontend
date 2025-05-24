import React from "react";
import FileUpload from "../components/FileUpload";
import UploadStatus from "../components/UploadStatus";
import RecordsViewer from "../components/RecordsViewer";
import { useAuth } from "react-oidc-context";
import AdminDashboard from "../components/AdminDashboard";

function Dashboard() {
  const auth = useAuth();
  const companyId = auth.user?.profile.email.split("@")[1].split(".")[0];

  return (
    <div>
      <h2>Welcome, {auth.user?.profile.email}</h2>
      <FileUpload companyId={companyId} />
      <RecordsViewer user={auth.user?.profile} />  
      <AdminDashboard companyId={companyId} /> 
    </div>
  );
}

export default Dashboard;
