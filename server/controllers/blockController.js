const pool = require("../db/connect");

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
      `INSERT INTO blocks 
        (page_id, block_type, content, position, x, y) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
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
      `UPDATE blocks 
       SET content = COALESCE($1, content),
           position = COALESCE($2, position),
           x = COALESCE($3, x),
           y = COALESCE($4, y),
           updated_at = CURRENT_TIMESTAMP
       WHERE block_id = $5 AND page_id = $6
       RETURNING *`,
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

    await pool.query(
      "DELETE FROM blocks WHERE block_id = $1 AND page_id = $2",
      [blockId, pageId]
    );
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};