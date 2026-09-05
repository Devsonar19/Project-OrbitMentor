class ProjectIdea {
  final String id;
  final String title;
  final String description;

  ProjectIdea({required this.id, required this.title, required this.description});

  factory ProjectIdea.fromJson(Map<String, dynamic> json) {
    return ProjectIdea(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
    );
  }
}

class TechRationale {
  final String tech;
  final String reason;

  TechRationale({required this.tech, required this.reason});

  factory TechRationale.fromJson(Map<String, dynamic> json) {
    return TechRationale(
      tech: json['tech'] ?? '',
      reason: json['reason'] ?? '',
    );
  }
}

class ModuleComponent {
  final String name;
  final String purpose;

  ModuleComponent({required this.name, required this.purpose});

  factory ModuleComponent.fromJson(Map<String, dynamic> json) {
    return ModuleComponent(
      name: json['name'] ?? '',
      purpose: json['purpose'] ?? '',
    );
  }
}

class RoadmapPhase {
  final String phase;
  final List<String> tasks;

  RoadmapPhase({required this.phase, required this.tasks});

  factory RoadmapPhase.fromJson(Map<String, dynamic> json) {
    return RoadmapPhase(
      phase: json['phase'] ?? '',
      tasks: (json['tasks'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
    );
  }
}

class MentorBlueprint {
  final String architecture;
  final List<TechRationale> rationale;
  final List<RoadmapPhase> roadmap;
  final List<ModuleComponent> components;

  MentorBlueprint({
    required this.architecture,
    required this.rationale,
    required this.roadmap,
    required this.components,
  });

  factory MentorBlueprint.fromJson(Map<String, dynamic> json) {
    return MentorBlueprint(
      architecture: json['architecture'] ?? '',
      rationale: (json['rationale'] as List<dynamic>?)
              ?.map((e) => TechRationale.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      roadmap: (json['roadmap'] as List<dynamic>?)
              ?.map((e) => RoadmapPhase.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      components: (json['components'] as List<dynamic>?)
              ?.map((e) => ModuleComponent.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}

class MentorResponse {
  final String response;
  final MentorBlueprint? blueprint;

  MentorResponse({required this.response, this.blueprint});

  factory MentorResponse.fromJson(Map<String, dynamic> json) {
    return MentorResponse(
      response: json['response'] ?? '',
      blueprint: json['blueprint'] != null
          ? MentorBlueprint.fromJson(json['blueprint'] as Map<String, dynamic>)
          : null,
    );
  }
}
