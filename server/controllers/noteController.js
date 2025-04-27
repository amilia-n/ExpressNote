const pool = require("../db/connect");

// Create Note Route Handler
exports.createNote = async (req, res) => {
  const { title } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO notes (user_id, title) VALUES ($1, $2) RETURNING *",
      [req.user.user_id, title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve Note w/ Pages and Blocks 
exports.getNoteById = async (req, res) => {
  const noteId = req.params.id;
  try {
    // Get note
    const noteResult = await pool.query(
      "SELECT * FROM notes WHERE note_id = $1 AND user_id = $2",
      [noteId, req.user.user_id]
    );

    if (noteResult.rows.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    const note = noteResult.rows[0];
     // Get pages with blocks
     const pagesResult = await pool.query(
      `SELECT p.*, 
        json_agg(
          json_build_object(
            'block_id', b.block_id,
            'block_type', b.block_type,
            'content', b.content,
            'position', b.position,
            'x', b.x,
            'y', b.y,
            'created_at', b.created_at,
            'updated_at', b.updated_at
          ) ORDER BY b.position
        ) as blocks
      FROM pages p
      LEFT JOIN blocks b ON p.page_id = b.page_id
      WHERE p.note_id = $1
      GROUP BY p.page_id
      ORDER BY p.position`,
      [noteId]
    );
    note.pages = pagesResult.rows.map(page => ({
      ...page,
      blocks: page.blocks[0] === null ? [] : page.blocks
    }));

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};    
// Retrieve All Notes
exports.getAllNotes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT n.*,
        (SELECT json_build_object(
          'page_id', p.page_id,
          'position', p.position,
          'blocks', (
            SELECT json_agg(
              json_build_object(
                'block_id', b.block_id,
                'block_type', b.block_type,
                'content', b.content
              )
            )
            FROM blocks b
            WHERE b.page_id = p.page_id
            ORDER BY b.position
            LIMIT 3
          )
        )
        FROM pages p
        WHERE p.note_id = n.note_id
        ORDER BY p.position
        LIMIT 1) as preview
      FROM notes n
      WHERE n.user_id = $1
      ORDER BY n.updated_at DESC`,
      [req.user.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Note Route Handler
exports.deleteNote = async (req, res) => {
  const noteId = req.params.id;
  try {
    await pool.query("DELETE FROM notes WHERE note_id = $1 AND user_id = $2", [
      noteId,
      req.user.user_id,
    ]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

