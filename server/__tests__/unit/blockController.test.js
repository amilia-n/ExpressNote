// Mock the database module
vi.mock('../../db/connect', () => ({
  default: {
    query: vi.fn()
  }
}));

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TEST_USER, TEST_PAGE, TEST_BLOCK } from '../setup';
import pool from '../../db/connect';
import * as blockController from '../../controllers/blockController';

describe('Block Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Setup request mock
    mockReq = {
      params: {},
      body: {}
    };
    
    // Setup response mock
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      end: vi.fn()
    };
    
    // Setup default mock responses for pool.query
    pool.query.mockImplementation((text, params) => {
      // For page existence check
      if (text.includes('SELECT * FROM pages WHERE page_id = $1')) {
        if (params[0] === TEST_PAGE.page_id) {
          return Promise.resolve({
            rows: [{ page_id: TEST_PAGE.page_id }]
          });
        } else {
          return Promise.resolve({ rows: [] });
        }
      }

      // For createBlock
      if (text.includes('INSERT INTO blocks')) {
        return Promise.resolve({
          rows: [{
            block_id: TEST_BLOCK.block_id,
            page_id: params[0],
            block_type: params[1],
            content: params[2],
            position: params[3],
            x: params[4],
            y: params[5]
          }]
        });
      }
      
      // For getBlocksByPage
      if (text.includes('SELECT * FROM blocks WHERE page_id = $1')) {
        if (params[0] === TEST_PAGE.page_id) {
          return Promise.resolve({
            rows: [{
              block_id: TEST_BLOCK.block_id,
              page_id: TEST_PAGE.page_id,
              block_type: 'text',
              content: 'Test content',
              position: 0,
              x: 0,
              y: 0
            }]
          });
        } else {
          return Promise.resolve({ rows: [] });
        }
      }
      
      // For getBlockById
      if (text.includes('SELECT * FROM blocks WHERE block_id = $1')) {
        if (params[0] === TEST_BLOCK.block_id) {
          return Promise.resolve({
            rows: [{
              block_id: TEST_BLOCK.block_id,
              page_id: TEST_PAGE.page_id,
              block_type: 'text',
              content: 'Test content',
              position: 0,
              x: 0,
              y: 0
            }]
          });
        } else {
          return Promise.resolve({ rows: [] });
        }
      }
      
      // For updateBlock
      if (text.includes('UPDATE blocks SET')) {
        if (params[params.length - 1] === TEST_BLOCK.block_id) {
          return Promise.resolve({
            rows: [{
              block_id: TEST_BLOCK.block_id,
              page_id: TEST_PAGE.page_id,
              block_type: 'text',
              content: params[0],
              position: params[1],
              x: params[2],
              y: params[3]
            }]
          });
        } else {
          return Promise.resolve({ rows: [] });
        }
      }
      
      // For deleteBlock
      if (text.includes('DELETE FROM blocks WHERE block_id = $1')) {
        if (params[0] === TEST_BLOCK.block_id) {
          return Promise.resolve({
            rows: [{
              block_id: TEST_BLOCK.block_id,
              page_id: TEST_PAGE.page_id,
              block_type: 'text',
              content: 'Test content',
              position: 0,
              x: 0,
              y: 0
            }]
          });
        } else {
          return Promise.resolve({ rows: [] });
        }
      }
      
      // Default response
      return Promise.resolve({ rows: [] });
    });
  });

  describe('createBlock', () => {
    it('should create a block successfully', async () => {
      mockReq = {
        user: TEST_USER,
        params: {},
        body: {
          page_id: TEST_PAGE.page_id,
          block_type: 'text',
          content: 'Test content',
          position: 0,
          x: 0,
          y: 0
        }
      };

      await blockController.createBlock(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          page_id: TEST_PAGE.page_id,
          block_type: 'text',
          content: 'Test content',
          position: 0,
          x: 0,
          y: 0
        })
      );
    });

    it('should handle errors when pageId is invalid', async () => {
      mockReq = {
        user: TEST_USER,
        params: {},
        body: {
          page_id: 999,
        block_type: 'text',
        content: 'Test content',
        position: 0,
        x: 0,
        y: 0
        }
      };

      await blockController.createBlock(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Page not found' });
    });
  });

  describe('getBlocksByPage', () => {
    it('should get all blocks for a page', async () => {
      mockReq = {
        user: TEST_USER,
        params: { pageId: TEST_PAGE.page_id }
      };

      await blockController.getBlocksByPage(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([
        expect.objectContaining({
            block_id: TEST_BLOCK.block_id,
            page_id: TEST_PAGE.page_id,
            block_type: 'text',
            content: 'Test content',
            position: 0
          })
        ])
      );
    });

    it('should return 404 for non-existent page', async () => {
      mockReq = {
        user: TEST_USER,
        params: { pageId: 999 }
      };

      await blockController.getBlocksByPage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Page not found' });
    });
  });

  describe('getBlockById', () => {
    it('should get a block by id', async () => {
      mockReq = {
        user: TEST_USER,
        params: { blockId: TEST_BLOCK.block_id }
      };

      await blockController.getBlockById(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          block_id: TEST_BLOCK.block_id,
          page_id: TEST_PAGE.page_id,
        block_type: 'text',
        content: 'Test content'
        })
      );
    });

    it('should return 404 for non-existent block', async () => {
      mockReq = {
        user: TEST_USER,
        params: { blockId: 999 }
      };

      await blockController.getBlockById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Block not found' });
    });
  });

  describe('updateBlock', () => {
    it('should update block content and position', async () => {
      mockReq = {
        user: TEST_USER,
        params: { blockId: TEST_BLOCK.block_id },
        body: {
          content: 'Updated content',
          position: 1,
          x: 10,
          y: 10
        }
      };

      await blockController.updateBlock(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          block_id: TEST_BLOCK.block_id,
        content: 'Updated content',
        position: 1,
        x: 10,
        y: 10
        })
      );
    });

    it('should return 404 for non-existent block', async () => {
      mockReq = {
        user: TEST_USER,
        params: { blockId: 999 },
        body: {
          content: 'Updated content',
          position: 1,
          x: 10,
          y: 10
        }
      };

      await blockController.updateBlock(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Block not found' });
    });
  });

  describe('deleteBlock', () => {
    it('should delete a block', async () => {
      mockReq = {
        user: TEST_USER,
        params: { blockId: TEST_BLOCK.block_id }
      };

      await blockController.deleteBlock(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.end).toHaveBeenCalled();
    });

    it('should return 404 for non-existent block', async () => {
      mockReq = {
        user: TEST_USER,
        params: { blockId: 999 }
      };

      await blockController.deleteBlock(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Block not found' });
    });
  });
});
