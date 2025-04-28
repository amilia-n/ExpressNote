import pool from '../db/connect.js';

export const validateNoteOwnership = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.user_id;
    const result = await pool.query(
      'SELECT * FROM notes WHERE note_id = $1 AND user_id = $2',
      [noteId, userId]
    );
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const validatePageBelongsToNote = async (req, res, next) => {
  try {
    const { noteId, pageId } = req.params;
    const result = await pool.query(
      'SELECT * FROM pages WHERE page_id = $1 AND note_id = $2',
      [pageId, noteId]
    );
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};