# IT Graduates Mentorship Platform

A peer-mentorship web platform that connects working IT graduates (mentors) with graduates still looking for their first opportunity (mentees). Members sign up online, a coordinator pairs them by specialisation, and each pair gets the other's contact details to start talking on WhatsApp.

It is a free, serverless site: the front end runs on GitHub Pages, and Firebase handles sign-in and data.

**Live site:** https://thembaphiri.github.io/mentorship-web/

---

## What the system does

- A sign-up form for mentors and mentees capturing name, WhatsApp number, specialisation, goals or skills to share, and availability, with a consent tick-box for sharing contact details.
- Mentors set how many mentees they can take (1 to 5), so no mentor is overloaded.
- A coordinator dashboard shows live totals (mentors, mentees, matched, waiting) and lets the coordinator match or unmatch each mentee.
- Mentor suggestions are filtered by free capacity and starred when the specialisation matches the mentee's field.
- Matched members see their partner's details and a one-tap WhatsApp chat button, updated in real time.

## How a match happens

1. **Join** as a mentor or mentee and complete a profile.
2. **Coordinator reviews** everyone waiting to be matched.
3. **Match** by specialisation and mentor capacity.
4. **Connect** on WhatsApp and begin the skills transfer.

## Security & access

- Members sign in anonymously; the coordinator signs in with Google.
- Firestore security rules let members read only their own data, and only the coordinator can create matches.

## Tech stack

| Layer | Technology |
| --- | --- |
| Front end | HTML, CSS, JavaScript |
| Authentication | Firebase Authentication (anonymous and Google) |
| Database | Cloud Firestore |
| Hosting | GitHub Pages |

## Project structure

```
index.html         Home page
join.html          Sign-up form and "Your match" view
coordinator.html   Coordinator dashboard (matching and stats)
app.js             Page logic shared by all pages
firebase.js        Firebase connection and sign-in
style.css          Shared styling
```

## Setup

1. Create a Firebase project and enable **Anonymous** and **Google** sign-in under Authentication.
2. Create a Cloud Firestore database and publish security rules that:
   - let each member read and write only their own `members` document,
   - let each member read only their own `matches` document,
   - allow only the coordinator's Google account to create or change matches.
3. Register a web app in Firebase and copy its config into `FIREBASE_CONFIG` at the top of `firebase.js`. Set `COORDINATOR_EMAIL` to the coordinator's Google account.
4. Add your site's domain (for example `your-username.github.io`) under **Authentication → Settings → Authorized domains**.
5. Publish with **Settings → Pages → Deploy from a branch → `main` / root**.

## Author

Built by [Themba Phiri](https://github.com/ThembaPhiri).
