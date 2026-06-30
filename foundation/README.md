# APJ Foundation

APJ Foundation is the machine-readable source of truth for APJ Labs.

This directory defines the company philosophy, product portfolio, platform principles, capabilities, standards, playbooks, glossary, and AI engineering rules that future humans and AI agents should follow.

## FP-001A Scope

This first increment creates the Foundation Manifest and Registry.

```text
foundation/
  manifest.yaml
  registry/
    products.yaml
    capabilities.yaml
    principles.yaml
    standards.yaml
    playbooks.yaml
    glossary.yaml
```

The Foundation Registry is intentionally lightweight. It is designed to become the input for a future Foundation Generator, Foundation Runtime, Atlas search, and VGOS Advisor integration.

## Rule

If the Foundation and implementation disagree, the implementation must be reviewed.

## Current Status

Status: `foundation-mvp`
Version: `1.0.0`
Owner: `APJ Platform`
