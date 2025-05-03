import pool from '../db/connect.js';
import { noteQueries } from '../db/queries.js';

// Create Note Route Handler
export const createNote = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.user_id || req.user.id;  // Handle both JWT and session auth
    const result = await pool.query(noteQueries.createNote, [userId, title]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve Single Note 
export const getNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;
    const result = await pool.query(noteQueries.getNoteById, [noteId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve All Notes
export const getAllNotes = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const result = await pool.query(
      'SELECT note_id, title, created_at FROM notes WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      notes: result.rows
    });
  } catch (error) {
    console.error('Get all notes error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update Note Title
export const updateNoteTitle = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title } = req.body;
    const result = await pool.query(noteQueries.updateNoteTitle, [title, noteId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Note Route Handler
export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.user_id;
    
    console.log('Delete request - Note ID:', noteId);
    console.log('Delete request - User ID:', userId);
    
    // Verify note exists and belongs to user
    const noteCheck = await pool.query(
      'SELECT * FROM notes WHERE note_id = $1 AND user_id = $2',
      [noteId, userId]
    );
    
    console.log('Note check result:', noteCheck.rows);
    
    if (noteCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found or unauthorized' });
    }

    // Delete in correct order
    await pool.query('DELETE FROM blocks WHERE page_id IN (SELECT page_id FROM pages WHERE note_id = $1)', [noteId]);
    await pool.query('DELETE FROM pages WHERE note_id = $1', [noteId]);
    await pool.query('DELETE FROM notes WHERE note_id = $1 AND user_id = $2', [noteId, userId]);
    
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Delete error details:', err);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};