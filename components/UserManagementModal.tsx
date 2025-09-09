
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { User, UserRole } from '../types';
import { XMarkIcon } from './icons/Icons';

interface UserManagementModalProps {
  user: User | null;
  onClose: () => void;
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({ user, onClose }) => {
  const { addUser, updateUser, users } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    role: UserRole.Employee,
    hireDate: '',
    department: '',
    managerId: '',
    password: '123', // Default mock password
    balances: { regular: 0, casual: 7, previous: 0 },
  });

  const managers = users.filter(u => u.role === UserRole.DirectManager || u.role === UserRole.HRManager || u.role === UserRole.Dean);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        role: user.role,
        hireDate: user.hireDate,
        department: user.department,
        managerId: user.managerId?.toString() || '',
        password: user.password || '123',
        balances: { ...user.balances }
      });
    }
  }, [user]);

  const calculateDefaultRegularBalance = (hireDate: string) => {
    if (!hireDate) return 0;
    const yearsOfService = new Date().getFullYear() - new Date(hireDate).getFullYear();
    if (yearsOfService >= 10) return 30;
    if (yearsOfService >= 1) return 21;
    return 15;
  };

  const handleHireDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHireDate = e.target.value;
    const newRegularBalance = calculateDefaultRegularBalance(newHireDate);
    setFormData(prev => ({
      ...prev,
      hireDate: newHireDate,
      balances: { ...prev.balances, regular: newRegularBalance }
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      balances: { ...prev.balances, [name]: parseInt(value) || 0 }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
        ...formData,
        managerId: formData.managerId ? parseInt(formData.managerId) : undefined,
    };
    if (user) {
        updateUser({ ...user, ...submissionData });
    } else {
        addUser(submissionData);
    }
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">{user ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon />
            </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 text-right">الاسم</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 text-right">الدور</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 text-right">القسم</label>
                    <input type="text" name="department" value={formData.department} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 text-right">المدير المباشر</label>
                    <select name="managerId" value={formData.managerId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        <option value="">لا يوجد</option>
                        {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 text-right">تاريخ التعيين</label>
                    <input type="date" name="hireDate" value={formData.hireDate} onChange={handleHireDateChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 text-right">كلمة المرور (مؤقتة)</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
            </div>
            <fieldset className="border p-4 rounded-md">
                <legend className="text-lg font-medium text-gray-900 px-2">تعديل أرصدة الإجازات</legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 text-right">اعتيادي</label>
                        <input type="number" name="regular" value={formData.balances.regular} onChange={handleBalanceChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 text-right">عارضة</label>
                        <input type="number" name="casual" value={formData.balances.casual} onChange={handleBalanceChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 text-right">سابق</label>
                        <input type="number" name="previous" value={formData.balances.previous} onChange={handleBalanceChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                </div>
            </fieldset>

            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">حفظ التغييرات</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagementModal;
