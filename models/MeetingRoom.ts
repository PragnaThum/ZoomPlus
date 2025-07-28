import mongoose, { Schema, Document } from 'mongoose';

export interface IMeetingRoom extends Document {
  meetingId: string;
  hostEmail: string;
  allowChatbot: boolean;
  // You can add more fields like meetingDate, title, participants, etc.
}

const MeetingRoomSchema = new Schema<IMeetingRoom>({
  meetingId: {
    type: String,
    required: true,
    unique: true,
  },
  hostEmail: {
    type: String,
    required: true,
  },
  allowChatbot: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.MeetingRoom ||
  mongoose.model<IMeetingRoom>('MeetingRoom', MeetingRoomSchema);
