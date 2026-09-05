import 'package:flutter_test/flutter_test.dart';
import 'package:project_orbitmentor/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const OrbitMentorApp());
  });
}
