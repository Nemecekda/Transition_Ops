# Guard and Reserve service check-in - October 4, 2026

Follow-on development after PR116, at Dean's request to prioritize Guard and Reserve. Base: 015cc39aa83b4ddbcadb5ce51d17f483b0ad88cf. Local candidate cache195; not published.

## Member task and behavior

A member with a selected direction can choose "Plan around my service commitments" from Home. Three situations shape different local suggestions: balancing civilian work with drill/training, preparing a work handoff before time away, and preparing a return-to-work conversation. Each explains the proposed action and leads into the existing editable, explicitly saved career-step flow.

The situation selector is temporary. Changing it resets replacement consent. Existing saved steps remain untouched until explicit save; a reload resumes the saved action. Other service profiles do not expose this control. Guard and Reserve still share the existing profile enum; no component or eligibility inference was added. No orders, unit schedule, separation date, new storage field, telemetry, model request or external contact is needed.

Hypothesis: a situation-specific next step will make ongoing-service career planning more useful than a generic time constraint. Member usefulness and retention remain unmeasured.

## Validation

Local synthetic browser tests cover all three situations, no automatic replacement, consent reset, editor focus, explicit save/reload, and isolation from other profiles. Both themes at 320/375/900 CSS pixels check reflow, labeling and select target size. Existing seven visitor/path scenarios remain required. Required migration, service-worker privacy, privacy-network, runtime-spend and accessibility automation passed. Structural inventory: 138 parsed records; public build: 64 files. No live model calls. Manual AT and hosted acceptance for this follow-on change remain pending.

Reproduction: select Guard/Reserve and a career direction; open the service-commitment button; change the situation; verify the suggested action changes while saved storage does not; explicitly replace/edit/save; reload Home. Cheap acceptance: a synthetic returning member can prepare and resume one supervisor-conversation step without entering orders or a separation date.

Scope: index.html planning loop, pwa-sw.js cache194 ->195, member-loop browser regression, demo and evidence notes. No policy wording, Resume behavior, J1/S2 or runtime AI changes.
