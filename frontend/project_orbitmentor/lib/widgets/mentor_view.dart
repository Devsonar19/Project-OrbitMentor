import 'package:flutter/material.dart';

class MentorView extends StatelessWidget {
  const MentorView({super.key});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: 'Mentor View',
      child: const Center(child: Text('Mentor')),
    );
  }
}
