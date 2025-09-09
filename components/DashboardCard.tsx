
import React, { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, iconBgColor }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${iconBgColor}`}>
        {icon}
      </div>
    </div>
  );
};

export default DashboardCard;
