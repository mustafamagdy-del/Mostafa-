
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { User, UserRole } from '../types';
import UserManagementModal from '../components/UserManagementModal';
import { PlusIcon } from '../components/icons/Icons';

const UserManagementPage: React.FC = () => {
    // Fix: Removed 'managers' as it does not exist on the AppContextType.
    const { users } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">إدارة المستخدمين</h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PlusIcon />
                    <span>إضافة مستخدم جديد</span>
                </button>
            </div>
            
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الاسم</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الدور</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">القسم</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ التعيين</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 [&>tr:nth-child(even)]:bg-gray-50">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.department}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.hireDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900">تعديل</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isModalOpen && <UserManagementModal user={editingUser} onClose={handleCloseModal} />}
        </div>
    );
};

export default UserManagementPage;
