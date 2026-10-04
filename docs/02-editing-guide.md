# Editing technojam.in — a guide for leads

You don't need to write code to run the site. Everything happens in the **Studio** at **technojam.in/studio**. Sign in with the Sanity account a lead invited you to.

Changes go live within about a minute of publishing (the webhook triggers it), or within an hour at the latest.

> **The one rule:** if it's a fact — a number, a date, a winner, a name — fill in **Verification** with where it came from. If you're not sure yet, set it to **Pending**. Pending content is saved but **not shown** on the site, so it can never embarrass anyone.

---

### Open or close recruitment
1. **Recruitment** → open this year's cycle (or **+ Create** a new one).
2. Set **Status**:
   - *Upcoming*: announced, not open yet
   - *Open*: the whole site switches over: Join shows **View tasks / Submit application**, the nav **Join** button gets a live dot, and the homepage shows it first.
   - *Evaluating*: submissions are closed, interviews are running
   - *Closed*
3. Fill in the tasks repository, application link, deadline, tracks, timeline and FAQ.
4. **Publish.**

### Publish an event
1. **Events** → **+ Create**. Add the title, type, short description and start date (plus the end date for multi-day events).
2. Don't set "upcoming" or "past". The site works that out from the dates. Only use **Status override** for *cancelled* or *postponed*.
3. Add the registration link if there is one. The **Register** button only appears while the event is upcoming or live.
4. Numbers go under **Figures**. Pick the right **kind**:
   - *Target*: announced before the event ("600+ participants expected")
   - *Registered*: sign-ups or RSVPs
   - *Actual*: counted after the event, with a source
5. Use the **Preview** (Presentation) tab to check it before you **Publish**.

### Add a Dexterix edition
**Dexterix editions** → **+ Create**. Keep **Participants — ACTUAL** and **Participants — TARGET** separate. Never copy a target into the actual field. Tick **Post-event data available** once results are published somewhere you can link to. Link the edition to its **Event** so the two pages point at each other.

### Add a member / archive a member
1. **People** → **+ Create** person. Add their name, role, domain, batch and links. Tick **Consent** only after they've agreed to be listed. Without it they won't appear.
2. **People → Team years** → open the current year → **Members** → add the person with their role and group (lead, core, domain lead, member, faculty).
3. To **archive** someone, untick **Current member**. They stay on their year's page under *Alumni & past teams*. Never delete past members.
4. New academic year: create a new **Team year**, tick **Current**, and untick **Current** on last year's.

### Add a project
**Projects** → **+ Create**. Be honest with **Status**: *Archived* is fine and expected for old repos. Add `owner/name` in **Repo full name** (e.g. `technojam/Dexterix-5.0`) and the site will show the last commit date from GitHub automatically. Tick **Featured** to put it on the homepage.

### Publish a gallery
**Galleries** → **+ Create**, upload photos and write **Alt text** for each one (describe what's in the photo). Tick **Approved** only once the people pictured are OK with it. Link it from the event's **Gallery** field.

### Update sponsors / partners
**Sponsors** or **Partners** → **+ Create**, then reference sponsors from the event or Dexterix edition. Logos need alt text too.

### Feature an announcement
**Announcements** → **+ Create**. Set **Active from / until** so it disappears on its own. It shows at the top of the homepage's *Now at TechnoJam* strip. Use sparingly.

### Check what still needs a source
**Needs verification** (bottom of the Studio menu) lists everything marked *Pending*. Find the source, paste the URL, set *Verified*, publish.

### Collaboration inquiries
Messages from the **Collaborate** form land in **Collaboration inquiries** (read-only). Reply by email.
