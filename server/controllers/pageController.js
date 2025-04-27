const pool = require("../db/connect");
const { verifyNoteOwnership, verifyPageBelongsToNote } = require('../utils/validators');

// Create Page Handler
exports.createPage = async (req, res) => {
  const noteId = req.params.noteId;
  const { position } = req.body;
  try {
    const noteCheck = await pool.query(
      "SELECT * FROM notes WHERE note_id = $1 AND user_id = $2",
      [noteId, req.user.user_id]
    );

    if (noteCheck.rows.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    const result = await pool.query(
      "INSERT INTO pages (note_id, position) VALUES ($1, $2) RETURNING *",
      [noteId, position]
    );
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
    const noteCheck = await pool.query(
      "SELECT * FROM notes WHERE note_id = $1 AND user_id = $2",
      [noteId, req.user.user_id]
    );

    if (noteCheck.rows.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    const result = await pool.query(
      `UPDATE pages 
       SET position = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE page_id = $2 AND note_id = $3
       RETURNING *`,
      [position, pageId, noteId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Page Handler
exports.deletePage = async (req, res) => {
  const { noteId, pageId } = req.params;
  try {
    const noteCheck = await pool.query(
      "SELECT * FROM notes WHERE note_id = $1 AND user_id = $2",
      [noteId, req.user.user_id]
    );

    if (noteCheck.rows.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    await pool.query(
      "DELETE FROM pages WHERE page_id = $1 AND note_id = $2",
      [pageId, noteId]
    );
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};