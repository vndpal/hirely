'use client'

import { DM_Sans, Instrument_Serif } from 'next/font/google'
import styles from './page.module.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
})

export default function HomePage() {
  return (
    <main className={`${styles.page} ${dmSans.className}`}>
      {/* ---- NAV ---- */}
      <nav className={styles.nav}>
        <div className={`${styles.logo} ${instrumentSerif.className}`}>
          Hire<em>ly</em>
        </div>
        <div className={styles.navRight}>
          <a href="#how" className={styles.navLink}>How it works</a>
          <a href="#quick-start" className={styles.navCta}>
            Get started
            <span className={styles.navCtaArrow}>→</span>
          </a>
        </div>
      </nav>

      {/* ---- HERO (dark) ---- */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} />
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <div className={styles.badgeDot} />
            Powered by Notion MCP
          </div>

          <h1 className={`${styles.heroTitle} ${instrumentSerif.className}`}>
            Post jobs in Notion.
            <br />
            <em>AI runs the interviews.</em>
          </h1>

          <p className={styles.heroSub}>
            Hirely turns your Notion workspace into a complete hiring engine. HR publishes a role, candidates apply in a smooth chat interview, and scored candidate cards are written back to Notion automatically.
          </p>

          <div className={styles.heroActions}>
            <a href="#quick-start" className={styles.btnPrimary}>
              Quick start in 2 minutes
            </a>
            <a href="#how" className={styles.btnGhost}>
              See the full workflow
              <span className={styles.btnArrow}>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ---- VALUE PROPS ---- */}
      <section className={styles.valueSection}>
        <div className={styles.sectionLabel}>Why teams choose Hirely</div>
        <div className={styles.valueGrid}>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z" fill="currentColor" opacity=".3"/><path d="M10 5v5l3.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div className={styles.valueTitle}>For HR teams</div>
            <p className={styles.valueDesc}>
              Create jobs in seconds inside Notion, share one apply link, and stop manually screening every profile. AI handles first-round interviews while you focus on top candidates.
            </p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 14l4-4 3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="17" cy="6" r="2" fill="currentColor" opacity=".3"/></svg>
            </div>
            <div className={styles.valueTitle}>For candidates</div>
            <p className={styles.valueDesc}>
              Skip tedious forms and resume re-uploads. Applying feels like a natural conversation, so candidates can show real experience quickly without wasting hours.
            </p>
          </div>
        </div>
      </section>

      {/* ---- WORKFLOW STEPS ---- */}
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

      {/* ---- NOTION + AI STRIPS ---- */}
      <div className={styles.stripContainer}>
        <div className={styles.notionStrip}>
          <div className={`${styles.notionN} ${instrumentSerif.className}`}>N</div>
          <div>
            <div className={styles.stripTitle}>Notion MCP is the live data layer</div>
            <div className={styles.stripSub}>
              The AI reads your job page live via MCP before every interview. No caching, no stale data. Edit the JD in Notion at 2pm, and the 2:01pm interview already uses it. Candidate results write back to Notion automatically.
            </div>
          </div>
        </div>

        <div className={styles.aiStrip}>
          <div className={styles.aiIconWrap}>
            <div className={`${styles.aiIcon} ${styles.aiIconClaude}`}>C</div>
            <div className={`${styles.aiIcon} ${styles.aiIconGPT}`}>G</div>
          </div>
          <div>
            <div className={styles.stripTitle}>Works with ChatGPT and Claude</div>
            <div className={styles.stripSub}>
              Already use AI for drafting? Just ask Claude or ChatGPT to <em>"create a new requirement for [Role Name]"</em> via the Hirely MCP. It will create the JD in Notion for you and give you the interview link instantly.
            </div>
          </div>
        </div>
      </div>

      {/* ---- MCP TOUCHPOINTS ---- */}
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
            <div className={styles.mcpCardDesc}>Every session starts with a live MCP fetch. The AI always has the latest job requirements.</div>
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

      {/* ---- CANDIDATE PREVIEW ---- */}
      <div className={styles.previewWrap}>
        <div className={styles.sectionLabel}>What lands in your Notion after each interview</div>
        <div className={styles.previewCard}>
          <div className={styles.previewCardTop}>
            <div className={styles.previewNotionDot}>
              <span className={styles.previewNotionIcon}>N</span>
              Senior Python Engineer
            </div>
            <div className={styles.previewBadge}>Written by MCP</div>
          </div>
          <div className={styles.previewCardBody}>
            <div>
              <div className={styles.cname}>Priya Sharma</div>
              <div className={styles.cscore}>78% match</div>
              <div className={styles.cmeta}>Available in 3 weeks<br />INR 24L ask · fits budget<br />priya@email.com</div>
            </div>
            <div>
              <div className={styles.colhead}>Skills</div>
              <div className={styles.skillRow}>
                <div className={`${styles.sdot} ${styles.sg}`} />
                Python · 4 yrs
              </div>
              <div className={styles.skillRow}>
                <div className={`${styles.sdot} ${styles.sg}`} />
                FastAPI · 2 projects
              </div>
              <div className={styles.skillRow}>
                <div className={`${styles.sdot} ${styles.sa}`} />
                Redis · basic only
              </div>
              <div className={styles.skillRow}>
                <div className={`${styles.sdot} ${styles.sr}`} />
                Kubernetes · none
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
              <div className={styles.quicktakeText}>Strong Python instincts with real FastAPI experience. Redis gap is learnable. Move fast, competing offer on table. Recommend: advance.</div>
              <br />
              <a href="#" className={styles.quicktakeLink}>
                View full transcript →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ---- STATS ---- */}
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

      {/* ---- ARCHITECTURE ---- */}
      <section className={styles.archSection}>
        <div className={styles.sectionLabel}>Architecture</div>
        <div className={styles.archDiagram}>
          <div className={styles.archNode}>
            <div className={styles.archNodeIcon}>N</div>
            <div className={styles.archNodeLabel}>Notion</div>
            <div className={styles.archNodeSub}>Jobs + Candidates DBs</div>
          </div>
          <div className={styles.archArrow}>
            <div className={styles.archArrowLine} />
            <span>MCP read/write</span>
          </div>
          <div className={styles.archNode}>
            <div className={`${styles.archNodeIcon} ${styles.archNodeIconApp}`}>H</div>
            <div className={styles.archNodeLabel}>Hirely</div>
            <div className={styles.archNodeSub}>Next.js on Vercel</div>
          </div>
          <div className={styles.archArrow}>
            <div className={styles.archArrowLine} />
            <span>webhook</span>
          </div>
          <div className={styles.archNode}>
            <div className={`${styles.archNodeIcon} ${styles.archNodeIconN8n}`}>n</div>
            <div className={styles.archNodeLabel}>n8n</div>
            <div className={styles.archNodeSub}>Score + write back</div>
          </div>
        </div>
      </section>

      {/* ---- QUICK START ---- */}
      <section className={styles.quickStartSection} id="quick-start">
        <div className={styles.quickStartInner}>
          <div className={`${styles.ctaTitle} ${instrumentSerif.className}`}>
            Quick start:
            <br />
            <em>see Hirely live now.</em>
          </div>
          <div className={styles.ctaSub}>Follow these three steps to go from zero to interview results in minutes.</div>
          <div className={styles.quickStartSteps}>
            <a className={styles.quickStartCard} href="https://www.notion.so/32ea3459b0f2800ab6feed22dbf373b5?pvs=21" target="_blank" rel="noreferrer">
              <div className={styles.quickStartStepRow}>
                <div className={styles.quickStartStepNum}>1</div>
                <div>
                  <div className={styles.quickStartTitle}>Post a job in Notion</div>
                  <div className={styles.quickStartDesc}>Create a role, set status to Published, and get an apply link generated for sharing in 20-30 seconds.</div>
                </div>
              </div>
            </a>
            <div className={styles.quickStartConnector}>
              <div className={styles.quickStartConnectorLine} />
              <div className={styles.quickStartConnectorLabel}>link generated</div>
            </div>
            <a className={styles.quickStartCard} href="https://hirely-tan.vercel.app/apply/32fa3459-b0f2-8016-9a69-c701590a6033" target="_blank" rel="noreferrer">
              <div className={styles.quickStartStepRow}>
                <div className={`${styles.quickStartStepNum} ${styles.quickStartStepNumActive}`}>2</div>
                <div>
                  <div className={styles.quickStartTitle}>Candidate takes the AI interview</div>
                  <div className={styles.quickStartDesc}>Share the apply link. Candidates click it and complete a 2-minute AI interview tailored to your JD.</div>
                </div>
              </div>
            </a>
            <div className={styles.quickStartConnector}>
              <div className={styles.quickStartConnectorLine} />
              <div className={styles.quickStartConnectorLabel}>results scored</div>
            </div>
            <a className={styles.quickStartCard} href="https://www.notion.so/32ea3459b0f2803f884ce1ecddc70d95?pvs=21" target="_blank" rel="noreferrer">
              <div className={styles.quickStartStepRow}>
                <div className={styles.quickStartStepNum}>3</div>
                <div>
                  <div className={styles.quickStartTitle}>Review scored candidates</div>
                  <div className={styles.quickStartDesc}>Match score, skill signals, salary fit, and summary cards land directly in your Candidates database.</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className={styles.footer}>
        <div className={`${styles.footerLogo} ${instrumentSerif.className}`}>
          Hire<em>ly</em>
        </div>
        <div className={styles.footerNote}>Built with Notion MCP · Submitted to Notion MCP Challenge 2026</div>
      </footer>
    </main>
  )
}
