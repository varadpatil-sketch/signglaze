const { createClient } = require('@libsql/client');
const path = require('path');
const fs = require('fs');
const os = require('os');
require('dotenv').config();

// Determine database connection target
let dbUrl;
let dbAuthToken = process.env.TURSO_AUTH_TOKEN || undefined;

if (process.env.TURSO_DATABASE_URL) {
  // 1. Turso Cloud Database (Primary persistent storage on Vercel)
  dbUrl = process.env.TURSO_DATABASE_URL;
} else if (process.env.VERCEL) {
  // 2. Serverless fallback if Turso is not yet configured
  const tmpDb = path.join(os.tmpdir(), 'signglaze.db').replace(/\\/g, '/');
  dbUrl = `file:${tmpDb}`;
} else {
  // 3. Local Development: data/signglaze.db
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch (e) {
      console.warn('[DB] Could not create data directory:', e.message);
    }
  }
  const dbFile = path.join(dataDir, 'signglaze.db').replace(/\\/g, '/');
  dbUrl = `file:${dbFile}`;
}

const client = createClient({
  url: dbUrl,
  authToken: dbAuthToken
});

let isInitialized = false;

/**
 * Initialize database schema
 */
async function initDb() {
  if (isInitialized) return;

  await client.execute(`
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

  isInitialized = true;
}

// Auto-trigger schema creation
initDb().catch(err => console.error('[DB INIT ERROR]', err));

/**
 * Generate human-readable Lead Reference: SGT-YYYYMMDD-XXXX
 */
function generateLeadId() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SGT-${dateStr}-${randomSuffix}`;
}

/**
 * Insert a new lead into SQLite / Turso
 */
async function createLead(data) {
  await initDb();
  const leadId = data.lead_id || generateLeadId();

  const insertSql = `
    INSERT INTO leads (
      lead_id, name, phone, email, company, source, sign_type,
      dimensions, area_sqft, illumination, mounting_surface,
      custom_text, estimated_budget, location, notes,
      artwork_filename, artwork_originalname, artwork_mimetype, artwork_size,
      status
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      'New / Pending Survey'
    )
  `;

  const info = await client.execute({
    sql: insertSql,
    args: [
      leadId,
      data.name || '',
      data.phone || '',
      data.email || '',
      data.company || '',
      data.source || 'quote_form',
      data.sign_type || '',
      data.dimensions || '',
      data.area_sqft ? parseFloat(data.area_sqft) : null,
      data.illumination || '',
      data.mounting_surface || '',
      data.custom_text || '',
      data.estimated_budget || '',
      data.location || '',
      data.notes || '',
      data.artwork_filename || null,
      data.artwork_originalname || null,
      data.artwork_mimetype || null,
      data.artwork_size || null
    ]
  });

  const insertedId = Number(info.lastInsertRowid);
  return await getLeadById(insertedId);
}

/**
 * Retrieve all leads with optional filtering and search
 */
async function getAllLeads(filterStatus, searchQuery) {
  await initDb();
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

  const result = await client.execute({ sql: query, args: params });
  return result.rows;
}

/**
 * Get single lead by ID
 */
async function getLeadById(id) {
  await initDb();
  const result = await client.execute({
    sql: `SELECT * FROM leads WHERE id = ?`,
    args: [id]
  });
  return result.rows[0] || null;
}

/**
 * Update status & notes of a lead
 */
async function updateLeadStatus(id, status, adminNotes) {
  await initDb();
  await client.execute({
    sql: `
      UPDATE leads 
      SET status = ?, 
          admin_notes = COALESCE(?, admin_notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [status, adminNotes || null, id]
  });
  return await getLeadById(id);
}

/**
 * Pipeline statistics for admin dashboard
 */
async function getLeadStats() {
  await initDb();
  const totalRes = await client.execute(`SELECT COUNT(*) as count FROM leads`);
  const pendingSurveyRes = await client.execute(`SELECT COUNT(*) as count FROM leads WHERE status = 'New / Pending Survey'`);
  const quotedRes = await client.execute(`SELECT COUNT(*) as count FROM leads WHERE status = 'Quoted'`);
  const inFabRes = await client.execute(`SELECT COUNT(*) as count FROM leads WHERE status = 'In Fabrication'`);
  const installedRes = await client.execute(`SELECT COUNT(*) as count FROM leads WHERE status = 'Installed / Closed'`);

  return {
    total: Number(totalRes.rows[0]?.count || 0),
    pendingSurvey: Number(pendingSurveyRes.rows[0]?.count || 0),
    quoted: Number(quotedRes.rows[0]?.count || 0),
    inFab: Number(inFabRes.rows[0]?.count || 0),
    installed: Number(installedRes.rows[0]?.count || 0)
  };
}

module.exports = {
  client,
  initDb,
  createLead,
  getAllLeads,
  getLeadById,
  updateLeadStatus,
  getLeadStats
};
