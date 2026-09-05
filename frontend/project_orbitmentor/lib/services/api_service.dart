import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/idea_models.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:8000/api';

  static Future<List<ProjectIdea>> generateIdeas({
    required List<String> skills,
    required String domain,
    required String tier,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/generate'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'skills': skills,
          'domain': domain,
          'tier': tier,
        }),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final list = data['ideas'] as List;
        return list.map((item) => ProjectIdea.fromJson(item)).toList();
      } else {
        throw Exception('Server error: ${response.statusCode}');
      }
    } catch (e) {
      // Fallback mock ideas if backend is offline so the hackathon app is fully testable
      await Future.delayed(const Duration(seconds: 1));
      return [
        ProjectIdea(
          id: '1',
          title: '$domain AI Copilot ($tier)',
          description: 'An advanced system leveraging ${skills.join(', ')} for real-time analytics and automated workflow execution.',
        ),
        ProjectIdea(
          id: '2',
          title: 'Decentralized $domain Mesh',
          description: 'A secure, fault-tolerant architecture built with modern protocols and AI agents.',
        ),
        ProjectIdea(
          id: '3',
          title: 'Autonomous $domain Intelligence Engine',
          description: 'High-throughput processing engine designed for high-scale enterprise deployment.',
        ),
      ];
    }
  }

  static Future<MentorResponse> getMentorBlueprint({
    required String ideaTitle,
    required List<String> skills,
    required String domain,
    String? ideaSummary,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/mentor'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'idea_title': ideaTitle,
          'skills': skills,
          'domain': domain,
          'idea_summary': ideaSummary,
        }),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return MentorResponse.fromJson(data);
      } else {
        throw Exception('Server error: ${response.statusCode}');
      }
    } catch (e) {
      await Future.delayed(const Duration(seconds: 1));
      return MentorResponse(
        response: 'Generated fallback mentorship blueprint',
        blueprint: MentorBlueprint(
          architecture: 'Microservices event-driven architecture with secure API gateway.',
          rationale: [TechRationale(tech: 'FastAPI', reason: 'High performance asynchronous execution')],
          roadmap: [RoadmapPhase(phase: 'Phase 1: Research & Setup', tasks: ['Requirements analysis', 'Repo setup'])],
          components: [ModuleComponent(name: 'API Gateway', purpose: 'Request routing and authentication')],
        ),
      );
    }
  }
}
