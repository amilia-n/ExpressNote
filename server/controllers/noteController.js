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
    const userId = req.user.user_id;
    
    const noteResult = await pool.query(
      'SELECT * FROM notes WHERE note_id = $1 AND user_id = $2',
      [noteId, userId]
    );
    
    if (noteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    const pagesResult = await pool.query(
      `SELECT p.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'block_id', b.block_id,
              'block_type', b.block_type,
              'content', b.content,
              'position', b.position,
              'x', b.x,
              'y', b.y,
              'color', b.color,
              'opacity', b.opacity
            ) ORDER BY b.position
          ) FILTER (WHERE b.block_id IS NOT NULL),
          '[]'
        ) as blocks
      FROM pages p
      LEFT JOIN blocks b ON p.page_id = b.page_id
      WHERE p.note_id = $1
      GROUP BY p.page_id
      ORDER BY p.position`,
      [noteId]
    );
    
    const note = noteResult.rows[0];
    note.pages = pagesResult.rows;
    
    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Retrieve All Notes
export const getAllNotes = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const result = await pool.query(
      `SELECT n.note_id, n.title, n.created_at, nd.description
       FROM notes n
       LEFT JOIN note_descriptions nd ON n.note_id = nd.note_id
       WHERE n.user_id = $1
       ORDER BY n.created_at DESC`,
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

// Save and Update Note
export const saveAndUpdate = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.user_id;
    const { title, content } = req.body;

    console.log('Save and update request - Note ID:', noteId);
    console.log('Save and update request - User ID:', userId);
    console.log('Save and update request - Title:', title);
    console.log('Save and update request - Content pages:', Object.keys(content).length);

    // Log the database connection
    const connectionCheck = await pool.query('SELECT NOW()');
    console.log('Database connection check:', connectionCheck.rows[0]);

    const noteCheck = await pool.query(
      'SELECT * FROM notes WHERE note_id = $1 AND user_id = $2',
      [noteId, userId]
    );
    console.log('Note check result:', noteCheck.rows);

    if (noteCheck.rows.length === 0) {
      console.log('Note not found or unauthorized');
      return res.status(404).json({ error: 'Note not found or unauthorized' });
    }

    const updateResult = await pool.query('UPDATE notes SET title = $1 WHERE note_id = $2 RETURNING *', [title, noteId]);
    console.log('Title update result:', updateResult.rows[0]);

    const deleteBlocksResult = await pool.query('DELETE FROM blocks WHERE page_id IN (SELECT page_id FROM pages WHERE note_id = $1) RETURNING *', [noteId]);
    console.log('Deleted blocks count:', deleteBlocksResult.rowCount);

    const deletePagesResult = await pool.query('DELETE FROM pages WHERE note_id = $1 RETURNING *', [noteId]);
    console.log('Deleted pages count:', deletePagesResult.rowCount);

    for (const [pageNum, blocks] of Object.entries(content)) {
      console.log(`Processing page ${pageNum} with ${blocks.length} blocks`);
      const pageResult = await pool.query(
        'INSERT INTO pages (note_id, position) VALUES ($1, $2) RETURNING *',
        [noteId, parseInt(pageNum)]
      );
      console.log('Inserted page:', pageResult.rows[0]);
      const pageId = pageResult.rows[0].page_id;

      for (const block of blocks) {
        const blockResult = await pool.query(
          `INSERT INTO blocks (page_id, block_type, content, position, x, y, color, opacity)
           VALUES ($1, $2, $3::text, $4, $5, $6, $7, $8) RETURNING *`,
          [
            pageId,
            block.type,
            block.content, 
            block.position,
            block.x,
            block.y,
            block.color || '#ffffff',
            block.opacity || 100
          ]
        );
        console.log('Inserted block:', blockResult.rows[0]);
      }
    }

    const updatedNote = await pool.query(noteQueries.getNoteById, [noteId]);
    console.log('Final note state:', updatedNote.rows[0]);
    res.json(updatedNote.rows[0]);
  } catch (error) {
    console.error('Save and update note error:', error);
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
    
    // Log the database connection
    const connectionCheck = await pool.query('SELECT NOW()');
    console.log('Database connection check:', connectionCheck.rows[0]);
    
    // Verify note exists and belongs to user
    const noteCheck = await pool.query(
      'SELECT * FROM notes WHERE note_id = $1 AND user_id = $2',
      [noteId, userId]
    );
    
    console.log('Note check result:', noteCheck.rows);
    
    if (noteCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found or unauthorized' });
    }

    // Delete in correct order with RETURNING clauses
    const deleteBlocksResult = await pool.query(
      'DELETE FROM blocks WHERE page_id IN (SELECT page_id FROM pages WHERE note_id = $1) RETURNING *',
      [noteId]
    );
    console.log('Deleted blocks count:', deleteBlocksResult.rowCount);

    const deletePagesResult = await pool.query(
      'DELETE FROM pages WHERE note_id = $1 RETURNING *',
      [noteId]
    );
    console.log('Deleted pages count:', deletePagesResult.rowCount);

    const deleteNoteResult = await pool.query(
      'DELETE FROM notes WHERE note_id = $1 AND user_id = $2 RETURNING *',
      [noteId, userId]
    );
    console.log('Deleted note:', deleteNoteResult.rows[0]);
    
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Delete error details:', err);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

// Get Note Description
export const getNoteDescription = async (req, res) => {
  try {
    const { noteId } = req.params;
    const result = await pool.query(
      'SELECT description FROM note_descriptions WHERE note_id = $1',
      [noteId]
    );
    res.json({ description: result.rows[0]?.description || '' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Note Description
export const updateNoteDescription = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { description } = req.body;
    
    // Upsert the description
    const result = await pool.query(
      `INSERT INTO note_descriptions (note_id, description)
       VALUES ($1, $2)
       ON CONFLICT (note_id)
       DO UPDATE SET description = $2
       RETURNING description`,
      [noteId, description]
    );
    
    res.json({ description: result.rows[0].description });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};