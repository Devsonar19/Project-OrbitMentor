import 'package:flutter_test/flutter_test.dart';
import 'package:project_orbitmentor/services/api_service.dart';

void main() {
  group('API Service Tests', () {
    test('generateIdeas gracefully falls back on error', () async {
      // The API endpoint is not running locally, so it should fallback
      final ideas = await ApiService.generateIdeas(
        skills: ['Flutter'],
        domain: 'Test Domain',
        tier: 'Safe',
      );

      expect(ideas, isNotEmpty);
      expect(ideas.first.title.contains('Test Domain'), isTrue);
    });

    test('getMentorBlueprint gracefully falls back on error', () async {
      final response = await ApiService.getMentorBlueprint(
        ideaTitle: 'Test Idea',
        skills: ['Python'],
        domain: 'AI',
      );

      expect(response.response.contains('fallback'), isTrue);
      expect(response.blueprint, isNotNull);
      expect(response.blueprint!.rationale, isNotEmpty);
    });
  });
}
