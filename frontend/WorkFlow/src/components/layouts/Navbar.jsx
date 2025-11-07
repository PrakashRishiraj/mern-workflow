import React, { useContext, useEffect, useRef, useState } from "react";
import SideMenu from "./SideMenu";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { UserContext } from "../../context/userContext";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { user } = useContext(UserContext);
  const overlayRef = useRef(null);
  const menuPanelRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpenSideMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock scroll when menu is open (mobile)
  useEffect(() => {
    document.body.style.overflow = openSideMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openSideMenu]);

  // Close if clicked outside (mobile)
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        openSideMenu &&
        menuPanelRef.current &&
        !menuPanelRef.current.contains(e.target) &&
        !menuButtonRef.current.contains(e.target)
      ) {
        setOpenSideMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [openSideMenu]);

  return (
    <header className="sticky z-50">
      {/* Navbar top bar */}
      <nav className="sticky top-0 left-0 right-0 bg-linear-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-indigo-700/20 shadow-lg shadow-indigo-900/20 backdrop-blur-xl md:ml-64 md:w-[calc(100%-16rem)] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side (brand + menu) */}
            <div className="flex items-center gap-4">
              {/* Menu toggle (mobile only) */}
              <button
                ref={menuButtonRef}
                onClick={() => setOpenSideMenu((s) => !s)}
                aria-label="Toggle menu"
                aria-expanded={openSideMenu}
                className="p-2 rounded-lg text-slate-100 hover:bg-slate-800/70 hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 md:hidden"
              >
                {openSideMenu ? (
                  <HiOutlineX className="w-6 h-6" />
                ) : (
                  <HiOutlineMenu className="w-6 h-6" />
                )}
              </button>

              <h1 className="text-2xl font-extrabold bg-linear-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent border-50">
                WorkFlow
              </h1>
            </div>

          </div>
        </div>
      </nav>

      {/* Side Menu (Desktop: always visible | Mobile: overlay mode) */}
      {/* Static sidebar for md+ */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:min-w-64 md:bg-linear-to-b md:from-slate-950 md:via-slate-900 md:to-indigo-950 md:border-r md:border-indigo-700/30 md:shadow-2xl md:shadow-indigo-900/40 md:flex md:flex-col md:items-start">
        <div className="flex-1 w-full">
          <SideMenu activeMenu={activeMenu} />
        </div>
      </aside>

      {/* Mobile overlay side menu */}
      <div
        ref={overlayRef}
        aria-hidden={!openSideMenu}
        className={`fixed inset-0 z-40 transition-opacity duration-300 md:hidden ${
          openSideMenu
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpenSideMenu(false)}
        />

        {/* Panel */}
        <aside
          ref={menuPanelRef}
          role="dialog"
          aria-modal="true"
          className={`absolute left-0 top-0 h-full w-auto min-w-[16rem] bg-linear-to-b from-slate-950 via-slate-900 to-indigo-950 border-r border-indigo-700/30 shadow-2xl shadow-indigo-900/40 transform transition-transform duration-300 ease-out px-3 py-4 ${
            openSideMenu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-2 pb-3 border-b border-indigo-700/30">
            <div>
              <div className="text-sm font-semibold text-indigo-300">
                WorkFlow
              </div>
              <div className="text-xs text-slate-500">Navigation</div>
            </div>
            <button
              onClick={() => setOpenSideMenu(false)}
              className="p-2 rounded-md hover:bg-slate-800/60 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3">
            <SideMenu
              activeMenu={activeMenu}
              closeMenu={() => setOpenSideMenu(false)}
            />
          </div>

          <div className="mt-auto px-2 py-3 border-t border-indigo-700/30 text-xs text-slate-500">
            © {new Date().getFullYear()} WorkFlow. All rights reserved.
          </div>
        </aside>
      </div>
    </header>
  );
};

export default Navbar;
