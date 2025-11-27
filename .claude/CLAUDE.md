# TTS Web - Claude Instructions

## Project Overview
Browser-based Text-to-Speech application using Piper TTS via WebAssembly. Fully client-side with no backend required.

## Code Standards

### Formatting
- Remove all trailing whitespace
- Use 2-space indentation
- Use single quotes for strings (except JSX attributes)
- No semicolons (consistent with existing code style)

### Git Commits
- Format: `type: description` (e.g., `fix: resolve audio concatenation issue`)
- Types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`
- No "Claude Code" or AI attribution in commit messages
- Keep messages concise and descriptive

### React/JavaScript Patterns
- Prefer functional components with hooks
- Extract business logic into separate utility files
- Keep components focused on UI rendering
- Use custom hooks for complex state logic
- Prefer named exports for utilities

### File Organization
```
src/
├── components/     # React components
├── hooks/          # Custom React hooks
├── services/       # Business logic (API calls, TTS operations)
├── utils/          # Pure utility functions
├── config/         # Configuration constants
├── test/           # Test setup and utilities
└── styles/         # CSS files
```

### Error Handling
- Always provide user-friendly error messages
- Log technical details to console
- Show error state in UI with recovery options
- Validate inputs before processing

### Performance
- Cache downloaded models using Cache API
- Persist model metadata in localStorage
- Process text in chunks to avoid blocking
- Show progress for long-running operations

## Important Technical Notes

### WebAssembly Requirements
- CORS headers are critical in vite.config.js
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`
- These enable SharedArrayBuffer for WASM

### Audio Processing
- Text is chunked at 500 characters respecting sentence boundaries
- Multiple audio chunks should be concatenated or played sequentially
- Use Web Audio API for concatenation when possible

### Model Management
- Models downloaded from HuggingFace are cached in browser
- Track downloaded models in localStorage for persistence
- Verify cache integrity on app load

## Testing

### Test Framework
- **Vitest** for unit and component testing
- **React Testing Library** for component tests
- **jsdom** for DOM simulation

### Writing Tests
- Place test files adjacent to source files with `.test.js` or `.test.jsx` extension
- Use descriptive test names that explain what is being tested
- Test both happy paths and edge cases
- Mock external dependencies (fetch, localStorage, Cache API)

### Test Structure
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup code
  })

  it('describes the expected behavior', () => {
    // Arrange
    // Act
    // Assert
  })
})
```

### Running Tests
```bash
npm test              # Watch mode
npm run test:run      # Single run
npm run test:coverage # Coverage report
npm run test:ui       # Vitest UI
```

### Test Coverage Areas
- **Utility Functions**: text processing, stats, storage, language detection
- **Services**: model management, voice services (with mocked fetch/cache)
- **Components**: UI rendering, props handling, user interactions

### CI/CD
- GitHub Actions runs tests automatically on pull requests
- Tests must pass before merging
- Lint and build checks are also enforced

## When Editing Files
- Always edit existing files rather than creating new ones
- Read the file first before making changes
- Maintain existing code style and patterns
- Test changes don't break CORS or WASM functionality
- Run tests after making changes to ensure nothing breaks
- Add tests for new functionality
