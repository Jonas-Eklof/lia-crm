import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

const app = express();
const db = new Database("companies.db", { verbose: console.log });

// Middleware
app.use(cors());
app.use(express.json());

function initializeDatabase() {
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL CHECK(length(name) > 0),
      contact TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE CHECK(email LIKE '%@%.%'),
      phone TEXT,
      time TEXT,
      how TEXT CHECK(how IN ('E-mail', 'Tele', 'E-mail/Tele')),
      response TEXT CHECK(response IN ('N/A', 'Ja', 'Ja - Godkänd', 'Ja - Nekad', 'Nej')),
      nextStep TEXT,
      status TEXT CHECK(status IN ('Aktiv', 'Inaktiv')))
    `
  ).run();

  // Exempeldata om tabellen är tom - för utveckling
  const rowCount = db
    .prepare(`SELECT COUNT(*) as count FROM companies`)
    .get().count;
  if (rowCount === 0) {
    const insert = db.prepare(
      "INSERT INTO companies (name, contact, email, phone, time, how, response, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    insert.run(
      "Exempel AB",
      "Anna Andersson",
      "anna@exempel.se",
      "070-1234567",
      new Date().toISOString().split("T")[0],
      "E-mail",
      "Ja",
      "Aktiv"
    );
    insert.run(
      "Testföretag",
      "Bo Bengtsson",
      "bo@test.se",
      "072-9876543",
      new Date().toISOString().split("T")[0],
      "Tele",
      "Nej",
      "Inaktiv"
    );
  }
}

function setupRoutes() {
  // GET /api/companies - Hämtar alla företag
  app.get("/api/companies", (req, res) => {
    try {
      const companies = db.prepare("SELECT * FROM companies").all();
      res.json(companies);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Kunde inte hämta företag" });
    }
  });

  // POST /api/companies - Skapa ett nytt företag
  app.post("/api/companies", (req, res) => {
    try {
      const {
        name,
        contact,
        email,
        phone,
        time,
        how,
        response,
        nextStep,
        status,
      } = req.body;

      const stmt = db.prepare(`
        INSERT INTO companies (name, contact, email, phone, time, how, response, nextStep, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        name,
        contact,
        email,
        phone,
        time,
        how,
        response,
        nextStep,
        status
      );

      const newCompany = db
        .prepare("SELECT * FROM companies WHERE id = ?")
        .get(result.lastInsertRowid);
      res.status(201).json(newCompany);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Kunde inte skapa nytt företag" });
    }
  });

  // PUT /api/companies/:id - Uppdatera företag
  app.put("/api/companies/:id", (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        contact,
        email,
        phone,
        time,
        how,
        response,
        nextStep,
        status,
      } = req.body;

      const stmt = db.prepare(`
        UPDATE companies 
        SET name = ?, contact = ?, email = ?, phone = ?, time = ?, how = ?, response = ?, nextStep = ?, status = ?
        WHERE id = ?
      `);

      const changes = stmt.run(
        name,
        contact,
        email,
        phone,
        time,
        how,
        response,
        nextStep,
        status,
        id
      ).changes;

      if (changes === 0) {
        return res.status(404).json({ error: "Företag hittades inte" });
      }

      const updatedCompany = db
        .prepare("SELECT * FROM companies WHERE id = ?")
        .get(id);
      res.json(updatedCompany);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Kunde inte uppdatera företag" });
    }
  });

  // DELETE /api/companies/:id - Radera ett företag
  app.delete("/api/companies/:id", (req, res) => {
    try {
      const { id } = req.params;
      const changes = db
        .prepare("DELETE FROM companies WHERE id = ?")
        .run(id).changes;

      if (changes === 0) {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
