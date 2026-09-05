import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'widgets/generator_view.dart';
import 'widgets/mentor_view.dart';
import 'widgets/sidebar.dart';
import 'models/idea_models.dart';

void main() => runApp(const OrbitMentorApp());

class OrbitMentorApp extends StatelessWidget {
  const OrbitMentorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: AppTheme.darkTheme,
      home: const MainLayout(),
    );
  }
}

class MainLayout extends StatefulWidget {
  const MainLayout({super.key});

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _selectedIndex = 0;

  ProjectIdea? _selectedIdea;
  List<String> _selectedSkills = [];
  String _selectedDomain = '';

  void _onExploreIdea(ProjectIdea idea, List<String> skills, String domain) {
    setState(() {
      _selectedIdea = idea;
      _selectedSkills = skills;
      _selectedDomain = domain;
      _selectedIndex = 1; // Switch to Mentor view
    });
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> views = [
      GeneratorView(onExploreIdea: _onExploreIdea),
      MentorView(
        idea: _selectedIdea,
        skills: _selectedSkills,
        domain: _selectedDomain,
      )
    ];

    return Scaffold(
      drawer: const Sidebar(),
      body: Row(
        children: [
          Expanded(child: views[_selectedIndex]),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (index) => setState(() => _selectedIndex = index),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.bolt, size: 48), label: 'Generator'),
          NavigationDestination(icon: Icon(Icons.school, size: 48), label: 'Mentor'),
        ],
      ),
    );
  }
}
