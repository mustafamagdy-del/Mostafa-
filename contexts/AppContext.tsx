
import React, { createContext, useState, useMemo, ReactNode, useCallback } from 'react';
import { User, AnyRequest, Notification, RequestStatus, LeaveRequest, UserRole } from '../types';
import { USERS, REQUESTS } from '../constants';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  requests: AnyRequest[];
  notifications: Notification[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addRequest: (request: Omit<AnyRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateRequestStatus: (requestId: number, newStatus: RequestStatus, notes?: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (updatedUser: User) => void;
  getNotificationsForUser: (userId: number) => Notification[];
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(USERS);
  const [requests, setRequests] = useState<AnyRequest[]>(REQUESTS);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const login = useCallback((username: string, password: string): boolean => {
    const user = users.find(u => u.name === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, [users]);

  const logout = () => {
    setCurrentUser(null);
  };

  const addNotification = (userId: number, message: string) => {
    const newNotification: Notification = {
      id: Date.now(),
      userId,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const addRequest = (requestData: Omit<AnyRequest, 'id' | 'createdAt' | 'status'>) => {
    if (!currentUser) return;
    const newRequest: AnyRequest = {
      ...requestData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: RequestStatus.Pending,
      managerId: currentUser.managerId,
    } as AnyRequest;
    
    setRequests(prev => [...prev, newRequest]);
    
    // Notify manager
    if (currentUser.managerId) {
       addNotification(currentUser.managerId, `طلب جديد من ${currentUser.name}`);
    } else {
       // Notify HR directly if no manager
       const hrManager = users.find(u => u.role === UserRole.HRManager);
       if (hrManager) {
           addNotification(hrManager.id, `طلب جديد من ${currentUser.name}`);
       }
    }
  };
  
  const updateRequestStatus = (requestId: number, newStatus: RequestStatus, notes: string = '') => {
    let targetRequest: AnyRequest | undefined;
    const updatedRequests = requests.map(r => {
        if (r.id === requestId) {
            targetRequest = r;
            const updated = {...r, status: newStatus};
            if(newStatus === RequestStatus.Rejected) updated.rejectionReason = notes;
            if(currentUser?.role === UserRole.HRManager) updated.hrApprovalNotes = notes;
            if(currentUser?.role === UserRole.Dean) updated.deanApprovalNotes = notes;
            return updated;
        }
        return r;
    });

    if (targetRequest) {
        setRequests(updatedRequests);
        const requestor = users.find(u => u.id === targetRequest!.userId);
        if (requestor) {
            addNotification(requestor.id, `تم تحديث حالة طلبك إلى: ${newStatus}`);
        }

        // Workflow notifications
        if (newStatus === RequestStatus.ManagerApproved) {
            const hrManager = users.find(u => u.role === UserRole.HRManager);
            if (hrManager) addNotification(hrManager.id, `طلب تمت موافقة المدير عليه من ${requestor?.name} بانتظار مراجعتك`);
        }
        if (newStatus === RequestStatus.HRApproved) {
            const dean = users.find(u => u.role === UserRole.Dean);
            if (dean) addNotification(dean.id, `طلب تمت موافقة الموارد البشرية عليه من ${requestor?.name} بانتظار مراجعتك`);
        }
    }
  };


  const addUser = (userData: Omit<User, 'id'>) => {
      const newUser: User = { ...userData, id: Date.now() };
      setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (updatedUser: User) => {
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };
  
  const getNotificationsForUser = (userId: number) => {
      return notifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const contextValue = useMemo(() => ({
    currentUser,
    users,
    requests,
    notifications,
    login,
    logout,
    addRequest,
    updateRequestStatus,
    addUser,
    updateUser,
    getNotificationsForUser
  }), [currentUser, users, requests, notifications, login]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
