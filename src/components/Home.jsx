import { useEffect, useMemo } from 'react'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { Download, Loader2, Volume2, Waves } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useLanguageDetection } from '../hooks/useLanguageDetection'
import { VoiceSelector } from './VoiceSelector'
import { ProgressBar } from './ProgressBar'
import { AudioPlayer } from './AudioPlayer'
import { ErrorMessage } from './ErrorMessage'
import { TextStats } from './TextStats'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`

const FooterLink = styled(Link)`
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #cbd5f5;
  }
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

function Home() {
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
                      <h4>Pick Your Perfect Voice</h4>
                      <p>Explore our diverse voice library spanning dozens of languages. From warm and conversational to professional and authoritative - find the voice that brings your words to life.</p>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepNumber>2</StepNumber>
                    <StepContent>
                      <h4>Download Once, Use Forever</h4>
                      <p>Grab your chosen voice model in seconds. This one-time download (10-80MB) lives in your browser permanently, ready to work its magic anytime - even without internet.</p>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepNumber>3</StepNumber>
                    <StepContent>
                      <h4>Drop in Your Content</h4>
                      <p>Paste your article, script, or story. Our intelligent text processor automatically handles lengthy content, breaking it into natural segments while preserving the flow of your narrative.</p>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepNumber>4</StepNumber>
                    <StepContent>
                      <h4>Watch the Magic Happen</h4>
                      <p>Hit 'Speak' and witness your words transform into lifelike speech. Our WebAssembly-powered engine runs entirely in your browser, keeping your content private while delivering professional-quality audio.</p>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepNumber>5</StepNumber>
                    <StepContent>
                      <h4>Listen and Share</h4>
                      <p>Play your crisp, high-quality audio instantly or download it for any project. Every audio file you create is yours to use however you like - no strings attached.</p>
                    </StepContent>
                  </Step>
                </StepList>
              </div>

              <div>
                <SectionTitle>Perfect For</SectionTitle>
                <InfoGrid>
                  <InfoCard>
                    <h3>Content Creators</h3>
                    <p>Transform scripts into professional voiceovers for YouTube, TikTok, podcasts, or explainer videos. No expensive recording equipment or voice actors needed - just your words and our AI.</p>
                  </InfoCard>
                  <InfoCard>
                    <h3>Learning & Accessibility</h3>
                    <p>Turn textbooks into audiobooks for auditory learners. Make websites accessible for visually impaired users. Master pronunciation in any of our 40+ languages with native-quality speech.</p>
                  </InfoCard>
                  <InfoCard>
                    <h3>Audiobook Enthusiasts</h3>
                    <p>Convert your favorite articles, blog posts, or research papers into audio companions. Perfect for multitasking, commuting, or simply giving your eyes a rest while staying informed.</p>
                  </InfoCard>
                  <InfoCard>
                    <h3>Developers & Testers</h3>
                    <p>Prototype voice interfaces, generate sample audio for demos, or test multilingual speech features. No API keys, no rate limits, no budget constraints - just build and iterate freely.</p>
                  </InfoCard>
                  <InfoCard>
                    <h3>Privacy Champions</h3>
                    <p>Process confidential documents, sensitive scripts, or private content without ever sending data to external servers. Your words stay on your device, encrypted and secure.</p>
                  </InfoCard>
                  <InfoCard>
                    <h3>Off-the-Grid Workers</h3>
                    <p>Travel to remote locations, work on planes, or overcome unreliable internet. Once you've downloaded models, create unlimited audio anywhere, anytime, without connectivity.</p>
                  </InfoCard>
                </InfoGrid>
              </div>

              <div>
                <SectionTitle>Why Web TTS?</SectionTitle>
                <FeatureGrid>
                  <Feature>
                    <h4>Fort Knox Privacy</h4>
                    <p>Zero data transmission. Your text never touches our servers or anyone else's. Every byte of processing happens locally in your browser using cutting-edge WebAssembly technology.</p>
                  </Feature>
                  <Feature>
                    <h4>Truly Free Forever</h4>
                    <p>No freemium tricks, no hidden costs, no credit card required. Generate unlimited audio for personal or commercial projects without spending a penny or worrying about subscription renewals.</p>
                  </Feature>
                  <Feature>
                    <h4>Zero Setup Required</h4>
                    <p>No downloads, no installations, no accounts, no configuration files. Just open your browser and start creating. It literally takes 30 seconds from landing to generating your first audio.</p>
                  </Feature>
                  <Feature>
                    <h4>Open Source Power</h4>
                    <p>Built on Piper TTS - a battle-tested, community-driven text-to-speech engine. Benefit from continuous improvements, transparent development, and a thriving ecosystem of contributors.</p>
                  </Feature>
                  <Feature>
                    <h4>Works Everywhere</h4>
                    <p>Desktop, mobile, tablet - iOS, Android, Windows, Mac, Linux. Same smooth experience across every modern browser and platform. Your workspace follows you everywhere.</p>
                  </Feature>
                  <Feature>
                    <h4>Offline Champion</h4>
                    <p>Download models once and they're yours forever. Generate speech on planes, in basements, or anywhere else connectivity is a luxury. Your creative flow never has to stop.</p>
                  </Feature>
                </FeatureGrid>
              </div>

              <div>
                <SectionTitle>Frequently Asked Questions</SectionTitle>
                <FAQGrid>
                  <FAQ>
                    <h4>Is this actually free or is there a catch?</h4>
                    <p>It's genuinely, completely free. No trials, no premium tiers, no usage caps. Create unlimited audio for any purpose and keep 100% ownership of everything you generate.</p>
                  </FAQ>
                  <FAQ>
                    <h4>Can I monetize content made with this?</h4>
                    <p>Absolutely! Use generated audio in monetized YouTube videos, commercial products, client projects, or sell it directly. Full commercial rights included - no attribution required.</p>
                  </FAQ>
                  <FAQ>
                    <h4>How many languages can I work with?</h4>
                    <p>Dozens! English, Spanish, French, German, Italian, Portuguese, Dutch, Russian, Chinese, Japanese, Korean, Arabic, Hindi, and many more. Each with multiple unique voice profiles.</p>
                  </FAQ>
                  <FAQ>
                    <h4>Will this work without internet?</h4>
                    <p>Yes! After downloading your voice models, everything works offline. Models cache permanently in your browser - no re-downloads, no connectivity checks, no interruptions.</p>
                  </FAQ>
                  <FAQ>
                    <h4>Where does my text data go?</h4>
                    <p>Nowhere. Your content never leaves your device. All processing happens locally using WebAssembly. We literally can't see your text because it never reaches any server.</p>
                  </FAQ>
                  <FAQ>
                    <h4>Which browsers support this technology?</h4>
                    <p>Any modern browser with WebAssembly support: Chrome 92+, Edge 92+, Firefox 92+, Safari 15.2+. If your browser is from the last 2-3 years, you're good to go.</p>
                  </FAQ>
                  <FAQ>
                    <h4>How big are the voice files?</h4>
                    <p>Between 10MB (basic quality) and 80MB (premium quality). You only download what you need, and each model stays cached forever. Most users download 2-3 favorite voices.</p>
                  </FAQ>
                  <FAQ>
                    <h4>Can I switch between different voices?</h4>
                    <p>Of course! Download as many voices as you want. Switch instantly between them for different projects. All cached voices stay available for instant use anytime.</p>
                  </FAQ>
                </FAQGrid>
              </div>
            </InfoSection>
          </>
        )}
        <FooterNote>
          <span>On-Device AI • Privacy-First LLM • Zero Subscriptions</span>
          <span>•</span>
          <FooterLink to="/privacy">Privacy Policy</FooterLink>
        </FooterNote>
      </Shell>
    </Page>
  )
}

export default Home
