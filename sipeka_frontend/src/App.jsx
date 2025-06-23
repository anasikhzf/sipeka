import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import AdminDashboard from "./pages/AdminDashboard";
// import UserDashboard from "./pages/UserDashboard";
import Dashboard from "./pages/admin/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import Categories from "./pages/admin/Categories/Categories";
import Users from "./pages/admin/Users";
import Complaints from "./pages/admin/Complaints";
import Responses from "./pages/admin/Responses";
import Ratings from "./pages/admin/Ratings";
import Attachments from "./pages/admin/Attachments";
import UserLayout from "./layouts/UserLayout";
import UserDashboard from "./pages/public/Dashboard";
import UserComplaints from "./pages/public/Complaints";
// import UserRatings from "./pages/public/Ratings";
import UserProfile from "./pages/public/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
        </Route>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<Dashboard/>} />
                <Route path="categories" element={<Categories />} />
                <Route path="users" element={<Users />} />
                <Route path="complaints" element={<Complaints />} />
                <Route path="responses" element={<Responses />} />
                <Route path="ratings" element={<Ratings />} />
                <Route path="attachments" element={<Attachments />} />

                {/* Tambahkan route lain sesuai kebutuhan */}
              </Routes>
            </AdminLayout>
          }
        />

        <Route path="/user" element={<UserLayout />}>
          <Route path="home" element={<UserDashboard />} />
          <Route path="complaints" element={<UserComplaints />} />
          {/* <Route path="ratings" element={<UserRatings />} /> */}
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* <Route path="/user" element={<UserDashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
