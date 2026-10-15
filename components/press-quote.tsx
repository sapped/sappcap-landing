import styles from "./deal-home.module.css";
export function PressQuote({ compact = false }: { compact?: boolean }) {
 return <aside className={`${styles.press} ${compact ? styles.pressCompact : ""}`} aria-label="Edward Sapp in Newsweek Opinion">
  <p className={styles.pressLabel}><span>Newsweek</span> OPINION · EDWARD SAPP</p>
  <blockquote>{compact ? "“But when the cost of being wrong involves millions of dollars, speed should never be confused with certainty.”" : "“But finding a clause is not the same as understanding its significance.”"}</blockquote>
  <a href="https://www.newsweek.com/the-biggest-risk-of-ai-in-real-estate-may-be-false-confidence-opinion-12506574" target="_blank" rel="noopener noreferrer">{compact ? "Read Edward’s Newsweek Article on Commercial Real Estate" : "Read Edward’s article on false confidence in AI underwriting"}</a>
 </aside>;
}
