const pool = require("../db/connect");

// Create Note Route Handler
exports.createNote = async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
      [req.user.user_id, title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve Note Route Handler
exports.getNoteById = async (req, res) => {
  const noteId = req.params.id;
  try {
    const result = await pool.query(
      "SELECT * FROM notes WHERE note_id = $1 AND user_id = $2",
      [noteId, req.user.user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit Note Route Handler
exports.updateNote = async (req, res) => {
  const noteId = req.params.id;
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      "UPDATE notes SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE note_id = $3 AND user_id = $4 RETURNING *",
      [title, content, noteId, req.user.user_id]
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
      await pool.query('DELETE FROM notes WHERE note_id = $1 AND user_id = $2', [noteId, req.user.user_id]);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
