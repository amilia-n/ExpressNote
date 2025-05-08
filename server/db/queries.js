export const noteQueries = {
  createNote: "INSERT INTO notes (user_id, title) VALUES ($1, $2) RETURNING *",
  getAllNotes:
    "SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC",
    getNoteById: `
    SELECT n.*, 
      json_agg(
        json_build_object(
          'page_id', p.page_id,
          'position', p.position,
          'blocks', (
            SELECT json_agg(
              json_build_object(
                'block_id', b.block_id,
                'block_type', b.block_type,
                'content', (b.content),
                'position', b.position,
                'x', b.x,
                'y', b.y,
                'color', b.color,
                'opacity', b.opacity
              ) ORDER BY b.position
            )
            FROM blocks b
            WHERE b.page_id = p.page_id
          )
        ) ORDER BY p.position
      ) as pages
    FROM notes n
    LEFT JOIN pages p ON n.note_id = p.note_id
    WHERE n.note_id = $1
    GROUP BY n.note_id
  `,
  updateNoteTitle: "UPDATE notes SET title = $1 WHERE note_id = $2 RETURNING *",
  deleteNote: "DELETE FROM notes WHERE note_id = $1",
};

export const pageQueries = {
  createPage:
    "INSERT INTO pages (note_id, position) VALUES ($1, $2) RETURNING *",
  getPagesByNoteId: "SELECT * FROM pages WHERE note_id = $1 ORDER BY position",
  getPageById: "SELECT * FROM pages WHERE page_id = $1",
  updatePagePosition:
    "UPDATE pages SET position = $1 WHERE page_id = $2 RETURNING *",
  deletePage: "DELETE FROM pages WHERE page_id = $1",
};

export const blockQueries = {
  createBlock: `
  INSERT INTO blocks (page_id, block_type, content, position, x, y, color, opacity) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
  RETURNING *
`,
updateBlock: `
  UPDATE blocks 
  SET content = $1, 
      position = $2, 
      x = $3, 
      y = $4,
      color = $5,
      opacity = $6,
      updated_at = CURRENT_TIMESTAMP
  WHERE block_id = $7 
  RETURNING *
`,
  getBlocksByPage: "SELECT * FROM blocks WHERE page_id = $1 ORDER BY position",
  getBlockById: "SELECT * FROM blocks WHERE block_id = $1",
  deleteBlock: "DELETE FROM blocks WHERE block_id = $1",
};
