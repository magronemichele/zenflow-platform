# ZenFlow architecture

ZenFlow is a local browser demo. The Next.js App Router supplies an authentication route group and an application route group. The application waits until the browser can read the Zustand snapshot before enforcing its local sign-in state.

- `app/` contains page-level behavior and navigation.
- `components/` contains shared controls, navigation, and editorial components.
- `lib/store/` contains the persisted demo session, tracker, plans, and messages. Transient notifications are excluded from storage.
- `lib/utils/` contains the local article dataset, validation, date utilities, and daily summary logic.

Data stays in the current browser. Different browsers have independent journals. User sign-in and registration validate sample values locally. The coach picks from bundled responses and demo membership only changes the local profile.

The repository requires no database, backend credentials, Stripe configuration, or AI provider. See [README](README.md) for installation, development, build, and test commands.
