import { NavLink } from "react-router-dom";
import {
  BarChart2, Users, AlertCircle, Tag, Paperclip, MessageSquare, Star,
} from "lucide-react";

export default function AdminSidebar({ isOpen, onLinkClick }) {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded ${
      isActive ? "bg-gray-200 text-[#204c3f] font-semibold" : "text-[#4e4e4e] hover:bg-gray-100"
    }`;

  const sidebarClass = `bg-white shadow-md w-64 h-screen overflow-hidden space-y-2 transition-transform duration-200 fixed md:static z-40 p-4 ${
  isOpen ? "translate-x-0" : "-translate-x-full"
} md:translate-x-0`;

  return (
    <aside className={sidebarClass}>
      <NavLink to="/admin/dashboard" className={linkClass} onClick={onLinkClick}><BarChart2 size={18} /> Dashboard</NavLink>
      <NavLink to="/admin/users" className={linkClass} onClick={onLinkClick}><Users size={18} /> Users</NavLink>
      <NavLink to="/admin/complaints" className={linkClass} onClick={onLinkClick}><AlertCircle size={18} /> Complaints</NavLink>
      <NavLink to="/admin/categories" className={linkClass} onClick={onLinkClick}><Tag size={18} /> Categories</NavLink>
      <NavLink to="/admin/attachments" className={linkClass} onClick={onLinkClick}><Paperclip size={18} /> Attachments</NavLink>
      <NavLink to="/admin/responses" className={linkClass} onClick={onLinkClick}><MessageSquare size={18} /> Responses</NavLink>
      <NavLink to="/admin/ratings" className={linkClass} onClick={onLinkClick}><Star size={18} /> Ratings</NavLink>
    </aside>
  );
}