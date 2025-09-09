
import { User, UserRole, LeaveType, RequestStatus, AnyRequest, PermissionType } from './types';

export const USERS: User[] = [
  {
    id: 1,
    name: 'أحمد محمود',
    role: UserRole.Employee,
    hireDate: '2020-01-15',
    department: 'قسم تكنولوجيا المعلومات',
    managerId: 3,
    password: '123',
    balances: { regular: 21, casual: 7, previous: 5 },
  },
  {
    id: 2,
    name: 'فاطمة الزهراء',
    role: UserRole.Employee,
    hireDate: '2022-06-01',
    department: 'قسم تكنولوجيا المعلومات',
    managerId: 3,
    password: '123',
    balances: { regular: 15, casual: 7, previous: 0 },
  },
  {
    id: 3,
    name: 'خالد عبد العزيز',
    role: UserRole.DirectManager,
    hireDate: '2018-03-10',
    department: 'قسم تكنولوجيا المعلومات',
    managerId: 4,
    password: '123',
    balances: { regular: 21, casual: 7, previous: 10 },
  },
  {
    id: 4,
    name: 'سارة إبراهيم',
    role: UserRole.HRManager,
    hireDate: '2015-09-20',
    department: 'إدارة الموارد البشرية',
    managerId: 5,
    password: '123',
    balances: { regular: 21, casual: 7, previous: 12 },
  },
  {
    id: 5,
    name: 'محمد علي',
    role: UserRole.Dean,
    hireDate: '2010-02-01',
    department: 'الإدارة العليا',
    password: '123',
    balances: { regular: 30, casual: 7, previous: 25 },
  },
];

export const REQUESTS: AnyRequest[] = [
    {
        id: 1,
        userId: 1,
        type: 'Leave',
        leaveType: LeaveType.Regular,
        startDate: '2024-08-10',
        endDate: '2024-08-12',
        reason: 'إجازة صيفية',
        status: RequestStatus.Pending,
        createdAt: '2024-07-20T10:00:00Z',
        managerId: 3
    },
    {
        id: 2,
        userId: 2,
        type: 'Leave',
        leaveType: LeaveType.Sick,
        startDate: '2024-07-18',
        endDate: '2024-07-19',
        reason: 'وعكة صحية طارئة',
        status: RequestStatus.Pending,
        createdAt: '2024-07-18T09:00:00Z',
    },
     {
        id: 3,
        userId: 3,
        type: 'Permission',
        // Fix: Changed string literal to the correct enum value.
        permissionType: PermissionType.Morning,
        date: '2024-07-22',
        reason: 'موعد طبي',
        status: RequestStatus.Approved,
        createdAt: '2024-07-21T14:00:00Z',
        managerId: 4,
        deanApprovalNotes: "تمت الموافقة"
    }
];

export const ROLES_AR = {
  [UserRole.Employee]: 'موظف',
  [UserRole.DirectManager]: 'مدير مباشر',
  [UserRole.HRManager]: 'مدير موارد بشرية',
  [UserRole.Dean]: 'أمين الكلية',
};