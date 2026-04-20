# LinkedIn Smart Job Search
### A Full-Cycle PM Case Study

> End-to-end product case study on LinkedIn's job search experience — from user research to PRD, including a live prototype.

---

## The Problem

Active job seekers are leaving LinkedIn for other platforms because LinkedIn doesn't help them quickly identify which jobs are actually worth applying to. Without a reliable fit signal, job seekers waste time reading irrelevant JDs — and migrate to tools like Jobright.ai or Indeed that feel faster and smarter.

**Tracking is a symptom. The root cause is that LinkedIn fails to surface the right opportunity at the right moment for each job seeker.**

---

## What's Inside

This case study covers a full product cycle across 3 phases:

### Phase 1 — Discovery
| Step | Output |
|------|--------|
| 01 · Flows & Frictions | Flow-friction table across 4 user journeys (Onboarding, Search, Apply, Return Visit) |
| 02 · Company Context | Mission, revenue breakdown, competitive positioning vs. Indeed, Wellfound, and Teal (indirect) |
| 03 · Feature Reverse-Engineering | Mechanism analysis for Easy Apply, Job Alerts, Open to Work, and Under 10 Applicants filter |
| 04 · User Segmentation | 3 primary segments (Job Seekers, Recruiters, Sales/Marketers) with sub-segments, needs, and observed problems |
| 05 · Hypothesis Map | 12-item problem map → 3 research probes (P1: applicant count demotivation, P2: untracked external applications, P3: saved jobs paralysis) |

### Phase 2 — Research
| Step | Output |
|------|--------|
| 01 · User Interviews | 4 interviews across active job seekers, passive seekers, and career changers |
| 01 · Survey | 16 responses across 12 questions targeting active and passive job seekers |
| 02 · Research Readout | 5 validated insights including 2 newly discovered findings (posting lag, LinkedIn as recruiter outreach tool) |
| 03 · Competitive Check | Competitor analysis for each validated problem — Teal, Indeed, Wellfound, MyGreenhouse, Jobright.ai |
| 04 · Goal Setting | Retention cluster selected → Goal: improve retention for active job seekers |
| 05 · Problem Prioritization | PIF scoring → P0 selected: job seekers can't quickly identify which jobs to apply to |

### Phase 3 — Product
| Step | Output |
|------|--------|
| 01 · Brainstorm | 13 ideas across 3 root causes using How Might We + Root Cause analysis |
| 02 · Prioritization | RICE scoring across all 13 ideas → Top 5 selected |
| 03 · Prototype | Live interactive prototype (Lovable) — 6 screens demonstrating full user flow |
| 04 · Metrics | Key metric + 2 secondary + 1 guardrail metric with definitions and reasoning |
| 05 · Pitfalls | 4 core assumptions with failure modes, detection signals, and containment plans |
| 06 · PRD | Full product requirements document with MoSCoW, user flow, success metrics, risks, and phased rollout |

---

## The Solution

**LinkedIn Smart Job Search** — a feature set that helps job seekers find and apply to the right jobs faster, anchored by a freemium Match Score trial.

### Core Features
| Feature | Priority | Description |
|---------|----------|-------------|
| Enhanced Match Score | Must Have | Multi-signal fit score: resume (50%) + profile + keyword alignment + job freshness. Default sort in job search. |
| 3–5 Day Freemium Trial | Must Have | Full Match Score unlocked automatically on first Jobs tab visit. Expires to "??" paywall — loss aversion drives Premium conversion. |
| "Best Shot" Combo Filter | Must Have | Surfaces jobs where Match Score >85% AND applicants <10 — uniquely possible only on LinkedIn. |
| External Application Capture | Must Have | "Did you apply?" prompt on return + "Mark as Applied" button. Logs external applications to dashboard. |
| My Applications Dashboard | Must Have | Full pipeline view: Applied → Interviewing → Offer → Rejected → Archived. Replaces spreadsheets. |
| Daily Stats Bar | Must Have | Today's Saved / Applied / External count with a daily goal progress bar. Resets daily. |
| Skill Gap Breakdown | Should Have | Matched vs. missing skills per job listing (Premium). |
| Follow-up Nudge (Day 7/14) | Should Have | Smart notification + AI-drafted follow-up message to recruiter. |

### Why This, Not Something Else
LinkedIn's primary revenue comes from recruiters (~60% Talent Solutions), not job seekers. Any solution that cannibalizes Easy Apply or reduces recruiter value risks the core business. The freemium trial model solves this tension: Match Score becomes a conversion engine rather than a free giveaway, and the guardrail metric (Easy Apply rate) protects recruiter-side value.

---

## Key Research Findings

- **4/4 interviewees** used manual workarounds (Excel, Google Docs) to track applications
- **75%** of survey respondents lost track of an application more than once
- **"Track all applications in one place"** was the #1 unprompted improvement request in open survey text
- **LinkedIn posts jobs 2–3 days after company career pages** — confirmed by 2 interviewees and G2 reviews
- **Indeed, Wellfound both hide applicant counts** — LinkedIn is the outlier, and it demotivates a meaningful subset of job seekers

---

## Prototype

> 🔗 <a href="https://ai.studio/apps/132026fc-2cb0-45e2-acca-51af628cddb3?fullscreenApplet=true" target="_blank" rel="noopener noreferrer">Live Prototype →</a>

Built with Google AI Studio. Demonstrates the full 6-screen user flow:

1. Job Search with Match Score sorting + Trial Banner + Daily Stats Bar
2. Job Detail with Match Score breakdown and Skill Gap
3. "Did you apply?" prompt with live state update
4. My Applications Dashboard with animated count
5. Follow-up Message Draft
6. Trial Expired Paywall

---

## Success Metrics

| Type | Metric | Definition |
|------|--------|------------|
| **Key** | Premium Career Conversion Rate (Trial Completers) | % of trial users who upgrade within 14 days of expiry |
| Secondary | Application Volume per Session | Trial group vs. control — measures if Match Score drives action |
| Secondary | 7-Day Return Visit Rate (Post-Trial) | % who return after expiry — measures habit formation |
| **Guardrail** | Easy Apply Usage Rate | Must not drop >5% from baseline — protects recruiter business |

---

## Tools Used

- User interviews + survey design
- Competitive analysis (G2, product walkthroughs, support docs)
- PIF framework for problem prioritization
- RICE framework for solution prioritization
- Lovable for live prototype
- Figma (wireframe sketches)

---

## About This Project

This case study was completed as part of a structured PM training program covering end-to-end product thinking — from observation to hypothesis, research to evidence, and problem to solution.

The target segment throughout is **active job seekers**, with particular focus on those applying at high volume across LinkedIn and external company sites.

---

*Last updated: April 2026*

