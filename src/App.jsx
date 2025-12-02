import { useEffect, useMemo } from 'react'
import styled, { keyframes } from 'styled-components'
import { Download, Loader2, Volume2, Waves } from 'lucide-react'
import { useAppStore } from './store/useAppStore'
import { useLanguageDetection } from './hooks/useLanguageDetection'
import { VoiceSelector } from './components/VoiceSelector'
import { ProgressBar } from './components/ProgressBar'
import { AudioPlayer } from './components/AudioPlayer'
import { ErrorMessage } from './components/ErrorMessage'
import { TextStats } from './components/TextStats'
import { Button } from './components/ui/button'
import { Textarea } from './components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert'

const Page = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.85), #030712 68%);
  padding: 2rem 1rem 4rem;
`

const Shell = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`

const Hero = styled.header`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 0 0.5rem;
`

const Title = styled.h1`
  margin: 0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: clamp(2.4rem, 4vw, 3.9rem);
  letter-spacing: 0.13em;
  color: #f8fafc;
  text-transform: uppercase;
`

const Subtitle = styled.p`
  color: #cbd5f5;
  max-width: 760px;
  margin: 0 auto;
  line-height: 1.6;
`

const MainGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(0, 3fr) minmax(260px, 1fr);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const VoiceInfo = styled.div`
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.45);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.95rem;
  color: #cbd5f5;
`

const Pulse = keyframes`
  from { opacity: 0.4; }
  to { opacity: 1; }
`

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 3rem 0;
  color: #a5b4fc;
  animation: ${Pulse} 1s ease-in-out infinite alternate;
`

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`

const SpeedControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-top: 1px solid rgba(148, 163, 184, 0.15);
`

const SpeedLabel = styled.div`
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.75rem;
  color: #94a3b8;
`

const SpeedValue = styled.span`
  font-weight: 600;
  color: #f8fafc;
`

const SpeedSlider = styled.input`
  flex: 1;
  appearance: none;
  height: 4px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.3);

  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #60a5fa;
    cursor: pointer;
    box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.25);
  }
`

const FooterNote = styled.div`
  margin-top: 1rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
`

const InfoSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  margin-top: 3rem;
  padding-top: 2.5rem;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
`

const InfoGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`

const InfoCard = styled.div`
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(15, 23, 42, 0.35);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  h3 {
    margin: 0;
    font-size: 1.15rem;
    color: #f8fafc;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    margin: 0;
    color: #cbd5f5;
    line-height: 1.6;
    font-size: 0.95rem;
  }
`

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

const Step = styled.div`
  display: flex;
  gap: 1rem;
  align-items: start;
`

const StepNumber = styled.div`
  min-width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(96, 165, 250, 0.2);
  color: #60a5fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  border: 1px solid rgba(96, 165, 250, 0.3);
`

const StepContent = styled.div`
  flex: 1;
  padding-top: 0.25rem;

  h4 {
    margin: 0 0 0.35rem;
    color: #f8fafc;
    font-size: 1rem;
  }

  p {
    margin: 0;
    color: #cbd5f5;
    line-height: 1.6;
    font-size: 0.9rem;
  }
`

const FeatureGrid = styled.div`
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
`

const Feature = styled.div`
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.3);
  padding: 1.25rem;

  h4 {
    margin: 0 0 0.5rem;
    color: #60a5fa;
    font-size: 0.95rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #cbd5f5;
    line-height: 1.6;
    font-size: 0.9rem;
  }
`

const FAQGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`

const FAQ = styled.div`
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.25);
  padding: 1.25rem;

  h4 {
    margin: 0 0 0.5rem;
    color: #f8fafc;
    font-size: 0.95rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #cbd5f5;
    line-height: 1.6;
    font-size: 0.88rem;
  }
`

const SectionTitle = styled.h2`
  margin: 0 0 1.5rem;
  font-size: 1.8rem;
  color: #f8fafc;
  text-align: center;
  letter-spacing: 0.05em;
`

