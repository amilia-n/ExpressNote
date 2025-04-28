import pool from '../db/connect.js';
import { blockQueries } from '../db/queries.js';

// Create Block
export const createBlock = async (req, res) => {
  try {
    const { page_id, block_type, content, position, x, y } = req.body;

    // Check if page exists
    const pageCheck = await pool.query('SELECT * FROM pages WHERE page_id = $1', [page_id]);
    if (pageCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

      const result = await pool.query(
        blockQueries.createBlock,
      [page_id, block_type, content, position, x, y]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

//Update Block
export const updateBlock = async (req, res) => {
  try {
    const { blockId } = req.params;
    const { content, position, x, y } = req.body;

      const result = await pool.query(
        blockQueries.updateBlock,
      [content, position, x, y, blockId]
      );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Block not found' });
    }

      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Delete Block
export const deleteBlock = async (req, res) => {
  try {
    const { blockId } = req.params;
    const result = await pool.query(blockQueries.deleteBlock, [blockId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Block not found' });
    }

      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Get Blocks by Page
export const getBlocksByPage = async (req, res) => {
  try {
    const { pageId } = req.params;

    // Check if page exists
    const pageCheck = await pool.query('SELECT * FROM pages WHERE page_id = $1', [pageId]);
    if (pageCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

      const result = await pool.query(blockQueries.getBlocksByPage, [pageId]);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Get Blocks by Note
export const getBlocksByNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    // Check if note exists
    const noteCheck = await pool.query('SELECT * FROM notes WHERE note_id = $1', [noteId]);
    if (noteCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

      const result = await pool.query(blockQueries.getBlocksByNote, [noteId]);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

export const getBlockById = async (req, res) => {
  try {
    const { blockId } = req.params;
    const result = await pool.query(blockQueries.getBlockById, [blockId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Block not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};