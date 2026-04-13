---
name: mermaid-plan
description: Generate Mermaid diagrams for planning outputs. Use when creating a plan, task breakdown, implementation roadmap, or architecture proposal. Select flowchart TD for step-by-step plans, sequenceDiagram for request/response flows, and classDiagram for data models, then include a numbered explanation list after every diagram.
---

# Mermaid Plan

## Purpose

Use this skill whenever the response includes a plan, task breakdown, or architecture proposal.

## Diagram Selection Rules

1. Use `flowchart TD` for step-by-step implementation plans and task execution order.
2. Use `sequenceDiagram` for request/response flows, service interactions, and lifecycle events over time.
3. Use `classDiagram` for data models, schema relationships, and object structure.

If more than one view is needed, include multiple diagrams in the same response.

## Required Diagram Standards

- Keep node and class labels concise (short phrases, no paragraphs).
- Label all edges with meaningful verbs or relationship names.
- Use subgraphs to group related steps, services, or model domains when there are 3+ related nodes.
- Keep diagram structure readable and top-down for plans.

## Output Format

For each diagram, always use this order:

1. Brief title line.
2. Mermaid code block.
3. Numbered explanation list that explains the key nodes/groups and major transitions.

Template:

````markdown
### <Diagram Title>

```mermaid
<diagram type and content>
```

1. <What the first important part represents>
2. <What the next important transition or relationship means>
3. <Any critical constraint, dependency, or handoff>
````

## Quality Checklist

Before sending:

- Diagram type matches the intent (`flowchart TD`, `sequenceDiagram`, or `classDiagram`).
- Labels are concise and edges are explicitly labeled.
- Subgraphs are used where grouping improves readability.
- A numbered explanation list appears immediately after every diagram.
