import { describe, it, expect, beforeEach, vi } from 'vitest';
import { pool, TEST_USER, TEST_NOTE } from '../setup';
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNoteTitle,
  deleteNote
} from '../../controllers/noteController';

describe('Note Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      send: vi.fn()
    };
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      mockReq = {
        body: { title: 'Test Note' },
        user: { user_id: TEST_USER.user_id }
      };

      await createNote(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          note_id: expect.any(Number),
          title: 'Test Note',
          user_id: TEST_USER.user_id
        })
      );
    });
  });

  describe('getAllNotes', () => {
    it('should return all notes for a user', async () => {
      mockReq = {
        user: { user_id: TEST_USER.user_id }
      };

      await getAllNotes(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            note_id: expect.any(Number),
            title: expect.any(String),
            user_id: TEST_USER.user_id
          })
        ])
      );
    });
  });

  describe('getNoteById', () => {
    it('should return a specific note', async () => {
      mockReq = {
        params: { noteId: TEST_NOTE.note_id },
        user: { user_id: TEST_USER.user_id }
      };

      await getNoteById(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          note_id: expect.any(Number),
          title: expect.any(String),
          user_id: TEST_USER.user_id
        })
      );
    });

    it('should return 404 for non-existent note', async () => {
      mockReq = {
        params: { noteId: 999999 },
        user: { user_id: TEST_USER.user_id }
      };

      await getNoteById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Note not found' });
    });
  });

  describe('updateNoteTitle', () => {
    it('should update a note', async () => {
      mockReq = {
        params: { noteId: TEST_NOTE.note_id },
        body: { title: 'Updated Title' },
        user: { user_id: TEST_USER.user_id }
      };

      await updateNoteTitle(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          note_id: expect.any(Number),
          title: 'Updated Title',
          user_id: TEST_USER.user_id
        })
      );
    });

    it('should return 404 if trying to update non-existent note', async () => {
      mockReq = {
        params: { noteId: 999999 },
        body: { title: 'Non-existent Title' },
        user: { user_id: TEST_USER.user_id }
      };

      await updateNoteTitle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Note not found' });
    });
  });

  describe('deleteNote', () => {
    it('should delete a note', async () => {
      mockReq = {
        params: { noteId: TEST_NOTE.note_id },
        user: { user_id: TEST_USER.user_id }
      };

      await deleteNote(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });
  });
});
