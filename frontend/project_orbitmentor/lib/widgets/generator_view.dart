import 'package:flutter/material.dart';
import '../models/idea_models.dart';
import '../services/api_service.dart';

class GeneratorView extends StatefulWidget {
  final void Function(ProjectIdea idea, List<String> skills, String domain)? onExploreIdea;

  const GeneratorView({super.key, this.onExploreIdea});

  @override
  State<GeneratorView> createState() => _GeneratorViewState();
}

class _GeneratorViewState extends State<GeneratorView> {
  final List<String> _selectedSkills = ['Flutter', 'FastAPI', 'Gemini AI', 'PostgreSQL'];
  final TextEditingController _skillController = TextEditingController();
  
  String _selectedDomain = 'Healthcare AI';
  String _selectedTier = 'Innovative';
  bool _isLoading = false;
  List<ProjectIdea> _results = [];

  final Map<String, Map<String, String>> _domainSpecs = {
    'Healthcare AI': {
      'title': 'HIPAA & HL7/FHIR Compliant',
      'desc': 'Forces encrypted enclave orchestration, zero-retention model proxies, audit trail sinks, and BAA-eligible VPC peering.',
    },
    'Aerospace': {
      'title': 'DO-178C / AS9100 Standard Architecture',
      'desc': 'Hard real-time deterministic event bus, fault isolation telemetry, and radiation-tolerant edge computing redundancy.',
    },
    'FinTech': {
      'title': 'PCI-DSS Level 1 & SOC2 Spec',
      'desc': 'Strict ledger idempotency, multi-region double-entry consensus, zero-knowledge audit trails, and sub-5ms low latency settlement.',
    },
    'EdTech': {
      'title': 'COPPA & FERPA Standardized',
      'desc': 'Strict data privacy barriers, distributed multi-tenant real-time whiteboard sockets, and low-bandwidth student edge support.',
    },
    'Cybersecurity': {
      'title': 'NIST-800 Zero-Trust Architecture',
      'desc': 'Continuous micro-segmentation, ephemeral mutual TLS service meshes, high-volume SIEM event ingest, and kernel-level eBPF probes.',
    },
    'Web3 / Blockchain': {
      'title': 'EVM & State Machine Primitives',
      'desc': 'Stateless verification nodes, decentralized IPFS file storage bridges, smart contract deterministic test harness, and RPC load-balancing.',
    },
  };

  final Map<String, List<String>> _quickCatalog = {
    'Frontend': ['Next.js', 'React', 'SvelteKit', 'TypeScript'],
    'Backend': ['Node.js', 'Go', 'Rust', 'Python'],
    'Cloud/Infra': ['AWS', 'Firebase', 'GraphQL', 'Docker', 'Redis'],
  };

  void _addSkill(String skill) {
    final trimmed = skill.trim();
    if (trimmed.isNotEmpty && !_selectedSkills.any((s) => s.toLowerCase() == trimmed.toLowerCase())) {
      setState(() {
        _selectedSkills.add(trimmed);
        _skillController.clear();
      });
    }
  }

  void _removeSkill(String skill) {
    setState(() {
      _selectedSkills.remove(skill);
    });
  }

