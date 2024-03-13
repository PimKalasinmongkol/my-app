import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Slidebar from "./Page_admin/Slidebar";
import FirstPage from "./Page_admin/FirstPage";
import MainPage from "./Page_admin/MainPage";
import Login from "./LoginWithGG/Login";
import Profile from "./Page_admin/Profile"
import SubjectTable from "./Page_admin/SubjectTable";
import EditSubject from "./Page_admin/EditSubject";
import ImportSubject from "./Page_admin/ImportSubject";
import ImportRoom from "./Page_admin/ImportRoom";
import UserAll from "./Page_admin/UserAll";
import AddUser from "./Page_admin/AddUser";

import './App.css';

function App() {
  const [stage ,setStage] = useState(0)
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {stage === 1 && <Route path="/FirstPage" element={<FirstPage />} />} {/* แสดง Sidebar สำหรับ Admin */}
        {stage === 0 && <Route path="/FirstPage" element={<FirstPage />} />} {/* แสดง Sidebar สำหรับ Teacher */}
        <Route
          path="/*"
          element=
            {
              <div style={{ display: "flex" }}>
              {stage === 1 && <Slidebar />} {/* แสดง Sidebar สำหรับ Admin */}
              {stage === 0 && <Slidebar />} {/* แสดง Sidebar สำหรับ Teacher */}
              <Routes>
                {/* Admin Pages */}
                <Route path="/Profile" element={<Profile />} />
                <Route path="/MainPage" element={<MainPage />} />
                <Route path="/SubjectTable" element={<SubjectTable />} />
                <Route path="/EditSubject" element={<EditSubject />} />
                <Route path="/ImportSubject" element={<ImportSubject />} />
                <Route path="/ImportRoom" element={<ImportRoom />} />
                <Route path="/UserAll" element={<UserAll />} />
                <Route path="/AddUser" element={<AddUser />} />
              </Routes>
            </div>
            } 
        />
      </Routes>
    </Router>
  );
}

export default App;
