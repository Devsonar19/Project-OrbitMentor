import 'package:flutter/material.dart';
import '../services/api_service.dart';

class MentorView extends StatefulWidget {
  const MentorView({super.key});

  @override
  State<MentorView> createState() => _MentorViewState();
}

class _MentorViewState extends State<MentorView> {
  final TextEditingController _controller = TextEditingController();
  final List<Map<String, String>> _messages = [];
  bool _isLoading = false;

  void _sendMessage(String text) async {
    final message = text.trim();
    if (message.isEmpty) return;

    setState(() {
      _messages.add({'role': 'user', 'content': message});
      _isLoading = true;
    });

    _controller.clear();

    try {
      final response = await ApiService.mentorChat(message, _messages);
      setState(() {
        _messages.add({'role': 'bot', 'content': response});
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _messages.add({'role': 'bot', 'content': 'Sorry, I encountered an error: $e'});
        _isLoading = false;
      });
    }
  }

  Widget _buildQuickPrompt(String text) {
    return ActionChip(
      label: Text(text, style: const TextStyle(fontSize: 12)),
      onPressed: () => _sendMessage(text),
      backgroundColor: const Color(0xFF2B3035),
      side: BorderSide.none,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _buildQuickPrompt('which tech stack is better and why?'),
              _buildQuickPrompt('final year roadmap'),
              _buildQuickPrompt('module breakdown'),
            ],
          ),
          const SizedBox(height: 16),
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: const Color(0xFF131313),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFF2B3035)),
              ),
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _messages.length + (_isLoading ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index == _messages.length) {
                    return const Padding(
                      padding: EdgeInsets.symmetric(vertical: 8),
                      child: Align(
                        alignment: Alignment.centerLeft,
                        child: CircularProgressIndicator(),
                      ),
                    );
                  }
                  final msg = _messages[index];
                  final isUser = msg['role'] == 'user';
                  return Align(
                    alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                    child: Container(
                      margin: const EdgeInsets.symmetric(vertical: 4),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: isUser ? const Color(0xFF212529) : const Color(0xFF1A1D20),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFF2B3035)),
                      ),
                      child: Text(
                        msg['content'] ?? '',
                        style: const TextStyle(fontSize: 14, color: Color(0xFFF1F3F5)),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _controller,
                  decoration: InputDecoration(
                    hintText: 'Ask the mentor...',
                    filled: true,
                    fillColor: const Color(0xFF131313),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: Color(0xFF2B3035)),
                    ),
                  ),
                  onSubmitted: _sendMessage,
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                onPressed: () => _sendMessage(_controller.text),
                icon: const Icon(Icons.send, color: Color(0xFFb8c4ff)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
