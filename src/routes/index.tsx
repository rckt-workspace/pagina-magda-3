import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { siteHtml, siteScript } from "./-site-content";
import { MagdaAssistant } from "../components/MagdaAssistant";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Magda Gutiérrez · Pricing & HEOR" },
      {
        name: "description",
        content:
          "Pricing y Health Economics & Outcomes Research para la industria farmacéutica. Modelos económicos, dossiers de valor y estrategia de precio frente a financiadores.",
      },
      { property: "og:title", content: "Magda Gutiérrez · Pricing & HEOR" },
      {
        property: "og:description",
        content:
          "Modelos económicos, dossiers de valor y estrategia de precio frente a financiadores.",
      },
      { property: "og:type", content: "website" },
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
    ],
  }),
  component: Index,
});

function Index() {
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
      <div ref={ref} dangerouslySetInnerHTML={{ __html: siteHtml }} />
      <MagdaAssistant />
    </>
  );
}
