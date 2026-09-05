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
