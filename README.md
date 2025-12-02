# TTS Web

A browser-based Text-to-Speech application powered by [Piper TTS](https://github.com/rhasspy/piper) running entirely client-side via WebAssembly. No backend server required.

## Features

- 🌍 **Multi-language Support** - Access hundreds of voices across dozens of languages
- 🎯 **High-Quality Speech** - Natural-sounding voices with multiple quality levels
- 💾 **Offline Capable** - Download models once, use them offline indefinitely
- 🚀 **Fast Processing** - WebAssembly-powered TTS runs locally in your browser
- 📦 **No Backend Required** - Fully client-side application
- 🔊 **Smart Text Chunking** - Handles long texts by intelligently splitting at sentence boundaries
- 📊 **Progress Tracking** - Real-time progress for downloads and generation

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Visit `http://localhost:5173` to use the application.

## How It Works

1. **Select Language & Voice** - Choose from available languages and voices
2. **Download Model** - Download the TTS model (one-time, cached in browser)
3. **Enter Text** - Type or paste the text you want to convert to speech
4. **Generate** - Click "Speak" to generate audio
5. **Listen** - Play the generated audio directly in your browser

## Architecture

```
tts/
├── public/                 # Static assets
│   ├── dist/              # ONNX Runtime / ONNX.js bundles for WebAssembly
│   ├── favicon_io/        # App icons + manifest
│   ├── piper_phonemize.*  # WebAssembly phonemizer (includes espeak data)
│   └── piper_worker.js    # Web Worker bootstrap for Piper
├── src/
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration
│   ├── App.jsx            # Main application
│   └── main.jsx           # Entry point
└── vite.config.js         # Vite configuration (critical CORS headers)
```

## Technical Details

### WebAssembly & CORS

The application requires specific CORS headers to enable SharedArrayBuffer for WebAssembly:

```javascript
headers: {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
}
```

### Model Caching

- TTS models are fetched from [HuggingFace](https://huggingface.co/rhasspy/piper-voices)
- Downloaded models are cached using the browser's Cache API
- Model metadata persists in localStorage for tracking
- Models remain available offline after initial download

### Text Processing

- Text is split into chunks (max 1000 characters)
- Chunking respects paragraph and sentence boundaries
- Each chunk is processed separately to avoid blocking
- Audio chunks are concatenated for seamless playback

## Dependencies

### Runtime

- **React 19** - UI framework
- **piper-wasm** - Piper TTS WebAssembly bindings

### Build Tools

- **Vite 7** - Build tool and dev server
- **ESLint** - Code linting

## Browser Support

Requires a modern browser with:

- WebAssembly support
- SharedArrayBuffer support
- Cache API support
- Web Audio API support

Tested on:

- Chrome/Edge 92+
- Firefox 92+
- Safari 15.2+

## Development

### Code Style

- 2-space indentation
- Single quotes for strings
- Functional React components with hooks
- Clean architecture with separated concerns

### Commit Convention

```
type: description

Types: feat, fix, refactor, docs, style, test, chore
Example: fix: resolve audio concatenation issue
```

### Scripts

```bash
npm run dev           # Start dev server with hot reload
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
npm test              # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:ui       # Open Vitest UI
npm run test:coverage # Generate test coverage report
```

### Testing

This project uses [Vitest](https://vitest.dev/) for unit testing with React Testing Library for component tests.

Run tests:
```bash
npm test              # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage report
```

Test coverage:
- Utility functions (text processing, stats, storage, language detection)
- Service layer (model management, voice services)
- React components (UI components, progress indicators, error handling)

The project includes GitHub Actions workflow that automatically runs tests on pull requests.

## Troubleshooting

### Audio not playing

- Check browser console for CORS errors
- Ensure dev server is running with correct headers
- Verify model was downloaded successfully

### Model download fails

- Check internet connection
- Verify HuggingFace is accessible
- Clear browser cache and retry

### Performance issues

- Reduce text length or split into smaller chunks
- Use lower quality models for faster processing
- Close other browser tabs to free memory

## Contributing

1. Follow the existing code style
2. Test thoroughly in multiple browsers
3. Update documentation for new features
4. Use conventional commit messages

## License

MIT

## Credits

- [Piper TTS](https://github.com/rhasspy/piper) - High-quality text-to-speech engine
- [ONNX Runtime](https://onnxruntime.ai/) - Cross-platform ML inference
- [HuggingFace](https://huggingface.co/rhasspy/piper-voices) - Voice model hosting

## Links

- [Piper TTS Documentation](https://github.com/rhasspy/piper)
- [piper-wasm](https://www.npmjs.com/package/piper-wasm)
- [Available Voices](https://huggingface.co/rhasspy/piper-voices/blob/main/voices.json)
