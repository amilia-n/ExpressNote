export const noteQueries = {
  createNote: 'INSERT INTO notes (user_id, title) VALUES ($1, $2) RETURNING *',
  getAllNotes: 'SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC',
  getNoteById: 'SELECT * FROM notes WHERE note_id = $1',
  updateNoteTitle: 'UPDATE notes SET title = $1 WHERE note_id = $2 RETURNING *',
  deleteNote: 'DELETE FROM notes WHERE note_id = $1'
};

export const pageQueries = {
  createPage: 'INSERT INTO pages (note_id, position) VALUES ($1, $2) RETURNING *',
  getPagesByNoteId: 'SELECT * FROM pages WHERE note_id = $1 ORDER BY position',
  getPageById: 'SELECT * FROM pages WHERE page_id = $1',
  updatePagePosition: 'UPDATE pages SET position = $1 WHERE page_id = $2 RETURNING *',
  deletePage: 'DELETE FROM pages WHERE page_id = $1'
};

export const blockQueries = {
  createBlock: 'INSERT INTO blocks (page_id, block_type, content, position, x, y) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
  getBlocksByPage: 'SELECT * FROM blocks WHERE page_id = $1 ORDER BY position',
  getBlockById: 'SELECT * FROM blocks WHERE block_id = $1',
  updateBlock: 'UPDATE blocks SET content = $1, position = $2, x = $3, y = $4 WHERE block_id = $5 RETURNING *',
  deleteBlock: 'DELETE FROM blocks WHERE block_id = $1'
}; 