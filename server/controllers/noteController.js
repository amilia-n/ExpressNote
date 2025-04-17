const pool = require('../db/connect');

exports.createNote = async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [req.user.user_id, title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

