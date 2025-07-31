export type Rarity = 'SSR' | 'SR' | 'R' | 'N' | 'C';

export interface UnitPoolItem {
  unitId: string;
  rarity: Rarity;
}

// TODO: Replace these sample unit IDs with real ones as soon as they are available.
export const UNIT_POOL: UnitPoolItem[] = [
  // SSR
  { unitId: 'UA001', rarity: 'SSR' },
  { unitId: 'UA002', rarity: 'SSR' },
  { unitId: 'UA006', rarity: 'SSR' },

  // SR
  { unitId: 'UA003', rarity: 'SR' },
  { unitId: 'UA004', rarity: 'SR' },
  { unitId: 'UA005', rarity: 'SR' },
  { unitId: 'UA007', rarity: 'SR' },

  // R
  { unitId: 'UE004', rarity: 'R' },

  // N
  { unitId: 'UE002', rarity: 'N' },

  // C
  { unitId: 'UE001', rarity: 'C' },
];
