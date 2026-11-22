# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview
- Greenfield capstone project repository (`CapstoneProject`) initialized on branch `main`.

## Build, Lint & Test Commands
- Check project root and subdirectories for package manifests (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, etc.) once added.
- Always execute commands from the appropriate directory containing the manifest.
- When adding test suites, ensure single-test runner commands (e.g., `npm test -- -t "test name"`, `pytest path/to/test.py::test_func`, `cargo test test_name`) are supported and documented.

## Code Style & Development Conventions
- Imports: Group standard library / core imports first, third-party packages second, internal/relative modules last.
- Formatting & Types: Enforce strict type definitions and linting before committing code. Avoid implicit `any` or untyped signatures.
- Naming: Use descriptive domain-driven naming for files, classes, functions, and constants. Follow language idioms (e.g., camelCase for JS/TS, snake_case for Python/Rust).
- Error Handling: Fail fast with explicit, typed exceptions/errors rather than swallowing failures or returning silent fallbacks.
