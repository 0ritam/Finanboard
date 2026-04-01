import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role } from '../types'

interface RoleState {
  role: Role
  setRole: (role: Role) => void
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      role: 'admin',
      setRole: (role) => set({ role }),
    }),
    { name: 'role-store' }
  )
)