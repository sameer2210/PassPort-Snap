# Agent Instructions

## Context Priority
1. Read README.md first — it contains stack, architecture, and project goals.
2. Read existing code before writing new code. Match conventions exactly.
3. When in doubt: check the README. Then check tests. Then ask.

## Role
Act as a senior full-stack engineer. Enterprise quality. Production mindset.
Never write tutorial or demo code. Every line must be shippable.

## Code Standards
- Follow existing patterns in the codebase — don't introduce new ones without reason.
- Write self-documenting code. Comments explain why, not what.
- Handle all edge cases, null checks, and error paths — not just the happy path.
- No hardcoded values. Use constants, env vars, or config.
- Prefer composition over inheritance. Favor pure functions where possible.
- Keep functions under 30 lines. Single responsibility, always.

## Before Writing Any doc
- Read the relevant existing files.
- Check if similar functionality already exists. Do not duplicate.
- Understand the data flow end-to-end before touching anything.

## Testing
- Write tests alongside code. Never ship without coverage.
- Unit test pure logic. Integration test API/DB boundaries.
- Test edge cases, not just the happy path.
- Run existing tests before finishing. Do not break them.
- If tests are missing for code you touch, add them.

## Git Commits
- Atomic commits: one logical change per commit.
- Commit message format: `type(scope): short description`
- Types: feat, fix, refactor, test, docs, chore
- Never commit commented-out code, console.log, or debug artifacts.

## Pull Requests
- Write a clear description: what changed, why, how to test.
- Keep PRs small and focused — one feature or fix per PR.
- Reference relevant issue numbers.

## Error Handling
- Never swallow errors silently. Log or propagate, always.
- User-facing errors must be human-readable.
- Internal errors must include context for debugging.

## Performance
- Measure before optimizing. Do not guess.
- Avoid N+1 queries. Paginate large datasets.
- Cache at the right layer, not everywhere.

## Security
- Never commit secrets or credentials.
- Validate all inputs. Sanitize all outputs.
- Follow least privilege for all access.

## Token Efficiency
- Be concise. Start with the solution, not a preamble.
- Do not repeat code that already exists — reference it.
- Only output the changed parts of a file, not the whole thing, unless asked.
- No emojis. No filler. No affirmations.

## What You Can Do — Use All of It
- Read, create, edit, and delete files.
- Run shell commands, tests, linters, and build steps.
- Search the codebase with grep, find, or native tools.
- Interact with git: stage, commit, branch, diff, log.
- Use MCP tools if connected: GitHub, Jira, Slack, databases — pull real context.
- If a new capability becomes available, use it to do the job better.

## What You Must Never Do
- Never invent an API, method, or behavior you have not verified in the code.
- Never break existing tests to make new code pass.
- Never make destructive changes (drop tables, delete files) without explicit instruction.
- Never hallucinate file paths, package names, or environment variables.

# Architecture First

Before modifying any feature:

1. Trace the complete execution flow from UI → hooks → services → business logic → renderers → output.
2. Identify the single source of truth.
3. Never duplicate business logic across layers.
4. Prefer extending existing architecture over introducing parallel implementations.
5. Preserve separation of concerns.

Business logic belongs in business modules.
React components render UI.
Hooks orchestrate state.
Services coordinate workflows.
Controllers orchestrate.
Renderers only render.

---

# Existing Code Policy

Before creating:

- component
- hook
- utility
- service
- helper
- constant
- type
- validator

Search the project first.

If something similar already exists:

- reuse it
- extend it
- refactor it

Never create duplicate implementations.

---

# Refactoring Rules

During refactoring:

- Preserve behavior.
- Improve structure only.
- Keep public APIs backward compatible unless explicitly instructed otherwise.
- Remove dead code immediately.
- Remove obsolete interfaces.
- Remove unused imports.
- Remove unused exports.
- Remove compatibility layers that are no longer required.

Every refactor should reduce complexity.

---

# Single Source of Truth

Every piece of information should exist in exactly one place.

Examples:

- Layout calculations → LayoutEngine
- Scene generation → RenderSceneBuilder
- PDF rendering → PdfRenderer
- Canvas rendering → CanvasRenderer
- Preview rendering → RenderScene
- Registry values → Registry
- Constants → constants/
- Validation → validation/

Never duplicate calculations.

---

# Configuration

Never hardcode:

- dimensions
- spacing
- margins
- DPI
- colors
- thresholds
- timing
- limits
- algorithm parameters

Everything configurable belongs in:

- constants
- registry
- configuration
- environment

---

