import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AnalysisCompleteScreen from "@/screens/AnalysisCompleteScreen";
import BiometricReportScreen from "@/screens/BiometricReportScreen";
import CommandCenterScreen from "@/screens/CommandCenterScreen";
import ComparisonSummaryScreen from "@/screens/ComparisonSummaryScreen";
import DashboardScreen from "@/screens/DashboardScreen";
import FindingsLogReportScreen from "@/screens/FindingsLogReportScreen";
import IntelligenceReportExportScreen from "@/screens/IntelligenceReportExportScreen";
import ProcessingAnalysisScreen from "@/screens/ProcessingAnalysisScreen";
import LoginScreen from "@/screens/LoginScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import SecureLinkSharingModalScreen from "@/screens/SecureLinkSharingModalScreen";
import VideoUploadScreen from "@/screens/VideoUploadScreen";
import { SessionProvider } from "@/context/SessionContext";

function RootRedirect() {
  const token = window.localStorage.getItem("opm_auth_token");
  return <Navigate to={token ? "/dashboard" : "/login"} replace />;
}

export default function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/upload" element={<VideoUploadScreen />} />
          <Route path="/processing" element={<ProcessingAnalysisScreen />} />
          <Route path="/analysis" element={<AnalysisCompleteScreen />} />
          <Route path="/session/:sessionId" element={<CommandCenterScreen />} />
          <Route
            path="/session/:sessionId/comparison"
            element={<ComparisonSummaryScreen />}
          />
          <Route
            path="/session/:sessionId/biometric"
            element={<BiometricReportScreen />}
          />
          <Route
            path="/session/:sessionId/findings"
            element={<FindingsLogReportScreen />}
          />
          <Route
            path="/session/:sessionId/export"
            element={<IntelligenceReportExportScreen />}
          />
          <Route
            path="/session/:sessionId/share"
            element={<SecureLinkSharingModalScreen />}
          />
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
}
