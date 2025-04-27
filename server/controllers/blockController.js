const pool = require("../db/connect");
const { blockQueries } = require('../db/queries');

// Create Block
exports.createBlock = async (req, res) => {
    const { pageId } = req.params;
    const { block_type, content, position, x, y } = req.body;
    try {
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
    const { pageId, blockId } = req.params;
    const { content, position, x, y } = req.body;
    try {
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
    const { pageId, blockId } = req.params;
    try {
      await pool.query(blockQueries.deleteBlock, [blockId, pageId]);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Get Blocks by Page
exports.getBlocksByPage = async (req, res) => {
    const { pageId } = req.params;
    try {
      const result = await pool.query(blockQueries.getBlocksByPage, [pageId]);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Get Blocks by Note
exports.getBlocksByNote = async (req, res) => {
    const { noteId } = req.params;
    try {
      const result = await pool.query(blockQueries.getBlocksByNote, [noteId]);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };