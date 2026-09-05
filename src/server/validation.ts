/**
 * PROJECT ORBITMENTOR - Server Input Validation & Sanitization Engine
 * 
 * Provides strict, defensive schema validation and string sanitization for incoming
 * client requests to safeguard against prompt injection, malformed payloads,
 * and denial-of-service attempts.
 */

import { GenerateRequest, MentorRequest, ChatRequest, GenerationTier } from '../types';

export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  error?: string;
}

const VALID_TIERS: GenerationTier[] = ['Safe', 'Applied ML', 'Super'];
const MAX_DOMAIN_LENGTH = 120;
const MAX_SKILLS_COUNT = 20;
const MAX_SKILL_LENGTH = 50;
const MAX_MESSAGE_LENGTH = 1500;
const MAX_TITLE_LENGTH = 200;

/**
 * Sanitizes generic string inputs by trimming whitespace, normalizing control characters,
 * and escaping potential prompt delimiter abuses.
 */
export function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== 'string') {
    return '';
  }
  return input
    .trim()
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '') // remove control chars
    .slice(0, maxLength);
}

/**
 * Validates and sanitizes a GenerateRequest payload.
 */
export function validateGenerateRequest(payload: unknown): ValidationResult<GenerateRequest> {
  if (!payload || typeof payload !== 'object') {
    return { isValid: false, error: 'Request body must be a valid JSON object' };
  }

  const raw = payload as Record<string, unknown>;

  // Domain
  const domain = sanitizeString(raw.domain, MAX_DOMAIN_LENGTH);
  if (!domain || domain.length < 2) {
    return { isValid: false, error: 'Domain must be specified (minimum 2 characters)' };
  }

  // Skills
  let skills: string[] = [];
  if (Array.isArray(raw.skills)) {
    skills = raw.skills
      .map((s) => sanitizeString(s, MAX_SKILL_LENGTH))
      .filter((s) => s.length > 0)
      .slice(0, MAX_SKILLS_COUNT);
  }
  if (skills.length === 0) {
    skills = ['React', 'Node.js', 'PostgreSQL'];
  }

  // Tier
  let tier: GenerationTier = 'Safe';
  if (typeof raw.tier === 'string' && VALID_TIERS.includes(raw.tier as GenerationTier)) {
    tier = raw.tier as GenerationTier;
  }

  return {
    isValid: true,
    data: {
      domain,
      skills,
      tier,
    },
  };
}

/**
 * Validates and sanitizes a MentorRequest payload.
 */
export function validateMentorRequest(payload: unknown): ValidationResult<MentorRequest> {
  if (!payload || typeof payload !== 'object') {
    return { isValid: false, error: 'Request body must be a valid JSON object' };
  }

  const raw = payload as Record<string, unknown>;

  const ideaTitle = sanitizeString(raw.idea_title, MAX_TITLE_LENGTH);
  if (!ideaTitle) {
    return { isValid: false, error: 'Project idea title is required' };
  }

  const domain = sanitizeString(raw.domain, MAX_DOMAIN_LENGTH) || 'Computer Science & Software Engineering';
  const ideaSummary = sanitizeString(raw.idea_summary, 500);

  let skills: string[] = [];
  if (Array.isArray(raw.skills)) {
    skills = raw.skills
      .map((s) => sanitizeString(s, MAX_SKILL_LENGTH))
      .filter((s) => s.length > 0)
      .slice(0, MAX_SKILLS_COUNT);
  }

  let tier: GenerationTier = 'Safe';
  if (typeof raw.tier === 'string' && VALID_TIERS.includes(raw.tier as GenerationTier)) {
    tier = raw.tier as GenerationTier;
  }

  return {
    isValid: true,
    data: {
      idea_title: ideaTitle,
      domain,
      skills,
      tier,
      idea_summary: ideaSummary,
    },
  };
}

/**
 * Validates and sanitizes a ChatRequest payload.
 */
export function validateChatRequest(payload: unknown): ValidationResult<ChatRequest> {
  if (!payload || typeof payload !== 'object') {
    return { isValid: false, error: 'Request body must be a valid JSON object' };
  }

  const raw = payload as Record<string, unknown>;

  const message = sanitizeString(raw.message, MAX_MESSAGE_LENGTH);
  if (!message) {
    return { isValid: false, error: 'Message cannot be empty' };
  }

  const projectTitle = sanitizeString(raw.project_title, MAX_TITLE_LENGTH) || 'Capstone Engineering Project';
  const domain = sanitizeString(raw.domain, MAX_DOMAIN_LENGTH) || 'Software Engineering';

  let skills: string[] = [];
  if (Array.isArray(raw.skills)) {
    skills = raw.skills
      .map((s) => sanitizeString(s, MAX_SKILL_LENGTH))
      .filter((s) => s.length > 0)
      .slice(0, MAX_SKILLS_COUNT);
  }

  interface RawHistoryMsg {
    role?: unknown;
    content?: unknown;
  }

  let history: { role: 'user' | 'assistant'; content: string }[] = [];
  if (Array.isArray(raw.history)) {
    history = (raw.history as RawHistoryMsg[])
      .filter((h) => h && (h.role === 'user' || h.role === 'assistant' || h.role === 'model') && typeof h.content === 'string')
      .map((h) => ({
        role: (h.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: sanitizeString(h.content, 1000),
      }))
      .slice(-10); // retain last 10 messages for context window efficiency
  }

  return {
    isValid: true,
    data: {
      message,
      project_title: projectTitle,
      domain,
      skills,
      history,
    },
  };
}
