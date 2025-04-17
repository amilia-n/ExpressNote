const pool = require('../db/connect');
const callGemini = require('../utils/geminiHelper');

exports.generateFlashcards = async (req, res) => {
    const { content, note_id } = req.body;
    const user_id = req.user.user_id; // Get user_id from authenticated session

    try {
        // check user
        const noteCheck = await pool.query(
            'SELECT * FROM notes WHERE note_id = $1 AND user_id = $2',
            [note_id, user_id]
        );

        if (noteCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Note not found or unauthorized' });
        }

        // Generate flashcards using Gemini
        const flashcards = await callGemini(content);

        // Save flashcard to db
        const savedCards = [];
        for (const card of flashcards.slice(0, 10)) {
            const result = await pool.query(
                `INSERT INTO cards (note_id, header, summary) 
                 VALUES ($1, $2, $3) 
                 RETURNING *`,
                [note_id, card.header, card.summary]
            );
            savedCards.push(result.rows[0]);
        }

        res.status(201).json({
            message: 'Flashcards created successfully',
            cards: savedCards
        });
    } catch (err) {
        console.error('Error creating flashcards:', err);
        res.status(500).json({ error: err.message });
    }
};