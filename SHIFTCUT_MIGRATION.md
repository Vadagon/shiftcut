# HyperFrames → ShiftCut migration runbook

> How we turn this cloned HyperFrames repo into the **ShiftCut** framework
> (by **Verblike LLC**, site **shiftcut.verblike.com**).
> Companion to the site's [`SPEC.md`](../shiftcut-site/SPEC.md). When a detail
> isn't covered here: **do exactly what HyperFrames already does** and only rebrand it.

## Progress

| Phase | Status |
|---|---|
| Mechanical rebrand (§2) — names, paths, URLs, manifests, identity copy | ✅ **Done** (commit "Rebrand HyperFrames → ShiftCut (Verblike)", 2,002 files) |
| Strip cloud / HeyGen surface (§4) | ⬜ Not started |
| Reposition skill *content* + router (§6) | ⬜ Not started (dirs/names renamed; workflow copy still creation-first) |
| Editing capabilities / MVP ops (§6) | ⬜ Not started |
| Docs, brand tokens, logo assets (§7) | 🟨 Partial (README/CLAUDE/manifest hooks repositioned; docs body + logos pending) |
| Build/test verification | ⬜ **Blocked** — no `bun` on the rebrand machine; run `bun install && bun run build && bun run test`, refresh snapshots |
| Release plumbing (§8 Phase 6) | ⬜ Not started |

**Facts locked:** company **Verblike LLC**; site **shiftcut.verblike.com** (under verblike.com);
contact **shiftcut@verblike.com**; npm scope **@shiftcut**; bin **shiftcut**; router **/shiftcut**;
install **`npx skills add Verblike/shiftcut`**. **Git remote still points at `heygen-com/hyperframes`
— repoint before any push.** `LICENSE` left intact (Apache-2.0 requires retaining HeyGen's
copyright notice); our own copyright goes on new/modified files and brand surfaces.

> **Note on ordering:** we executed the mechanical rebrand (§2) *before* stripping cloud (§4),
> the reverse of the original plan below. That's fine — cloud files are simply rebranded now and
> get deleted next. §8's phase numbers are kept for reference; the Progress table above is truth.

## 0. Goal & guardrails

**Goal:** ShiftCut = an AI-native, agent-first **video editor** ("CapCut on autopilot").
Same technical engine as HyperFrames (HTML compositions → deterministic Chromium+FFmpeg
render), rebranded, **100% local**, repositioned from *"write HTML, render video"* to
*"open a video, tell your agent what you want, it edits it."*

**Hard rules:**
1. **Keep only the `LICENSE`.** Apache-2.0 stays. Everything else — names, docs, brand,
   copy, assets, endpoints — is ours to edit and rebrand.
2. **Preserve attribution correctness.** `LICENSE`, any `NOTICE`, and third-party
   credits in `CREDITS.md` for code we didn't write must stay accurate. Don't claim
   someone else's copyright; do drop HeyGen's product branding.
3. **100% local.** Remove every feature that requires a HeyGen/cloud endpoint, or make
   it a local-only equivalent. No phone-home (telemetry/events/feedback), no OAuth.
4. **Editor-first.** Reposition skills/docs/templates around editing existing footage.
   Generation-from-scratch stays, but as the secondary story.
5. **Don't break the engine to chase brand purity.** Internal, brand-neutral contract
   names (`data-composition-id`, `data-start/-duration/-track-index`, `window.__timelines`)
   are **kept as-is** — see §3. Only rename things containing `hyperframes`/`heygen`.

---

## 1. Repo map (what we're working with)

