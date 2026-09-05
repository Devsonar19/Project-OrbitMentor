import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'widgets/generator_view.dart';
import 'widgets/mentor_view.dart';
import 'widgets/sidebar.dart';

void main() => runApp(const OrbitMentorApp());

class OrbitMentorApp extends StatefulWidget {
  const OrbitMentorApp({super.key});

  @override
  State<OrbitMentorApp> createState() => _OrbitMentorAppState();
}

class _OrbitMentorAppState extends State<OrbitMentorApp> {
  bool _isDarkMode = true;

  void _toggleTheme() {
    setState(() {
      _isDarkMode = !_isDarkMode;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: _isDarkMode ? AppTheme.darkTheme : ThemeData.light(useMaterial3: true),
      home: Scaffold(
        backgroundColor: const Color(0xFF17181a),
        body: Stack(
          children: [
            Positioned.fill(
              child: CustomPaint(
                painter: DotGridPainter(),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(32),
                  border: Border.all(color: const Color(0xFF1e1f22), width: 2),
                  color: const Color(0xFF121212),
                ),
                clipBehavior: Clip.antiAlias,
                child: MainLayout(
                  isDarkMode: _isDarkMode,
                  onToggleTheme: _toggleTheme,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class DotGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF4e4e4e)
      ..strokeWidth = 1
      ..strokeCap = StrokeCap.round;
    const spacing = 40.0;
    for (double i = 0; i < size.width; i += spacing) {
      for (double j = 0; j < size.height; j += spacing) {
        canvas.drawCircle(Offset(i, j), 1.5, paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class MainLayout extends StatefulWidget {
  final bool isDarkMode;
  final VoidCallback onToggleTheme;

  const MainLayout({
    super.key,
    required this.isDarkMode,
    required this.onToggleTheme,
  });

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _selectedIndex = 0;
  final List<Widget> _views = [const GeneratorView(), const MentorView()];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Row(
        children: [
          const Sidebar(),
          Expanded(
            child: Column(
              children: [
                _buildTopBar(),
                Expanded(child: _views[_selectedIndex]),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTopBar() {
    return Container(
      height: 64,
      decoration: const BoxDecoration(
        color: Color(0xFF121212),
        border: Border(bottom: BorderSide(color: Color(0xFF1e1f22))),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: [
            const Icon(Icons.webhook, size: 20, color: Color(0xFFb8c4ff)),
            const SizedBox(width: 12),
            const Text(
              'Workspace / Production Cluster',
              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13, fontFamily: 'JetBrains Mono'),
            ),
            const SizedBox(width: 32),
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: const Color(0xFF1c1b1b),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFF1e1f22)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _buildTab('Generator', 0),
                  _buildTab('Mentor', 1),
                  _buildTab('Inspector', 2),
                ],
              ),
            ),
            const SizedBox(width: 32),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: const Color(0xFF1c1b1b),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF1e1f22)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(color: Color(0xFF10b981), shape: BoxShape.circle),
                  ),
                  const SizedBox(width: 8),
                  const Text('READY', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11, fontFamily: 'JetBrains Mono')),
                ],
              ),
            ),
            const SizedBox(width: 16),
            ElevatedButton.icon(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFb8c4ff),
                foregroundColor: const Color(0xFF002585),
                elevation: 0,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
              ),
              icon: const Icon(Icons.play_arrow, size: 16),
              label: const Text('Execute', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            ),
            const SizedBox(width: 16),
            IconButton(
              onPressed: widget.onToggleTheme,
              icon: Icon(
                widget.isDarkMode ? Icons.light_mode : Icons.dark_mode,
                color: const Color(0xFFb8c4ff),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTab(String title, int index) {
    final isSelected = _selectedIndex == index;
    return InkWell(
      onTap: () {
        if (index < _views.length) {
          setState(() => _selectedIndex = index);
        }
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF2B3035) : Colors.transparent,
          borderRadius: BorderRadius.circular(6),
        ),
        child: Text(
          title,
          style: TextStyle(
            color: isSelected ? Colors.white : const Color(0xFF94A3B8),
            fontSize: 13,
            fontFamily: 'JetBrains Mono',
          ),
        ),
      ),
    );
  }
}
