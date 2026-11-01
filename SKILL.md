---
name: quiz-website-builder
description: Turn one test direction into autonomous research, a user-approved proposal, an iterative website prototype and audited delivery. Compose topic-specific psychological exploration, historical/character similarity, animal metaphors, career, preference, decision or knowledge reports from modular sections, evidence and data-appropriate visuals. Use for quiz/test website creation and revision; never present custom scoring as validated diagnosis.
license: MIT
metadata:
  version: "1.2.1"
---

# Quiz Website Builder

Turn a user topic into a complete, usable quiz website with understandable results. Deliver an actual HTML artifact when file tools exist. Without file tools, return complete code plus exact saving instructions; say which actions were not executed.

## Mandatory collaboration sequence

A topic alone is enough to start research. Do not require the user to supply a bibliography, dimension system or report outline. Default sequence:

**Direction → autonomous keyword expansion and research → concrete proposal → user approval → working prototype → feedback/revision loop → user accepts prototype → final audit/fixes → deliver website.**

Read [references/staged-workflow.md](references/staged-workflow.md) first. Persist stages with [assets/project-state-template.json](assets/project-state-template.json) and optionally `scripts/workflow.cjs`. A proposal is not a website. Never skip its review just because the user initially said “make me a test.” Aesthetic feedback is authorization to revise the prototype, not permission to call it approved. Only bypass review checkpoints if the user explicitly delegates the entire sequence without review; record that delegation.

Read [references/report-composition.md](references/report-composition.md) and [assets/report-recipes.json](assets/report-recipes.json) when proposing report content. Pick a primary report purpose and optional secondary purpose semantically; do not route arbitrary topics only by keyword matching. The report combines independently selected story/setting, explanatory modules, data views, actions and visual style. Use `scripts/compose-report.cjs` to inspect a suitable initial composition; it produces a design specification, not a personalized paid report.

For a sourced character/history profile model, `scripts/profile-match.cjs` implements the weighted normalized-distance similarity contract, explicit ties, missing-axis coverage and per-axis similarities/differences. It does not research or score historical figures for you. Build and verify the topic archive before using it; never ship synthetic demo profiles as real people.

## Consumer report boundary

Consumer reports present results, meaningful visualizations, personalized interpretation, relevant similarities/differences, impacts and recommendations. Do not display source citations, bibliography, source links/IDs, research logs, formulas, scoring weights, methodology, evidence coverage or the author's design/reasoning process. Keep these in separate author-facing research and audit artifacts; do not merely hide them with CSS or include them in downloadable reports. Apply this boundary to visible pages and every HTML/TXT/PDF/print export. Preserve useful explanations of the user's patterns and appropriate uncertainty; removing methodology must not turn hypotheses into established causes or indices into probabilities. Essential chart labels, units and brief score meaning may remain, without exposing the calculation. Verify representative report routes and exports for leakage. This boundary does not remove materials from the author's proposal review or the teaching design atlas.

## Start with the intended result

Infer supplied audience, topic, outcome, language and constraints. Ask only for missing facts that materially change the product. For a vague request, propose a reversible small prototype: 9 single-choice scenario questions and 3 outcomes. Keep the default at 9–15 questions, never exceed 30 without explicit user instruction. Preserve user requirements about wording, brand, count and interaction.

The first delivery is a reviewable research/design proposal: keyword families and actual search coverage, topic boundaries, sources/rights, candidate dimensions, question directions and sample questions, scoring choices, report section wireframe, persona/animal/history-setting choice, palette and selected chart rationale, plus the exact next approval needed. Present the recommended plan first; do not overwhelm the user with every research note.

Read [references/research-library.md](references/research-library.md) before collecting or using topic data. Read [references/design.md](references/design.md) before scoring. Read [references/visualizations.md](references/visualizations.md) and [references/ui-design.md](references/ui-design.md) before designing questions or reports. Read [references/delivery.md](references/delivery.md) for installation/publishing. These are modular: load the relevant catalog entries, not every example at once. The runnable starter is [assets/quiz-template.html](assets/quiz-template.html) with [assets/example.json](assets/example.json).

