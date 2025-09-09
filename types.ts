
export enum UserRole {
  Employee = 'موظف',
  DirectManager = 'مدير مباشر',
  HRManager = 'مدير موارد بشرية',
  Dean = 'أمين الكلية',
}

export enum LeaveType {
  Regular = 'اعتيادية',
  Casual = 'عارضة',
  Sick = 'مرضية',
  Unpaid = 'بدون أجر',
}

export enum PermissionType {
    Morning = 'صباحي',
    Afternoon = 'مسائي',
}

export enum RequestStatus {
  Pending = 'قيد المراجعة',
  ManagerApproved = 'موافقة المدير المباشر',
  HRApproved = 'موافقة الموارد البشرية',
  Approved = 'مقبول',
  Rejected = 'مرفوض',
}

export interface UserBalances {
  regular: number;
  casual: number;
  previous: number;
}

export interface User {
  id: number;
  name: string;
  role: UserRole;
  hireDate: string;
  department: string;
  managerId?: number;
  password: string; // In a real app, this would be hashed
  balances: UserBalances;
}

interface BaseRequest {
  id: number;
  userId: number;
  status: RequestStatus;
  createdAt: string;
  reason: string;
  managerId?: number;
  rejectionReason?: string;
  hrApprovalNotes?: string;
  deanApprovalNotes?: string;
}

export interface LeaveRequest extends BaseRequest {
  type: 'Leave';
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
}

export interface PermissionRequest extends BaseRequest {
  type: 'Permission';
  permissionType: PermissionType;
  date: string;
}

export type AnyRequest = LeaveRequest | PermissionRequest;

export interface Notification {
  id: number;
  userId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}
