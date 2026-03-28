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
          Powered by Notion MCP
        </div>

        <h1 className={`${styles.heroTitle} ${instrumentSerif.className}`}>
          Notion is your ATS.
          <br />
          <em>AI does the screening.</em>
        </h1>

        <p className={styles.heroSub}>
          Create a job in Notion. Share a link. AI interviews every candidate, scores them, and writes a ranked card back to your Notion workspace. No new tools. No context switching.
        </p>

        <div className={styles.heroActions}>
          <a href="#waitlist" className={styles.btnPrimary}>
            Get early access
          </a>
          <a href="#how" className={styles.btnGhost}>
            See the full workflow →
          </a>
        </div>
      </section>

      <section className={styles.stepsSection} id="how">
        <div className={styles.sectionLabel}>End-to-end workflow</div>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepTitle}>Define the role in Notion</div>
            <div className={styles.stepDesc}>Fill one Notion page: role title, required skills, salary range, and match threshold. Publish it and an apply link is generated automatically.</div>
          </div>
          <div className={styles.step}>
            <div className={`${styles.stepNum} ${styles.stepNumActive}`}>2</div>
            <div className={styles.stepTitle}>AI interviews every applicant</div>
            <div className={styles.stepDesc}>
              Candidates click the link and chat with an AI interviewer that reads your JD live from Notion via MCP. Every interview is tailored to your exact requirements.
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepTitle}>Scored cards land in Notion</div>
            <div className={styles.stepDesc}>
              When the interview ends, the transcript is scored and a candidate card is created in your Notion database: match score, skill breakdown, salary fit, and a one-paragraph summary.
            </div>
          </div>
        </div>
      </section>

      <div className={styles.notionStrip}>
        <div className={`${styles.notionN} ${instrumentSerif.className}`}>N</div>
        <div>
          <div className={styles.notionTitle}>Notion MCP is the live data layer</div>
          <div className={styles.notionSub}>
            The AI reads your job page live via MCP before every interview — no caching, no stale data. Edit the JD in Notion at 2pm, and the 2:01pm interview already uses it. Candidate results write back to Notion automatically.
          </div>
        </div>
      </div>

      <div className={styles.aiStrip}>
        <div className={styles.aiIconWrap}>
          <div className={`${styles.aiIcon} ${styles.aiIconClaude}`}>C</div>
          <div className={`${styles.aiIcon} ${styles.aiIconGPT}`} style={{ marginLeft: '-12px' }}>G</div>
        </div>
        <div>
          <div className={styles.aiTitle}>Works with ChatGPT and Claude</div>
          <div className={styles.aiSub}>
            Already use AI for drafting? Just ask Claude or ChatGPT to <em>"create a new requirement for [Role Name]"</em> via the Hirely MCP — it will create the JD in Notion for you and give you the interview link to share instantly.
          </div>
        </div>
      </div>

      <section className={styles.mcpSection}>
        <div className={styles.sectionLabel}>4 MCP touchpoints</div>
        <div className={styles.mcpGrid}>
          <div className={styles.mcpCard}>
            <div className={styles.mcpIcon}>R</div>
            <div className={styles.mcpCardTitle}>Read job on publish</div>
            <div className={styles.mcpCardDesc}>When status changes to Published, MCP reads the full page to generate the apply link.</div>
          </div>
          <div className={styles.mcpCard}>
            <div className={styles.mcpIcon}>R</div>
            <div className={styles.mcpCardTitle}>Read JD before each interview</div>
            <div className={styles.mcpCardDesc}>Every session starts with a live MCP fetch — the AI always has the latest job requirements.</div>
          </div>
          <div className={styles.mcpCard}>
            <div className={`${styles.mcpIcon} ${styles.mcpIconWrite}`}>W</div>
            <div className={styles.mcpCardTitle}>Write candidate card</div>
            <div className={styles.mcpCardDesc}>After scoring, MCP creates a new page in your Candidates database with all evaluation data.</div>
          </div>
          <div className={styles.mcpCard}>
            <div className={`${styles.mcpIcon} ${styles.mcpIconWrite}`}>W</div>
            <div className={styles.mcpCardTitle}>Write apply link back</div>
            <div className={styles.mcpCardDesc}>The generated apply link is written back to the job page so HR can share it immediately.</div>
          </div>
        </div>
      </section>

      <div className={styles.previewWrap}>
        <div className={styles.previewLabel}>What lands in your Notion after each interview</div>
        <div className={styles.previewCard}>
          <div className={styles.previewCardTop}>
            <div className={styles.previewNotionDot}>Senior Python Engineer</div>
            <div className={styles.updatedText}>Written by MCP</div>
          </div>
          <div className={styles.previewCardBody}>
            <div>
              <div className={styles.cname}>Priya Sharma</div>
              <div className={styles.cscore}>78% match</div>
              <div className={styles.cmeta}>Available in 3 weeks<br />INR 24L ask - fits budget<br />priya@email.com</div>
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
              <div className={styles.signal}>Strong async communication</div>
            </div>
            <div>
              <div className={styles.colhead}>Quick take</div>
              <div className={styles.quicktakeText}>Strong Python instincts with real FastAPI experience. Redis gap is learnable. Move fast — competing offer on table. Recommend: advance.</div>
              <br />
              <a href="#" className={styles.quicktakeLink}>
                View full transcript
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={`${styles.statNum} ${instrumentSerif.className}`}>~4 min</div>
          <div className={styles.statLabel}>Average interview duration</div>
        </div>
        <div className={styles.stat}>
          <div className={`${styles.statNum} ${instrumentSerif.className}`}>0</div>
          <div className={styles.statLabel}>Screening calls you sit through</div>
        </div>
        <div className={styles.stat}>
          <div className={`${styles.statNum} ${instrumentSerif.className}`}>30 sec</div>
          <div className={styles.statLabel}>To decide on any candidate</div>
        </div>
      </div>

      <section className={styles.archSection}>
        <div className={styles.sectionLabel}>Architecture</div>
        <div className={styles.archDiagram}>
          <div className={styles.archNode}>
            <div className={styles.archNodeIcon}>N</div>
            <div className={styles.archNodeLabel}>Notion</div>
            <div className={styles.archNodeSub}>Jobs + Candidates DBs</div>
          </div>
          <div className={styles.archArrow}>
            <span>MCP read</span>
          </div>
          <div className={styles.archNode}>
            <div className={`${styles.archNodeIcon} ${styles.archNodeIconApp}`}>H</div>
            <div className={styles.archNodeLabel}>Hirely</div>
            <div className={styles.archNodeSub}>Next.js on Vercel</div>
          </div>
          <div className={styles.archArrow}>
            <span>webhook</span>
          </div>
          <div className={styles.archNode}>
            <div className={`${styles.archNodeIcon} ${styles.archNodeIconN8n}`}>n</div>
            <div className={styles.archNodeLabel}>n8n</div>
            <div className={styles.archNodeSub}>Score + write back</div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection} id="waitlist">
        <div className={`${styles.ctaTitle} ${instrumentSerif.className}`}>
          Your Notion workspace is
          <br />
          <em>already an ATS.</em>
        </div>
        <div className={styles.ctaSub}>Early access is free. No credit card required.</div>
        <form className={styles.emailForm} onSubmit={handleSubmit}>
          <input className={styles.emailInput} type="email" placeholder="your@email.com" required disabled={joinedWaitlist} />
          <button className={`${styles.emailBtn} ${joinedWaitlist ? styles.emailBtnSuccess : ''}`} type="submit" disabled={joinedWaitlist}>
            {joinedWaitlist ? "You're in" : 'Join waitlist'}
          </button>
        </form>
      </section>

      <footer className={styles.footer}>
        <div className={`${styles.footerLogo} ${instrumentSerif.className}`}>Hirely</div>
        <div className={styles.footerNote}>Built with Notion MCP</div>
      </footer>
    </main>
  )
}
