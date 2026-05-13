import { useNavigate } from 'react-router-dom'
import { BrandMark } from '../components/UI'

export default function IntroPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <main className="intro-flow">

        {/* ── HERO ── */}
        <section className="intro-panel intro-panel-hero">
          <div className="intro-panel-content">
            <BrandMark />
            <div className="intro-chip">AI Workforce Intelligence</div>
            <h1>
              Understand Your<br />
              <span className="intro-gradient-text">AI Exposure Risk</span><br />
              Before It's Too Late
            </h1>
            <p className="intro-lead">
              A structured, evidence-based tool for assessing artificial intelligence
              displacement risk across your professional role — and building a clear
              plan to stay ahead.
            </p>
            <button className="btn-primary" onClick={() => navigate('/app')} style={{ maxWidth: 260 }}>
              Start Your Analysis →
            </button>
            <div className="intro-scroll-hint">
              <span>Scroll to explore</span>
              <div className="intro-scroll-line" />
            </div>
          </div>

          <div className="intro-motion" aria-hidden="true">
            <div className="orbit orbit-1"><span className="orb orb-a" /></div>
            <div className="orbit orbit-2"><span className="orb orb-b" /></div>
            <div className="orbit orbit-3"><span className="orb orb-c" /></div>
            <div className="pulse-core" />
            <div className="signal-beam signal-beam-1" />
            <div className="signal-beam signal-beam-2" />
            <div className="signal-beam signal-beam-3" />
          </div>
        </section>

        {/* ── CHALLENGE ── */}
        <section className="intro-panel">
          <div className="intro-panel-content wide">
            <p className="label intro-section-heading">THE CHALLENGE</p>
            <div className="intro-problem-block">
              <div className="intro-problem-text">
                <h2>Most workers don't know which parts of their role are vulnerable to AI until it's too late.</h2>
                <div className="intro-stat-list">
                  <div className="intro-stat-row">
                    <span className="intro-stat-number">85%</span>
                    <div className="intro-stat-label-group">
                      <span className="intro-stat-label">of jobs will be significantly transformed by AI by 2030</span>
                      <span className="intro-stat-source">World Economic Forum — Future of Jobs Report</span>
                    </div>
                  </div>
                  <div className="intro-stat-row">
                    <span className="intro-stat-number">40%</span>
                    <div className="intro-stat-label-group">
                      <span className="intro-stat-label">of core work tasks across all occupations are exposed to large language models like GPT-4</span>
                      <span className="intro-stat-source">OpenAI &amp; University of Pennsylvania, 2023</span>
                    </div>
                  </div>
                  <div className="intro-stat-row">
                    <span className="intro-stat-number">12M</span>
                    <div className="intro-stat-label-group">
                      <span className="intro-stat-label">workers may need to switch occupational categories as AI-driven automation accelerates</span>
                      <span className="intro-stat-source">McKinsey Global Institute — The Future of Work</span>
                    </div>
                  </div>
                </div>
              </div>
              <img
                className="intro-problem-image"
                src="/intro-problem.png"
                alt="AI impact on professional roles"
              />
            </div>
          </div>
        </section>

        {/* ── SOLUTION ── */}
        <section className="intro-panel intro-panel-solution">
          <div className="intro-panel-content wide">
            <p className="label intro-section-heading">THE SOLUTION</p>
            <div className="intro-solution-block">
              <div className="intro-solution-text">
                <h2>The Job Role Analyser breaks down your role task by task, revealing exactly where AI threatens your career and what to do about it.</h2>
                <div className="intro-feature-list">
                  <div className="intro-feature-card">
                    <div className="intro-feature-index">01</div>
                    <div>
                      <strong>Task-Level Risk Mapping</strong>
                      <p>Break down your role into individual tasks and assess each one's AI displacement risk using a six-tier classification model.</p>
                    </div>
                  </div>
                  <div className="intro-feature-card">
                    <div className="intro-feature-index">02</div>
                    <div>
                      <strong>Personalised Risk Report</strong>
                      <p>Receive a tailored report with risk classifications, displacement timelines, and industry-specific context for every task.</p>
                    </div>
                  </div>
                  <div className="intro-feature-card">
                    <div className="intro-feature-index">03</div>
                    <div>
                      <strong>Actionable Future-Proofing Guide</strong>
                      <p>Concrete tools, skills to develop, and immediate steps — structured across immediate, short-term, and long-term horizons.</p>
                    </div>
                  </div>
                </div>
                <a
                  className="btn-primary intro-solution-article-btn"
                  href="https://medium.com/@khantauqeerali26/future-proofing-yourself-in-the-age-of-ai-de93a5e4fdd6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read the research article →
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

        {/* ── ABOUT ── */}
        <section className="intro-panel intro-panel-author">
          <div className="intro-author-centered">
            <p className="label intro-section-heading" style={{ textAlign: 'center' }}>MIND BEHIND THE FRAMEWORK</p>

            <div className="intro-author-photo">
              <img src="/me.jpg" alt="Tauqeer Ali Khan" />
            </div>

            <p className="intro-author-name">Tauqeer Ali Khan</p>
            <p className="intro-author-role">Researcher · University of Leeds</p>

            <div className="intro-author-bio-center">
              <p>
                Tauqeer Ali Khan is an engineer and technologist on a mission to help people
                understand, embrace, and thrive within the 4th Industrial Revolution. Through
                intelligent systems, AI-powered tools, and practical education, his work is
                dedicated to equipping individuals with the clarity and confidence to harness
                emerging technologies — rather than be overtaken by them.
              </p>
              <p>
                The JRA Framework is a direct expression of that mission: a structured,
                accessible tool that helps professionals identify exactly where AI intersects
                with their work and take decisive, informed steps to stay ahead of the curve.
              </p>
              <p style={{ marginTop: '0.25rem' }}>
                Be a part of this mission and contribute in making the technology better for humanity
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                <a
                  href="https://www.linkedin.com/in/tauqeer-ali-khan"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 700 }}
                >
                  Let's connect
                </a>
              </p>
            </div>

            <div className="author-cta-row" style={{ justifyContent: 'center' }}>
              <button className="btn-primary" onClick={() => navigate('/app')} style={{ maxWidth: 220 }}>
                Begin Analysis →
              </button>
              <a
                className="btn-ghost"
                href="https://medium.com/@khantauqeerali26/future-proofing-yourself-in-the-age-of-ai-de93a5e4fdd6"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the article →
              </a>
            </div>
          </div>
        </section>

      </main>

      <footer className="intro-footer">
        <a
          href="https://www.linkedin.com/in/tauqeer-ali-khan"
          target="_blank"
          rel="noopener noreferrer"
          className="intro-footer-linkedin"
          aria-label="LinkedIn profile"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <span>Tauqeer Ali Khan</span>
        </a>

        <a
          href="mailto:khantauqeerali26@gmail.com"
          className="intro-footer-copy"
          style={{ textDecoration: 'none', color: 'var(--text3)', fontSize: '0.92rem' }}
        >
          khantauqeerali26@gmail.com
        </a>

        <p className="intro-footer-copy">© {new Date().getFullYear()} Tauqeer Ali Khan. All rights reserved.</p>
      </footer>
    </div>
  )
}
