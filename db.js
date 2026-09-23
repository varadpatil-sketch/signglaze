const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'signglaze.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id TEXT UNIQUE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    company TEXT,
    source TEXT DEFAULT 'quote_form',
    sign_type TEXT,
    dimensions TEXT,
    area_sqft REAL,
    illumination TEXT,
    mounting_surface TEXT,
    custom_text TEXT,
    estimated_budget TEXT,
    location TEXT,
    notes TEXT,
    artwork_filename TEXT,
    artwork_originalname TEXT,
    artwork_mimetype TEXT,
    artwork_size INTEGER,
    status TEXT DEFAULT 'New / Pending Survey',
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

/**
 * Generate human-readable Lead Reference: SGT-YYYYMMDD-XXXX
 */
function generateLeadId() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SGT-${dateStr}-${randomSuffix}`;
}

/**
 * Insert a new lead into SQLite
 */
function createLead(data) {
  const leadId = data.lead_id || generateLeadId();
  const stmt = db.prepare(`
    INSERT INTO leads (
      lead_id, name, phone, email, company, source, sign_type,
      dimensions, area_sqft, illumination, mounting_surface,
      custom_text, estimated_budget, location, notes,
      artwork_filename, artwork_originalname, artwork_mimetype, artwork_size,
      status
    ) VALUES (
      @lead_id, @name, @phone, @email, @company, @source, @sign_type,
      @dimensions, @area_sqft, @illumination, @mounting_surface,
      @custom_text, @estimated_budget, @location, @notes,
      @artwork_filename, @artwork_originalname, @artwork_mimetype, @artwork_size,
      'New / Pending Survey'
    )
  `);

  const info = stmt.run({
    lead_id: leadId,
    name: data.name || '',
    phone: data.phone || '',
    email: data.email || '',
    company: data.company || '',
    source: data.source || 'quote_form',
    sign_type: data.sign_type || '',
    dimensions: data.dimensions || '',
    area_sqft: data.area_sqft ? parseFloat(data.area_sqft) : null,
    illumination: data.illumination || '',
    mounting_surface: data.mounting_surface || '',
    custom_text: data.custom_text || '',
    estimated_budget: data.estimated_budget || '',
    location: data.location || '',
    notes: data.notes || '',
    artwork_filename: data.artwork_filename || null,
    artwork_originalname: data.artwork_originalname || null,
    artwork_mimetype: data.artwork_mimetype || null,
    artwork_size: data.artwork_size || null
  });

  return getLeadById(info.lastInsertRowid);
}

/**
 * Retrieve all leads with optional filtering and search
 */
function getAllLeads(filterStatus, searchQuery) {
  let query = `SELECT * FROM leads`;
  const params = [];
  const conditions = [];

  if (filterStatus && filterStatus !== 'all') {
    conditions.push(`status = ?`);
    params.push(filterStatus);
  }

  if (searchQuery && searchQuery.trim().length > 0) {
    conditions.push(`(name LIKE ? OR phone LIKE ? OR email LIKE ? OR company LIKE ? OR lead_id LIKE ?)`);
    const s = `%${searchQuery.trim()}%`;
    params.push(s, s, s, s, s);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(' AND ');
  }

  query += ` ORDER BY id DESC`;

  return db.prepare(query).all(...params);
}

/**
 * Get single lead by ID
 */
function getLeadById(id) {
  return db.prepare(`SELECT * FROM leads WHERE id = ?`).get(id);
}

/**
 * Update status & notes of a lead
 */
function updateLeadStatus(id, status, adminNotes) {
  const stmt = db.prepare(`
    UPDATE leads 
    SET status = ?, 
        admin_notes = COALESCE(?, admin_notes),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(status, adminNotes || null, id);
  return getLeadById(id);
}

/**
 * Pipeline statistics for admin dashboard
 */
function getLeadStats() {
  const total = db.prepare(`SELECT COUNT(*) as count FROM leads`).get().count;
  const pendingSurvey = db.prepare(`SELECT COUNT(*) as count FROM leads WHERE status = 'New / Pending Survey'`).get().count;
  const quoted = db.prepare(`SELECT COUNT(*) as count FROM leads WHERE status = 'Quoted'`).get().count;
  const inFab = db.prepare(`SELECT COUNT(*) as count FROM leads WHERE status = 'In Fabrication'`).get().count;
  const installed = db.prepare(`SELECT COUNT(*) as count FROM leads WHERE status = 'Installed / Closed'`).get().count;

  return {
    total,
    pendingSurvey,
    quoted,
    inFab,
    installed
  };
}

module.exports = {
  db,
  createLead,
  getAllLeads,
  getLeadById,
  updateLeadStatus,
  getLeadStats
};
