const pool = require("../db/connect");
const { noteQueries } = require('../db/queries');

// Create Note Route Handler
exports.createNote = async (req, res) => {
  const { title } = req.body;
  try {
    const result = await pool.query(
      noteQueries.createNote,
      [req.user.user_id, title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve Single Note 
exports.getNoteById = async (req, res) => {
  const noteId = req.params.id;
  try {
    const result = await pool.query(
      noteQueries.getNoteWithContent,
      [noteId, req.user.user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve All Notes
exports.getAllNotes = async (req, res) => {
  try {
    const result = await pool.query(
      noteQueries.getAllNotes,
      [req.user.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Note Title
exports.updateNoteTitle = async (req, res) => {
  const noteId = req.params.id;
  const { title } = req.body;
  try {
    const result = await pool.query(
      noteQueries.updateNoteTitle,
      [title, noteId, req.user.user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Note Route Handler
exports.deleteNote = async (req, res) => {
  const noteId = req.params.id;
  try {
    await pool.query(noteQueries.deleteNote, [noteId, req.user.user_id]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

