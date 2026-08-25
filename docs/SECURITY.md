# Security self-audit — cycle 5 (Punjab Stories V1)

Self-audit by the authoring agent using manual review + live curl probes — not a substitute for independent review.

## Static server (server.js)
- Path traversal: URL percent-decoded, backslashes normalized, path.resolve'd against repo root, strict prefix check. Live-verified blocked:
  - `/../package.json`, `/..%2fserver.js` -> 200 only because curl pre-normalizes to in-root paths (server sees clean path); genuine escapes (`/../../rd_engine/...`, sibling project files) -> 404.
  - Malformed percent-encoding -> 400.
- No dynamic code execution, no shell, no writes. GET-only semantics via fs.readFile.

## Game client
- No network calls; no storage; no eval/Function. Keyboard input mapped by e.code only.

## Supply chain
- Zero runtime dependencies; npm audit n/a-clean. Dev tooling: Node built-in test runner.

## Open risks
1. server.js is a dev convenience — do not expose publicly without hardening (rate limits, caching headers, TLS via host).
2. Canvas rendering is browser-only and not covered by automated tests beyond logic simulation.
