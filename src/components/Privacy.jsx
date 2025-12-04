import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Database, Lock, Eye, Server, Globe } from 'lucide-react'
import { Button } from './ui/button'

const Page = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.85), #030712 68%);
  padding: 2rem 1rem 4rem;
`

const Shell = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #60a5fa;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
  width: fit-content;

  &:hover {
    color: #93c5fd;
  }
`

const Title = styled.h1`
  margin: 0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: clamp(2rem, 4vw, 3rem);
  letter-spacing: 0.08em;
  color: #f8fafc;
  text-transform: uppercase;
`

const LastUpdated = styled.p`
  color: #94a3b8;
  font-size: 0.9rem;
  margin: 0;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`

const Section = styled.section`
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(15, 23, 42, 0.35);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #60a5fa;
  margin-bottom: 0.5rem;
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: #f8fafc;
`

const Paragraph = styled.p`
  margin: 0;
  color: #cbd5f5;
  line-height: 1.7;
  font-size: 0.95rem;
`

const List = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
  color: #cbd5f5;
  line-height: 1.7;
  font-size: 0.95rem;

  li {
    margin-bottom: 0.5rem;
  }
`

const Highlight = styled.div`
  border-left: 3px solid #60a5fa;
  padding-left: 1.25rem;
  margin: 1rem 0;
  color: #e0e7ff;
  font-size: 0.95rem;
  line-height: 1.7;
`

const ContactLink = styled.a`
  color: #60a5fa;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

