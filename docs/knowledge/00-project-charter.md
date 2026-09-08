# Project Charter: Magda

## What is Magda?

Magda is a professional services website for Magdalena Cardona, a designer/developer with expertise in visual communication, interaction design, and strategic web development. The site showcases her work, approach, and availability for consulting and project collaboration.

**Current URL**: https://pagina-magda-3.lovable.app  
**Repository**: rckt-workspace/pagina-magda-3  
**Type**: Marketing + Contact Hub

## Business Objectives

1. **Visibility**: Present Magdalena's professional identity and expertise to potential clients and collaborators
2. **Lead Generation**: Collect qualified inquiries (name, email, project description)
3. **Credibility**: Showcase past work, approach, and testimonials
4. **Availability**: Communicate current status (available/unavailable for work)
5. **Low Friction**: Make it easy to explore, understand, and reach out

## Target Audience

- **Primary**: Potential clients (startups, agencies, brands seeking design + dev expertise)
- **Secondary**: Design/dev community, colleagues, referral partners
- **Geographic**: No geographic limitation (remote work)
- **Budget**: Mid-market and above (strategic projects, not bargain hunters)

## Technical Objectives

1. **Fast and Responsive**: Works on all devices, loads quickly
2. **Visually Distinctive**: Reflects professional aesthetic and attention to detail
3. **Accessible**: WCAG compliance, keyboard navigation, color contrast
4. **Maintainable**: Can be updated without technical friction
5. **Scalable**: Foundation for future features (chat, AI responses, metrics)

## Current Scope (Phase 1)

- Static marketing pages (hero, work samples, about, testimonials, contact)
- Lead collection form (name, email, message)
- Responsive design (mobile/tablet/desktop)
- Animations and micro-interactions (no JavaScript dependencies)
- Supabase PostgreSQL backend (auth, data persistence)
- Render deployment

## Future Scope (Phase 2+)

- AI agent for chat/Q&A (OpenRouter integration)
- Analytics and lead funnel metrics
- CRM integration (future consideration)
- Email automation (Resend or similar)
- Blog/case studies (optional)

## Out of Scope (Explicitly)

- Complex e-commerce (not selling products)
- Multi-language support (Spanish only for now)
- Dark mode toggle (single aesthetic)
- User accounts (leads only, no signup)
- Real-time collaboration tools
- Video hosting (YouTube embeds only)

## Success Metrics

| Metric          | Target        | Measurement                 |
| --------------- | ------------- | --------------------------- |
| Page Load       | < 2s          | Lighthouse, Core Web Vitals |
| Mobile Score    | > 95          | Lighthouse mobile audit     |
| Lead Collection | 10+ per month | Form submissions            |
| Bounce Rate     | < 40%         | Google Analytics (future)   |
| Time on Site    | > 1min        | Analytics (future)          |

## Stakeholders

- **Product Owner**: Magdalena Cardona (magda@rckt.es)
- **Design Lead**: Lovable Cloud (visual design, animations)
- **Technical Lead**: Claude Code (architecture, backend, AI)
- **Deployment**: Render (hosting, CI/CD)

## Key Principles

1. **Design-First**: Visual quality and user experience come first
2. **Incremental**: Small, reversible changes; no big rewrites
3. **Lovable Integration**: Leverage Lovable Cloud for design efficiency
4. **Future-Ready**: Architecture supports AI agents without refactoring
5. **Privacy-Conscious**: Collect only what we need; no tracking cruft

## Roadmap (Indicative)

| Phase | Priority | Focus                                     |
| ----- | -------- | ----------------------------------------- |
| 1     | Now      | Foundation, governance, stability         |
| 2     | Next     | Server routes (`/api/leads`, `/api/chat`) |
| 3     | Future   | AI agent integration                      |
| 4     | Future   | Analytics, lead automation                |

_Specific dates TBD by project leadership_

---

**Charter Approved By**: RCKT Foundation  
**Last Updated**: 2026-09-07  
**Version**: 1.0
