import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Cmnt extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  taskId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  senderId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['MSG', 'INFO'],
    required: true,
  })
  cmntType: string;

  @Prop({
    type: String,
    enum: ['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE'],
    required: true,
  })
  contentType: string;

  @Prop({ default: '', trim: true })
  content: string;

  @Prop({ default: '', trim: true })
  mediaUrl: string;

  @Prop({ type: Boolean, default: false })
  isEdited: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: [Types.ObjectId], default: [] })
  taggedUser: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Cmnt', default: null })
  replyTo: Types.ObjectId;
}

export const CmntSchema = SchemaFactory.createForClass(Cmnt);
