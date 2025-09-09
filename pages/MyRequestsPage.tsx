
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { AnyRequest, RequestStatus } from '../types';
import RequestModal from '../components/RequestModal';
import { PlusIcon } from '../components/icons/Icons';

const MyRequestsPage: React.FC = () => {
    const { currentUser, requests } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const myRequests = useMemo(() => {
        if (!currentUser) return [];
        return requests.filter(r => r.userId === currentUser.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [currentUser, requests]);

    const getStatusChipColor = (status: RequestStatus) => {
        switch (status) {
            case RequestStatus.Approved:
            case RequestStatus.HRApproved:
            case RequestStatus.ManagerApproved:
                return 'bg-green-100 text-green-800';
            case RequestStatus.Pending:
                return 'bg-yellow-100 text-yellow-800';
            case RequestStatus.Rejected:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRequestTypeDisplay = (request: AnyRequest) => {
        if (request.type === 'Leave') {
            return `إجازة ${request.leaveType}`;
        }
        return `إذن ${request.permissionType}`;
    }

    const getRequestDateDisplay = (request: AnyRequest) => {
        if (request.type === 'Leave') {
            return `${request.startDate} إلى ${request.endDate}`;
        }
        return request.date;
    }
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">طلباتي</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PlusIcon />
                    <span>تقديم طلب جديد</span>
                </button>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نوع الطلب</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ الإنشاء</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 [&>tr:nth-child(even)]:bg-gray-50">
                            {myRequests.map(request => (
                                <tr key={request.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getRequestTypeDisplay(request)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getRequestDateDisplay(request)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(request.createdAt).toLocaleDateString('ar-EG')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChipColor(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {myRequests.length === 0 && (
                        <p className="text-center p-4 text-gray-500">لا يوجد طلبات حالياً.</p>
                    )}
                </div>
            </div>

            {isModalOpen && <RequestModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default MyRequestsPage;
