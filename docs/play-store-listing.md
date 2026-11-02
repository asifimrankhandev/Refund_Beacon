# Google Play listing

Copy for the Play Console. Keep it in sync with the app and `docs/privacy-data-inventory.md`.
Never promise that users will get money back.

## Main store listing

**App name** (30 max): Refund Beacon

**Short description** (80 max):
Track returns whose refund hasn’t arrived. Evidence, reminders and next steps.

**Full description** (4000 max):

Returned something and the refund still hasn’t shown up? Refund Beacon keeps the whole case in
one place, so you always know what happened and what to do next.

RECORD THE RETURN
Add the retailer, item, amount and dates in under 90 seconds. Note how you sent it back, the
carrier and the tracking number.

KEEP THE EVIDENCE TOGETHER
Attach receipts, return labels, tracking screenshots, retailer emails and PDFs. A readiness
checklist shows what’s still missing.

KNOW THE NEXT STEP
Every case shows one sensible next step and the facts it’s based on, such as “Handed over
Oct 28” or “$12.00 received of $20.00 expected”. Not a fit? Dismiss it.

NEVER MISS A FOLLOW-UP
Set a reminder for the day you should check in. Notifications are optional, and reminders also
appear in the app.

FOLLOW UP WITH CONFIDENCE
Draft a polite, concise or firm follow-up from the facts you recorded. Copy it or share it —
Refund Beacon never sends anything for you.

TRACK WHAT ACTUALLY ARRIVED
Record full or partial refunds, store credit and exchanges. Store credit is never counted as
cash, and the remaining balance is simple arithmetic from your own numbers.

PRIVATE BY DESIGN
• No account, no sign-in
• Everything stays on your device
• No analytics, ads or tracking
• Export a case summary, a CSV or a full backup only when you choose

Refund Beacon organizes information you enter. It doesn’t issue refunds, contact retailers,
file disputes or give legal or financial advice, and it can’t guarantee any outcome.

## App details

| Field              | Value                                    |
| ------------------ | ---------------------------------------- |
| App category       | Finance (alternative: Productivity)      |
| Contact email      | support@idexa.app                        |
| Privacy policy URL | https://idexa.app/refund-beacon/privacy/ |
| Ads                | No ads                                   |
| Target audience    | 18 and over                              |
| Content rating     | Answer the questionnaire “No” throughout |
| Package name       | com.refundbeacon.app                     |

## Data safety form

Answers match the app as built (see `docs/privacy-data-inventory.md`).

- **Does your app collect or share any of the required user data types?** No.
  (Data that stays on the device and is never sent off it by the app or developer is not
  “collected” under Play’s definition. User-initiated sharing through the system share sheet is
  not “sharing” by the developer.)
- **Is all of the user data collected by your app encrypted in transit?** Not applicable — no
  data is transmitted.
- **Do you provide a way for users to request that their data is deleted?** Users delete data in
  the app (Settings › Delete all data), and uninstalling removes it.

## Permissions declaration

The release manifest requests only: camera (photograph evidence), notifications (reminders),
storage up to Android 12 (system camera save on Android 9 and older), and alarms/boot (restore
scheduled reminders). Push, install-referrer and launcher-badge permissions are blocked in
`app.json`.

## Graphics checklist

Ready to upload from `store-listing/`. Screenshots are real device captures (fictional demo
retailers, no personal data) with a caption band.

- App icon 512×512 PNG: `store-listing/play-icon-512.png`.
- Feature graphic 1024×500: `store-listing/feature-graphic-1024x500.png`.
- Phone screenshots, 1080×1920, upload in this order: `store-listing/screenshots/01-home.png`
  to `06-dark.png` (home, next step, timeline, follow-up draft, reminders, dark mode).
