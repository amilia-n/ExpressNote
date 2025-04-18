const request = require("supertest");
const express = require("express");
const { Pool } = require("pg");
const http = require("http");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pool = require("../db/connect");

process.env.GEMINI_API_KEY = "test-api-key";
process.env.PORT = "3000";
process.env.NODE_ENV = "test";

const app = require("../server");
let server;

jest.mock("@google/generative-ai");
jest.mock("../db/connect");

jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      startChat: jest.fn().mockReturnValue({
        sendMessage: jest.fn().mockResolvedValue({
          response: [],
        }),
      }),
    }),
  })),
}));

describe("Express App", () => {
  let server;

  beforeAll(() => {
    if (!server && process.env.NODE_ENV !== "test") {
      server = app.listen(0);
    }
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });})
