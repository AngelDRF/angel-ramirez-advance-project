"use client";

import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";
import React, { useRef, useEffect } from "react";
import SideBar from "./SideBar";

const Bar: React.FC = () => {
  const pathname = usePathname();

  const isRootOrChoosePlan =
    pathname === "/" || pathname === "/choose-planPage";

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const handleToggleSidebar = () => {
    if (sidebarRef.current) {
      if (sidebarRef.current.classList.contains("sidebar")) {
        sidebarRef.current.className = "sidebar--open";
      } else {
        sidebarRef.current.className = "sidebar";
      }
    }

    if (overlayRef.current) {
      overlayRef.current.classList.toggle("sidebar__overlay--hidden");
    }
  };

  const handleResize = () => {
    if (window.innerWidth > 768) {
      if (sidebarRef.current) {
        sidebarRef.current.className = "sidebar";
      }

      if (overlayRef.current) {
        overlayRef.current.classList.add("sidebar__overlay--hidden");
      }
    }
  };

  const handleLinkClick = () => {
    if (sidebarRef.current) {
      sidebarRef.current.className = "sidebar";
    }

    if (overlayRef.current) {
      overlayRef.current.classList.add("sidebar__overlay--hidden");
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {!isRootOrChoosePlan && (
        <>
          <SearchBar handleToggleSidebar={handleToggleSidebar} />
          <SideBar ref={sidebarRef} onLinkClick={handleLinkClick} />
        </>
      )}

      {!isRootOrChoosePlan && (
        <div
          ref={overlayRef}
          className="sidebar__overlay sidebar__overlay--hidden"
        />
      )}

      {!isRootOrChoosePlan && (
        <button
          className="sidebar__toggle--btn"
          onClick={handleToggleSidebar}
        ></button>
      )}
    </>
  );
};

export default Bar;
