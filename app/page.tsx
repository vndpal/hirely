'use client'

import { FormEvent, useState } from 'react'
import { DM_Sans, Instrument_Serif } from 'next/font/google'
import styles from './page.module.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
})

export default function HomePage() {
  const [joinedWaitlist, setJoinedWaitlist] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setJoinedWaitlist(true)
  }

  return (
    <main className={`${styles.page} ${dmSans.className}`}>
      <nav className={styles.nav}>
        <div className={`${styles.logo} ${instrumentSerif.className}`}>
          Hire<em>ly</em>
        </div>
        <a href="#waitlist" className={styles.navCta}>
          Join waitlist
        </a>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <div className={styles.badgeDot} />
          Built on Notion MCP
        </div>

        <h1 className={`${styles.heroTitle} ${instrumentSerif.className}`}>
          Post a job.
          <br />
          <em>AI interviews everyone.</em>
          <br />
          You just decide.
        </h1>

        <p className={styles.heroSub}>
          Fill a Notion template. AI reads it, writes the job post, interviews every applicant, and hands you a ranked shortlist - before your
          coffee gets cold.
        </p>

        <div className={styles.heroActions}>
          <a href="#waitlist" className={styles.btnPrimary}>
            Get early access
          </a>
          <a href="#how" className={styles.btnGhost}>
            See how it works →
          </a>
        </div>
      </section>

      <section className={styles.stepsSection} id="how">
        <div className={styles.sectionLabel}>How it works</div>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepTitle}>You fill one Notion page</div>
            <div className={styles.stepDesc}>Role, skills, budget, and how strict you want the filter. That&apos;s it. No ATS login, no new tool to learn.</div>
          </div>
          <div className={styles.step}>
            <div className={`${styles.stepNum} ${styles.stepNumActive}`}>2</div>
            <div className={styles.stepTitle}>AI interviews every applicant</div>
            <div className={styles.stepDesc}>
              Candidates get a chat link. The AI has a real conversation - reads their CV, probes gaps, scores them against your exact requirements.
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepTitle}>You get a ranked shortlist</div>
            <div className={styles.stepDesc}>
              Every candidate appears as a card in Notion with a match score, skill breakdown, and one-paragraph summary. Decide in 30 seconds.
            </div>
          </div>
        </div>
      </section>

      <div className={styles.notionStrip}>
        <div className={`${styles.notionN} ${instrumentSerif.className}`}>N</div>
        <div>
          <div className={styles.notionTitle}>Notion is the only tool you need</div>
          <div className={styles.notionSub}>
            The AI reads your job page live. When you move a candidate card to &quot;Shortlisted&quot;, it sends the interview invite automatically. You never
            leave your workspace.
          </div>
        </div>
      </div>

      <div className={styles.previewWrap}>
        <div className={styles.previewLabel}>What lands in your Notion after each interview</div>
        <div className={styles.previewCard}>
          <div className={styles.previewCardTop}>
            <div className={styles.previewNotionDot}>Senior Python Engineer · 14 applicants</div>
            <div className={styles.updatedText}>Updated just now</div>
          </div>
          <div className={styles.previewCardBody}>
            <div>
              <div className={styles.cname}>Priya Sharma</div>
              <div className={styles.cscore}>78% match</div>
              <div className={styles.cmeta}>Available in 3 weeks<br />INR 24L ask - fits budget<br />Remote preferred</div>
            </div>
            <div>
              <div className={styles.colhead}>Skills</div>
              <div className={styles.skillRow}>
                <div className={`${styles.sdot} ${styles.sg}`} />
                Python - 4 yrs
              </div>
              <div className={styles.skillRow}>
                <div className={`${styles.sdot} ${styles.sg}`} />
                FastAPI - 2 projects
              </div>
              <div className={styles.skillRow}>
                <div className={`${styles.sdot} ${styles.sa}`} />
                Redis - basic only
              </div>
              <div className={styles.skillRow}>
                <div className={`${styles.sdot} ${styles.sr}`} />
                Kubernetes - none
              </div>
            </div>
            <div>
              <div className={styles.colhead}>Signals</div>
              <div className={styles.signal}>Led a team of 3 engineers</div>
              <div className={styles.signal}>Competing fintech offer</div>
              <div className={styles.signal}>Interested in AI products</div>
            </div>
            <div>
              <div className={styles.colhead}>Quick take</div>
              <div className={styles.quicktakeText}>Strong instincts, learnable gaps. Move fast - competing offer on table.</div>
              <br />
              <a href="#" className={styles.quicktakeLink}>
                → Full transcript
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={`${styles.statNum} ${instrumentSerif.className}`}>~4 min</div>
          <div className={styles.statLabel}>Average time to post a job</div>
        </div>
        <div className={styles.stat}>
          <div className={`${styles.statNum} ${instrumentSerif.className}`}>0</div>
          <div className={styles.statLabel}>Interviews you sit through to screen</div>
        </div>
        <div className={styles.stat}>
          <div className={`${styles.statNum} ${instrumentSerif.className}`}>30 sec</div>
          <div className={styles.statLabel}>To decide on any candidate</div>
        </div>
      </div>

      <section className={styles.ctaSection} id="waitlist">
        <div className={`${styles.ctaTitle} ${instrumentSerif.className}`}>
          Hire like you have a
          <br />
          <em>full recruiting team.</em>
        </div>
        <div className={styles.ctaSub}>Early access is free. No credit card.</div>
        <form className={styles.emailForm} onSubmit={handleSubmit}>
          <input className={styles.emailInput} type="email" placeholder="your@email.com" required disabled={joinedWaitlist} />
          <button className={`${styles.emailBtn} ${joinedWaitlist ? styles.emailBtnSuccess : ''}`} type="submit" disabled={joinedWaitlist}>
            {joinedWaitlist ? "You're in ✓" : 'Join waitlist'}
          </button>
        </form>
      </section>

      <footer className={styles.footer}>
        <div className={`${styles.footerLogo} ${instrumentSerif.className}`}>Hirely</div>
        <div className={styles.footerNote}>Built with Notion MCP · © 2026</div>
      </footer>
    </main>
  )
}
