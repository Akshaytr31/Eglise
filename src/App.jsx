import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import FamilyPage from "./pages/FamilyPage";
import WardPage from "./pages/WardPage";
import GradePage from "./pages/GradePage";
import RelationshipPage from "./pages/RelationshipPage";
import MembersPage from "./pages/MembersPage";
import MemberDetailsPage from "./pages/MemberDetailsPage";
import authService from "./auth/authService";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import BaptismPage from "./pages/BaptismPage";
import ChurchInfoPage from "./pages/ChurchInfoPage";
import PreAnnouncementPage from "./pages/PreAnnouncementPage";
import MarriagePage from "./pages/MarriagePage";
import TombTypePage from "./pages/TombTypePage";

const ProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Debug: Moved change-password route up */}
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/family"
          element={
            <ProtectedRoute>
              <FamilyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ward"
          element={
            <ProtectedRoute>
              <WardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grade"
          element={
            <ProtectedRoute>
              <GradePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/relationship"
          element={
            <ProtectedRoute>
              <RelationshipPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members"
          element={
            <ProtectedRoute>
              <MembersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members/:headId"
          element={
            <ProtectedRoute>
              <MemberDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/baptism"
          element={
            <ProtectedRoute>
              <BaptismPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/church-info"
          element={
            <ProtectedRoute>
              <ChurchInfoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pre-announcement"
          element={
            <ProtectedRoute>
              <PreAnnouncementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marriage"
          element={
            <ProtectedRoute>
              <MarriagePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tomb-type"
          element={
            <ProtectedRoute>
              <TombTypePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
