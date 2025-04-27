const pool = require("../db/connect");
const { pageQueries } = require("../db/queries");

// Create Page Handler
exports.createPage = async (req, res) => {
    const noteId = req.params.noteId;
    const { position } = req.body;
    try {
      const result = await pool.query(pageQueries.createPage, [noteId, position]);
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Handler for Block Position + Update Page
exports.updatePagePosition = async (req, res) => {
    const { noteId, pageId } = req.params;
    const { position } = req.body;
    try {
      const result = await pool.query(pageQueries.updatePosition, [position, pageId, noteId]);
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Get A Single Page by ID
exports.getPageById = async (req, res) => {
    const { noteId, pageId } = req.params;
    try {
      const result = await pool.query(pageQueries.getPageById, [pageId, noteId]);
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Get All Pages
exports.getAllPages = async (req, res) => {
    const { noteId } = req.params;
    try {
      const result = await pool.query(pageQueries.getAllPages, [noteId]);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Delete Page Handler
exports.deletePage = async (req, res) => {
    const { noteId, pageId } = req.params;
    try {
      await pool.query(pageQueries.deletePage, [pageId, noteId]);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
