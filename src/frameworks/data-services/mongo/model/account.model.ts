import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AccountDocument = Account & Document;

@Schema({ timestamps: true }) 
export class Account {

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    hash_password: string;

    @Prop({ required: true })
    salt: string;

    @Prop()
    password_reset_token: string;

    @Prop()
    reset_token_expire_time: Date;

    @Prop({ required: true, default: 'active' })
    status: string;

    @Prop()
    image: string;

    @Prop({ default: Date.now })
    created_at: Date;

    @Prop({ default: Date.now })
    updated_at: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account)