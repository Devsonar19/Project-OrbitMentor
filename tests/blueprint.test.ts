import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { handleGenerateIdeas, handleMentorBlueprint } from '../src/server/geminiService';

describe('OrbitMentor Blueprint & Generator Engine', () => {
  it('generates 3 structured ideas across Safe, Applied ML, and Super tiers', async () => {
    const result = await handleGenerateIdeas({
      domain: 'Cloud Infrastructure & DevOps',
      skills: ['Docker', 'Kubernetes', 'Go'],
      tier: 'Safe',
    });

    assert.ok(result.ideas);
    assert.equal(result.ideas.length, 3);

    const tiers = result.ideas.map((i) => i.tier);
    assert.ok(tiers.includes('Safe'));
    assert.ok(tiers.includes('Applied ML'));
    assert.ok(tiers.includes('Super'));

    for (const idea of result.ideas) {
      assert.ok(idea.id);
      assert.ok(idea.title.length > 5);
      assert.ok(idea.problem.length > 10);
      assert.ok(idea.solution.length > 10);
      assert.ok(Array.isArray(idea.recommended_stack));
      assert.ok(idea.recommended_stack.length >= 2);
      assert.ok(Array.isArray(idea.key_features));
      assert.ok(idea.key_features.length >= 3);
      assert.ok(idea.feasibility_score);
      assert.ok(idea.why_good_for_final_year);
    }
  });

  it('produces a university-aligned 16-week roadmap with 4 milestone phases', async () => {
    const result = await handleMentorBlueprint({
      idea_title: 'Automated Microservice Health Sentinel',
      domain: 'Cloud Infrastructure',
      skills: ['Go', 'Docker', 'Prometheus'],
      tier: 'Applied ML',
    });

    assert.ok(result.blueprint);
    const { blueprint } = result;

    assert.ok(blueprint.project_overview);
    assert.ok(blueprint.system_architecture_summary);

    // 16-week phases
    assert.equal(blueprint.roadmap_phases?.length, 4);
    assert.equal(blueprint.roadmap_phases?.[0]?.timeframe, 'Weeks 1 - 4');
    assert.equal(blueprint.roadmap_phases?.[1]?.timeframe, 'Weeks 5 - 8');
    assert.equal(blueprint.roadmap_phases?.[2]?.timeframe, 'Weeks 9 - 12');
    assert.equal(blueprint.roadmap_phases?.[3]?.timeframe, 'Weeks 13 - 16');

    for (const phase of blueprint.roadmap_phases || []) {
      assert.ok(phase.phase_title);
      assert.ok(phase.goal);
      assert.ok(phase.tasks && phase.tasks.length >= 2);
      assert.ok(phase.deliverables);
    }

    // Tech stack comparison
    assert.ok(blueprint.tech_stack_comparison && blueprint.tech_stack_comparison.length >= 2);
    for (const comp of blueprint.tech_stack_comparison || []) {
      assert.ok(comp.technology);
      assert.ok(comp.why_better);
      assert.ok(comp.verdict);
    }

    // Viva defense tips
    assert.ok(blueprint.viva_defense_tips && blueprint.viva_defense_tips.length >= 3);
  });
});
