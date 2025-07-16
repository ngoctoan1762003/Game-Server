export interface UnitSquadSetup {
  [key: string]: { x: number; y: number };
}

export class UnitSquadSetupImpl {
  private units: { [key: string]: { x: number; y: number } } = {};

  constructor() {}

  getUnitPosition(unitId: string): { x: number; y: number } | undefined {
    return this.units[unitId];
  }

  setUnitPosition(unitId: string, position: { x: number; y: number }): void {
    this.units[unitId] = position;
  }

  toJSON(): UnitSquadSetup {
    return this.units;
  }
}
