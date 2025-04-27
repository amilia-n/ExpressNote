const pool = require("../db/connect");

exports.verifyNoteOwnership = async (noteId, userId) => {
  const result = await pool.query(
    "SELECT * FROM notes WHERE note_id = $1 AND user_id = $2",
    [noteId, userId]
  );
  return result.rows.length > 0;
};

exports.verifyPageBelongsToNote = async (pageId, noteId) => {
  const result = await pool.query(
    "SELECT * FROM pages WHERE page_id = $1 AND note_id = $2",
    [pageId, noteId]
  );
  return result.rows.length > 0;
};