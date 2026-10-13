# Career workspace visual and interaction review

Date: 2026-10-12. Local preview: http://127.0.0.1:18776/?tool=pathway.
Scope: Career entry, role selection, continuation and the handoff to job search.
Conditions: Codex in-app browser; 390 x 844 CSS-pixel phone viewport, light theme;
invented notes only. This is a browser lab check, not a physical-device or member study.

Final first-screen visual check: 375 x 812 and 320 x 812; no horizontal overflow,
both starting choices visible. Desktop checked at the restored normal viewport.
Final first-screen screenshots: `mobile-start.jpg`, `desktop-start.jpg`.
Candidate index SHA-256:
`1a15a9fff1649f74a11c3d2c38a1ea212f0329dcde140b3249bfadf7ff4b71bf`.
Screenshots recaptured after the independent keyboard-focus correction.

Observed:
- Fresh entry shows Use my resume and Start without a resume in the first viewport.
  It does not expose the long intake form before a choice.
- Resume-free entry -> Human Resources -> Talent Acquisition / Recruiter produces
  a role-specific next action and prominent Find jobs for this role button.
- Invented warehouse/team-training notes -> Operations Manager / Supply Chain ->
  Home -> Career retains the selected role and next action in the same tab.
- Optional AI experience help, learning and networking remain available in the
  contextual secondary disclosure. No AI request was submitted.
- The first job-search review found duplicate Back controls and repeated headings.
  The revised preview has one visible Find jobs heading, a selected-role summary,
  one Back to Career control, the role prefilled, and a location field.
- Returning from job search restores the same role and next action.

Limits: no production update, real resume, member data, account creation, provider
request, live job search, manual assistive-technology matrix or retention measurement.
The static local preview reports federal search is not connected; live API delivery
was outside this layout review. Independent regression and project-gate receipts are
owned by S3 and the reviewer in the feature worktree.

Hypothesis: fewer simultaneous choices and clearer return context will make starting
and continuing a career task easier. Real first-time-member usefulness is unmeasured.