## Three required foundations

1. **Topic evidence library.** Build a separate library for the user's actual topic. Identify sources, claims, constructs, questions, scoring rules, outcomes and actions by IDs. Keep full-text access, rights, population, country, dates, limitations and conflicting findings. Use [assets/evidence-library.json](assets/evidence-library.json) as a structural example; its weekend preference content is an explicit design hypothesis, not scientific evidence. Do not reuse the example as a validated psychology database.
2. **Visual selection library.** [assets/design-library.json](assets/design-library.json) contains 36 distinct chart patterns, 8 palettes, option patterns, report layouts and scenario templates. Select charts by decision and available data. Do not put 36 charts on a report; ordinarily use 2–4 relevant visuals. If the data are qualitative or missing a denominator, choose a labeled comparison or explanation instead of inventing a percentage.
3. **Experience specification.** Define a scene, a palette, readable typography, question states and result sections. A chart is followed by a personal explanation and decision implication. User-facing pages show relevant conclusions; keep internal research/audit work out of the buyer's main report, while respecting any legally required attribution or license notice.

## Workflow

1. **Define useful outcomes and research questions.** State the user's question, audience, intended result and evidence needed. Each outcome needs a definition, matching evidence, tradeoffs and next steps. Prefer a low-stakes example for an unspecified tutorial. Do not infer intelligence, hidden trauma, mental illness or employability from an unvalidated quiz.
   Expand topic terms into multiple research families before searching: core concepts, adjacent concepts and exclusions, observable situations, measurement, mechanisms/contradictory explanations, context/life stages, consequences/possible actions, and narrative/representation where relevant. Search synonyms and cross-language terms; follow relevant primary references and counterevidence. This is coverage by research questions, not a promise of a fixed number of sources. If browsing is unavailable, report that limitation and an unverified search plan, never claim a literature review occurred.
2. **Build and inspect the topic library.** Search official subject sources, research indexes, publishers and library catalogs; verify documents rather than treating search snippets as evidence. Extract claim cards with precise locators and applicable populations. Distinguish original design assumptions, published findings and validated licensed instruments. A bibliographic entry alone does not support a claim. Track permissions before copying questionnaires or books. Link every question/scoring/outcome decision to claims or explicit original hypotheses; record unavailable material and conflicting evidence internally.
3. **Define dimensions and rules.** Map each dimension to observable choices. Separate preferences, self-reported ability, actual evidence and practical constraints. For career exploration, rank plausible directions and turn barriers into preparation paths; do not return an empty report for a completed quiz. If evidence is weak, qualify the recommendation in plain language without inventing certainty.
4. **Write scenario questions.** Give balanced options with realistic costs. Include choices that distinguish liking an outcome from tolerating the process. Do not make the desirable answer obvious. Avoid asking the same thing repeatedly. Record IDs, option effects and rationale in a question map.
5. **Specify scoring before coding.** Choose either direct outcome scores (starter) or an explicitly documented dimension-profile model. Do not mix formulas silently. In the starter, normalized result score = selected option points / sum of the maximum available points for that result across questions × 100. It is a rule-based preference index; multiple results can be high. Equal scores produce co-leading outcomes. Display only precision supported by the rule; do not call it a success probability. Describe any weights and thresholds. Never fabricate psychometric validity.
   Submit the complete proposal here and wait for the user's actual approval. Historical/character similarity requires a separately sourced and transparently interpreted character profile library; decorative setting must not change scores. Psychological exploration must distinguish reported history, plausible general mechanisms and an individual's unestablished causes. Do not infer childhood trauma, illness, age-specific inevitability or a deterministic future from quiz selections.
