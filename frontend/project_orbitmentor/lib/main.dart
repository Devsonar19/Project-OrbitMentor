import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'widgets/generator_view.dart';
import 'widgets/mentor_view.dart';
import 'widgets/sidebar.dart';

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
  final List<Widget> _views = [const GeneratorView(), const MentorView()];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const Sidebar(),
      body: Row(
        children: [
          Expanded(child: _views[_selectedIndex]),
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
