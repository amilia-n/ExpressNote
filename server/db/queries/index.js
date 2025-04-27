const noteQueries = {
    createNote: `
      INSERT INTO notes (user_id, title) 
      VALUES ($1, $2) 
      RETURNING *
    `,
    getNoteWithContent: `
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
                  'content', b.content,
                  'position', b.position,
                  'x', b.x,
                  'y', b.y
                ) ORDER BY b.position
              )
              FROM blocks b
              WHERE b.page_id = p.page_id
            )
          ) ORDER BY p.position
        ) as pages
      FROM notes n
      LEFT JOIN pages p ON n.note_id = p.note_id
      WHERE n.note_id = $1 AND n.user_id = $2
      GROUP BY n.note_id
    `,
    getAllNotes: `
    SELECT note_id, title, created_at, updated_at
    FROM notes 
    WHERE user_id = $1 
    ORDER BY updated_at DESC
  `,
    deleteNote: `
    DELETE FROM notes 
    WHERE note_id = $1 AND user_id = $2
  `
  };
  
  const pageQueries = {
    createPage: `
      INSERT INTO pages (note_id, position) 
      VALUES ($1, $2) 
      RETURNING *
    `,
    updatePosition: `
      UPDATE pages 
      SET position = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE page_id = $2 AND note_id = $3
      RETURNING *
    `,
    deletePage: `
    DELETE FROM pages 
    WHERE page_id = $1 AND note_id = $2
  `
  };
  
  const blockQueries = {
    createBlock: `
      INSERT INTO blocks (page_id, block_type, content, position, x, y)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
    updateBlock: `
      UPDATE blocks
      SET content = COALESCE($1, content),
          position = COALESCE($2, position),
          x = COALESCE($3, x),
          y = COALESCE($4, y),
          updated_at = CURRENT_TIMESTAMP
      WHERE block_id = $5 AND page_id = $6
      RETURNING *
    `,
    deleteBlock: `
    DELETE FROM blocks 
    WHERE block_id = $1 AND page_id = $2
  `
  };
  
  module.exports = {
    noteQueries,
    pageQueries,
    blockQueries
  };