import { Schema, model } from 'mongoose';

const auditLogSchema = new Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN_SUCCESS',
      'LOGIN_FAILED',
      'ACCOUNT_LOCKED',
      'PROFILE_UPDATE',
      'PROJECT_CREATED',
      'PROJECT_UPDATED',
      'PROJECT_DELETED'
    ],
  },
  adminId: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    default: null,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
  },
  details: {
    type: Schema.Types.Mixed,
  },
}, { timestamps: true });

// Index for easier querying by action or admin
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ adminId: 1, createdAt: -1 });

export default model('AuditLog', auditLogSchema);
