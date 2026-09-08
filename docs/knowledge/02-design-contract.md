# Design Contract: Lovable Cloud ↔ Claude Code

## Overview

This contract defines the boundary between **visual design** (Lovable Cloud) and **infrastructure/backend** (Claude Code). The goal is to enable rapid iteration without architectural conflicts.

## What Lovable Cloud Controls

### ✅ Lovable Cloud Can Modify

1. **Layout and Structure**
   - Section ordering and visibility
   - Grid and flexbox layouts
   - Responsive breakpoints (mobile, tablet, desktop)
   - Spacing, padding, margins

2. **Visual Design**
   - Colors (via CSS tokens or Tailwind classes)
   - Typography (font sizes, weights, families)
   - Icons and illustrations
   - Shadows, borders, rounded corners
   - Gradients and background patterns

3. **Animations and Micro-interactions**
   - Scroll reveals (fade-in, slide-up)
   - Hover effects (button elevation, color shift)
   - Page transitions
   - Loading spinners
   - Parallax effects
   - Entrance animations

4. **Asset Management**
   - Images (JPG, PNG, WebP)
   - SVG icons
   - Video embeds (YouTube, Vimeo)
   - PDF downloads
   - Favicon and branding assets

5. **Copy and Content** (Approved)
   - Hero headline and subheadline
   - Section titles and descriptions
   - Button labels
   - Form placeholders
   - Testimonials and case studies

6. **Form Fields** (Visual Only)
   - Input styles, focus states
   - Validation message styling
   - Success/error colors
   - Accessibility labels (already in DOM)

### ❌ Lovable Cloud Must NOT Modify

1. **API Contracts and Endpoints**
   - Form submission URLs
   - Request/response structure
   - Error handling logic
   - Headers and authentication

2. **Backend Logic**
   - Server-side validation rules
   - Database operations
   - Authentication flow
   - Email sending or CRM integration

3. **Type Definitions and Contracts**
   - TypeScript interfaces
   - Zod schemas
   - Generated route types
   - API request/response shapes

4. **Infrastructure and Deployment**
   - Environment variables
   - Render configuration
   - GitHub Actions (CI/CD)
   - Database credentials

5. **Build Configuration**
   - `vite.config.ts` (do not modify)
   - `tsconfig.json` (type settings)
   - `eslint.config.js` (code quality)
   - `package.json` (dependencies)
   - `bun.lock` (dependency lock)

6. **Generated Files**
   - `src/routeTree.gen.ts` (TanStack Router auto-gen)
   - `src/integrations/supabase/*` (Lovable Cloud auto-gen)
   - Build output (`dist/`, `.output/`)

7. **Security-Critical Code**
   - CSRF middleware logic
   - JWT token handling
   - Supabase Auth integration
   - Environment secret loading

## Coordination Process

### Visual Change (Lovable Cloud Initiates)

1. **Design Change in Lovable Editor**
   - Modify layout, colors, animations, copy
   - Test responsiveness in Lovable preview
   - Commit to `main` (or `design/*` branch if large)

2. **GitHub Sync**
   - Lovable pushes to GitHub automatically
   - Changes appear in PR or direct commit
   - CI runs (lint, typecheck, build)

3. **Review** (if via PR)
   - Claude Code reviews for:
     - No API contract changes
     - No backend logic changes
     - No `package.json` modifications
     - No secrets exposed

4. **Merge to Main**
   - Preview live on Render
   - Visual check by team

### Backend/API Change (Claude Code Initiates)

1. **Feature Branch** (`feature/xyz`)
   - Claude Code creates architectural change
   - Example: new form field, new endpoint, database migration
   - **Communicate intent**: Create GitHub issue with:
     - What visual change is needed (if any)
     - What backend is being added
     - Why the change

2. **PR with Description**
   - Title: `feat: [name]` or `refactor: [name]`
   - Body: Link to issue, explain impact on Lovable
   - Example: "This adds an `email` field to the leads table. Lovable will need to update the contact form to include an email input and update the submission handler."

3. **Lovable Review** (if visual changes needed)
   - Lovable Cloud team reviews PR
   - Makes visual changes on `design/*` branch
   - Merges design branch to main (or feature branch)
   - Feedback via PR comments

4. **Merge**
   - All tests pass
   - Both teams approve
   - Merge to main

### Conflict Scenario (Rare)

**Example**: Lovable changes contact form UI, Claude Code adds email field backend simultaneously.

**Resolution**:

1. Claude Code creates `feature/contact-email`
2. Lovable creates `design/contact-form-redesign` (from main)
3. Both teams communicate scope
4. Claude merges feature → main first
5. Lovable rebases design branch on new main
6. Lovable merges design → main
7. Resolve any conflicts in Lovable editor (visual merge)

## Visual Regression Testing

**Responsibility**: Lovable Cloud lead or designated reviewer

**Process**:

1. After each Lovable commit, preview on Render
2. Check against reference screenshots:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1200px)
3. Verify:
   - No text overflow or wrapping issues
   - Buttons and forms are clickable
   - Animations are smooth (no jank)
   - Colors match design tokens
   - Images load correctly

**Tools**:

- Render preview deployment
- Browser DevTools (Lighthouse, Responsive Mode)
- Percy or similar (optional, for visual diff)

## Component Inventory

**Lovable Cloud owns presentation of:**

- Hero section (title, subtitle, CTA buttons)
- Work showcase (cards, galleries, filters)
- Services section (cards, benefits, icons)
- About / Testimonials
- Contact form (styling, validation UX)
- Footer (links, copyright)
- Navigation (menu, logo, active states)

**Claude Code owns logic of:**

- Form submission (validation, database write)
- Navigation routing (URL changes)
- Auth state management (redirect based on session)
- API error handling (show error message)
- Rate limiting and spam detection

## Copy Approval Flow

1. **Draft in Lovable**
   - Magdalena (product owner) reviews in Lovable editor
   - Approves or requests changes

2. **Merge to Main**
   - Copy is now approved and locked

3. **Production Deployment**
   - No more copy changes without full review cycle

**Note**: Copy is version-controlled in Git; approved copy is immutable unless new issue requests change.

## Accessibility Checklist

**Lovable Cloud must ensure:**

- [ ] Text contrast meets WCAG AA (4.5:1 for body text)
- [ ] Focus indicators visible on all interactive elements
- [ ] Form labels associated with inputs (`<label for="...">`)
- [ ] Images have alt text
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Color is not the only way to communicate (use icons, text)
- [ ] Font size is readable (min 16px on mobile)
- [ ] Touch targets are at least 48x48px
- [ ] Keyboard navigation works (Tab, Enter, Esc)

**Claude Code must ensure:**

- [ ] Error messages are linked to form fields (`aria-describedby`)
- [ ] Dynamic content updates are announced (`aria-live`)
- [ ] Modals have focus traps and close with Esc
- [ ] Server-rendered HTML is semantic (headings, lists, etc.)

## Breaking the Contract

**If Lovable Cloud modifies backend logic:**

1. Claude Code rolls back the commit
2. Discussion in GitHub issue
3. Re-design with proper scope

**If Claude Code changes visual code without approval:**

1. Lovable Cloud reverts in Lovable editor
2. Claude Code creates issue to request visual change
3. Lovable Cloud makes change and commits

**If either team pushes to `main` without approval:**

1. Revert the commit
2. Create issue with lessons learned
3. Update this contract to prevent recurrence

---

**Contract Version**: 1.0  
**Effective Date**: 2026-09-07  
**Reviewed By**: RCKT Foundation  
**Next Review**: Q1 2027
