import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url"; // Add this import

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";

const { Pool } = pg;
const app = express();

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

// Middleware
app.use(
  cors({
    origin: isProduction
      ? ["https://your-frontend-domain.com"]
      : ["http://localhost:5173"],
  })
);
app.use(express.json());

async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL CHECK(length(name) > 0),
        contact TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE CHECK(email LIKE '%@%.%'),
        phone TEXT,
        time TEXT,
        how TEXT CHECK(how IN ('E-mail', 'Tele', 'E-mail/Tele')),
        response TEXT CHECK(response IN ('N/A', 'Ja', 'Ja - Godkänd', 'Ja - Nekad', 'Nej')),
        nextStep TEXT,
        status TEXT CHECK(status IN ('Aktiv', 'Inaktiv'))
    )
    `);

    const { rows } = await pool.query(
      "SELECT COUNT(*) as count FROM companies"
    );
    if (rows[0].count === "0") {
      await pool.query(
        `
        INSERT INTO companies (name, contact, email, phone, time, how, response, status)
        VALUES 
          ('Exempel AB', 'Anna Andersson', 'anna@exempel.se', '070-1234567', $1, 'E-mail', 'Ja', 'Aktiv'),
          ('Testföretag', 'Bo Bengtsson', 'bo@test.se', '072-9876543', $1, 'Tele', 'Nej', 'Inaktiv')
      `,
        [new Date().toISOString().split("T")[0]]
      );
    }
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}

function setupRoutes() {
  // GET /api/companies
  app.get("/api/companies", async (req, res) => {
    try {
      const { rows } = await pool.query("SELECT * FROM companies");
      res.json(rows);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Kunde inte hämta företag" });
    }
  });

  // POST /api/companies
  app.post("/api/companies", async (req, res) => {
    try {
      const { rows } = await pool.query(
        `INSERT INTO companies 
        (name, contact, email, phone, time, how, response, nextStep, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [
          req.body.name,
          req.body.contact,
          req.body.email,
          req.body.phone,
          req.body.time,
          req.body.how,
          req.body.response,
          req.body.nextStep,
          req.body.status,
        ]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Kunde inte skapa nytt företag" });
    }
  });

  // PUT /api/companies/:id
  app.put("/api/companies/:id", async (req, res) => {
    try {
      const { rows, rowCount } = await pool.query(
        `UPDATE companies SET
        name = $1, contact = $2, email = $3, phone = $4, time = $5,
        how = $6, response = $7, nextStep = $8, status = $9
        WHERE id = $10
        RETURNING *`,
        [
          req.body.name,
          req.body.contact,
          req.body.email,
          req.body.phone,
          req.body.time,
          req.body.how,
          req.body.response,
          req.body.nextStep,
          req.body.status,
          req.params.id,
        ]
      );

      if (rowCount === 0) {
        return res.status(404).json({ error: "Företag hittades inte" });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Kunde inte uppdatera företag" });
    }
  });

  // DELETE /api/companies/:id
  app.delete("/api/companies/:id", async (req, res) => {
    try {
      const { rowCount } = await pool.query(
        "DELETE FROM companies WHERE id = $1",
        [req.params.id]
      );

      if (rowCount === 0) {
        return res.status(404).json({ error: "Företaget hittades inte" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Kunde inte radera företaget" });
    }
  });
}

initializeDatabase();
setupRoutes();

if (isProduction) {
  app.use(express.static(path.join(__dirname, "public")));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
