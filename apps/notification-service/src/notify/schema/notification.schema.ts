import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  desc: string;

  @Prop({ type: [Types.ObjectId], required: true, ref: 'User' })
  participants: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, required: true })
  refId: Types.ObjectId;

  @Prop({ required: true })
  refName: string;

  @Prop({ required: true })
  notifyType: string;

  @Prop({ type: Object, default: {} })
  readStatus: Record<string, boolean>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
