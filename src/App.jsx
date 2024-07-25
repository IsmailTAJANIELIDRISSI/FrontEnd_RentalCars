import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import ProtectedRoute from "./pages/auth/interceptors/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={[2000]} />}>
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Route>
      {/* Public routes */}
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
}

export default App;
