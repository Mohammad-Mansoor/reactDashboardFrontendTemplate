import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/Common/ScrollToTop";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import PublicRoute from "./components/Common/PublicRoute";
import Home from "./pages/Dashboard/Home";
import ComponentsPage from "./pages/ComponentsPage";
import Login from "./pages/AuthPages/Login";
import FilterTestPage from "./pages/FilterTestPage";
import PremiumTableDemo from "./pages/PremiumTableDemo";
import { PermissionsProvider } from "./context/PermissionsContext";
import { ViewTransitionManager } from "./components/Navigation/ViewTransitionManager";
import ItemListPage from "./pages/Demo/ItemListPage";
import ItemDetailPage from "./pages/Demo/ItemDetailPage";
import ModulePlaceholder from "./pages/OtherPage/ModulePlaceholder";

// Forgot Password Flow
import ForgotPassword from "./auth/pages/ForgotPassword";
import VerifyOtp from "./auth/pages/VerifyOtp";
import ResetPassword from "./auth/pages/ResetPassword";
import { useInitializeApp } from "./hooks/useInitializeApp";

export default function App() {
  useInitializeApp();
  return (
    <PermissionsProvider>
      <Router>
        <ScrollToTop />
        <ViewTransitionManager>
          {(location) => (
            <Routes location={location}>
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route index element={<Home />} />
                  <Route path="/components" element={<ComponentsPage />} />
                  <Route path="/filter-test" element={<FilterTestPage />} />
                  <Route path="/table-demo" element={<PremiumTableDemo />} />
                  <Route path="/demo/items" element={<ItemListPage />} />
                  <Route path="/demo/items/:id" element={<ItemDetailPage />} />
                  
                  {/* Sidebar Placeholders */}
                  <Route path="/users/patients" element={<ModulePlaceholder />} />
                  <Route path="/users/roles" element={<ModulePlaceholder />} />
                  <Route path="/settings/account/security" element={<ModulePlaceholder />} />
                  <Route path="/settings/account/sessions" element={<ModulePlaceholder />} />
                  <Route path="/settings/general" element={<ModulePlaceholder />} />
                  <Route path="/reports" element={<ModulePlaceholder />} />
                  <Route path="/docs" element={<ModulePlaceholder />} />
                </Route>
              </Route>
              <Route element={<PublicRoute />}>
                <Route path="/signin" element={<Login />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </ViewTransitionManager>
      </Router>
    </PermissionsProvider>
  );
}
