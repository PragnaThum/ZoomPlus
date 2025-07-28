// models/Attendance.ts
import mongoose, { Schema, models } from 'mongoose';

const AttendanceSchema = new Schema({
  username: { type: String, required: true },
  meetingId: { type: String, required: true },
});

export default models.Attendance ||
  mongoose.model('Attendance', AttendanceSchema);
