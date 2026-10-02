const db = require('../db/connection');

function logAudit(userEmail, action, moduleName, description) {
  try {
    const stmt = db.prepare(`
      INSERT INTO audit_logs (user_email, action, module, description)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(userEmail || 'system@tcc.com', action, moduleName, description || '');
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
}

module.exports = { logAudit };
