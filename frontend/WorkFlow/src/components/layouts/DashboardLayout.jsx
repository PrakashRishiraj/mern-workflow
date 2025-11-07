import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <Navbar activeMenu={activeMenu} />

      {/* Main Content */}
      {user && (
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="hidden lg:block border-r border-border bg-card/50 backdrop-blur-sm">
            <SideMenu activeMenu={activeMenu} />
          </div>

          {/* Main Section */}
          <div
            className="flex-1 mx-4 lg:mx-6 my-4 lg:my-6 rounded-xl 
            bg-card/30 border border-border shadow-sm 
            p-4 lg:p-6 overflow-y-auto"
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
