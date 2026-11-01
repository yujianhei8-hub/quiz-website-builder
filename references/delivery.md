# Delivery, installation and publishing

## Static prototype

Build `index.html`, open it in a browser, answer all questions, return and change an answer, view the result, then download the text report. Test on a narrow viewport. If using a temporary local server, verify an actual HTTP response and key page content; a process-start message is not verification.

To share publicly, upload the checked HTML to the user's chosen static host, use its actual URL, configure HTTPS, and test from a phone network. A custom domain is optional. State hosting costs only after checking the selected vendor's current plan. A self-contained file may be large; keep the starter small and avoid unnecessary remote libraries.

## Payment

The example does not implement a paywall. A password stored and checked entirely in HTML can be inspected or bypassed. A production paid product needs an appropriate server-side access or signed entitlement mechanism, recovery and buyer support. Never include real credentials in a public repository.

## Agent Skills client

Copy the complete `quiz-website-builder` folder to a skill location supported by the target client. Consult its official installation instructions. Do not silently install for the author merely because they asked for a distributable package.

## Doubao route — checked 2026-10-31

Official Doubao documentation describes a developer review/listing flow and consumer installation of listed skills in Doubao Work. It does not establish that an arbitrary GitHub folder can be installed by pasting its URL into ordinary Doubao chat. This repository has not been submitted or approved for the Doubao store.

For ordinary chat, open `prompts/doubao-copy.md`, paste its contents in a new conversation, fill the topic, and follow the design/build/check stages. This is an instruction-copy workflow, with tool availability and output capabilities depending on the client. The reader saves returned code locally if files cannot be created by the client.

Source: [Doubao Skill integration guide](https://open.doubao.com/document/doubao-developer-guide/skill-integration-guide). Consult the latest official documentation before teaching specific buttons or claiming store availability.

## GitHub release

Upload all repository contents, then replace the single `YOUR-GITHUB-REPOSITORY-URL` placeholder in `POST.md` with the actual public repository URL. Do not publish internal folders or credentials. GitHub publishing itself requires user authorization and account access. No repository URL is fabricated by this package.
