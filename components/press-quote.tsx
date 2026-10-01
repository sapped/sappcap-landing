import styles from "./deal-home.module.css";
export function PressQuote() {
 return <aside className={styles.press} aria-label="Edward Sapp in Newsweek Opinion">
  <p className={styles.pressLabel}><span>Newsweek</span> OPINION · EDWARD SAPP</p>
  <blockquote>“But finding a clause is not the same as understanding its significance.”</blockquote>
  <a href="https://www.newsweek.com/the-biggest-risk-of-ai-in-real-estate-may-be-false-confidence-opinion-12506574" target="_blank" rel="noopener noreferrer">Read Edward’s article on false confidence in AI underwriting</a>
 </aside>;
}
