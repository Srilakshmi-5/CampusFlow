import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile, UserRole } from '@/types';

export const DEMO_PROFILES: Record<UserRole, Profile> = {
  student: {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'student@campusflow.edu',
    full_name: 'Aarav Sharma',
    role: 'student',
    student_id: 'CS-2024-8842',
    department: 'Computer Science & Engineering',
    phone: '+91 98765 43210',
    created_at: new Date().toISOString(),
  },
  kitchen_staff: {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'kitchen@campusflow.edu',
    full_name: 'Chef Vikram Singh',
    role: 'kitchen_staff',
    department: 'Central Dining Operations',
    phone: '+91 98765 43211',
    created_at: new Date().toISOString(),
  },
  librarian: {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'librarian@campusflow.edu',
    full_name: 'Dr. Meenakshi Sundaram',
    role: 'librarian',
    department: 'Central University Library',
    phone: '+91 98765 43212',
    created_at: new Date().toISOString(),
  },
  admin_staff: {
    id: '44444444-4444-4444-4444-444444444444',
    email: 'adminstaff@campusflow.edu',
    full_name: 'Officer Rajesh Varma',
    role: 'admin_staff',
    department: 'Academic Registry & Certification',
    phone: '+91 98765 43213',
    created_at: new Date().toISOString(),
  },
  fees_staff: {
    id: '55555555-5555-5555-5555-555555555555',
    email: 'fees@campusflow.edu',
    full_name: 'Accounts Desk Sunita',
    role: 'fees_staff',
    department: 'Bursar & Finance Office',
    phone: '+91 98765 43214',
    created_at: new Date().toISOString(),
  },
  super_admin: {
    id: '66666666-6666-6666-6666-666666666666',
    email: 'superadmin@campusflow.edu',
    full_name: 'Prof. K. Venkatesh (Provost)',
    role: 'super_admin',
    department: 'Campus Administration & Dean of Ops',
    phone: '+91 98765 43215',
    created_at: new Date().toISOString(),
  },
};

interface AuthState {
  currentUser: Profile;
  isAuthenticated: boolean;
  setRole: (role: UserRole) => void;
  setUser: (profile: Profile) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: DEMO_PROFILES.student,
      isAuthenticated: true,
      setRole: (role: UserRole) => {
        set({ currentUser: DEMO_PROFILES[role], isAuthenticated: true });
      },
      setUser: (profile: Profile) => {
        set({ currentUser: profile, isAuthenticated: true });
      },
      signOut: () => {
        set({ currentUser: DEMO_PROFILES.student, isAuthenticated: false });
      },
    }),
    {
      name: 'campusflow-auth-storage',
    }
  )
);
