const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());

// Basic admin auth middleware (uses ENV ADMIN_USER / ADMIN_PASS)
function adminAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Basic ')) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
        return res.status(401).send('Authentication required');
    }

    const creds = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
    const user = process.env.ADMIN_USER || 'admin';
    const pass = process.env.ADMIN_PASS || 'changeme';
    if (creds[0] === user && creds[1] === pass) return next();

    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Invalid credentials');
}

// Simple rate limiter for contact endpoint
const contactLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 6,
    message: { error: 'Too many requests, please wait a moment.' }
});

let db;
(async () => {
    db = await open({ filename: path.join(__dirname, 'data', 'messages.db'), driver: sqlite3.Database });
    await db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
})();

// POST /api/contact
app.post('/api/contact', contactLimiter, async (req, res) => {
    try {
        const { name, email, subject, message } = req.body || {};
        if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' });

        // Store in DB
        await db.run('INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)', [name, email, subject || '', message]);

        // Send email to site owner
        const transporter = nodemailer.createTransport(
            process.env.SMTP_URL || process.env.SMTP_CONNECTION_STRING || {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            }
        );

        const mailOptions = {
            from: process.env.FROM_EMAIL || 'no-reply@example.com',
            to: process.env.TO_EMAIL || process.env.SMTP_USER,
            subject: `[Portfolio Contact] ${subject || 'New message from website'}`,
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
            html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>`
        };

        // Only attempt to send if SMTP credentials provided
        if (process.env.SMTP_USER && (process.env.SMTP_PASS || process.env.SMTP_URL || process.env.SMTP_CONNECTION_STRING)) {
            await transporter.sendMail(mailOptions);
        }

        return res.json({ ok: true });
    } catch (err) {
        console.error('Contact error', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/messages - protected admin list with pagination
app.get('/api/messages', adminAuth, async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page || '1'));
        const limit = Math.min(200, Math.max(10, parseInt(req.query.limit || '20')));
        const offset = (page - 1) * limit;

        const rows = await db.all('SELECT id, name, email, subject, message, created_at FROM messages ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset]);
        const [{ count } = { count: 0 }] = await db.all('SELECT COUNT(*) as count FROM messages');

        res.json({ messages: rows, total: count, page, limit });
    } catch (err) {
        console.error('List messages error', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/messages/:id - protected delete
app.delete('/api/messages/:id', adminAuth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) return res.status(400).json({ error: 'Invalid id' });
        await db.run('DELETE FROM messages WHERE id = ?', id);
        res.json({ ok: true });
    } catch (err) {
        console.error('Delete message error', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve admin UI (protected)
app.get('/admin', adminAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
