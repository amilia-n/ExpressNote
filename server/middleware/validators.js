import pool from '../db/connect.js';

export const validateNoteOwnership = async (req, res, next) => {
  try {
    // Get note_id from params, body, or from page_id
    let noteId = req.params.noteId || req.body.note_id;
    
    // If we have a page_id but no note_id, get the note_id from the page
    if (!noteId && (req.params.pageId || req.body.page_id)) {
      const pageId = req.params.pageId || req.body.page_id;
      const pageResult = await pool.query(
        'SELECT note_id FROM pages WHERE page_id = $1',
        [pageId]
      );
      
      if (pageResult.rows.length > 0) {
        noteId = pageResult.rows[0].note_id;
      }
    }
    
    // If we still don't have a note_id, we can't validate ownership
    if (!noteId) {
      return res.status(400).json({ error: 'Note ID is required' });
    }
    
    const userId = req.user.user_id || req.user.id;  // Support both user_id and id
    
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