function Privacy() {
  return (
    <Page>
      <Shell>
        <Header>
          <BackButton to="/">
            <ArrowLeft size={18} />
            Back to Web-TTS
          </BackButton>
          <Title>Privacy Policy</Title>
          <LastUpdated>Last updated: December 4, 2025</LastUpdated>
        </Header>

        <Content>
          <Section>
            <SectionHeader>
              <Shield size={24} />
              <SectionTitle>Our Commitment to Your Privacy</SectionTitle>
            </SectionHeader>
            <Paragraph>
              Web-TTS is built with privacy at its core. Unlike traditional cloud-based text-to-speech services,
              we process everything directly in your browser using WebAssembly technology. This means your data
              never leaves your device, and we have no ability to access, store, or analyze your content.
            </Paragraph>
            <Highlight>
              <strong>Simple Truth:</strong> We don't collect, store, or transmit your text or audio data. Period.
            </Highlight>
          </Section>

          <Section>
            <SectionHeader>
              <Database size={24} />
              <SectionTitle>Data Collection</SectionTitle>
            </SectionHeader>
            <Paragraph>
              Web-TTS does not collect, store, or transmit any personal information or user-generated content.
              Here's what happens with your data:
            </Paragraph>
            <List>
              <li><strong>Your Text:</strong> Stays in your browser's memory. Never sent to any server.</li>
              <li><strong>Generated Audio:</strong> Created locally on your device. Never uploaded anywhere.</li>
              <li><strong>Voice Models:</strong> Downloaded once from HuggingFace and cached in your browser for offline use.</li>
              <li><strong>Settings & Preferences:</strong> Stored locally in your browser's localStorage. Never synced to any server.</li>
            </List>
          </Section>

          <Section>
            <SectionHeader>
              <Lock size={24} />
              <SectionTitle>Local Processing</SectionTitle>
            </SectionHeader>
            <Paragraph>
              All text-to-speech processing happens entirely in your browser using:
            </Paragraph>
            <List>
              <li><strong>WebAssembly (WASM):</strong> Enables high-performance local processing without server communication</li>
              <li><strong>ONNX Runtime Web:</strong> Runs AI models directly in your browser</li>
              <li><strong>Cache API:</strong> Stores downloaded voice models locally for offline access</li>
              <li><strong>localStorage:</strong> Saves your preferences and downloaded model metadata</li>
            </List>
            <Paragraph>
              This architecture ensures that your content remains private and secure, accessible only to you.
            </Paragraph>
          </Section>

          <Section>
            <SectionHeader>
              <Server size={24} />
              <SectionTitle>Server Interactions</SectionTitle>
            </SectionHeader>
            <Paragraph>
              The only network requests made by Web-TTS are:
            </Paragraph>
            <List>
              <li><strong>Voice Model Downloads:</strong> When you download a voice, we fetch the model files from HuggingFace's public CDN. These are one-time downloads that get cached permanently.</li>
              <li><strong>Voice Metadata:</strong> We load the list of available voices from HuggingFace to populate the voice selector.</li>
            </List>
            <Paragraph>
              No user content, text, or audio is ever transmitted in these requests. We only download public AI models
              that are necessary for the text-to-speech functionality.
            </Paragraph>
          </Section>

          <Section>
            <SectionHeader>
              <Eye size={24} />
              <SectionTitle>Analytics & Tracking</SectionTitle>
            </SectionHeader>
            <Paragraph>
              Web-TTS does not use any analytics, tracking pixels, or third-party monitoring services. We don't use:
            </Paragraph>
            <List>
              <li>Google Analytics or similar analytics platforms</li>
              <li>Social media tracking pixels</li>
              <li>Advertising networks</li>
              <li>Session recording or heatmap tools</li>
              <li>User behavior tracking</li>
            </List>
            <Paragraph>
              Your usage of Web-TTS is completely anonymous and private.
            </Paragraph>
          </Section>

          <Section>
            <SectionHeader>
              <Globe size={24} />
              <SectionTitle>Third-Party Services</SectionTitle>
            </SectionHeader>
            <Paragraph>
              Web-TTS relies on these external services:
            </Paragraph>
            <List>
              <li>
                <strong>HuggingFace:</strong> Hosts the voice model files. When you download a voice model,
                your browser makes a direct request to HuggingFace's CDN. HuggingFace may log these requests
                as part of their standard CDN operations, but no personal data is transmitted.
              </li>
            </List>
            <Paragraph>
              Once models are downloaded and cached, Web-TTS works completely offline with no third-party dependencies.
            </Paragraph>
          </Section>

          <Section>
            <SectionHeader>
              <Shield size={24} />
              <SectionTitle>Your Rights & Control</SectionTitle>
            </SectionHeader>
            <Paragraph>
              You have complete control over your data:
            </Paragraph>
            <List>
              <li><strong>Clear Cache:</strong> Use your browser's settings to clear cached voice models at any time</li>
              <li><strong>Clear Settings:</strong> Clear your browser's localStorage to reset all preferences</li>
              <li><strong>Offline Use:</strong> Once models are downloaded, disconnect from the internet for complete privacy</li>
              <li><strong>No Account Required:</strong> Use Web-TTS without creating an account or providing any personal information</li>
            </List>
          </Section>

          <Section>
            <SectionHeader>
              <Globe size={24} />
              <SectionTitle>Cookies</SectionTitle>
            </SectionHeader>
            <Paragraph>
              Web-TTS does not use cookies. All data storage happens through browser APIs (localStorage and Cache API)
              which are confined to your device and never transmitted elsewhere.
            </Paragraph>
          </Section>

          <Section>
            <SectionHeader>
              <Shield size={24} />
              <SectionTitle>Children's Privacy</SectionTitle>
            </SectionHeader>
            <Paragraph>
              Web-TTS does not knowingly collect any information from anyone, including children under 13.
              The service can be used by anyone without providing personal information.
            </Paragraph>
          </Section>

          <Section>
            <SectionHeader>
              <Database size={24} />
              <SectionTitle>Changes to This Policy</SectionTitle>
            </SectionHeader>
            <Paragraph>
              We may update this privacy policy from time to time. Any changes will be posted on this page with
              an updated "Last updated" date. We encourage you to review this policy periodically.
            </Paragraph>
            <Paragraph>
              Given the nature of Web-TTS (client-side only, no data collection), any future changes are likely
              to be minor clarifications rather than fundamental changes to our privacy practices.
            </Paragraph>
          </Section>

          <Section>
            <SectionHeader>
              <Globe size={24} />
              <SectionTitle>Contact Us</SectionTitle>
            </SectionHeader>
            <Paragraph>
              If you have any questions about this privacy policy or Web-TTS's privacy practices, please contact us:
            </Paragraph>
            <List>
              <li>GitHub Issues: <ContactLink href="https://github.com/7kfpun/webtts/issues" target="_blank" rel="noopener noreferrer">github.com/7kfpun/webtts/issues</ContactLink></li>
            </List>
          </Section>

          <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
            <Button as={Link} to="/" variant="secondary">
              Back to Home
            </Button>
          </div>
        </Content>
      </Shell>
    </Page>
  )
}

export default Privacy
