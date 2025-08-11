import { Entity } from '@/core/base/entity';
import { UnitOwned } from '@/core/domain/interface/unit-owned.interface';

export interface PlayerDataProps {
  id: string;
  accountId: string;
  nickname: string;
  clearedStageData: string[];
  clearedChapterData: string[];
  completedTutorialIds: string[];
  ownedUnits: UnitOwned[];
  listUnitSquadSetup: { [key: string]: { x: number; y: number; }; }[];
  createdAt: Date;
}

export class PlayerData extends Entity<PlayerDataProps> {
  private constructor(props: PlayerDataProps) {
    super(props);
  }

  static create(props: Omit<PlayerDataProps, 'createdAt'>) {
    // Initialize listUnitSquadSetup with 10 independent dictionaries mapping unitId to position
    const listUnitSquadSetup: { [key: string]: { x: number; y: number } }[] =
      props.listUnitSquadSetup ?? Array.from({ length: 10 }, () => ({}));

    return new PlayerData({
      ...props,
      clearedStageData: props.clearedStageData || [],
      clearedChapterData: props.clearedChapterData || [],
      completedTutorialIds: props.completedTutorialIds || [],
      ownedUnits: props.ownedUnits || [],
      listUnitSquadSetup,
      createdAt: new Date(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get accountId(): string {
    return this.props.accountId;
  }

  get nickname(): string {
    return this.props.nickname;
  }

  get clearedStageData(): string[] {
    return this.props.clearedStageData;
  }

  get clearedChapterData(): string[] {
    return this.props.clearedChapterData;
  }

  get completedTutorialIds(): string[] {
    return this.props.completedTutorialIds;
  }

  get ownedUnits(): UnitOwned[] {
    return this.props.ownedUnits;
  }

  get listUnitSquadSetup(): { [key: string]: { x: number; y: number; }; }[] {
    return this.props.listUnitSquadSetup;
  }
} 