  Future<void> _generateIdeas() async {
    if (_selectedSkills.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please add at least one technical skill or capability')),
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      final ideas = await ApiService.generateIdeas(
        skills: _selectedSkills,
        domain: _selectedDomain,
        tier: _selectedTier,
      );
      setState(() {
        _results = ideas;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to generate architecture roadmap: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFFb8c4ff);
    const surfaceDark = Color(0xFF131313);
    const surfaceSubtle = Color(0xFF1A1D20);
    const borderDark = Color(0xFF2B3035);

    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 840),
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header & Scope Context
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF212529),
                  border: Border.all(color: borderDark),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: const [
                    SizedBox(
                      width: 6,
                      height: 6,
                      child: DecoratedBox(
                        decoration: BoxDecoration(color: primaryColor, shape: BoxShape.circle),
                      ),
                    ),
                    SizedBox(width: 8),
                    Text('STITCH_SPEC::v2.4_PROD', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, color: Color(0xFF94A3B8))),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Architect full-stack systems, cloud infrastructure, and technical roadmaps tailored to your stack.',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500, color: Color(0xFFe5e2e1)),
              ),
              const SizedBox(height: 4),
              const Text(
                'Deterministic composition engine • Zero ambient hallucination • Graph-constrained validation',
                style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 12, color: Color(0xFF94A3B8)),
              ),
              const SizedBox(height: 28),

              // Main Configuration Surface
              Container(
                decoration: BoxDecoration(
                  color: surfaceSubtle,
                  border: Border.all(color: borderDark),
                  borderRadius: BorderRadius.circular(8),
                ),
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // SECTION 01: Technical Capabilities & Stack
                    Wrap(
                      spacing: 8,
                      runSpacing: 4,
                      alignment: WrapAlignment.spaceBetween,
                      children: [
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            Text('01.', style: TextStyle(fontFamily: 'JetBrains Mono', color: primaryColor, fontWeight: FontWeight.bold)),
                            SizedBox(width: 8),
                            Text(
                              'TECHNICAL CAPABILITIES & STACK',
                              style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 1.2, fontWeight: FontWeight.w600, color: Color(0xFFc4c5d6)),
                            ),
                          ],
                        ),
                        const Text('Select below or commit custom tokens', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, color: Color(0xFF94A3B8))),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Custom Input Bar
                    Container(
                      decoration: BoxDecoration(
                        color: surfaceDark,
                        border: Border.all(color: borderDark),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Row(
                        children: [
                          const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 12),
                            child: Icon(Icons.data_object, size: 18, color: Color(0xFF94A3B8)),
                          ),
                          Expanded(
                            child: TextField(
                              controller: _skillController,
                              style: const TextStyle(fontFamily: 'JetBrains Mono', fontSize: 13, color: Color(0xFFF1F3F5)),
                              decoration: const InputDecoration(
                                hintText: 'Add runtime, framework, or cloud service...',
                                hintStyle: TextStyle(color: Color(0xFF444654)),
                                border: InputBorder.none,
                                isDense: true,
                                contentPadding: EdgeInsets.symmetric(vertical: 12),
                              ),
                              onSubmitted: (val) => _addSkill(val),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF212529),
                                    border: Border.all(color: borderDark),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: const Text('↵ ENTER', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 10, color: Color(0xFF94A3B8))),
                                ),
                                const SizedBox(width: 6),
                                ElevatedButton(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF212529),
                                    foregroundColor: Colors.white,
                                    elevation: 0,
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                                  ),
                                  onPressed: () => _addSkill(_skillController.text),
                                  child: const Text('Add', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 12)),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Active Selected Tags
                    const Text('Active constraints:', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, color: Color(0xFF94A3B8))),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _selectedSkills.map((skill) => Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: const Color(0xFF212529),
                          border: Border.all(color: primaryColor),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const SizedBox(
                              width: 6,
                              height: 6,
                              child: DecoratedBox(decoration: BoxDecoration(color: primaryColor, shape: BoxShape.circle)),
                            ),
                            const SizedBox(width: 8),
                            Text(skill, style: const TextStyle(fontFamily: 'JetBrains Mono', fontSize: 12, color: Color(0xFFF1F3F5))),
                            const SizedBox(width: 6),
                            InkWell(
                              onTap: () => _removeSkill(skill),
                              child: const Text('✕', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
                            ),
                          ],
                        ),
                      )).toList(),
                    ),
                    const SizedBox(height: 20),

                    // Quick Add Stack Catalog
                    Container(
                      padding: const EdgeInsets.only(top: 16),
                      decoration: const BoxDecoration(border: Border(top: BorderSide(color: borderDark))),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: _quickCatalog.entries.map((entry) => Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: Wrap(
                            crossAxisAlignment: WrapCrossAlignment.center,
                            spacing: 8,
                            runSpacing: 4,
                            children: [
                              SizedBox(
                                width: 90,
                                child: Text('[${entry.key}]', style: const TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, color: Color(0xFF94A3B8), fontWeight: FontWeight.w500)),
                              ),
                              Wrap(
                                spacing: 6,
                                runSpacing: 6,
                                children: entry.value.map((chip) => ActionChip(
                                  backgroundColor: surfaceDark,
                                  side: const BorderSide(color: borderDark),
                                  label: Text('+ $chip', style: const TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, color: Color(0xFF94A3B8))),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                                  onPressed: () => _addSkill(chip),
                                )).toList(),
                              ),
                            ],
                          ),
                        )).toList(),
                      ),
                    ),

                    const SizedBox(height: 24),
                    const Divider(color: borderDark),
                    const SizedBox(height: 24),

                    // SECTION 02: Target Industry & Domain
                    Wrap(
                      spacing: 8,
                      runSpacing: 4,
                      alignment: WrapAlignment.spaceBetween,
                      children: [
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            Text('02.', style: TextStyle(fontFamily: 'JetBrains Mono', color: primaryColor, fontWeight: FontWeight.bold)),
                            SizedBox(width: 8),
                            Text(
                              'TARGET INDUSTRY & DOMAIN',
                              style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 1.2, fontWeight: FontWeight.w600, color: Color(0xFFc4c5d6)),
                            ),
                          ],
                        ),
                        const Text('Applies regulatory & compliance bounds', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, color: Color(0xFF94A3B8))),
                      ],
                    ),
                    const SizedBox(height: 16),

                    LayoutBuilder(
                      builder: (context, constraints) {
                        if (constraints.maxWidth < 600) {
                          return Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              _buildDomainDropdown(surfaceDark, borderDark),
                              const SizedBox(height: 12),
                              _buildDomainInfoCard(surfaceDark, borderDark, primaryColor),
                            ],
                          );
                        } else {
                          return Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                flex: 5,
                                child: _buildDomainDropdown(surfaceDark, borderDark),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                flex: 7,
                                child: _buildDomainInfoCard(surfaceDark, borderDark, primaryColor),
                              ),
                            ],
                          );
                        }
                      },
                    ),

                    const SizedBox(height: 24),
                    const Divider(color: borderDark),
                    const SizedBox(height: 24),

                    // SECTION 03: Generation Tier & Feasibility Target
                    Wrap(
                      spacing: 8,
                      runSpacing: 4,
                      alignment: WrapAlignment.spaceBetween,
                      children: [
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            Text('03.', style: TextStyle(fontFamily: 'JetBrains Mono', color: primaryColor, fontWeight: FontWeight.bold)),
                            SizedBox(width: 8),
                            Text(
                              'GENERATION TIER & FEASIBILITY TARGET',
                              style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 1.2, fontWeight: FontWeight.w600, color: Color(0xFFc4c5d6)),
                            ),
                          ],
                        ),
                        const Text('Select structural risk tolerance', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, color: Color(0xFF94A3B8))),
                      ],
                    ),
                    const SizedBox(height: 16),

                    LayoutBuilder(
                      builder: (context, constraints) {
                        if (constraints.maxWidth < 600) {
                          return Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              _buildTierCard('Safe', 'L1 · Safe', 'Low Risk', 'Industry-standard, battle-tested monolith or standard microservices.', '99%', 'Simple'),
                              const SizedBox(height: 12),
                              _buildTierCard('Innovative', 'L2 · Innovative', 'Balanced', 'Cutting-edge workflows, applied AI, modern event-driven architectures.', '85%', 'Edge/K8s'),
                              const SizedBox(height: 12),
                              _buildTierCard('Moonshot', 'L3 · Moonshot', 'Research', 'Novel implementations: autonomous agent swarms, zero-knowledge proofs.', '55%', 'Complex'),
                            ],
                          );
                        } else {
                          return Row(
                            children: [
                              Expanded(child: _buildTierCard('Safe', 'L1 · Safe', 'Low Structural Risk', 'Industry-standard, battle-tested monolith or standard microservices.', '99%', 'Simple')),
                              const SizedBox(width: 12),
                              Expanded(child: _buildTierCard('Innovative', 'L2 · Innovative', 'Balanced & Modern', 'Cutting-edge workflows, applied AI, modern event-driven architectures.', '85%', 'Edge/K8s')),
                              const SizedBox(width: 12),
                              Expanded(child: _buildTierCard('Moonshot', 'L3 · Moonshot', 'Research-Grade', 'Novel implementations: autonomous agent swarms, zero-knowledge proofs.', '55%', 'Complex')),
                            ],
                          );
                        }
                      },
                    ),

                    const SizedBox(height: 32),

                    // Action Area
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: primaryColor,
                          foregroundColor: const Color(0xFF002585),
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                        ),
                        onPressed: _isLoading ? null : _generateIdeas,
                        child: _isLoading
                            ? const SizedBox(
                                width: 24,
                                height: 24,
                                child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF002585)),
                              )
                            : Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(Icons.bolt, size: 20),
                                  const SizedBox(width: 8),
                                  const Text('Generate Architecture Roadmap', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                                  const SizedBox(width: 12),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: const Color(0x33002585),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: const Text('⌘ + Enter', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11)),
                                  ),
                                ],
                              ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 16,
                      runSpacing: 4,
                      alignment: WrapAlignment.spaceBetween,
                      children: [
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            Icon(Icons.tune, size: 14, color: Color(0xFF94A3B8)),
                            SizedBox(width: 6),
                            Text('Est. compile: ', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, color: Color(0xFF94A3B8))),
                            Text('~1.8s', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, color: Color(0xFFe5e2e1))),
                            SizedBox(width: 8),
                            Text('• Context: 4.2k tokens', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, color: Color(0xFF94A3B8))),
                          ],
                        ),
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            Icon(Icons.schema, size: 14, color: Color(0xFF94A3B8)),
                            SizedBox(width: 6),
                            Text('Artifacts: Mermaid graph + IaC boilerplate', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, color: Color(0xFF94A3B8))),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Active Compilation Preview Pane
              Container(
                decoration: BoxDecoration(
                  color: surfaceSubtle,
                  border: Border.all(color: borderDark),
                  borderRadius: BorderRadius.circular(8),
                ),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Wrap(
                      spacing: 12,
                      runSpacing: 4,
                      alignment: WrapAlignment.spaceBetween,
                      children: [
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            Icon(Icons.terminal, size: 16, color: primaryColor),
                            SizedBox(width: 8),
                            Text('PIPELINE_PREFLIGHT', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white)),
                            SizedBox(width: 6),
                            Text('::', style: TextStyle(color: Color(0xFF94A3B8))),
                            SizedBox(width: 6),
                            Text('READY', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 12, color: primaryColor)),
                          ],
                        ),
                        const Text('Target: GCP • Security: Level-4 HIPAA', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, color: Color(0xFF94A3B8))),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: surfaceDark,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text('> STITCH_GRAPH: Initialized with domain constraints & regulatory perimeter.', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, color: Color(0xFFF1F3F5))),
                          SizedBox(height: 4),
                          Text('> COMPONENT_MAP: [Flutter Client] -> [mTLS Envoy Proxy] -> [FastAPI Worker]', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, color: Color(0xFF94A3B8))),
                          SizedBox(height: 4),
                          Text('> STORAGE_POLICY: Encrypted partitioned PostgreSQL (pgvector active) + Cloud KMS', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, color: Color(0xFF94A3B8))),
                          SizedBox(height: 4),
                          Text('> STATUS: Engine primed. Trigger execution above or adjust constraints.', style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, color: primaryColor)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Results Section
              if (_results.isNotEmpty) ...[
                const Text(
                  'Generated Architecture Blueprints',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                const SizedBox(height: 16),
                ..._results.map((idea) => Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: surfaceSubtle,
                    border: Border.all(color: borderDark),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Wrap(
                        spacing: 8,
                        runSpacing: 4,
                        alignment: WrapAlignment.spaceBetween,
                        crossAxisAlignment: WrapCrossAlignment.center,
                        children: [
                          Text(
                            idea.title,
                            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFF212529),
                              border: Border.all(color: borderDark),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(_selectedTier, style: const TextStyle(fontFamily: 'JetBrains Mono', fontSize: 11, color: primaryColor)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        idea.description,
                        style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
                      ),
                      const SizedBox(height: 16),
                      Align(
                        alignment: Alignment.centerRight,
                        child: TextButton.icon(
                          onPressed: widget.onExploreIdea != null
                              ? () => widget.onExploreIdea!(idea, List.from(_selectedSkills), _selectedDomain)
                              : null,
                          icon: const Text('Explore in Mentor ->', style: TextStyle(color: primaryColor, fontWeight: FontWeight.bold)),
                          label: const SizedBox.shrink(),
                        ),
                      ),
                    ],
                  ),
                )),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDomainDropdown(Color surfaceDark, Color borderDark) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        color: surfaceDark,
        border: Border.all(color: borderDark),
        borderRadius: BorderRadius.circular(4),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: _selectedDomain,
          dropdownColor: surfaceDark,
          isExpanded: true,
          style: const TextStyle(fontFamily: 'JetBrains Mono', fontSize: 13, color: Color(0xFFF1F3F5)),
          items: _domainSpecs.keys.map((domain) => DropdownMenuItem(
            value: domain,
            child: Text(domain),
          )).toList(),
          onChanged: (val) {
            if (val != null) setState(() => _selectedDomain = val);
          },
        ),
      ),
    );
  }

  Widget _buildDomainInfoCard(Color surfaceDark, Color borderDark, Color primaryColor) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: surfaceDark,
        border: Border.all(color: borderDark),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.verified_user, size: 18, color: primaryColor),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _domainSpecs[_selectedDomain]!['title']!,
                  style: const TextStyle(fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFFF1F3F5)),
                ),
                const SizedBox(height: 4),
                Text(
                  _domainSpecs[_selectedDomain]!['desc']!,
                  style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTierCard(String tierKey, String title, String subtitle, String desc, String feasibility, String ops) {
    final isSelected = _selectedTier == tierKey;
    const primaryColor = Color(0xFFb8c4ff);
    const surfaceDark = Color(0xFF131313);
    const borderDark = Color(0xFF2B3035);

    return InkWell(
      onTap: () => setState(() => _selectedTier = tierKey),
      child: Container(
        height: 170,
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: surfaceDark,
          border: Border.all(color: isSelected ? primaryColor : borderDark),
          borderRadius: BorderRadius.circular(6),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Wrap(
                  spacing: 8,
                  runSpacing: 4,
                  alignment: WrapAlignment.spaceBetween,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    Text(title, style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: FontWeight.bold, color: isSelected ? primaryColor : Color(0xFFF1F3F5))),
                    Container(
                      width: 14,
                      height: 14,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: isSelected ? primaryColor : borderDark),
                      ),
                      child: isSelected
                          ? Center(
                              child: Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(shape: BoxShape.circle, color: primaryColor),
                              ),
                            )
                          : null,
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(subtitle.toUpperCase(), style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 9, color: isSelected ? primaryColor : Color(0xFF94A3B8), letterSpacing: 0.5)),
                const SizedBox(height: 8),
                Text(desc, style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)), maxLines: 2, overflow: TextOverflow.ellipsis),
              ],
            ),
            Container(
              padding: const EdgeInsets.only(top: 8),
              decoration: const BoxDecoration(border: Border(top: BorderSide(color: Color(0x662B3035)))),
              child: Wrap(
                spacing: 8,
                runSpacing: 4,
                alignment: WrapAlignment.spaceBetween,
                children: [
                  Text('Feasibility: $feasibility', style: const TextStyle(fontFamily: 'JetBrains Mono', fontSize: 10, color: Color(0xFF94A3B8))),
                  Text('Ops: $ops', style: const TextStyle(fontFamily: 'JetBrains Mono', fontSize: 10, color: Color(0xFF94A3B8))),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
