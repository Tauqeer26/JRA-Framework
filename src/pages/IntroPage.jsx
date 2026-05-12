import { useNavigate } from 'react-router-dom'
import { BrandMark } from '../components/UI'

export default function IntroPage() {
  const navigate = useNavigate()

  function handleContinue() {
    navigate('/app')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <main className="intro-flow">
        <section className="intro-panel intro-panel-hero">
          <div className="intro-panel-content">
            <BrandMark />
            <h1>Job Role Analyzer</h1>
            <button className="btn-primary" onClick={handleContinue} style={{ maxWidth: 260 }}>
              Start your analysis →
            </button>
          </div>

          <div className="intro-motion" aria-hidden="true">
            <div className="orbit orbit-1">
              <span className="orb orb-a" />
            </div>
            <div className="orbit orbit-2">
              <span className="orb orb-b" />
            </div>
            <div className="orbit orbit-3">
              <span className="orb orb-c" />
            </div>
            <div className="pulse-core" />
            <div className="signal-beam signal-beam-1" />
            <div className="signal-beam signal-beam-2" />
            <div className="signal-beam signal-beam-3" />
          </div>
        </section>

        <section className="intro-panel">
          <div className="intro-panel-content wide">
            <p className="label intro-section-heading">THE PROBLEM</p>
            <div className="intro-problem-block">
              <div className="intro-problem-text">
                <h2>Workers don't know which parts of their job are at risk from AI — until it's too late.</h2>
              </div>
              <img
                className="intro-problem-image"
                src="/intro-problem.png"
                alt="Professional worried about AI impact on job"
              />
            </div>
          </div>
        </section>

        <section className="intro-panel intro-panel-solution">
          <div className="intro-panel-content wide">
            <p className="label intro-section-heading">THE SOLUTION</p>
            <div className="intro-solution-block">
              <div className="intro-solution-text">
                <h2>
                  Job Role Analyzer(JRA) helps you understand where AI poses the greatest exposure in your work and gives practical, actionable steps to stay relevant.
                </h2>
                <p>
                  Quickly generate a task map of your role, classify tasks by risk, and get a concise summary with tools and actions.
                </p>
                <a
                  className="btn-primary intro-solution-article-btn"
                  href="https://medium.com/@khantauqeerali26/future-proofing-yourself-in-the-age-of-ai-de93a5e4fdd6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read the article →
                </a>
              </div>
              <img
                className="intro-solution-image"
                src="/Block_diagram.svg"
                alt="JRA framework diagram"
              />
            </div>
          </div>
        </section>

        <section className="intro-panel intro-panel-author">
          <div className="intro-panel-content wide">
            <h2>Framework developed by Tauqeer Ali Khan</h2>
            <div className="author-wrap">
              <div className="intro-author-col">
                <div className="intro-author-photo">
                  <img src="/intro-author.png" alt="Tauqeer Ali Khan" />
                </div>
                <p className="intro-author-name">Tauqeer Ali Khan</p>
                <p className="intro-author-role">Researcher at University of Leeds</p>
              </div>
              <div className="intro-author-bio">
                <p>
                  I am an Engineer and researcher focused on building real-world intelligent systems powered by Artificial Intelligence, automation, and emerging technologies. My mission is to help people understand the ongoing AI revolution, use AI effectively in their personal and professional lives, and stay relevant in the future of work through practical, accessible, and responsible AI education.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}