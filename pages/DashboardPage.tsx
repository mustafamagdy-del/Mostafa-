import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import DashboardCard from '../components/DashboardCard';
import { CalendarIcon, BriefcaseIcon, RequestsIcon } from '../components/icons/Icons';
import { RequestStatus } from '../types';

const DashboardPage: React.FC = () => {
  const { currentUser, requests } = useAppContext();

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const pendingRequestsCount = requests.filter(
    r => r.userId === currentUser.id && r.status === RequestStatus.Pending
  ).length;

  const { balances } = currentUser;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">لوحة التحكم</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="رصيد الإجازات الاعتيادية"
          value={balances.regular}
          icon={<CalendarIcon className="text-blue-600" />}
          iconBgColor="bg-blue-100"
        />
        <DashboardCard
          title="رصيد الإجازات العارضة"
          value={balances.casual}
          icon={<BriefcaseIcon className="text-green-600" />}
          iconBgColor="bg-green-100"
        />
        <DashboardCard
          title="الرصيد السابق"
          value={balances.previous}
          icon={<CalendarIcon className="text-yellow-600" />}
          iconBgColor="bg-yellow-100"
        />
        <DashboardCard
          title="طلبات قيد المراجعة"
          value={pendingRequestsCount}
          icon={<RequestsIcon className="text-purple-600 h-8 w-8" />}
          iconBgColor="bg-purple-100"
        />
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">ملخص سريع</h2>
        <p className="text-gray-600 leading-relaxed">
            مرحباً بك في نظام إدارة الموارد البشرية. من هنا يمكنك متابعة أرصدة إجازاتك، تقديم طلبات جديدة، ومتابعة حالة طلباتك السابقة بكل سهولة.
        </p>
      </div>

    </div>
  );
};

export default DashboardPage;
