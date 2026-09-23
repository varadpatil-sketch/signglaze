const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { createLead, getAllLeads, getLeadById, updateLeadStatus, getLeadStats } = require('./db');
const { sendLeadNotifications } = require('./mailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB limit
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadsDir));

// Route for Admin Dashboard
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// ============================================================================
// API ROUTES
// ============================================================================

/**
 * POST /api/leads - Create new lead / quote request with optional artwork upload
 */
app.post('/api/leads', upload.single('artwork'), async (req, res) => {
  try {
    const {
      name, phone, email, company, source,
      sign_type, dimensions, area_sqft, illumination,
      mounting_surface, custom_text, estimated_budget,
      location, notes
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Name and Phone number are required fields.'
      });
    }

    const fileData = req.file ? {
      artwork_filename: req.file.filename,
      artwork_originalname: req.file.originalname,
      artwork_mimetype: req.file.mimetype,
      artwork_size: req.file.size
    } : {};

    const newLead = createLead({
      name,
      phone,
      email,
      company,
      source: source || 'quote_form',
      sign_type,
      dimensions,
      area_sqft,
      illumination,
      mounting_surface,
      custom_text,
      estimated_budget,
      location,
      notes,
      ...fileData
    });

    // Send asynchronous notifications (does not block lead response)
    sendLeadNotifications(newLead, req.file).catch(err => {
      console.error('[NOTIFICATION ASYNC ERROR]', err);
    });

    return res.status(201).json({
      success: true,
      message: 'Quote inquiry successfully received and logged.',
      lead: newLead
    });
  } catch (error) {
    console.error('[API LEADS ERROR]', error);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while saving the inquiry.'
    });
  }
});

/**
 * GET /api/admin/leads - Retrieve leads with optional filter & search
 */
app.get('/api/admin/leads', (req, res) => {
  try {
    const { status, search } = req.query;
    const leads = getAllLeads(status, search);
    return res.json({ success: true, leads });
  } catch (error) {
    console.error('[GET LEADS ERROR]', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch leads.' });
  }
});

/**
 * GET /api/admin/stats - Retrieve pipeline summary statistics
 */
app.get('/api/admin/stats', (req, res) => {
  try {
    const stats = getLeadStats();
    return res.json({ success: true, stats });
  } catch (error) {
    console.error('[GET STATS ERROR]', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch stats.' });
  }
});

/**
 * PATCH /api/admin/leads/:id/status - Update lead status & admin notes
 */
app.patch('/api/admin/leads/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required.' });
    }

    const updated = updateLeadStatus(id, status, admin_notes);
    return res.json({ success: true, lead: updated });
  } catch (error) {
    console.error('[UPDATE LEAD STATUS ERROR]', error);
    return res.status(500).json({ success: false, error: 'Failed to update lead status.' });
  }
});

/**
 * GET /api/admin/export - Export leads to downloadable CSV
 */
app.get('/api/admin/export', (req, res) => {
  try {
    const leads = getAllLeads('all');
    
    // CSV Header
    const headers = [
      'Lead ID', 'Created Date', 'Client Name', 'Phone', 'Email',
      'Company', 'Source', 'Sign Type', 'Dimensions', 'Area SqFt',
      'Lighting', 'Mounting Wall', 'Custom Text', 'Estimated Budget',
      'Site Location', 'Client Notes', 'Status', 'Admin Notes', 'Artwork File'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = leads.map(l => [
      escapeCsv(l.lead_id),
      escapeCsv(l.created_at),
      escapeCsv(l.name),
      escapeCsv(l.phone),
      escapeCsv(l.email),
      escapeCsv(l.company),
      escapeCsv(l.source),
      escapeCsv(l.sign_type),
      escapeCsv(l.dimensions),
      escapeCsv(l.area_sqft),
      escapeCsv(l.illumination),
      escapeCsv(l.mounting_surface),
      escapeCsv(l.custom_text),
      escapeCsv(l.estimated_budget),
      escapeCsv(l.location),
      escapeCsv(l.notes),
      escapeCsv(l.status),
      escapeCsv(l.admin_notes),
      escapeCsv(l.artwork_originalname ? `${l.artwork_originalname} (/uploads/${l.artwork_filename})` : 'None')
    ].join(','));

    const csvContent = '\uFEFF' + headers.join(',') + '\n' + rows.join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="sgt_leads_${new Date().toISOString().slice(0, 10)}.csv"`);
    return res.send(csvContent);
  } catch (error) {
    console.error('[CSV EXPORT ERROR]', error);
    return res.status(500).send('Error generating CSV export.');
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 SIGN GLAZE TECHNOLOGY (SGT) SERVER IS LIVE`);
  console.log(`📍 Web Application: http://localhost:${PORT}`);
  console.log(`🛡️  Admin Dashboard: http://localhost:${PORT}/admin`);
  console.log(`📁 Uploads Directory: ${uploadsDir}`);
  console.log(`💾 SQLite Database: ${path.join(__dirname, 'data', 'signglaze.db')}`);
  console.log(`=======================================================`);
});
