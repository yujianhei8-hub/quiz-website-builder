# Outcome and scoring design

Write this before making the webpage:

| Item | Required decision |
|---|---|
| User question | One specific uncertainty the quiz can help explore |
| Outcomes | 3–5 distinct directions, each with evidence, cost and next steps |
| Observations | What answer patterns support each outcome |
| Question map | Question ID → scenario → choices → score effects → rationale |
| Rules | Formula, bounds, normalization, weights, tie policy |
| Report | Name, evidence, friction, adjacent directions and concrete suggestions |

## Starter formula

For outcome r, sum the points of the currently selected options as S(r). For each question, find its largest available points for r; sum these maxima as M(r). Index(r) = 100 × S(r) / M(r), rounded to a whole number. Every outcome must have M(r) > 0. Outcomes are sorted by unrounded index. Values within 1e-9 are co-leaders. They are independent preference indices, not probabilities adding to 100. A broad mix may yield several similar values; interpret that as a mixed profile.

Never increase low values merely to make the report look flattering. Do not label an invented number “scientifically accurate.” A public score explanation should be short; research and audit notes stay in source documentation unless requested.

## Scenario example

Question: a free Saturday afternoon appears. Options can support quiet time, exploring outside, or making something. Later questions add realistic constraints: travel, company, planning, repetition, expense. Vary order; do not let A always map to one outcome.

For high-stakes topics, self-report supports exploration, not diagnosis or eligibility decisions. Career report reasons should distinguish “you prefer this process” from “you can already do this professionally.” Current salaries, licenses and overseas rules require dated primary sources. If unavailable, omit exact claims and specify the missing fact internally.

## Useful result writing

- Say what direction leads, then link reasons to actual selected options.
- Explain what might make the direction tiring or impractical.
- Give 2–3 actions that fit the user's constraints; don't prescribe major purchases as a first step.
- Show ties and adjacent possibilities without forcing one identity.
- Write specifically enough that changing the answers changes the explanation.
