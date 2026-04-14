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

export default function App() {
  return (
    <PermissionsProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="/components" element={<ComponentsPage />} />
              <Route path="/filter-test" element={<FilterTestPage />} />
              <Route path="/table-demo" element={<PremiumTableDemo />} />
            </Route>
          </Route>
          <Route element={<PublicRoute />}>
            <Route path="/signin" element={<Login />} />
            <Route path="/auth/login" element={<Login />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </PermissionsProvider>
  );
}
