import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateGenerateRequest,
  validateMentorRequest,
  validateChatRequest,
  sanitizeString,
} from '../src/server/validation';

describe('Validation & Sanitization Engine', () => {
  describe('sanitizeString', () => {
    it('trims whitespace and removes invisible control characters', () => {
      const input = '  \u0000Hello \u001FWorld!  ';
      const output = sanitizeString(input, 50);
      assert.equal(output, 'Hello World!');
    });

    it('enforces maximum character length strictly', () => {
      const longString = 'A'.repeat(200);
      const output = sanitizeString(longString, 50);
      assert.equal(output.length, 50);
    });

    it('handles non-string values safely', () => {
      assert.equal(sanitizeString(null, 50), '');
      assert.equal(sanitizeString(undefined, 50), '');
      assert.equal(sanitizeString(12345, 50), '');
      assert.equal(sanitizeString({}, 50), '');
    });
  });

  describe('validateGenerateRequest', () => {
    it('accepts valid domain, skills, and tier', () => {
      const result = validateGenerateRequest({
        domain: 'Healthcare & Medical Systems',
        skills: ['React', 'Python', 'FastAPI'],
        tier: 'Applied ML',
      });
      assert.equal(result.isValid, true);
      assert.equal(result.data?.domain, 'Healthcare & Medical Systems');
      assert.equal(result.data?.tier, 'Applied ML');
      assert.deepEqual(result.data?.skills, ['React', 'Python', 'FastAPI']);
    });

    it('rejects empty or missing domain', () => {
      const result = validateGenerateRequest({ domain: '' });
      assert.equal(result.isValid, false);
      assert.match(result.error || '', /Domain must be specified/);
    });

    it('defaults to Safe tier when invalid tier provided', () => {
      const result = validateGenerateRequest({
        domain: 'FinTech',
        tier: 'UltraImpossible',
      });
      assert.equal(result.isValid, true);
      assert.equal(result.data?.tier, 'Safe');
    });

    it('defaults skills array if empty or missing', () => {
      const result = validateGenerateRequest({
        domain: 'FinTech',
        skills: [],
      });
      assert.equal(result.isValid, true);
      assert.ok((result.data?.skills?.length || 0) > 0);
    });
  });

  describe('validateMentorRequest', () => {
    it('validates project title and constructs clean request', () => {
      const result = validateMentorRequest({
        idea_title: 'AI Smart Health Portal',
        domain: 'Healthcare',
        skills: ['Python', 'PostgreSQL'],
        tier: 'Safe',
      });
      assert.equal(result.isValid, true);
      assert.equal(result.data?.idea_title, 'AI Smart Health Portal');
    });

    it('rejects missing idea_title', () => {
      const result = validateMentorRequest({});
      assert.equal(result.isValid, false);
      assert.match(result.error || '', /title is required/);
    });
  });

  describe('validateChatRequest', () => {
    it('validates student message and retains recent conversation history', () => {
      const result = validateChatRequest({
        message: 'How do I test my REST API endpoints?',
        project_title: 'Smart Health Portal',
        domain: 'Healthcare',
        skills: ['FastAPI'],
        history: [
          { role: 'user', content: 'Hello' },
          { role: 'model', content: 'Hi there!' },
        ],
      });
      assert.equal(result.isValid, true);
      assert.equal(result.data?.message, 'How do I test my REST API endpoints?');
      assert.equal(result.data?.history?.length, 2);
    });

    it('rejects empty chat message', () => {
      const result = validateChatRequest({ message: '   ' });
      assert.equal(result.isValid, false);
      assert.match(result.error || '', /Message cannot be empty/);
    });
  });
});
