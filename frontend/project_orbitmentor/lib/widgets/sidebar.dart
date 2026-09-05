import 'package:flutter/material.dart';

class Sidebar extends StatelessWidget {
  const Sidebar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 280,
      decoration: const BoxDecoration(
        color: Color(0xFF1c1b1b),
        border: Border(right: BorderSide(color: Color(0xFF1e1f22))),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildHeader(),
          const SizedBox(height: 16),
          _buildRecentProjectsHeader(),
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                _buildProjectItem('Healthcare ML API', 'L2', '2m ago', 'Safe', true),
                _buildProjectItem('FinTech Clearing Pipeline', 'L1', '1h ago', 'Innov', false),
                _buildProjectItem('Drone Fleet Telemetry', 'L3', '5h ago', 'Moon', false),
                _buildProjectItem('Identity Auth Service', 'L2', 'Yesterday', 'Safe', false),
                _buildProjectItem('Adaptive Tutor Platform', 'L1', '3d ago', 'Innov', false),
              ],
            ),
          ),
          _buildFooter(),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Row(
        children: [
          const Icon(Icons.webhook, color: Color(0xFFb8c4ff), size: 24),
          const SizedBox(width: 12),
          const Text(
            'STITCH',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 18,
              letterSpacing: 2,
              fontFamily: 'JetBrains Mono',
            ),
          ),
          const Spacer(),
          const Text(
            'v1.0.4',
            style: TextStyle(
              color: Color(0xFF94A3B8),
              fontSize: 12,
              fontFamily: 'JetBrains Mono',
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentProjectsHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: const [
          Text(
            'RECENT PROJECTS',
            style: TextStyle(
              color: Color(0xFF94A3B8),
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.2,
              fontFamily: 'JetBrains Mono',
            ),
          ),
          Icon(Icons.add, color: Color(0xFF94A3B8), size: 16),
        ],
      ),
    );
  }

  Widget _buildProjectItem(String title, String level, String time, String type, bool isSelected) {
    Color levelColor = const Color(0xFF94A3B8);
    if (level == 'L3') levelColor = const Color(0xFFF59E0B);

    return Container(
      color: isSelected ? const Color(0xFF2B3035) : Colors.transparent,
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    color: isSelected ? Colors.white : const Color(0xFFF1F3F5),
                    fontSize: 13,
                    fontFamily: 'JetBrains Mono',
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Text(
                      time,
                      style: const TextStyle(
                        color: Color(0xFF94A3B8),
                        fontSize: 11,
                        fontFamily: 'JetBrains Mono',
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Text('·', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
                    const SizedBox(width: 8),
                    Text(
                      type,
                      style: const TextStyle(
                        color: Color(0xFF94A3B8),
                        fontSize: 11,
                        fontFamily: 'JetBrains Mono',
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Text(
            level,
            style: TextStyle(
              color: levelColor,
              fontSize: 12,
              fontWeight: FontWeight.bold,
              fontFamily: 'JetBrains Mono',
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFooter() {
    return Container(
      padding: const EdgeInsets.all(24.0),
      decoration: const BoxDecoration(
        border: Border(top: BorderSide(color: Color(0xFF1e1f22))),
      ),
      child: Row(
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: const BoxDecoration(color: Color(0xFF94A3B8), shape: BoxShape.circle),
          ),
          const SizedBox(width: 8),
          const Text(
            'OPERATIONAL',
            style: TextStyle(
              color: Color(0xFF94A3B8),
              fontSize: 11,
              letterSpacing: 1.2,
              fontFamily: 'JetBrains Mono',
            ),
          ),
          const Spacer(),
          const Icon(Icons.dark_mode_outlined, color: Color(0xFF94A3B8), size: 18),
          const SizedBox(width: 12),
          const Icon(Icons.settings_outlined, color: Color(0xFF94A3B8), size: 18),
        ],
      ),
    );
  }
}
