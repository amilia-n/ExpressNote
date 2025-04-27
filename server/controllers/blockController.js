const pool = require("../db/connect");
const { blockQueries } = require('../db/queries');

// Create Block
exports.createBlock = async (req, res) => {
    const { noteId, pageId } = req.params;
    const { block_type, content, position, x, y } = req.body;
    try {
      const noteCheck = await pool.query(
        "SELECT * FROM notes WHERE note_id = $1 AND user_id = $2",
        [noteId, req.user.user_id]
      );
  
      if (noteCheck.rows.length === 0) {
        return res.status(404).json({ error: "Note not found" });
      }
  
      const result = await pool.query(
        blockQueries.createBlock,
        [pageId, block_type, content, position, x, y]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

//Update Block
exports.updateBlock = async (req, res) => {
    const { noteId, pageId, blockId } = req.params;
    const { content, position, x, y } = req.body;
    try {
      const noteCheck = await pool.query(
        "SELECT * FROM notes WHERE note_id = $1 AND user_id = $2",
        [noteId, req.user.user_id]
      );
  
      if (noteCheck.rows.length === 0) {
        return res.status(404).json({ error: "Note not found" });
      }
  
      const result = await pool.query(
        blockQueries.updateBlock,
        [content, position, x, y, blockId, pageId]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Delete Block
exports.deleteBlock = async (req, res) => {
    const { noteId, pageId, blockId } = req.params;
    try {
      const noteCheck = await pool.query(
        "SELECT * FROM notes WHERE note_id = $1 AND user_id = $2",
        [noteId, req.user.user_id]
      );
  
      if (noteCheck.rows.length === 0) {
        return res.status(404).json({ error: "Note not found" });
      }
  
      await pool.query(blockQueries.deleteBlock, [blockId, pageId]);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Get All Blocks for a Page
exports.getBlocksByPage = async (req, res) => {
    const { noteId, pageId } = req.params;
    try {
      const noteCheck = await pool.query(
        "SELECT * FROM notes WHERE note_id = $1 AND user_id = $2",
        [noteId, req.user.user_id]
      );
  
      if (noteCheck.rows.length === 0) {
        return res.status(404).json({ error: "Note not found" });
      }
  
      const result = await pool.query(
        blockQueries.getBlocksByPage,
        [pageId]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Get All Blocks for a Note
exports.getBlocksByNote = async (req, res) => {
    const { noteId } = req.params;
    try {
      const noteCheck = await pool.query(
        "SELECT * FROM notes WHERE note_id = $1 AND user_id = $2",
        [noteId, req.user.user_id]
      );
  
      if (noteCheck.rows.length === 0) {
        return res.status(404).json({ error: "Note not found" });
      }
  
      const result = await pool.query(
        blockQueries.getBlocksByNote,
        [noteId]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };