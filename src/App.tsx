import { useEffect, useState } from "react";
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

type ScreenKey =
  | "upload"
  | "processing"
  | "analysis"
  | "command"
  | "biometric"
  | "comparison"
  | "findings"
  | "export"
  | "share"
  | "dashboard"
  | "login"
  | "register";

function getScreenFromHash(): ScreenKey {
  const hash = window.location.hash.replace("#", "").trim();
  if (hash === "analysis") return "analysis";
  if (hash === "processing") return "processing";
  if (hash === "command") return "command";
  if (hash === "biometric") return "biometric";
  if (hash === "comparison") return "comparison";
  if (hash === "findings") return "findings";
  if (hash === "export") return "export";
  if (hash === "share") return "share";
  if (hash === "dashboard") return "dashboard";
  if (hash === "login") return "login";
  if (hash === "register") return "register";
  const token = window.localStorage.getItem("opm_auth_token");
  return token ? "dashboard" : "login";
}

export default function App() {
  const [screen, setScreen] = useState<ScreenKey>(() => getScreenFromHash());

  useEffect(() => {
    const handleHashChange = () => setScreen(getScreenFromHash());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <SessionProvider>
      {screen === "analysis" && <AnalysisCompleteScreen />}
      {screen === "processing" && <ProcessingAnalysisScreen />}
      {screen === "command" && <CommandCenterScreen />}
      {screen === "biometric" && <BiometricReportScreen />}
      {screen === "comparison" && <ComparisonSummaryScreen />}
      {screen === "findings" && <FindingsLogReportScreen />}
      {screen === "export" && <IntelligenceReportExportScreen />}
      {screen === "share" && <SecureLinkSharingModalScreen />}
      {screen === "dashboard" && <DashboardScreen />}
      {screen === "login" && <LoginScreen />}
      {screen === "register" && <RegisterScreen />}
      {screen === "upload" && <VideoUploadScreen />}
    </SessionProvider>
  );
}
