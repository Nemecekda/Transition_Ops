# ALERT CHANNEL — MANUAL VERIFICATION ON A REAL DEVICE

Headless Chrome proves Chrome desktop and an Android-class context. It cannot
prove real iOS Safari. This script is what closes that gap. Run it on the
deploy preview, before merge.

Everything below is done from the app's own UI except the two date entries.

---

## A. iPhone — installed PWA (the case that matters most)

iOS refuses to even ask for notification permission unless the app is on the
Home Screen. That guard is already in the app and you should see it fire.

1. **Safari, NOT installed.** Open the preview URL in Safari. Go to the alerts
   control and try to enable alerts.
   - EXPECT: toast reading `INSTALL APP FIRST — Add to Home Screen, then enable alerts.`
   - If you get a permission prompt instead, stop and report it — that means the
     iOS guard at `index.html:5282` is not firing.
2. **Install it.** Share → Add to Home Screen. Open it from the Home Screen icon
   (not Safari).
3. **Enable alerts.** Tap the alerts control, accept the iOS prompt.
   - EXPECT: toast `ALERTS ENABLED — You will receive transition reminders.`
4. **Set the trigger date.** Set your ETS date to **exactly 31 days from today**.
5. **Force-close the app** (swipe up from the app switcher) and reopen it from
   the Home Screen icon.
   - EXPECT within ~2 seconds of the app settling: one iOS notification titled
     **"FEDVIP Dental/Vision Window OPEN (Retirees)"**.
   - EXPECT exactly ONE notification, not a burst.
6. **Reopen again** without changing anything.
   - EXPECT: no repeat of that notification. Once per rung, ever.

## B. iPhone — post-separation tail

7. Set ETS to **45 days in the past**.
8. Force-close, reopen.
   - EXPECT: **"FEDVIP Backstop — 30 Days Left on the Window (Retirees)"**.
   - This is the negative-offset path. If A works and B does not, the sign
     handling is wrong and I need to know.

## C. Android (if you have one to hand)

Same as A, steps 2-6. Install via Chrome's "Add to Home screen".
Expected results are identical.

## D. Denial path — confirm nothing is lost

9. On a second device or after clearing site data: set an ETS date 31 days out
   but **decline** the notification permission.
   - EXPECT: no notification, no error, and the reminder still visible inside
     the app on the dashboard and the reminders tab.
10. Now grant permission and reopen.
    - EXPECT: the FEDVIP notification arrives now. Declining must not burn the
      rung — the app only records a rung as delivered if it actually showed it.

---

## Resetting between runs

The delivered-rung record lives in `localStorage` under `tops_rung_notified`.
To re-run a case, clear website data for the site (iOS: Settings → Safari →
Advanced → Website Data; or delete and reinstall the Home Screen app).

## What "pass" means

- A5 fires exactly one notification, correct title, within a couple of seconds
- A6 does not repeat it
- B8 fires the post-separation rung
- D9 stays silent but still shows the reminder in-app
- D10 delivers the rung after permission is granted

## Report back

If any step deviates, send me the step number, the device and OS version, and
whether the app was opened from the Home Screen icon or from Safari. That last
detail decides whether it is an iOS platform limit or a defect in this branch.
