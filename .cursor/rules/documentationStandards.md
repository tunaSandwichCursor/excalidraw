# Documentation Standards — Mandatory

Apply these rules to every created or modified TypeScript/TSX file.

## Required file header
At the top of each file, include a TSDoc comment block.

The block must include:
- @module
- @description
- @packageDocumentation

The block must also state:
- the module purpose
- the key exports
- which package consumes this module
- the parent package relationship (for example: "Part of @excalidraw/math")

## Completion requirement
Before finishing, verify that every touched TypeScript/TSX file includes this header.
If any touched file is missing it, add it before completing the task.

Do not skip this requirement, even if the user does not mention documentation.