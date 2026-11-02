# Privacy data inventory

Every field RefundBeacon stores, where it lives, and whether it ever leaves the device. Keep this
in sync with `src/db/schema.ts`, the App Store privacy details and the Play Data safety form.

| Data                                                                         | Storage                                       | Retention                             | Leaves device?                                   |
| ---------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------- | ------------------------------------------------ |
| Case facts: retailer, item, amounts, dates, return method, carrier, tracking | SQLite `cases` (app sandbox)                  | Until the case or all data is deleted | Only in exports/backups the user shares          |
| Order reference                                                              | SQLite `cases.order_reference`                | Same                                  | Only if “Order number” is included in an export  |
| Notes                                                                        | SQLite `cases.notes`                          | Same                                  | Only if “Private notes” is included in an export |
| Timeline events                                                              | SQLite `timeline_events`                      | Same (cascade on case delete)         | In exports/backups the user shares               |
| Refund entries (amount, date, confirmation source)                           | SQLite `refund_entries`                       | Same                                  | In exports/backups the user shares               |
| Evidence files (photos, PDFs, text)                                          | `Documents/evidence/<uuid>.<ext>`             | Until removed; deleted with case      | Backups (base64) and files the user shares       |
| Evidence metadata (original name, type, date, note)                          | SQLite `evidence`                             | Same                                  | Listed in summaries if marked for export         |
| Reminders                                                                    | SQLite `reminders` + OS notification schedule | Until completed/deleted               | No                                               |
| Preferences (onboarding, appearance, reminder time)                          | SQLite `preferences`                          | Until all data is deleted             | In backups                                       |

## Not collected

No account, email, contacts, location, inbox, bank or card credentials, advertising IDs,
analytics or crash reporting. The app makes no network requests of its own; official-source
links open in the user’s browser.

## Permissions

| Permission    | When requested                                                                      | If declined                               |
| ------------- | ----------------------------------------------------------------------------------- | ----------------------------------------- |
| Camera        | User taps “Take photo” for evidence                                                 | Choose an existing photo or file instead  |
| Storage       | Android 9 and older only, with Camera: the system camera needs it to save the photo | Choose an existing photo or file instead  |
| Photos        | Not requested — the system picker is used                                           | —                                         |
| Notifications | User saves a reminder or enables it in Settings                                     | Reminders still show in the Reminders tab |

## Temporary files

- The system photo and file pickers copy the chosen file into the app cache. The copy is deleted
  when the Add evidence screen closes (saved, cancelled or rejected) and right after a backup
  file is read for restore.
- Summaries, CSV exports and backups are written to the app cache so the share sheet can send
  them. They stay until the OS clears the cache or the user deletes all data.

## Deletion

- Single case: Case › Manage case › Delete case (rows cascade, files and notifications removed).
- Everything: Settings › Delete all data on this device (also removes picker copies and shared
  exports and backups left in the cache).
- Backups are unencrypted JSON; the UI warns users to store them privately.
