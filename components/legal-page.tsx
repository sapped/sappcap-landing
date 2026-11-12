import fs from "node:fs";
import path from "node:path";
import { Fragment } from "react";
import { Navbar } from "@/components/navbar";
import styles from "./legal-page.module.css";

function inline(text: string) {
  return text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link && /^(https:\/\/|mailto:)/.test(link[2])) return <a key={index} href={link[2]}>{link[1]}</a>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2,-2)}</strong>;
    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function LegalPage({ slug }: { slug: "privacy" | "terms" | "cookies" }) {
  const markdown = fs.readFileSync(path.join(process.cwd(), "content/legal", slug + ".md"), "utf8");
  const [titleBlock, ...blocks] = markdown.trim().split(/\n\s*\n/);
  return <><Navbar /><main className={styles.main}>
    <article className={styles.article}><p className={styles.kicker}>SAPP CAPITAL ADVISORS</p><h1>{titleBlock.replace(/^# /, "")}</h1>
      {blocks.map((block,index) => {
        if (block.startsWith("## ")) return <h2 key={index}>{block.slice(3)}</h2>;
        if (block.startsWith("- ")) return <ul key={index}>{block.split("\n").map((item,i) => <li key={i}>{inline(item.replace(/^- /,""))}</li>)}</ul>;
        return <p key={index}>{inline(block)}</p>;
      })}
    </article>
  </main></>;
}
