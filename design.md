# UI/UX Design System: Project OrbitMentor

## 1. Visual Theme & Aesthetics
- **Style:** Extreme Minimalism, flat UI elements, sharp borders, zero complex drop-shadows.
- **Color Palette:** Monochrome Deep Graphite (`#121212`) and Crisp Light Paper (`#F8F9FA`), accented with Subtle Slate (`#4A5568`).
- **Typography:** Monospace and Clean Sans-Serif (`Roboto Mono` / `Inter`) for a high-spec, scientific aesthetic.

## 2. Layout Structure

### Left Sidebar (25% Screen Width)
- **Header:** "OrbitMentor" mission control identifier.
- **Recent Sessions:** Scrollable `ListView` displaying previously saved project blueprints from Firestore.
- **Bottom Left Corner:** Minimalist Theme Toggle (Sun/Moon icon).

### Main Screen (75% Screen Width)
- **Top Bar:** Mode Segmented Control `[ Generator ]` | `[ Mentor ]`
- **Input Section:**
  - Skill Search Bar with interactive quick-add chips (`Flutter`, `FastAPI`, `Python`, `Gemini`, `PyTorch`).
  - Domain Search Bar / Dropdown (`Aerospace`, `Healthcare AI`, `FinTech`, `Cybersecurity`, `Distributed Systems`).
- **Tier Selector (Generator Mode):** Three distinct selector cards:
  - *Safe:* Fast, easy to build, standard stack.
  - *Applied ML:* ML, RAG, and agentic workflows.
  - *Super:* High complexity, enterprise & publication grade.
- **Action Trigger:** Full-width flat button: `EXECUTE SYSTEM BLUEPRINT`.
- **Output Container:** Dynamic rendering area displaying the generated ideas or detailed mentor breakdown (Tech Stack Rationale, Roadmap, Modular Architecture).

## 3. Accessibility & Compliance Rules
- Every clickable chip, button, and input field must be explicitly wrapped in Flutter `Semantics` widgets.
- Minimum tap targets must be $\ge 48\times48$ pixels.