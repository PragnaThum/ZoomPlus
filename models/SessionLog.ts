import mongoose, { Schema, models } from 'mongoose';

const SessionLogSchema = new Schema({
  username: { type: String, required: true },
  subject: { type: String, required: true },
  section: { type: String, required: true },
  logs: [
    {
      joinedAt: { type: Date, required: true },
      leftAt: { type: Date, required: true },
    },
  ],
});

export default models.SessionLog ||
  mongoose.model('SessionLog', SessionLogSchema);
