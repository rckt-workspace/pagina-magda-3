/**
 * Versión en inglés del sitio (/en).
 * Misma estructura que -site-content.ts: si se cambia algo en español, hay que reflejarlo aquí.
 * El script (siteScript) es compartido y elige los mensajes según data-site-lang del header.
 */
export const siteHtmlEn = `

<div class="scroll-progress" aria-hidden="true"><div class="bar" id="scrollBar"></div></div>

<header class="site" data-site-lang="en">
  <nav class="nav">
    <div class="nav-left">
      <a class="brand" href="#top">
        <span class="mark">MG</span>
        <span class="txt"><span class="name">Magda Gutiérrez</span><span class="sub">Pricing &amp; HEOR</span></span>
      </a>
      <span class="nav-divider" aria-hidden="true"></span>
      <a class="nav-tag" href="#contacto">Independent consulting</a>
    </div>
    <ul class="nav-links">
      <li><a href="#servicios">Services</a></li>
      <li><a href="#metodo">Method</a></li>
      <li><a href="#comparativa">Why me</a></li>
      <li><a href="#contacto">Contact</a></li>
    </ul>
    <div class="nav-right">
      <div class="lang-switch" role="group" aria-label="Idioma / Language">
        <a href="/" hreflang="es" lang="es">ES</a>
        <a href="/en" hreflang="en" lang="en" aria-current="page">EN</a>
      </div>
      <a class="btn btn-outline-light btn-sm" href="https://linkedin.com/in/magda-gutierrez-ardila" target="_blank" rel="noopener">View LinkedIn</a>
      <a class="btn btn-glow btn-sm nav-cta" href="mailto:magda.vianey.g@gmail.com" aria-label="Let’s talk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg><span class="nav-cta-label">Let’s talk</span></a>
      <button class="menu-toggle" type="button" aria-label="Open menu">☰</button>
    </div>
  </nav>
</header>

<main id="top">
  <section class="hero" id="hero">
    <div class="hero-glow g1"></div>
    <div class="hero-glow g2"></div>
    <div class="wrap">
      <div class="hero-badge reveal"><span class="stars">★★★★★</span> 14 years helping pharmaceutical companies defend their price</div>
      <h1 class="reveal">14 years building the evidence behind positioning</h1>
      <p class="hero-lead reveal">I help design, structure or adapt pharmacoeconomic models and tailored arguments so your product demonstrates its true impact against the specific realities of each payer and health authority.</p>
      <div class="hero-cta-row reveal">
        <a class="btn btn-glow" href="mailto:magda.vianey.g@gmail.com">Let’s talk →</a>
        <a class="btn btn-outline-light" href="#servicios">View services</a>
      </div>
    </div>
  </section>

  <div class="marquee-strip" aria-hidden="true">
    <div class="marquee-track">
      <span class="item"><span class="dot"></span>HTA-validated models</span>
      <span class="item"><span class="dot"></span>Country-specific regulatory compliance</span>
      <span class="item"><span class="dot"></span>Full confidentiality</span>
      <span class="item"><span class="dot"></span>14 years at Pfizer and AbbVie</span>
      <span class="item"><span class="dot"></span>Review-ready dossiers</span>
      <span class="item"><span class="dot"></span>HTA-validated models</span>
      <span class="item"><span class="dot"></span>Country-specific regulatory compliance</span>
      <span class="item"><span class="dot"></span>Full confidentiality</span>
      <span class="item"><span class="dot"></span>14 years at Pfizer and AbbVie</span>
      <span class="item"><span class="dot"></span>Review-ready dossiers</span>
    </div>
  </div>

  <section class="alt" id="contexto">
    <div class="wrap">
      <div class="sec-head reveal">
        <span class="eyebrow">Context</span>
        <h2>Pricing, evidence and HTA in a changing environment</h2>
        <p>Although pricing dynamics and healthcare models vary widely from country to country, HEOR rigor is a universal language: the methodology and principles stay the same; what changes is the context in which they are applied.</p>
      </div>

      <div class="highlight-banner reveal">
        <div class="highlight-cell">
          <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z"/></svg></div>
          <h3>Europe and Spain</h3>
          <p>In Europe, the application of the HTA Regulation (EU Regulation 2021/2282) and, in Spain, the publication of Royal Decree 415/2026 are simultaneously redefining value dossiers, PICO logic and pricing strategies.</p>
        </div>
        <div class="highlight-cell dark">
          <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-6-3.8-9s1.3-6.5 3.8-9Z"/></svg></div>
          <h3>Latin America</h3>
          <p>Latin America is seeing similar momentum: Colombia is stepping up direct price control alongside IETS, Brazil is exploring negotiation committees and confidential pricing for the SUS, and Chile is consolidating its technical assessment under the Ricarte Soto Law.</p>
        </div>
      </div>

      <p class="context-closing reveal">Across this diverse regulatory map, I translate each country’s complexity into technically sound models and value narratives tailored to payer decision-making.</p>

      <details class="sources-prose reveal">
        <summary class="sources-label">Regulatory framework consulted</summary>
        <p>In Europe, the framework in force is <a href="https://www.boe.es/doue/2021/458/L00001-00032.pdf" target="_blank" rel="noopener">Regulation (EU) 2021/2282</a> of the European Parliament and of the Council on health technology assessment and amending Directive 2011/24/EU (applicable since 12 January 2025); in Spain, <a href="https://www.boe.es/boe/dias/2026/05/29/pdfs/BOE-A-2026-11587.pdf" target="_blank" rel="noopener">Royal Decree 415/2026</a> creates the Health Technology Assessment System, with two independent offices: AEMPS for medicines (coordinated with the European joint clinical assessments, JCA) and RedETS for non-pharmacological technologies, plus an Adoption Group that acts as a bridge to the decision-making bodies.</p>
        <p>In Colombia, the National Commission for Medicine and Medical Device Prices (CNPMDM) regulates direct price control through <a href="https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/circular-018-de-2024.pdf" target="_blank" rel="noopener">Circular 18 of 2024</a> (methodology for the direct price control regime based on international reference pricing) and its update circulars, in line with article 87 of <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/LEY%201438%20DE%202011.pdf" target="_blank" rel="noopener">Law 1438 of 2011</a> (which grants the CNPMDM its powers) and <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/Decreto%200705%20de%202016.pdf" target="_blank" rel="noopener">Decree 705 of 2016</a>; IETS, created by the same Law 1438/2011, is the country’s technical health technology assessment body, although it works in processes separate from price setting.</p>
        <p>In Brazil, the Ministério da Saúde’s <a href="https://www.gov.br/saude/pt-br/assuntos/noticias-ms/2026/julho/ministerio-da-saude-institui-comite-para-negociacao-de-precos-nas-compras-do-sus" target="_blank" rel="noopener">Portaria GM/MS No. 12.011</a> (July 2026) creates the Comitê de Negociação de Preços e Condições Econômicas de Tecnologias em Saúde for the SUS, enabling managed access models and confidential discounts (desconto silenciado / preço confidencial), within a legal framework supported by <a href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12401.htm" target="_blank" rel="noopener">Law 12.401/2011</a> and <a href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/decreto/d7646.htm" target="_blank" rel="noopener">Decree 7.646/2011</a>, which regulate CONITEC (Comissão Nacional de Incorporação de Tecnologias no SUS).</p>
        <p>In Chile, <a href="https://www.bcn.cl/leychile/navegar?idNorma=1078148" target="_blank" rel="noopener">Law No. 20.850</a> (Ricarte Soto Law) creates the Financial Protection System for High-Cost Diagnoses and Treatments and requires a systematic, evidence-based health technology assessment process to support coverage decisions, a process currently carried out by MINSAL’s Department of Health Technology Assessment and Evidence-Based Health (ETESA-SBE), created in 2017.</p>
      </details>

    </div>
  </section>

  <section class="light">
    <div class="wrap">
      <div class="about-head reveal">
        <span class="eyebrow">About me</span>
        <h2>Scientific rigor, analytical authority and executive vision</h2>
      </div>

      <div class="about-panel reveal">
        <div class="about-panel-text">
          <span class="eyebrow">Magda Gutiérrez Ardila, MSc, eMBA</span>
          <p class="about-panel-sub">HEOR · Pricing · Market Access</p>
          <p>Consultant specializing in Health Economics and Outcomes Research (HEOR), Pricing and Market Access. I support pharmaceutical companies and major consultancies in developing economic models, budget impact analyses and pricing and value evidence strategies, with an approach that combines scientific rigor, analytical authority and an executive strategic vision.</p>
          <p>Before starting my independent practice, I led pricing and economic evidence strategies at Pfizer and AbbVie. I hold a Master’s in Health Economics (MSc), a Master’s in Clinical Epidemiology (MSc) and an eMBA, training I combine every day with the practice of translating clinical evidence into business decisions.</p>
          <div class="about-chips">
            <span>HEOR</span>
            <span>Pricing &amp; Market Access</span>
            <span>Scientific communication</span>
            <span>Training</span>
          </div>
        </div>
        <div class="about-panel-photo">
          <img src="/images/magda-sobre-mi.jpg" alt="Portrait of Magda Gutiérrez">
        </div>
      </div>


      <div class="value-grid reveal-group">
        <div class="value-card reveal" style="--i:0">
          <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18M3 9v10a2 2 0 0 0 2 2h4"/></svg></div>
          <h3>Scientific rigor</h3>
          <p>Economic models built with scientific rigor, developed hand in hand with the client on the available clinical evidence.</p>
        </div>
        <div class="value-card reveal" style="--i:1">
          <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg></div>
          <h3>Analytical authority</h3>
          <p>Fourteen years at Pfizer and AbbVie building value positioning strategies for payers in demanding, fast-changing markets.</p>
        </div>
        <div class="value-card reveal" style="--i:2">
          <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/></svg></div>
          <h3>Executive vision</h3>
          <p>I translate clinical data into business arguments that reduce uncertainty for assessors and decision-makers.</p>
        </div>
      </div>

      <div class="stats-row reveal">
        <div><div class="num" data-count="14" data-suffix="+">14+</div><div class="cap">Years of experience</div></div>
        <div><div class="num" data-count="2" data-suffix="">2</div><div class="cap">Global pharmaceutical companies</div></div>
        <div><div class="num">ISPOR</div><div class="cap">Active community</div></div>
      </div>
    </div>
  </section>

  <section class="dark" id="metodo">
    <div class="wrap">
      <div class="sec-head reveal">
        <span class="eyebrow">Method</span>
        <h2>From evidence to decision, in four steps</h2>
        <p>Each phase can be contracted on its own or combined, depending on the product’s stage.</p>
      </div>

      <div class="method-grid">
        <div class="method-pin reveal">
          <span class="k">How I work</span>
          <h3>One process, four phases, a single goal: robust positioning before the decision-maker.</h3>
          <p>Each phase builds on the previous one, from the regulatory context to the defense before the payer.</p>
          <div class="method-progress" aria-hidden="true">
            <span class="dash active" data-dash="1"></span>
            <span class="dash" data-dash="2"></span>
            <span class="dash" data-dash="3"></span>
            <span class="dash" data-dash="4"></span>
          </div>
          <div class="method-flex-note">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            <span><strong>Full flexibility:</strong> phases and deliverables can be developed independently, without contracting the full workflow.</span>
          </div>
        </div>

        <div class="method-stack">
          <div class="method-card-wrap" data-card="1">
            <div class="method-card">
              <div class="idx">01</div>
              <h4>Assessment</h4>
              <p>I understand the product’s regulatory, competitive and clinical context before moving a single figure.</p>
              <ul>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Regulatory mapping by country and payer</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Review of the competitive and clinical landscape</li>
              </ul>
            </div>
          </div>
          <div class="method-card-wrap" data-card="2">
            <div class="method-card">
              <div class="idx">02</div>
              <h4>Modeling</h4>
              <p>I build or adapt the economic model: cost-effectiveness, budget impact or cost comparison, as the case requires.</p>
              <ul>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Cost-effectiveness and cost-utility models</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Budget impact analysis</li>
              </ul>
            </div>
          </div>
          <div class="method-card-wrap" data-card="3">
            <div class="method-card">
              <div class="idx">03</div>
              <h4>Value dossier</h4>
              <p>I translate the model into a clear value narrative for each stakeholder: payer, regulator, KOL.</p>
              <ul>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Review-ready value dossier</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Narrative tailored to each audience</li>
              </ul>
            </div>
          </div>
          <div class="method-card-wrap" data-card="4">
            <div class="method-card">
              <div class="idx">04</div>
              <h4>Payer defense</h4>
              <p>I support the presentation and negotiation of value before the authority or insurer.</p>
              <ul>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Preparing the presentation and handling objections</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Support during the final negotiation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="alt" id="servicios">
    <div class="wrap">
      <div class="sec-head reveal">
        <span class="eyebrow">Services</span>
        <h2>Four fronts to sustain your product’s value</h2>
      </div>

      <div class="services-grid reveal-group">
        <div class="service-card reveal" style="--i:0">
          <span class="badge">Most requested</span>
          <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l3.5-5 3 3L19 6"/></svg></div>
          <h3>Health economics &amp; HEOR</h3>
          <p>Cost-effectiveness, cost-utility and budget impact models, adapted to local regulation.</p>
        </div>
        <div class="service-card reveal" style="--i:1">
          <span class="badge">New</span>
          <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L4 3a1 1 0 0 0-1 1l.24 5.59a2 2 0 0 0 .59 1.41l9.58 9.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83Z"/><circle cx="8.5" cy="8.5" r="1.5"/></svg></div>
          <h3>Pricing &amp; launch</h3>
          <p>Pricing business cases, international reference pricing and positioning versus competitors.</p>
        </div>
        <div class="service-card reveal" style="--i:2">
          <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v5h5"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z"/><path d="M9 13h6M9 17h6"/></svg></div>
          <h3>Scientific communication &amp; evidence</h3>
          <p>Value dossiers by stakeholder, translation of technical evidence into commercial insights, and manuscripts (abstracts and scientific articles).</p>
        </div>
        <div class="service-card reveal" style="--i:3">
          <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/></svg></div>
          <h3>Training &amp; education</h3>
          <p>Tailored training for commercial and market access teams on health economics, pharmacoeconomics fundamentals and key concepts.</p>
        </div>
      </div>

      <div class="advisory-band reveal">
        <div class="advisory-copy">
          <span class="advisory-eyebrow">Agile format</span>
          <h3>Advisory session · 60 minutes</h3>
          <p>To resolve a specific question without opening a project. Paid session, reserved time slot and written conclusions.</p>
        </div>
        <a class="advisory-btn magnetic" href="mailto:magda.vianey.g@gmail.com">Book a session →</a>
      </div>

      <div class="areas-band reveal">
        <span class="areas-label">Therapeutic areas</span>
        <div class="areas-chips">
          <span class="area-chip dark">Oncology</span>
          <span class="area-chip">Immunology</span>
          <span class="area-chip dark">Dermatology</span>
          <span class="area-chip">Vaccines</span>
          <span class="area-chip dark">Anti-infectives</span>
          <span class="area-chip">Women’s health</span>
          <span class="area-chip dark">Others</span>
        </div>
      </div>
    </div>
  </section>

  <section class="dark" id="comparativa">
    <div class="wrap">
      <div class="sec-head reveal">
        <span class="eyebrow">Why work with me</span>
        <h2>Built for teams that need focus, not bureaucracy</h2>
        <p>An independent HEOR partner: 100% specialized focus and the flexibility to step in wherever needed, either directly with the pharmaceutical company or as an extension of your consulting team.</p>
      </div>

      <div class="compare-cards reveal-group">
        <div class="compare-card us reveal" style="--i:1">
          <div class="head">
            <span class="head-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z"/></svg>Magda Gutiérrez</span>
          </div>
          <ul class="compare-list">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Exclusive specialization in HEOR and pharma</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Tailored models, adapted by country and payer</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Exclusive dedication per indication</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Conclusions always delivered in writing</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Flexible engagement by phase</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="dark">
    <div class="wrap">
      <div class="sec-head reveal">
        <span class="eyebrow">Trust &amp; rigor</span>
        <h2>Every deliverable, ready to withstand review</h2>
      </div>
      <div class="trust-grid reveal-group">
        <div class="trust-card reveal" style="--i:0">
          <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z"/></svg></div>
          <h4>Confidentiality</h4>
          <p>Exclusive dedication per project.</p>
        </div>
        <div class="trust-card reveal" style="--i:1">
          <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
          <h4>Regulatory compliance</h4>
          <p>Methodology aligned with the current framework in each country.</p>
        </div>
        <div class="trust-card reveal" style="--i:2">
          <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l3.5-5 3 3L19 6"/></svg></div>
          <h4>Validated methodology</h4>
          <p>Models built with academic rigor.</p>
        </div>
        <div class="trust-card reveal" style="--i:3">
          <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="m4 6 8 7 8-7"/></svg></div>
          <h4>Direct response</h4>
          <p>Personal contact, reply within one business day.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="alt">
    <div class="wrap">
      <div class="testimonial-card reveal">
        <blockquote>"A product’s value is backed by solid evidence, communicated clearly to whoever makes the decision."</blockquote>
        <div class="attrib">
          <div class="av"><img src="/images/magda.jpg" alt="Magda Gutiérrez"></div>
          <div>
            <div class="name">Magda Gutiérrez Ardila</div>
            <div class="role">HEOR &amp; Access Consulting</div>
          </div>
        </div>
        <div class="verified">✓ 14 years of verifiable experience</div>
      </div>
    </div>
  </section>

  <section class="final-cta" id="contacto">
    <div class="hero-glow g1"></div>
    <div class="wrap">
      <span class="eyebrow" style="color:var(--accent-soft); justify-content:center; display:flex;">Contact</span>
      <h2 style="margin-top:1rem;">Need support with HEOR or pricing?</h2>
      <p>Let’s talk about building your access strategy from the evidence.</p>
      <div class="hero-cta-row">
        <a class="btn btn-white" href="mailto:magda.vianey.g@gmail.com">Write to magda.vianey.g@gmail.com →</a>
        <a class="btn btn-outline-dark" href="https://linkedin.com/in/magda-gutierrez-ardila" target="_blank" rel="noopener">View LinkedIn</a>
      </div>
      <div class="final-badges">
        <span class="pill">🔒 Confidential</span>
        <span class="pill">⏱ Reply within 1 business day</span>
        <span class="pill">📍 Madrid, Spain</span>
      </div>
      <form class="contact-form" id="contactForm" novalidate>
        <div class="cf-grid">
          <div class="cf-field">
            <label for="cf-empresa">Company</label>
            <input type="text" id="cf-empresa" name="empresa" placeholder="Your company name" required maxlength="100" />
          </div>
          <div class="cf-field">
            <label for="cf-area">Area of interest</label>
            <select id="cf-area" name="area" required>
              <option value="" disabled selected>Select an area</option>
              <option value="Economía de la salud y HEOR">Health economics &amp; HEOR</option>
              <option value="Pricing y lanzamiento">Pricing &amp; launch</option>
              <option value="Comunicación científica">Scientific communication</option>
              <option value="Capacitación y formación">Training &amp; education</option>
              <option value="Otra">Other</option>
            </select>
          </div>
          <div class="cf-field cf-full">
            <label for="cf-email">Email</label>
            <input type="email" id="cf-email" name="email" placeholder="your.email@company.com" required maxlength="255" />
          </div>
          <div class="cf-field cf-full">
            <label for="cf-comentario">Message</label>
            <textarea id="cf-comentario" name="comentario" rows="4" placeholder="Briefly tell me what you need..." required maxlength="1000"></textarea>
          </div>
          <div class="cf-field cf-full">
            <label for="cf-consent" style="display: flex; align-items: center; gap: 8px; font-size: 13px;">
              <input type="checkbox" id="cf-consent" name="consent" required />
              <span>I agree that Magda may contact me about my request</span>
            </label>
          </div>
        </div>
        <p class="cf-error" id="cfError" role="alert" hidden>Please complete all fields with a valid email.</p>
        <button type="submit" class="btn btn-white cf-submit">Send request →</button>
      </form>
    </div>
  </section>
</main>

<footer class="site">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-brand">
        <div class="name">Magda Gutiérrez</div>
        <div class="sub">Pricing &amp; HEOR · Madrid</div>
        <div class="footer-social">
          <a href="https://linkedin.com/in/magda-gutierrez-ardila" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 11v5M8 8v.01M12 16v-5M12 16v-3c0-1.1.9-2 2-2s2 .9 2 2v3"/></svg></a>
          <a href="mailto:magda.vianey.g@gmail.com" aria-label="Email"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="m4 6 8 7 8-7"/></svg></a>
        </div>
        <div class="footer-compliance">
          <span class="pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>Confidential</span>
          <span class="pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5Z"/><path d="m9 12 2 2 4-4"/></svg>ISPOR member</span>
          <span class="pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v5"/></svg>GDPR compliant</span>
        </div>
      </div>
      <div class="footer-cols">
        <div class="footer-col">
          <h4>Services</h4>
          <ul>
            <li><a href="#servicios">Health economics &amp; HEOR</a></li>
            <li><a href="#servicios">Pricing &amp; launch</a></li>
            <li><a href="#servicios">Scientific communication</a></li>
            <li><a href="#servicios">Training &amp; education</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Navigation</h4>
          <ul>
            <li><a href="#metodo">Method</a></li>
            <li><a href="#comparativa">Why me</a></li>
            <li><a href="#contacto">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:magda.vianey.g@gmail.com">magda.vianey.g@gmail.com</a></li>
            <li><a href="https://linkedin.com/in/magda-gutierrez-ardila" target="_blank" rel="noopener">LinkedIn</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Magda Gutiérrez. All rights reserved.</span>
      <a class="to-top" href="#top" aria-label="Back to top">↑</a>
    </div>
  </div>
</footer>

`;
