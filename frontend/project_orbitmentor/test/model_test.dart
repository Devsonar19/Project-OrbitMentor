import 'package:flutter_test/flutter_test.dart';
import 'package:project_orbitmentor/models/idea_models.dart';

void main() {
  group('Model Tests', () {
    test('ProjectIdea fromJson parses correctly', () {
      final json = {
        'id': '123',
        'title': 'Test Idea',
        'description': 'A description',
      };
      final idea = ProjectIdea.fromJson(json);
      expect(idea.id, '123');
      expect(idea.title, 'Test Idea');
      expect(idea.description, 'A description');
    });

    test('MentorResponse fromJson parses correctly', () {
      final json = {
        'response': 'Success',
        'blueprint': {
          'architecture': 'Microservices',
          'rationale': [
            {'tech': 'Flutter', 'reason': 'UI'}
          ],
          'roadmap': [
            {'phase': 'Phase 1', 'tasks': ['Task A']}
          ],
          'components': [
            {'name': 'Frontend', 'purpose': 'Display'}
          ]
        }
      };

      final response = MentorResponse.fromJson(json);
      expect(response.response, 'Success');
      expect(response.blueprint, isNotNull);
      expect(response.blueprint!.architecture, 'Microservices');
      expect(response.blueprint!.rationale.first.tech, 'Flutter');
      expect(response.blueprint!.roadmap.first.phase, 'Phase 1');
      expect(response.blueprint!.components.first.name, 'Frontend');
    });
  });
}
