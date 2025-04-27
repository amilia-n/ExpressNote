const { verifyNoteOwnership, verifyPageBelongsToNote } = require('../utils/validators');

exports.validateNoteOwnership = async (req, res, next) => {
  const noteId = req.params.noteId || req.params.id;
  const isOwner = await verifyNoteOwnership(noteId, req.user.user_id);
  
  if (!isOwner) {
    return res.status(404).json({ error: "Note not found" });
  }
  next();
};

exports.validatePageBelongsToNote = async (req, res, next) => {
  const { noteId, pageId } = req.params;
  const belongs = await verifyPageBelongsToNote(pageId, noteId);
  
  if (!belongs) {
    return res.status(404).json({ error: "Page not found" });
  }
  next();
};