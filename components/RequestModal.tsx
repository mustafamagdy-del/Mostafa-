import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { LeaveType, PermissionType, AnyRequest } from '../types';
import { XMarkIcon } from './icons/Icons';

interface RequestModalProps {
    onClose: () => void;
}

const RequestModal: React.FC<RequestModalProps> = ({ onClose }) => {
    const { addRequest, currentUser } = useAppContext();
    const [requestType, setRequestType] = useState<'Leave' | 'Permission'>('Leave');
    const [leaveType, setLeaveType] = useState<LeaveType>(LeaveType.Regular);
    const [permissionType, setPermissionType] = useState<PermissionType>(PermissionType.Morning);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [date, setDate] = useState('');
    const [reason, setReason] = useState('');

    // Fix: Refactored to avoid TypeScript excess property errors with discriminated unions.
    // Instead of creating an intermediate variable with a broad union type,
    // we now call `addRequest` directly with the correctly typed object literal.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        if (requestType === 'Leave') {
            addRequest({
                userId: currentUser.id,
                type: 'Leave',
                leaveType,
                startDate,
                endDate,
                reason,
                managerId: currentUser.managerId
            });
        } else {
            addRequest({
                userId: currentUser.id,
                type: 'Permission',
                permissionType,
                date,
                reason,
                managerId: currentUser.managerId
            });
        }
        
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">تقديم طلب جديد</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 text-right">نوع الطلب</label>
                        <select
                            value={requestType}
                            onChange={(e) => setRequestType(e.target.value as 'Leave' | 'Permission')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        >
                            <option value="Leave">إجازة</option>
                            <option value="Permission">إذن</option>
                        </select>
                    </div>

                    {requestType === 'Leave' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">نوع الإجازة</label>
                                <select value={leaveType} onChange={e => setLeaveType(e.target.value as LeaveType)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    {Object.values(LeaveType).map(lt => <option key={lt} value={lt}>{lt}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 text-right">من تاريخ</label>
                                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 text-right">إلى تاريخ</label>
                                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                            </div>
                        </>
                    )}

                    {requestType === 'Permission' && (
                         <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">نوع الإذن</label>
                                <select value={permissionType} onChange={e => setPermissionType(e.target.value as PermissionType)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                     {Object.values(PermissionType).map(pt => <option key={pt} value={pt}>{pt}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">التاريخ</label>
                                <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 text-right">السبب</label>
                        <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">إلغاء</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">إرسال الطلب</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestModal;