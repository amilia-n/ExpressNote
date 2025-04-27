const pool = require("../db/connect");
const { pageQueries } = require("../db/queries");

// Create Page Handler
exports.createPage = async (req, res) => {
  const noteId = req.params.noteId;
  const { position } = req.body;
  try {
    const noteCheck = await pool.query(
      "SELECT * FROM notes WHERE note_id = $1 AND user_id = $2",
      [noteId, req.user.user_id]
    );

    if (noteCheck.rows.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    const result = await pool.query(pageQueries.createPage, [noteId, position]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Handler for Block Position + Update Page
exports.updatePagePosition = async (req, res) => {
  const { noteId, pageId } = req.params;
  const { position } = req.body;
  try {
    const noteCheck = await pool.query(
      "SELECT * FROM notes WHERE note_id = $1 AND user_id = $2",
      [noteId, req.user.user_id]
    );

    if (noteCheck.rows.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    const result = await pool.query(pageQueries.updatePosition, [
      position,
      pageId,
      noteId,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get A Single Page by ID
exports.getPageById = async (req, res) => {
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
        pageQueries.getPageById,
        [pageId, noteId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Page not found" });
      }
  
      const page = result.rows[0];
      
      res.json(page);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Get All Pages
exports.getAllPages = async (req, res) => {
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
        pageQueries.getAllPages,
        [noteId]
      );
  
      const pages = result.rows;
  
      res.json(pages);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Delete Page Handler
exports.deletePage = async (req, res) => {
  const { noteId, pageId } = req.params;
  try {
    const noteCheck = await pool.query(
      "SELECT * FROM notes WHERE note_id = $1 AND user_id = $2",
      [noteId, req.user.user_id]
    );

    if (noteCheck.rows.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    await pool.query(pageQueries.deletePage, [pageId, noteId]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