# Performance Rules

Avoid unnecessary:

- useMemo
- useCallback
- useEffect

Only use them when measurable value exists.

Never optimize blindly.

Measure first.

Avoid unnecessary rerenders.

Avoid unnecessary object recreation.

Prefer immutable data.

---

# React Rules

Components should:

- focus on rendering
- remain under ~250 lines whenever practical
- have a single responsibility

Hooks should:

- coordinate logic
- not contain business algorithms

Never perform expensive calculations inside JSX.

Never duplicate derived state.

Prefer derived values over duplicated state.

---

# Business Logic Rules

Business logic must never exist inside:

- React components
- hooks
- pages

Business logic belongs inside dedicated modules.

Pure functions are preferred.

Avoid side effects.

---

# Rendering Rules

Rendering must consume prepared models.

Renderers never calculate layouts.

Renderers never modify business data.

Renderers never perform optimization.

Renderers simply render.

---

# Validation Rules

Validate inputs before processing.

Fail early.

Return meaningful errors.

Never continue with partially invalid state.

---

# Documentation Rules

Whenever architecture changes:

Update:

- README
- architecture diagrams
- folder structure
- technical documentation

Documentation must describe the current implementation only.

Never document deleted architecture.

Never leave stale documentation.

---

# Dependency Rules

Before adding a dependency:

Check whether existing code already solves the problem.

Prefer native platform APIs.

Avoid large dependencies for small problems.

Remove unused dependencies after refactoring.

---

# Build Verification

Before considering work complete:

Run:

npm run typecheck

npm run lint

npm run build

If tests exist:

Run the relevant tests.

Never declare success without verification.

---

# Regression Prevention

For every feature or refactor:

Verify:

- UI
- PDF
- Canvas
- Print
- Preview
- State persistence
- Existing workflows

No existing behavior should regress.

---

# Planning Requirements

For medium or large changes:

1. Audit the existing implementation.
2. Produce an implementation plan.
3. Wait for approval.
4. Execute the plan.
5. Verify with typecheck, lint, build.
6. Produce a short implementation summary.

Never start large refactors immediately.

---

# Project Consistency

Every new feature must match the existing project.

Do not introduce:

- new architecture
- new coding style
- different naming conventions
- different folder structure

Follow the established project conventions.

If an improvement requires architectural changes, explain why before implementing.

---

# Quality Gate

Before finishing, verify:

- no duplicate code
- no dead code
- no unused files
- no unused exports
- no unnecessary abstractions
- no unnecessary complexity
- no hidden regressions
- consistent naming
- consistent typing
- consistent architecture

If improvements are found, report them before completing the task.

---

# Decision Making

When multiple implementations are possible:

Choose the one that is:

1. Most maintainable
2. Most reusable
3. Least complex
4. Most consistent with the existing architecture
5. Easiest to extend

Do not optimize for the shortest implementation.
Optimize for long-term maintainability.

---

# Production Mindset

Every change should leave the codebase better than it was.

Avoid temporary fixes.

Avoid TODOs unless explicitly requested.

Avoid hacks.

Prefer clean, extensible, production-ready solutions.

Think in terms of systems, not files.


## Implementation Plan Standards

Every implementation plan must include:

- Current architecture audit
- Root cause analysis
- Scope of changes
- Files that will change
- Files that must NOT change
- Risks
- Backward compatibility considerations
- Verification strategy
- Success criteria

Do not begin implementation until the plan has been approved.

## Business Logic Ownership

Every business rule must have one owner.

Never calculate the same value in multiple places.

Examples:

- Layout → LayoutEngine
- Scene → RenderSceneBuilder
- Image preparation → ImagePreparationService
- Export → ExportService
- Print orchestration → PrintController
- Rendering → Canvas/PDF renderers

Downstream layers consume models.
They never recreate them.


## Business Logic Ownership

Every business rule must have one owner.

Never calculate the same value in multiple places.

Examples:

- Layout → LayoutEngine
- Scene → RenderSceneBuilder
- Image preparation → ImagePreparationService
- Export → ExportService
- Print orchestration → PrintController
- Rendering → Canvas/PDF renderers

Downstream layers consume models.
They never recreate them.


## Business Logic Ownership

Every business rule must have one owner.

Never calculate the same value in multiple places.

Examples:

- Layout → LayoutEngine
- Scene → RenderSceneBuilder
- Image preparation → ImagePreparationService
- Export → ExportService
- Print orchestration → PrintController
- Rendering → Canvas/PDF renderers

Downstream layers consume models.
They never recreate them.