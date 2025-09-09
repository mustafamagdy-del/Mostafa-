
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { UserRole } from '../types';
import { DashboardIcon, RequestsIcon, TeamIcon, UsersIcon } from './icons/Icons';

const Sidebar: React.FC = () => {
  const { currentUser } = useAppContext();

  const commonLinks = [
    { to: '/dashboard', icon: <DashboardIcon />, label: 'لوحة التحكم' },
    { to: '/my-requests', icon: <RequestsIcon />, label: 'طلباتي' },
  ];

  const managerLinks = [
    { to: '/team-requests', icon: <TeamIcon />, label: 'طلبات الفريق' },
  ];

  const hrLinks = [
    { to: '/user-management', icon: <UsersIcon />, label: 'إدارة المستخدمين' },
  ];

  let links = [...commonLinks];
  if (currentUser?.role === UserRole.DirectManager || currentUser?.role === UserRole.HRManager || currentUser?.role === UserRole.Dean) {
    links = [...links, ...managerLinks];
  }
  if (currentUser?.role === UserRole.HRManager) {
    links = [...links, ...hrLinks];
  }

  const linkClass = "flex items-center px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-white transition-colors duration-200 rounded-md";
  const activeLinkClass = "bg-slate-700 text-white font-semibold";

  return (
    <aside className="w-64 bg-slate-800 text-white flex-shrink-0 flex flex-col">
      <div className="h-20 flex items-center justify-center bg-slate-900">
        <h1 className="text-2xl font-bold tracking-wider">نظام HR</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
          >
            {link.icon}
            <span className="mr-3">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
