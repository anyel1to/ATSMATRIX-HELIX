# ATSMATRIX // HELIX

[![License: MIT](https://img.shields.io/badge/License-MIT-6ea8ff?style=flat-square)](LICENSE)
[![Stack](https://img.shields.io/badge/Stack-HTML%20%C2%B7%20CSS%20%C2%B7%20Canvas-7d8aa0?style=flat-square)](#repository-layout)
[![Status](https://img.shields.io/badge/Status-Reference%20floor-6cffb2?style=flat-square)](#project-status)
[![ATSMATRIX](https://img.shields.io/badge/Built%20by-ATSMATRIX-22d3ee?style=flat-square)](https://atsmatrix.com)

**Live helical command stack for multi-agent work.**

A task does not sit in a chat window. It climbs. Six named roles occupy rungs on a double helix. Packets travel the spine. Handoffs light the lattice. One ship event leaves the crown only after MEMORY writes the receipt.

This repository is the reference visualizer and climb contract for that stack. It is not a larger prompt. It is a visible control plane for intake, route, execute, critique, persist, and ship.

**Live floor:** [https://anyel1to.github.io/ATSMATRIX-HELIX/](https://anyel1to.github.io/ATSMATRIX-HELIX/)

---

## Purpose

Most multi-agent demos flatten work into a transcript. HELIX treats **altitude** as the product:

- The **spine** is the only object that holds task state.
- Each **role** occupies a fixed rung. It does not wander.
- A **handoff** is a packet traveling the helix, not a re-read of the whole chat.
- **CRITIC** re-reads claims before the packet may climb past mid-stack.
- **MEMORY** writes the receipt before **SHIP** is allowed to fire.

If one role carries the entire climb, the helix has collapsed into a single agent with extra hops.

---

## Operating model

```
                         SHIP
                           |
                        MEMORY
                           |
                        CRITIC
                           |
                        WORKER
                           |
                        ROUTER
                           |
                        INTAKE
```

| Invariant | Meaning |
| --- | --- |
| Named rung | Nothing runs until the spine has assigned the packet to a role. |
| State, not transcripts | The packet moves. The chat log does not. |
| Second reader | CRITIC blocks climb on disagreement. |
| Trace first | MEMORY writes before SHIP. |
| Route by step | Assignment follows the work, not a preferred model. |
| Safe parallelism | Independent packets may occupy adjacent rungs. |

---

## Roles on the helix

| Role | Mandate | Constraint |
| --- | --- | --- |
| **INTAKE** | Accept the brief. Cut it into climbable steps. | Does not call tools. |
| **ROUTER** | Assign the next cheapest role that can finish the step. | Does not execute. |
| **WORKER** | Perform the side-effecting action. | Fires only when arguments are complete. |
| **CRITIC** | Re-read every claim from source. | Blocks climb on disagreement. |
| **MEMORY** | Persist the receipt to the spine. | Blocks ship until written. |
| **SHIP** | Return the answer to the caller. | Speaks only after MEMORY. |

---

## Operations floor

`index.html` is a live reference dashboard. It renders the helix, the active packets, the message bus, and six telemetry panels.

The floor currently runs a high-fidelity **simulation**. It is not yet wired to a production agent backend.

Controls: **INJECT TASK**, **PAUSE / RUN**, click a rung, drag to orbit, scroll to zoom.

---

## Run locally

```bash
git clone https://github.com/anyel1to/ATSMATRIX-HELIX.git
cd ATSMATRIX-HELIX
python3 -m http.server 4173
```

Open http://localhost:4173

No package manager. No bundler. No API key.

---

## GitHub Pages

1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: main / (root)

https://anyel1to.github.io/ATSMATRIX-HELIX/

---

## Project status

| Item | State |
| --- | --- |
| Public repository | Active |
| Operations floor | Shipped (simulated telemetry) |
| Climb contract | Documented |
| Production agent backend | Not in this repository |
| Packet adapter / live roles | Planned |

Related: [AGENT-RING](https://github.com/anyel1to/ATSMATRIX-AGENT-RING) · [NEXUS](https://github.com/anyel1to/ATSMATRIX-NEXUS) · [PRISM](https://github.com/anyel1to/ATSMATRIX-PRISM) · [AGENT-COMPOUND](https://github.com/anyel1to/ATSMATRIX-AGENT-COMPOUND)

---

MIT License © 2026 ATSMATRIX Technologies

Built by **ANYELO · ATSMATRIX**  
[atsmatrix.com](https://atsmatrix.com)
