import 'package:flutter/material.dart';
import '../models/idea_models.dart';
import '../services/api_service.dart';

class MentorView extends StatefulWidget {
  final ProjectIdea? idea;
  final List<String> skills;
  final String domain;

  const MentorView({
    super.key,
    this.idea,
    this.skills = const [],
    this.domain = '',
  });

  @override
  State<MentorView> createState() => _MentorViewState();
}

class _MentorViewState extends State<MentorView> {

  bool _isLoading = false;
  MentorBlueprint? _blueprint;
  String _error = '';

  @override
  void initState() {
    super.initState();
    _fetchBlueprint();
  }

  @override
  void didUpdateWidget(covariant MentorView oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.idea != oldWidget.idea && widget.idea != null) {
      _fetchBlueprint();
    }
  }

  Future<void> _fetchBlueprint() async {
    if (widget.idea == null) return;

    setState(() {
      _isLoading = true;
      _error = '';
      _blueprint = null;
    });

    try {
      final response = await ApiService.getMentorBlueprint(
        ideaTitle: widget.idea!.title,
        skills: widget.skills,
        domain: widget.domain,
        ideaSummary: widget.idea!.description,
      );
      setState(() {
        _blueprint = response.blueprint;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (widget.idea == null) {
      return Semantics(
        label: 'Mentor View Empty',
        child: const Center(
          child: Text(
            'No Project Idea Selected.\nGo to Generator and Explore an Idea.',
            textAlign: TextAlign.center,
            style: TextStyle(fontFamily: 'JetBrains Mono', color: Color(0xFF94A3B8)),
          ),
        ),
      );
    }

    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error.isNotEmpty) {
      return Center(
        child: Text('Error loading blueprint: $_error', style: const TextStyle(color: Colors.red)),
      );
    }

    if (_blueprint == null) {
      return const Center(child: Text('No blueprint available.'));
    }

    return Semantics(
      label: 'Mentor View',
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 840),
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.idea!.title,
                  style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                const SizedBox(height: 8),
                Text(
                  widget.idea!.description,
                  style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 16),
                ),
                const SizedBox(height: 32),

                const Text(
                  '1. Tech Stack Rationale',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                const SizedBox(height: 16),
                ..._blueprint!.rationale.map((r) => Padding(
                  padding: const EdgeInsets.only(bottom: 8.0),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('${r.tech}: ', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFb8c4ff))),
                      Expanded(child: Text(r.reason, style: const TextStyle(color: Color(0xFFe5e2e1)))),
                    ],
                  ),
                )),
                const SizedBox(height: 32),

                const Text(
                  '2. Modular Architecture',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                const SizedBox(height: 8),
                Text(_blueprint!.architecture, style: const TextStyle(color: Color(0xFFe5e2e1))),
                const SizedBox(height: 16),
                ..._blueprint!.components.map((c) => Padding(
                  padding: const EdgeInsets.only(bottom: 8.0),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('${c.name}: ', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFb8c4ff))),
                      Expanded(child: Text(c.purpose, style: const TextStyle(color: Color(0xFFe5e2e1)))),
                    ],
                  ),
                )),
                const SizedBox(height: 32),

                const Text(
                  '3. Roadmap',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                const SizedBox(height: 16),
                ..._blueprint!.roadmap.map((phase) => Padding(
                  padding: const EdgeInsets.only(bottom: 16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(phase.phase, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFb8c4ff), fontSize: 16)),
                      const SizedBox(height: 4),
                      ...phase.tasks.map((task) => Padding(
                        padding: const EdgeInsets.only(left: 16.0, top: 4.0),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('• ', style: TextStyle(color: Color(0xFF94A3B8))),
                            Expanded(child: Text(task, style: const TextStyle(color: Color(0xFFe5e2e1)))),
                          ],
                        ),
                      )),
                    ],
                  ),
                )),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
