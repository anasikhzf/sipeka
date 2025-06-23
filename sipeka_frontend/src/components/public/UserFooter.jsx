import React from "react";
import { NavLink } from "react-router-dom";

export default function UserFooter() {
  const linkClass = "text-[#eaeaea] font-bold hover:text-white";

  return (
    <footer className="bg-[#141414] py-6 px-4 mt-auto">
      <p className="text-[#a9a9a9] text-sm border-t pt-2 pl-5" style={{ borderTopColor: "#373737" }}>2025. SiPeka All Rights Reserved</p>
    </footer>
  );
}