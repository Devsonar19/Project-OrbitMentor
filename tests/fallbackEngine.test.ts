import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateFallbackIdeas,
  generateFallbackBlueprint,
  generateFallbackChat,
} from '../src/data/fallbackEngine';

describe('Fallback Engine Unit Tests', () => {
  describe('generateFallbackIdeas', () => {
    it('produces 3 distinct ideas across Safe, Applied ML, and Super tiers', () => {
      const result = generateFallbackIdeas('Healthcare & Telemedicine', ['React', 'Python', 'FastAPI'], 'Safe');
      assert.equal(result.source, 'orbitmentor-engine');
      assert.equal(result.ideas.length, 3);

      const tiers = result.ideas.map((idea) => idea.tier);
      assert.ok(tiers.includes('Safe'), 'Should contain Safe tier idea');
      assert.ok(tiers.includes('Applied ML'), 'Should contain Applied ML tier idea');
      assert.ok(tiers.includes('Super'), 'Should contain Super tier idea');
    });

    it('tailors recommendations with user-provided skills', () => {
      const customSkills = ['Flutter', 'Django', 'PostgreSQL'];
      const result = generateFallbackIdeas('Smart Agriculture & Farming', customSkills, 'Safe');
      const safeIdea = result.ideas.find((i) => i.tier === 'Safe');
      assert.ok(safeIdea);
      assert.ok(safeIdea.recommended_stack.includes('Flutter') || safeIdea.recommended_stack.includes('PostgreSQL'));
    });

    it('handles edge case of empty skills and custom domains safely', () => {
      const result = generateFallbackIdeas('Autonomous Drone Logistics', [], 'Super');
      assert.equal(result.ideas.length, 3);
      assert.ok(result.ideas[0].title.length > 0);
      assert.ok(result.ideas[0].key_features.length >= 3);
    });
  });

  describe('generateFallbackBlueprint', () => {
    it('constructs a complete 4-phase academic capstone blueprint', () => {
      const result = generateFallbackBlueprint(
        'AI Medical Image Analyzer',
        'Healthcare',
        ['Python', 'FastAPI', 'PyTorch'],
        'Applied ML',
        'Detects anomalies in chest X-rays'
      );

      assert.equal(result.source, 'orbitmentor-engine');
      assert.ok(result.blueprint);
      assert.ok(result.blueprint.project_overview.includes('AI Medical Image Analyzer') || result.blueprint.project_overview.includes('Healthcare'));
      assert.equal(result.blueprint.roadmap_phases.length, 4);
      assert.ok(result.blueprint.tech_stack_comparison.length >= 3);
      assert.ok(result.blueprint.modules.length >= 3);
      assert.ok(result.blueprint.viva_defense_tips.length >= 4);
    });

    it('ensures each roadmap phase has deliverables and tasks', () => {
      const result = generateFallbackBlueprint('FinTech Ledger', 'Finance', ['Go', 'PostgreSQL'], 'Safe');
      for (const phase of result.blueprint.roadmap_phases) {
        assert.ok(phase.phase_title.length > 0);
        assert.ok(phase.timeframe.length > 0);
        assert.ok(phase.deliverables.length > 0);
        assert.ok(phase.tasks.length >= 2);
      }
    });
  });

  describe('generateFallbackChat', () => {
    it('answers database selection queries with specific engineering advice', () => {
      const result = generateFallbackChat(
        'Which database should I choose for my project evaluation?',
        'HealthHub',
        'Healthcare',
        ['React', 'PostgreSQL']
      );
      assert.equal(result.source, 'orbitmentor-engine');
      assert.match(result.reply, /PostgreSQL/i);
    });

    it('answers dataset questions with verified public sources', () => {
      const result = generateFallbackChat(
        'Where can I find free datasets for training or demoing?',
        'AgriPredict',
        'Smart Agriculture',
        ['Python']
      );
      assert.match(result.reply, /Kaggle|HuggingFace/i);
    });

    it('answers team division questions practically', () => {
      const result = generateFallbackChat(
        'How should we divide the modules among our 3 team members?',
        'E-Commerce Hub',
        'Web Systems',
        ['Node.js', 'React']
      );
      assert.match(result.reply, /Frontend|Backend|Database/i);
    });

    it('answers viva examination questions with examiner focus tips', () => {
      const result = generateFallbackChat(
        'What will the external viva examiner ask me about?',
        'Smart Portal',
        'EdTech',
        ['React']
      );
      assert.match(result.reply, /examiner|viva/i);
    });
  });
});
