import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PlayerDataDocument = PlayerData & Document;

@Schema({ timestamps: true }) 
export class PlayerData{
    @Prop()
    accountId: string;
    @Prop()
    nickname: string;
    @Prop()
    clearedStageData: string[];
    @Prop()
    clearedChapterData: string[];
    @Prop()
    currentStageData: string[];
    @Prop()
    ownedUnits: {
        unitID: string;
        level: number;
        currentExp: number;
        tier: number;
    }[];
    @Prop()
    listUnitSquadSetup: [[{
        unitId: string;
        positionX: number;
        positionY: number;
    }]];
}

export const PlayerDataSchema = SchemaFactory.createForClass(PlayerData)