# IT Graduates Mentorship

Static site (GitHub Pages) with a Firebase backend for sign-ups and matching.

## 1. Firebase (free)
1. console.firebase.google.com > Add project.
2. Build > Authentication > Get started > enable **Anonymous** and **Google**.
3. Build > Firestore Database > Create (production mode), then paste `firestore.rules` into the Rules tab (replace `YOUR_COORDINATOR_EMAIL`) and Publish.
4. Project settings > Your apps > Web (`</>`) > copy the config into the top of the second `<script>` in `index.html`, and set `COORDINATOR_EMAIL`.
5. Authentication > Settings > Authorized domains > add `YOUR-USERNAME.github.io`.

## 2. GitHub Pages
```
git init && git add . && git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/it-mentorship.git
git push -u origin main
```
Then repo > Settings > Pages > Source: **Deploy from a branch** > `main` / `/ (root)` > Save.
Live at `https://YOUR-USERNAME.github.io/it-mentorship/` in about a minute.

Coordinator: click "Coordinator sign in" in the footer and use the Google account set above.
