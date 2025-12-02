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

---

## Getting Started Guide

### Step 1: Choose Your Voice

Browse through the language and voice options to find the perfect match for your content. Each language offers multiple voice profiles with different characteristics - from formal to casual, male to female voices.

### Step 2: Download the Model

First-time use requires downloading a voice model. This is a one-time process - the model gets cached in your browser for instant access later. Model sizes vary from 10MB to 80MB depending on quality level.

### Step 3: Prepare Your Text

Paste or type your content into the text area. The application handles long texts automatically by breaking them into manageable segments while maintaining natural speech flow.

### Step 4: Generate Speech

Click the "Speak" button and watch the progress indicator as your text transforms into natural-sounding speech. Processing happens entirely in your browser - no data leaves your device.

### Step 5: Play and Enjoy

Listen to the generated audio immediately through the built-in player. Audio is generated in high-quality WAV format for crisp, clear playback.

## Common Use Cases

**📚 Content Creation**
Generate voiceovers for videos, podcasts, or presentations without recording equipment or voice actors.

**🎓 Learning and Accessibility**
Convert written materials into audio for auditory learners or users with visual impairments. Practice pronunciation for language learning.

**📖 Personal Audiobooks**
Transform articles, blog posts, or documents into audio format for listening on-the-go or during commutes.

**🧪 Development and Testing**
Test voice interfaces, prototype voice-enabled applications, or generate sample audio for demos without external APIs.

**🔒 Privacy-Focused Applications**
Process sensitive text content without sending data to external servers - everything runs locally in your browser.

## Why Choose Web TTS?

**Complete Privacy**
Your text never leaves your device. All processing happens locally in your browser using WebAssembly technology.

**Zero Cost**
No subscriptions, no API fees, no usage limits. Download models once and use them forever, even offline.

**Instant Availability**
No installation, no sign-up, no configuration. Open the web app and start converting text to speech immediately.

**Open Source Foundation**
Built on Piper TTS, a proven open-source engine with active development and community support.

**Cross-Platform Compatibility**
Works on any modern browser - Windows, macOS, Linux, Android, iOS. Same experience everywhere.

**Offline Capability**
After downloading models, use the application without internet connection. Perfect for travel or restricted networks.

## Frequently Asked Questions

**How much does it cost to use?**
Web TTS is completely free with no usage limits, subscriptions, or hidden fees. You own the generated audio files outright.

**Can I use the generated audio commercially?**
Yes, you have full rights to use generated audio for any lawful purpose, including commercial projects, videos, or products.

**What languages are supported?**
The application supports dozens of languages including English, Spanish, French, German, Italian, Portuguese, Dutch, Russian, Chinese, Japanese, Korean, and many more.

**How large are the voice models?**
Model sizes range from 10MB (low quality) to 80MB (high quality). You only download models you choose to use.

**Does this work offline?**
Yes! After downloading voice models, the entire application works offline. Models are cached in your browser permanently.

**Why do I need to download models?**
Models enable high-quality speech generation. Downloading them once allows for instant, unlimited use without repeated downloads or API calls.

**Is my text data sent to any servers?**
No. All text processing and speech generation happens locally in your browser. Your content stays completely private.

**Which browsers are supported?**
Modern browsers with WebAssembly support: Chrome/Edge 92+, Firefox 92+, and Safari 15.2+.

**Can I use multiple voices?**
Yes! Download as many voice models as you like and switch between them anytime. Each model remains cached for quick access.

**What audio format is generated?**
Audio is generated as high-quality WAV format for optimal clarity and compatibility.
