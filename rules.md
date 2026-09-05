# Hackathon Execution Rules & Constraints

## CRITICAL REPOSITORY & SUBMISSION RULES
1. **Size Limit Constraint:** Total repository size must remain strictly under **10MB**. 
   - *Enforcement:* Root `.gitignore` must immediately ignore `venv/`, `__pycache__/`, `build/`, `.dart_tool/`, and all platform folders except `android/` and `web/` inside `frontend/`.
2. **Branching Constraint:** All commits must be made directly on the single `main` branch. No feature branches are permitted.
3. **Secret Security:** Never hardcode API keys. Use `flutter_dotenv` on the frontend and `python-dotenv` on the backend.
4. **Testing Mandate:** Generate at least 3-4 unit test stubs using `flutter_test` for core logic before final submission.
5. **Code Pragmatism:** Focus entirely on MVP stability, clean error handling, and robust JSON parsing. Avoid deep over-engineering.