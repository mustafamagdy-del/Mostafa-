
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { AnyRequest, RequestStatus, UserRole } from '../types';

// Simple modal for approve/reject actions
const ActionModal: React.FC<{
    request: AnyRequest;
    action: 'approve' | 'reject';
    onClose: () => void;
    onSubmit: (requestId: number, notes: string) => void;
}> = ({ request, action, onClose, onSubmit }) => {
    const [notes, setNotes] = useState('');
    const title = action === 'approve' ? 'ملاحظات الموافقة' : 'سبب الرفض';

    const handleSubmit = () => {
        onSubmit(request.id, notes);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded-md"
                    placeholder={action === 'reject' ? 'السبب مطلوب...' : 'ملاحظات (اختياري)...'}
                ></textarea>
                <div className="flex justify-end space-x-3 mt-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">إلغاء</button>
                    <button onClick={handleSubmit} disabled={action === 'reject' && !notes} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                        تأكيد
                    </button>
                </div>
            </div>
        </div>
    );
};

const TeamRequestsPage: React.FC = () => {
    const { currentUser, requests, users, updateRequestStatus } = useAppContext();
    const [selectedRequest, setSelectedRequest] = useState<AnyRequest | null>(null);
    const [action, setAction] = useState<'approve' | 'reject' | null>(null);

    const teamRequests = useMemo(() => {
        if (!currentUser) return [];
        
        const isHR = currentUser.role === UserRole.HRManager;
        const isDean = currentUser.role === UserRole.Dean;

        return requests
            .filter(r => {
                if(isDean) {
                    // Dean sees requests approved by HR
                    return r.status === RequestStatus.HRApproved;
                }
                if (isHR) {
                    // HR sees requests approved by manager, or requests without a manager
                    const requestor = users.find(u => u.id === r.userId);
                    return r.status === RequestStatus.ManagerApproved || (r.status === RequestStatus.Pending && !requestor?.managerId);
                }
                // Direct manager sees pending requests from their team
                return r.managerId === currentUser.id && r.status === RequestStatus.Pending;
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [currentUser, requests, users]);

    const getUserName = (userId: number) => users.find(u => u.id === userId)?.name || 'غير معروف';

    const handleAction = (request: AnyRequest, newAction: 'approve' | 'reject') => {
        setSelectedRequest(request);
        setAction(newAction);
    };

    const handleSubmitAction = (requestId: number, notes: string) => {
        if (!currentUser) return;
        
        let newStatus: RequestStatus;
        if (action === 'approve') {
            if (currentUser.role === UserRole.DirectManager) newStatus = RequestStatus.ManagerApproved;
            else if (currentUser.role === UserRole.HRManager) newStatus = RequestStatus.HRApproved;
            else newStatus = RequestStatus.Approved; // Dean's approval is final
        } else {
            newStatus = RequestStatus.Rejected;
        }

        updateRequestStatus(requestId, newStatus, notes);
        setSelectedRequest(null);
        setAction(null);
    };
    
    const getRequestTypeDisplay = (request: AnyRequest) => {
        if (request.type === 'Leave') return `إجازة ${request.leaveType}`;
        return `إذن ${request.permissionType}`;
    }

    const getRequestDateDisplay = (request: AnyRequest) => {
        if (request.type === 'Leave') return `${request.startDate} إلى ${request.endDate}`;
        return request.date;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">طلبات الفريق</h1>
            
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">اسم الموظف</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نوع الطلب</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">السبب</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 [&>tr:nth-child(even)]:bg-gray-50">
                            {teamRequests.map(request => (
                                <tr key={request.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getUserName(request.userId)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getRequestTypeDisplay(request)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getRequestDateDisplay(request)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{request.reason}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                        <button onClick={() => handleAction(request, 'approve')} className="text-green-600 hover:text-green-900">موافقة</button>
                                        <button onClick={() => handleAction(request, 'reject')} className="text-red-600 hover:text-red-900">رفض</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {teamRequests.length === 0 && (
                        <p className="text-center p-4 text-gray-500">لا يوجد طلبات للمراجعة حالياً.</p>
                    )}
                </div>
            </div>

            {selectedRequest && action && (
                <ActionModal
                    request={selectedRequest}
                    action={action}
                    onClose={() => {
                        setSelectedRequest(null);
                        setAction(null);
                    }}
                    onSubmit={handleSubmitAction}
                />
            )}
        </div>
    );
};

export default TeamRequestsPage;
