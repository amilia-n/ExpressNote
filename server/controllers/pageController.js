import pool from "../db/connect.js";
import { pageQueries } from "../db/queries.js";

// Create Page Handler
export const createPage = async (req, res) => {
  try {
    const { note_id, position } = req.body;
    // Check if note exists
    const noteCheck = await pool.query('SELECT * FROM notes WHERE note_id = $1', [note_id]);
    if (noteCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    const result = await pool.query(pageQueries.createPage, [note_id, position]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handler for Block Position + Update Page
export const updatePagePosition = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { position } = req.body;

    // Check if page exists
    const pageCheck = await pool.query(
      "SELECT * FROM pages WHERE page_id = $1",
      [pageId]
    );
    if (pageCheck.rows.length === 0) {
      return res.status(404).json({ error: "Page not found" });
    }

    const result = await pool.query(pageQueries.updatePagePosition, [
      position,
      pageId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Page not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get A Single Page by ID
export const getPageById = async (req, res) => {
  try {
    const { pageId } = req.params;
    const result = await pool.query("SELECT * FROM pages WHERE page_id = $1", [
      pageId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Page not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting page:", error);
    return res.status(500).json({ error: "Failed to get page" });
  }
};

// Get All Pages
export const getPagesByNoteId = async (req, res) => {
  try {
    const noteId = req.query.note_id;
    if (!noteId) {
      return res.status(400).json({ error: "Note ID is required" });
    }
    const result = await pool.query(
      "SELECT * FROM pages WHERE note_id = $1 ORDER BY position",
      [noteId]
    );
    return res.json(result.rows);
  } catch (error) {
    console.error("Error getting pages:", error);
    return res.status(500).json({ error: "Failed to get pages" });
  }
};

// Delete Page Handler
export const deletePage = async (req, res) => {
  try {
    const { pageId } = req.params;
    const result = await pool.query(
      "DELETE FROM pages WHERE page_id = $1 RETURNING *",
      [pageId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Page not found" });
    }

    return res.status(204).end();
  } catch (error) {
    console.error("Error deleting page:", error);
    return res.status(500).json({ error: "Failed to delete page" });
  }
};