6. **Build three usable views.** Intro explains outcome and expected effort. Quiz shows one question, progress and previous action; selection advances once, including after returning. Change answers by question ID rather than accumulating duplicate points. Completed answers generate a non-empty report with reasons, cautions, adjacent outcomes and next steps. Details such as budget belong behind the selected result if requested. Match on-screen and downloaded reports.
   This is a reviewable prototype. Include complete sample report routes with representative synthetic answers, clearly identified as preview data. Invite concrete feedback about questions, interpretation, setting and layout, revise within the approved purpose, and keep an actual change log. A new purpose/measurement system requires renewed proposal approval; visual revisions do not require repeating all research.
7. **Validate content and behavior.** Use the checklist below and run the bundled commands. Exercise actual browser interactions when a browser is available. Scripts alone do not prove visual correctness. State the testing boundary honestly.
   Run the final delivery audit after the user accepts the prototype. Fix defects autonomously, then recheck affected paths. Do not add a third approval loop for routine fixes. If an audit reveals a material change in interpretation or scope, surface that decision before rebuilding the product around it.
8. **Deliver concrete artifacts.** Supply the HTML, editable question data, scoring explanation and a short validation note. Give a direct file link. If deployment is requested and access is available, upload the checked artifact and verify the real public URL. If missing access, finish the release package and identify only the specific blocker. Do not fabricate a public URL.

Before coding, produce a short mapping: source/claim IDs → construct → question IDs → score rule → report section → chart choice → suggested action. Every numeric graphic must define metric, unit, denominator/bounds, source/origin, missing-data treatment and time scope. Store this separately from consumer text.

## Starter commands

Requires Node.js 18+; no npm packages, network calls or account keys.

```text
node scripts/validate.cjs assets/example.json
node scripts/build.cjs assets/example.json output/index.html
node scripts/check.cjs
node scripts/check-library.cjs
node scripts/build-atlas.cjs
node scripts/compose-report.cjs psych-exploration
node scripts/check-workflow.cjs
```

To start a custom quiz, copy `assets/example.json`, change content and scores while preserving schema, validate it, then build. The generated page is standalone and works from a local file. Output must stay in the user-authorized project directory.

## Acceptance checklist

- Every outcome is reachable, every option has an effect, all scores stay in range and equal scores have a defined result.
- A → previous → B stores B once; it recomputes all results from current answers. Rapid double activation cannot skip an unanswered question.
- An incomplete quiz cannot generate a full report. A completed quiz always yields a useful result and reasons consistent with answers.
- No fields ask for answers again after the user has finished. No internal source audit or unfinished self-evaluation leaks into the report.
- Controls work on a 360px viewport, text fits, keyboard navigation and focus are usable, selected choices are announced.
- The report download matches visible conclusions. Restart requires explicit action; reload and local-history behavior are explained.
- No credential, internal password, private user report or unrelated brand is copied into public assets.
- Static client-side passwords are not described as reliable payment protection. Do not automatically publish, register accounts, buy hosting, or send buyer messages unless authorized.
- Research records resolve to real documents or explicitly original hypotheses; books include edition/locator and reuse status. Metadata-only sources cannot be used as if full papers were read.
- Topic claims are not supported by unrelated UI documentation. Changes/retractions/expiry have a review path; conflicts are not hidden by averaging.
- Chart choice matches the data: composition is mutually exclusive, distributions have samples, longitudinal views have repeat measures, radar axes share a meaningful scale. Labels and an accessible text/table alternative explain the chart.
- Palettes pass contrast checks for their actual roles; options have selected/focus/disabled/error states. Emoji never carries the only meaning or suggests a desirable answer. Scenario wording remains culturally and financially answerable.

## Reuse and installation boundary

This is an Agent Skills folder, not a universally installable plugin. A GitHub URL is a source location. Client support and installation steps must be verified against official documentation. Ordinary chat users can use `prompts/doubao-copy.md` as conversation instructions; call this copying instructions, not installing a persistent skill. Do not invent a Doubao local-import button or claim this package is listed in its store.

