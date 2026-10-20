import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { siteScript } from "./-site-content";
import { siteHtmlEn } from "./-site-content.en";
import { MagdaAssistant } from "../components/MagdaAssistant";

export const Route = createFileRoute("/en")({
  head: () => ({
    meta: [
      { title: "Magda Gutiérrez · Pricing & HEOR" },
      {
        name: "description",
        content:
          "Pricing and Health Economics & Outcomes Research for the pharmaceutical industry. Economic models, value dossiers and pricing strategy for payers.",
      },
      { property: "og:title", content: "Magda Gutiérrez · Pricing & HEOR" },
      {
        property: "og:description",
        content:
          "Economic models, value dossiers and pricing strategy for payers.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,500&family=Public+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap",
      },
      { rel: "stylesheet", href: "/site.css" },
      { rel: "alternate", hrefLang: "es", href: "https://magdagutierrez.com/" },
      { rel: "alternate", hrefLang: "en", href: "https://magdagutierrez.com/en" },
      { rel: "alternate", hrefLang: "x-default", href: "https://magdagutierrez.com/" },
    ],
  }),
  component: IndexEn,
});

function IndexEn() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = document.createElement("script");
    el.textContent = siteScript;
    document.body.appendChild(el);
    return () => {
      el.remove();
      document.documentElement.classList.remove("js-ready");
    };
  }, []);

  return (
    <>
      <div ref={ref} dangerouslySetInnerHTML={{ __html: siteHtmlEn }} />
      <MagdaAssistant lang="en" />
    </>
  );
}
