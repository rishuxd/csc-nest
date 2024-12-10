import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: '', trim: true })
  desc: string;

  @Prop({ type: Types.ObjectId, required: true })
  assignedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  assignedTo: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['Pending', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Pending',
  })
  status: string;

  @Prop({
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  })
  priority: string;

  @Prop({ type: Date, required: true })
  dueDate: Date;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
