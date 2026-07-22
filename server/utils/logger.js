import AuditLog from '../models/AuditLog.js';

const logger = async (action, adminId, req, details = {}) => {
  try {
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    await AuditLog.create({
      action,
      adminId,
      ipAddress,
      userAgent,
      details,
    });
  } catch (error) {
    console.error(`❌ Failed to write audit log for action: ${action}`, error.message);
  }
};

export default logger;