| Area | Path | Role | Disposition |
|---|---|---|---|
| **Runtime core** | `packages/core` | clip tree, timeline, `startResolver`, compiler, `editing/`, color, beats | **Keep + rebrand** |
| **Render engine** | `packages/engine` | headless Chromium render services | **Keep + rebrand** |
| **Parsers** | `packages/parsers` | composition/HTML parsing | **Keep + rebrand** |
| **Player** | `packages/player` | in-browser playback of paused timeline | **Keep + rebrand** |
| **Producer** | `packages/producer` | orchestrates render pipeline | **Keep + rebrand** |
| **Browser Studio** | `packages/studio`, `packages/studio-server` | local visual studio + preview server | **Keep + rebrand** (this is our "Browser Studio"/preview) |
| **CLI** | `packages/cli` | `shiftcut` command + subcommands | **Keep core verbs, strip cloud, rebrand** |
| **SDK** | `packages/sdk`, `packages/sdk-playground` | embeddable API | **Keep + rebrand** (maps to our roadmap "API") |
| **Lint** | `packages/lint` | composition linting | **Keep + rebrand** |
| **Transitions** | `packages/shader-transitions` | GPU transitions | **Keep + rebrand** |
| **Cloud render** | `packages/aws-lambda`, `packages/gcp-cloud-run` | hosted rendering | **DELETE** (out of scope) |
| **Skills** | `skills/*` (18) | agent skills incl. `/shiftcut` router (dirs renamed) | **Rebrand + reposition** (§6) |
| **Registry** | `registry/` | installable blocks/components | **Keep + rebrand** |
| **Docs site** | `docs/` (30 dirs) | the docs (were hyperframes.heygen.com → shiftcut.verblike.com) | **Rewrite to ShiftCut** (§7) |
| **Releases** | `releases/` (117 dirs) | historical versioned skill snapshots | **Reset** (don't hand-rename; regenerate from our v0) |
| **Agent plugins** | `.claude/`, `.claude-plugin/`, `.codex/`, `.codex-plugin/`, `.cursor-plugin/`, `.agents/` | per-agent plugin installers/manifests | **Rebrand** |
| **Brand meta** | `README.md`, `DESIGN.md`, `AGENTS.md`, `CLAUDE.md`, `ADOPTERS.md`, `assets/` | branding, design tokens, logos | **Rewrite/replace** |

---

## 2. Naming matrix (global rename)

Scope is large: **~1,399 files** contain `hyperframes`, **~520** contain `heygen`.
Do this as a scripted, reviewed pass — not by hand.

| From | To | Notes |
|---|---|---|
| `hyperframes` (word) | `shiftcut` | lowercase identifiers, slugs, dirs |
| `HyperFrames` | `ShiftCut` | display name |
| `HYPERFRAMES` | `SHIFTCUT` | constants/env |
| `@hyperframes/<pkg>` | `@shiftcut/<pkg>` | npm scope — **claim `@shiftcut` on npm first** |
| `hyperframes-monorepo` | `shiftcut-monorepo` | root `package.json` name |
| bin `hyperframes` | `shiftcut` | `packages/cli/package.json` → `bin`, and `packages/cli/bin/hyperframes.mjs` → `bin/shiftcut.mjs` |
| `/hyperframes` (slash cmd) | `/shiftcut` | router skill + all skill cross-refs |
| skill dirs `hyperframes-*` | `shiftcut-*` | `skills/`, `skills-manifest.json`, plugin manifests, `releases/` regeneration |
| `HeyGen` (company/brand) | `Verblike` | owner names, authors, plugin manifests |
| `hyperframes@heygen.com` | `shiftcut@verblike.com` | `.claude-plugin/*.json` owner email |
| `hyperframes.heygen.com` | `shiftcut.verblike.com` | all homepage/doc URLs |
| `www.hyperframes.dev` → `shiftcut.dev` (stray) | `shiftcut.verblike.com` | old playground domain; also normalized |
| `*.heygen.com` API hosts (`api2`, `app`, `files`, `api.dev`) | **left as-is for now** | cloud endpoints — **deleted** in §4, not renamed (a bare `heygen`→`shiftcut` would mint fake hosts) |
| `heygen-com/hyperframes` | `Verblike/shiftcut` | install path `npx skills add …`, git remote |

**Do NOT rename (keep verbatim):**
- `LICENSE` body, Apache boilerplate, SPDX headers `Apache-2.0`.
- Third-party names in `CREDITS.md` / vendored code.
- Brand-neutral runtime contract (see §3).

**The mechanical pass actually run (recorded for reproducibility):**
Order matters — compound `heygen`/URL tokens first, so a later bare `hyperframes`→`shiftcut`
doesn't corrupt `hyperframes.heygen.com`, and cloud API hosts (`api2.heygen.com`, …) are left
untouched. File list = tracked, regular (non-symlink) text files, excluding `LICENSE`,
`CREDITS.md`, `bun.lock`, `SHIFTCUT_MIGRATION.md`, `releases/`, `updates/`, and binaries.
```bash
# over the filtered file list:
sed -i '' \
 -e 's#hyperframes\.heygen\.com#shiftcut.verblike.com#g' \
 -e 's#heygen-com/hyperframes#Verblike/shiftcut#g' \
 -e 's#hyperframes@heygen\.com#shiftcut@verblike.com#g' \
 -e 's#@hyperframes/#@shiftcut/#g' \
 -e 's#HyperFrames#ShiftCut#g' \
 -e 's#Hyperframes#Shiftcut#g'   `# 4th casing: HyperframesLoader, HyperframesRenderStack` \
 -e 's#HYPERFRAMES#SHIFTCUT#g' \
 -e 's#hyperframes#shiftcut#g' \
 -e 's#heygen-com#shiftcut#g' \
 -e 's#HeyGen#Verblike#g'
# second pass: s#shiftcut\.dev#shiftcut.verblike.com#g (stray old playground domain)
```
Then: `git mv` the `hyperframes-*` dirs/files (done), regenerate `bun.lock` via `bun install`,
run the full suite, and refresh snapshots/fixtures. **Result:** 0 live `hyperframes`/`HeyGen`
references (only `releases/` + `bun.lock` remain, both regenerated later).

---

## 3. Contract names we intentionally KEEP

These are internal, brand-neutral, and load-bearing across engine + player + studio +
skills + examples + registry. Renaming them buys no brand value and risks wide breakage.

- `data-composition-id`, `data-width`, `data-height`
- `class="clip"`, `data-start`, `data-duration`, `data-track-index`
- `window.__timelines` (the paused-GSAP registry) and `{ paused: true }` convention

Our own [`SPEC.md`](../shiftcut-site/SPEC.md) and the site docs already teach these exact
names, so keeping them keeps site and framework in sync. If we ever must rebrand a global,
change it in **lockstep** across `packages/core/src/runtime/*`, `player`, `studio`,
`engine`, every skill, and all `examples/registry` fixtures — one atomic change.

---

## 4. Strip the cloud / HeyGen surface (make it 100% local)

Enumerated from the clone. For each: **DELETE** unless a local equivalent is trivial.

| Feature | Where | Action |
|---|---|---|
| Hosted Lambda render | `packages/aws-lambda`, CLI `lambda.ts` | **DELETE** package + command + help/docs |
| GCP Cloud Run render | `packages/gcp-cloud-run`, CLI `cloudrun.ts` | **DELETE** |
| Generic cloud render/upload | CLI `cloud.ts`, `cli/src/cloud/*` | **DELETE** |
| Publish to HeyGen | CLI `publish.ts`, `utils/publishProject.ts`, `api2.heygen.com/v1/hyperframes/projects/publish*` | **DELETE** |
| HeyGen OAuth/login | CLI `auth.ts`, `auth/oauth.ts`, `auth/client.ts`, `app.heygen.com/oauth/*` | **DELETE** |
| Telemetry / events / feedback | CLI `telemetry.ts`, `events.ts`, `feedback.ts` | **DELETE** (no phone-home) |
| Figma import (API) | CLI `figma.ts`, `commands/figma/`, `skills/figma` | **DELETE** or gate behind user's own token, off by default |
| Remote asset download | `capture/assetDownloader.ts`, `files.heygen.com/*` | Keep local capture; **remove HeyGen-hosted fetches** |
| Fonts from HeyGen | `hyperframes.heygen.com/docs/fonts` | **Bundle fonts locally** |
| TTS / voiceover | CLI `tts.ts`, `media-use` | **Keep only if local** (e.g., local model); if it calls a cloud API, **remove or make optional-local** |
| `claude-design` | CLI `claude-design/` | Audit; keep only if fully local |

After stripping: update CLI `help.ts`, `cli.ts` command registry, `doctor.ts` checks,
`.env.example`, `Dockerfile*`, and remove now-dead deps from `package.json`/`bun.lock`.
`doctor` should verify **FFmpeg, Node 22+, Chromium, Whisper.cpp, OpenCV** — nothing cloud.

---

## 5. The engine we keep (do NOT reinvent)

`core` + `engine` + `parsers` + `player` + `producer` + `studio` are the deterministic
HTML-composition editor. This is exactly the "match HyperFrames technically" requirement —
**keep the architecture, rebrand the names.** No behavioral changes here except:
- Ensure the render path is fully local (it already is: Chromium + FFmpeg).
- Confirm `studio` + `studio-server` run offline; this becomes our **Browser Studio /
  preview** (site currently lists Studio as "coming soon" — we can pull it forward if it's solid).

---

## 6. Reposition the skills (biggest editorial change)

Today's skills lean "author from scratch." We rename **and** reframe them toward editing.

**Rename (1:1):** `hyperframes` → `shiftcut` (router, `/shiftcut`), `hyperframes-core`,
`-animation`, `-cli`, `-creative`, `-keyframes`, `-registry` → `shiftcut-*`. Keep `media-use`.

**Reposition the router (`skills/shiftcut`):** entry prompt changes from "make a video from
HTML" to **"the user has a video and wants it edited"** — route to understand → edit →
render. Detect an input file/URL and prefer editing flows over cold-start creation.

**Workflow skills — keep the editing ones, add ours, demote pure-creation ones:**

| Skill | Fate |
|---|---|
| `talking-head-recut` | **Keep** — core editing use case |
| `embedded-captions` | **Keep** — captions are MVP |
| `faceless-explainer` | Keep (repurpose from footage) |
| `music-to-video`, `slideshow`, `motion-graphics`, `product-launch-video`, `pr-to-video`, `remotion-to-shiftcut`, `general-video`, `figma` | **Demote/optional** (creation-first; keep behind router, not headline) |
| **NEW `shiftcut-shorts`** | podcast/interview → N shorts (MVP) |
| **NEW `shiftcut-remove-silences`** | cut silences + filler (MVP) |
| **NEW `shiftcut-reframe`** | face-aware 16:9 → 9:16 (MVP) |
| **NEW `shiftcut-ingest`** | open an existing video as source clips in a composition |

Add the **understanding layer** the skills call into (mostly already present, wire it up):
- `transcribe` (local Whisper.cpp) — exists as CLI command.
- scene / silence detection (OpenCV + audio analysis) — extend `core/src/editing`.
- `remove-background` — exists; confirm local backend.
- **New ops:** `shorts`, `remove-silences`, face-aware `reframe`, `ingest`.

Update `skills-manifest.json`, `.claude-plugin/*.json` (owner, description, homepage,
skill list), and regenerate `releases/` from a clean ShiftCut v0 (don't hand-edit 117 dirs).

---

## 7. Docs, brand, and design

- **`docs/` (30 dirs):** rewrite to ShiftCut positioning — lead with "edit existing footage,"
  demote "write HTML from scratch." Match the messaging in `shiftcut-site`. Keep the
  composition/animation reference pages (they describe the kept engine) — just rebrand.
- **`DESIGN.md`:** replace HyperFrames tokens with ShiftCut's warm-dark + amber system
  (mirror `shiftcut-site/src/app/globals.css`: `--accent: #ff7a1a`, charcoal surfaces, grain).
- **`assets/`:** replace `logo.png`, `icon.png` with the ShiftCut mark (the offset-frames
  logo from `shiftcut-site/src/components/logo.tsx`). Keep `claude-code-icon-*` (Anthropic's).
- **`README.md`:** rewrite around "CapCut on autopilot," `npx skills add Verblike/shiftcut`,
  100% local, Apache-2.0.
- **`AGENTS.md` / `CLAUDE.md` (root):** rebrand build/architecture guidance to ShiftCut.
- **Templates** (`packages/cli/src/templates/_shared/AGENTS.md|CLAUDE.md`): rebrand + strip
  cloud/publish references from scaffolds.
- **Agent plugin dirs** (`.claude`, `.codex`, `.cursor-plugin`, `.agents`): rebrand names,
  install commands, and slash command to `/shiftcut`.

---

## 8. Execution plan (phased, each phase = green tests + a commit)

1. ✅ **Phase 2 — Mechanical rebrand (§2).** Done: scripted token replace + dir/file renames +
   `bin` rename, §3 contract names preserved. **Still owed:** repoint git remote off
   `heygen-com/hyperframes`; `bun install` to regenerate `bun.lock`; `bun run build`/`test`;
   refresh snapshots.
2. ⬜ **Phase 1 — Strip cloud (§4).** Delete cloud packages/commands/auth/telemetry/publish;
   green the build. (Do this next — files are rebranded but still present.)
3. ⬜ **Phase 3 — Reposition skills + router (§6).** Rewrite the `/shiftcut` router copy
   (currently creation-first), keep editing skills, add MVP editing skills, wire understanding ops.
4. ⬜ **Phase 4 — Editing capabilities.** Ship MVP ops end-to-end: `shorts`, `captions`,
   `remove-silences`, `reframe`, `ingest`. Add fixtures/tests.
5. 🟨 **Phase 5 — Brand + docs (§7).** README/CLAUDE/manifests done; docs body, `DESIGN.md`
   tokens, and logo assets (`docs/logo/*.svg`, `assets/*.png`) still pending.
6. ⬜ **Phase 6 — Release plumbing.** Fresh `releases/` from v0, publish `@shiftcut/*` to npm,
   verify `npx skills add Verblike/shiftcut` installs against the public repo.

---

## 9. Gotchas / decisions to confirm

- **Git remote (do first):** still `heygen-com/hyperframes`. Repoint before any push:
  `git remote set-url origin <your ShiftCut repo>`.
- **npm scope:** claim `@shiftcut` before Phase 6. If taken, pick an alt scope now.
- **`npx skills add Verblike/shiftcut`** resolves a public GitHub repo — the framework must
  live at `github.com/Verblike/shiftcut` (or update the install path everywhere if it's
  `Vadagon/shiftcut`). Keep this consistent with `shiftcut-site`.
- **Build not yet verified** — the rebrand machine had no `bun`. Snapshot tests *will* fail
  until refreshed (they embed old brand output); that's expected, not a regression.
- **`releases/` (117 dirs)** and **`updates/` migrations** encode HyperFrames' version
  history — don't rename in place; start ShiftCut at its own v0. (These still contain the old
  brand text; that's intentional — they get regenerated, not edited.)
- **`window.__timelines` / `data-*`** — keep (see §3). This is deliberate, not laziness.
- **TTS/voiceover, figma, remove-background** — confirm each backend is local before keeping;
  anything cloud gets removed or made opt-in local.
- **Fonts** currently fetched from `shiftcut.verblike.com/docs/fonts` (was HeyGen) — host or
  bundle them locally or the render breaks offline.
- **CREDITS.md / NOTICE** — keep third-party attributions; only remove HeyGen *product* branding.
- **`LICENSE`** — left untouched; HeyGen's copyright line stays (Apache-2.0 §4). Add Verblike's
  own copyright to new/modified source and brand surfaces instead.
