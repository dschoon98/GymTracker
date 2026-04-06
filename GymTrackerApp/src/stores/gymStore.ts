import { seedGyms } from '@/data/seed';
import { Gym } from '@/data/types';
import { create } from 'zustand';

type GymStore = {
  gyms: Gym[];
  defaultGymId: string;
  addGym: (name: string) => void;
  removeGym: (id: string) => void;
  renameGym: (id: string, name: string) => void;
  setDefaultGym: (id: string) => void;
  getGym: (id: string) => Gym | undefined;
};

export const useGymStore = create<GymStore>((set, get) => ({
  gyms: seedGyms,
  defaultGymId: seedGyms.find((g) => g.isDefault)?.id ?? seedGyms[0]?.id ?? '',

  addGym: (name) =>
    set((s) => {
      const newGym: Gym = {
        id: `gym-${Date.now()}`,
        name,
        isDefault: s.gyms.length === 0,
      };
      return {
        gyms: [...s.gyms, newGym],
        defaultGymId: s.gyms.length === 0 ? newGym.id : s.defaultGymId,
      };
    }),

  removeGym: (id) =>
    set((s) => {
      const filtered = s.gyms.filter((g) => g.id !== id);
      const wasDefault = s.defaultGymId === id;
      return {
        gyms: filtered.map((g, i) =>
          wasDefault && i === 0 ? { ...g, isDefault: true } : wasDefault ? { ...g, isDefault: false } : g
        ),
        defaultGymId: wasDefault ? filtered[0]?.id ?? '' : s.defaultGymId,
      };
    }),

  renameGym: (id, name) =>
    set((s) => ({
      gyms: s.gyms.map((g) => (g.id === id ? { ...g, name } : g)),
    })),

  setDefaultGym: (id) =>
    set((s) => ({
      gyms: s.gyms.map((g) => ({ ...g, isDefault: g.id === id })),
      defaultGymId: id,
    })),

  getGym: (id) => get().gyms.find((g) => g.id === id),
}));