const IconSpin = styled(Loader2)`
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

function App() {
  const text = useAppStore((state) => state.text)
  const setText = useAppStore((state) => state.setText)
  const languages = useAppStore((state) => state.languages)
  const selectedLanguage = useAppStore((state) => state.selectedLanguage)
  const availableVoices = useAppStore((state) => state.availableVoices)
  const selectedVoice = useAppStore((state) => state.selectedVoice)
  const downloadedModels = useAppStore((state) => state.downloadedModels)
  const voiceLoading = useAppStore((state) => state.voiceLoading)
  const voiceError = useAppStore((state) => state.voiceError)
  const voices = useAppStore((state) => state.voices)
  const downloadProgress = useAppStore((state) => state.downloadProgress)
  const downloading = useAppStore((state) => state.downloading)
  const downloadError = useAppStore((state) => state.downloadError)
  const generating = useAppStore((state) => state.generating)
  const generateProgress = useAppStore((state) => state.generateProgress)
  const currentChunk = useAppStore((state) => state.currentChunk)
  const totalChunks = useAppStore((state) => state.totalChunks)
  const audioResult = useAppStore((state) => state.audioResult)
  const ttsError = useAppStore((state) => state.ttsError)
  const initVoices = useAppStore((state) => state.initVoices)
  const changeLanguage = useAppStore((state) => state.changeLanguage)
  const changeVoice = useAppStore((state) => state.changeVoice)
  const verifyModelCache = useAppStore((state) => state.verifyModelCache)
  const downloadSelectedVoice = useAppStore((state) => state.downloadSelectedVoice)
  const generateAudio = useAppStore((state) => state.generateAudio)
  const clearErrors = useAppStore((state) => state.clearErrors)
  const playbackRate = useAppStore((state) => state.playbackRate)
  const setPlaybackRate = useAppStore((state) => state.setPlaybackRate)

  useEffect(() => {
    initVoices()
  }, [initVoices])

  useEffect(() => {
    if (selectedVoice) {
      verifyModelCache(selectedVoice)
    }
  }, [selectedVoice, verifyModelCache])

  const voice = selectedVoice ? voices[selectedVoice] : null
  const modelSizeMB = useMemo(() => {
    if (!voice?.files) return null
    const entry = Object.entries(voice.files).find(([name]) => name.endsWith('.onnx'))
    const bytes = entry?.[1]?.size_bytes
    return bytes ? bytes / (1024 * 1024) : null
  }, [voice])

  const isModelDownloaded = selectedVoice ? downloadedModels.has(selectedVoice) : false
  const readyToSpeak = Boolean(text.trim() && selectedVoice)

  const handleDownload = async () => {
    await downloadSelectedVoice()
  }

  const handleSpeak = async () => {
    if (!readyToSpeak) return
    if (!isModelDownloaded) {
      const ok = await downloadSelectedVoice()
      if (!ok) return
    }
    await generateAudio()
  }

  const { detectedLanguageName, unsupportedLanguage } = useLanguageDetection(
    text,
    languages,
    selectedLanguage,
    changeLanguage
  )

  const aggregatedError = voiceError || downloadError || ttsError

  return (
    <Page>
      <Shell>
        <Hero>
          <Title>Web-TTS</Title>
          <Subtitle>
            Web-TTS crafts natural narrations directly in your browser with AI-powered voices inspired by large language model workflows. Track progress in
            real time, auto-detect languages, and keep every model ready for offline sessions.
          </Subtitle>
        </Hero>

        {voiceLoading ? (
          <LoadingState>
            <Waves size={34} /> Loading voices
          </LoadingState>
        ) : (
          <>
            <MainGrid>
              <Card>
                <CardHeader>
                  <CardTitle>Your text</CardTitle>
                  <p>Paste an article or script, tweak it, and render speech without leaving this editor.</p>
                </CardHeader>
                <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type or paste the narration you'd like to hear..."
                    disabled={generating}
                  />
                  <TextStats text={text} detectedLanguage={detectedLanguageName} />
                  <SpeedControl>
                    <SpeedLabel>Playback Speed</SpeedLabel>
                    <SpeedSlider
                      type="range"
                      min="0.8"
                      max="1.4"
                      step="0.05"
                      value={playbackRate}
                      onChange={(e) => setPlaybackRate(Number(e.target.value))}
                      disabled={generating}
                    />
                    <SpeedValue>{playbackRate.toFixed(2)}x</SpeedValue>
                  </SpeedControl>
                  <Actions>
                    <Button onClick={handleSpeak} disabled={!readyToSpeak || generating} size="lg">
                      {generating ? <IconSpin size={20} /> : <Volume2 size={20} />}
                      {generating
                        ? totalChunks > 1
                          ? `Generating ${currentChunk}/${totalChunks}`
                          : 'Generating audio'
                        : isModelDownloaded
                        ? 'Speak'
                        : 'Download & Speak'}
                    </Button>
                    {generating && (
                      <ProgressBar
                        progress={generateProgress}
                        label={totalChunks > 1 ? `Chunk ${currentChunk} of ${totalChunks}` : 'Synthesizing'}
                      />
                    )}
                  </Actions>
                </CardContent>
              </Card>

              <SideColumn>
                <Card>
                  <CardHeader>
                    <CardTitle>Voice</CardTitle>
                    <p>Pick a language and voice. Cached voices stay ready even when offline.</p>
                  </CardHeader>
                  <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <VoiceSelector
                      languages={languages}
                      selectedLanguage={selectedLanguage}
                      onLanguageChange={changeLanguage}
                      availableVoices={availableVoices}
                      selectedVoice={selectedVoice}
                      onVoiceChange={changeVoice}
                      downloadedModels={downloadedModels}
                      disabled={generating}
                    />

                    {voice && (
                      <VoiceInfo>
                        <strong>{voice.name}</strong>
                        <span>Quality: {voice.quality}</span>
                        <span>Language: {voice.language?.name_english}</span>
                        {modelSizeMB && <span>Model size: {modelSizeMB.toFixed(1)} MB</span>}
                      </VoiceInfo>
                    )}

                    {selectedVoice && (
                      <Actions>
                        <Button onClick={handleDownload} disabled={downloading || isModelDownloaded} variant="secondary">
                          {downloading ? <IconSpin size={18} /> : <Download size={18} />}
                          {downloading
                            ? 'Downloading voice...'
                            : isModelDownloaded
                            ? 'Voice cached'
                            : 'Download voice'}
                        </Button>
                        {downloading && <ProgressBar progress={downloadProgress} />}
                      </Actions>
                    )}
                  </CardContent>
                </Card>

                {unsupportedLanguage && (
                  <Alert>
                    <AlertTitle>Language not supported</AlertTitle>
                    <AlertDescription>
                      Detected language ({unsupportedLanguage}) is not available. Please select a language manually.
                    </AlertDescription>
                  </Alert>
                )}
              </SideColumn>
            </MainGrid>

            <ErrorMessage message={aggregatedError} onDismiss={clearErrors} />

            {audioResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Audio</CardTitle>
                </CardHeader>
                <CardContent>
                  <AudioPlayer key={audioResult.url} audioResult={audioResult} playbackRate={playbackRate} />
                </CardContent>
              </Card>
            )}

            <InfoSection>
              <div>
                <SectionTitle>How to Get Started</SectionTitle>
                <StepList>
                  <Step>
                    <StepNumber>1</StepNumber>
                    <StepContent>
                      <h4>Choose Your Voice</h4>
                      <p>Browse languages and voice options to find the perfect match. Each language offers multiple voice profiles with different characteristics.</p>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepNumber>2</StepNumber>
                    <StepContent>
                      <h4>Download the Model</h4>
                      <p>First-time use requires downloading a voice model. This one-time process caches the model in your browser for instant access later. Sizes range from 10MB to 80MB.</p>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepNumber>3</StepNumber>
                    <StepContent>
                      <h4>Enter Your Text</h4>
                      <p>Type or paste your content. The app automatically handles long texts by breaking them into segments while maintaining natural speech flow.</p>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepNumber>4</StepNumber>
                    <StepContent>
                      <h4>Generate Speech</h4>
                      <p>Click 'Speak' and watch as your text transforms into natural-sounding speech. All processing happens locally in your browser.</p>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepNumber>5</StepNumber>
                    <StepContent>
                      <h4>Listen and Download</h4>
                      <p>Play the generated audio immediately through the built-in player. Audio is generated in high-quality WAV format.</p>
                    </StepContent>
                  </Step>
                </StepList>
              </div>

              <div>
                <SectionTitle>Perfect For</SectionTitle>
                <InfoGrid>
                  <InfoCard>
                    <h3>Content Creation</h3>
                    <p>Generate voiceovers for videos, podcasts, or presentations without recording equipment or voice actors.</p>
                  </InfoCard>
                  <InfoCard>
                    <h3>Learning & Accessibility</h3>
                    <p>Convert written materials into audio for auditory learners or users with visual impairments. Practice pronunciation for language learning.</p>
                  </InfoCard>
                  <InfoCard>
                    <h3>Personal Audiobooks</h3>
                    <p>Transform articles, blog posts, or documents into audio format for listening on-the-go or during commutes.</p>
                  </InfoCard>
                  <InfoCard>
                    <h3>Development & Testing</h3>
                    <p>Test voice interfaces, prototype voice-enabled applications, or generate sample audio for demos without external APIs.</p>
                  </InfoCard>
                  <InfoCard>
                    <h3>Privacy-Focused Use</h3>
                    <p>Process sensitive text content without sending data to external servers. Everything runs locally in your browser.</p>
                  </InfoCard>
                  <InfoCard>
                    <h3>Offline Projects</h3>
                    <p>Work without internet connection after downloading models. Perfect for travel or restricted networks.</p>
                  </InfoCard>
                </InfoGrid>
              </div>

              <div>
                <SectionTitle>Why Web TTS?</SectionTitle>
                <FeatureGrid>
                  <Feature>
                    <h4>Complete Privacy</h4>
                    <p>Your text never leaves your device. All processing happens locally using WebAssembly technology.</p>
                  </Feature>
                  <Feature>
                    <h4>Zero Cost</h4>
                    <p>No subscriptions, no API fees, no usage limits. Download models once and use them forever, even offline.</p>
                  </Feature>
                  <Feature>
                    <h4>Instant Access</h4>
                    <p>No installation, no sign-up, no configuration. Open the app and start converting text to speech immediately.</p>
                  </Feature>
                  <Feature>
                    <h4>Open Source</h4>
                    <p>Built on Piper TTS, a proven open-source engine with active development and community support.</p>
                  </Feature>
                  <Feature>
                    <h4>Cross-Platform</h4>
                    <p>Works on any modern browser - Windows, macOS, Linux, Android, iOS. Same experience everywhere.</p>
                  </Feature>
                  <Feature>
                    <h4>Offline Ready</h4>
                    <p>After downloading models, use the app without internet connection. Models stay cached permanently.</p>
                  </Feature>
                </FeatureGrid>
              </div>

              <div>
                <SectionTitle>Frequently Asked Questions</SectionTitle>
                <FAQGrid>
                  <FAQ>
                    <h4>Is this really free?</h4>
                    <p>Yes, completely free with no usage limits, subscriptions, or hidden fees. You own the generated audio files outright.</p>
                  </FAQ>
                  <FAQ>
                    <h4>Can I use audio commercially?</h4>
                    <p>Yes, you have full rights to use generated audio for any lawful purpose, including commercial projects and products.</p>
                  </FAQ>
                  <FAQ>
                    <h4>What languages are supported?</h4>
                    <p>Dozens of languages including English, Spanish, French, German, Italian, Portuguese, Dutch, Russian, Chinese, Japanese, Korean, and more.</p>
                  </FAQ>
                  <FAQ>
                    <h4>Does this work offline?</h4>
                    <p>Yes! After downloading voice models, the entire app works offline. Models are cached in your browser permanently.</p>
                  </FAQ>
                  <FAQ>
                    <h4>Is my data sent to servers?</h4>
                    <p>No. All text processing and speech generation happens locally in your browser. Your content stays completely private.</p>
                  </FAQ>
                  <FAQ>
                    <h4>Which browsers work?</h4>
                    <p>Modern browsers with WebAssembly support: Chrome/Edge 92+, Firefox 92+, and Safari 15.2+.</p>
                  </FAQ>
                  <FAQ>
                    <h4>How large are models?</h4>
                    <p>Model sizes range from 10MB (low quality) to 80MB (high quality). You only download models you choose to use.</p>
                  </FAQ>
                  <FAQ>
                    <h4>Can I use multiple voices?</h4>
                    <p>Yes! Download as many voice models as you like and switch between them anytime. Each stays cached for quick access.</p>
                  </FAQ>
                </FAQGrid>
              </div>
            </InfoSection>
          </>
        )}
        <FooterNote>On-Device AI • Privacy-First LLM • Zero Subscriptions</FooterNote>
      </Shell>
    </Page>
  )
}

export default App
