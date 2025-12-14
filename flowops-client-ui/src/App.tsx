import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppSidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employee";

const App = () => {
  return (
    <BrowserRouter>
      <AppSidebar>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
        </Routes>
      </AppSidebar>
    </BrowserRouter>
  );
};

export default App;
