\# BUILD PROMPT: LOCAL-FIRST SOFTWARE ENGINEERING ROADMAP TRACKER



\## 1. Your role



Act as a senior full-stack engineer, mobile-first product designer, and UX specialist. Build a complete, polished, functional personal learning tracker that helps me follow my software engineering roadmap from \*\*20 October 2026 through December 2028\*\*, preparing me to apply for international software engineering internships and entry-level roles from 2028–2029.



Do not merely create a visual prototype. Implement a working application with persistent data, interactive controls, progress tracking, a complete roadmap, and data backup.



Follow the specifications below closely. Make sensible implementation decisions where necessary, but do not introduce unnecessary features or clutter.



\## 2. Product philosophy



The application should feel like a quiet, personal workspace rather than a gamified productivity platform.



Core principles:



\- Mobile-first and fully responsive.

\- Extremely clean, minimal, and low-clutter.

\- Local-first: all personal data remains on the device by default.

\- No login, accounts, cloud backend, or required internet connection.

\- Fast daily updates, ideally taking less than 30 seconds.

\- Clear separation between today's tasks, the long-term roadmap, and overall progress.

\- The entire roadmap must be usable immediately, not represented by placeholder content.

\- No fake progress, fake statistics, or randomly generated activities.

\- No excessive cards, gradients, animations, badges, or decorative illustrations.

\- Avoid making the user configure the app before they can begin.



\*\*The app's primary job is to answer three questions:\*\*



1\. What should I work on today?

2\. What have I completed, and what remains?

3\. Am I on track to become a competitive software engineer by 2029?



\## 3. Technical requirements



First inspect the existing repository and preserve its working setup where practical. If the repository is empty, use the following stack.



\- Frontend: React + TypeScript + Vite.

\- Styling: Tailwind CSS or clean CSS variables and reusable components.

\- Icons: Lucide.

\- Persistence: IndexedDB, preferably through Dexie.

\- Charts: lightweight SVG or a small chart library only where useful.

\- Testing: add tests for critical progress calculations, persistence, and data import/export.

\- PWA: installable on mobile, with an app manifest and service worker.

\- Hosting: optional static hosting; the core application must function without a server.



Do not introduce a backend, authentication service, database server, analytics SDK, or external AI API.



\### Local data and privacy



Persist the following locally:



\- Roadmap tasks and milestones.

\- Completion states and actual completion dates.

\- Daily study logs.

\- Study duration.

\- Notes and reflections.

\- Projects and project progress.

\- Weekly review records.

\- User preferences and schedule settings.



Requirements:



\- Data must survive app restarts and browser refreshes.

\- Provide JSON export and import.

\- Validate imported JSON before replacing any existing data.

\- Ask for confirmation before destructive resets or data replacement.

\- Include a backup reminder in Settings, not a disruptive popup.

\- Include a clear-all-data action behind an explicit confirmation.

\- Display a small “Stored on this device” label in Settings.

\- Never transmit personal data anywhere.



The roadmap should be seeded with versioned application data on first launch. Subsequent app updates must not reset the user's progress or overwrite their personal changes.



If IndexedDB is unavailable, show a clear error and explain the limitation rather than silently pretending data was saved.



\## 4. Design system



\### Visual direction



Use a minimal editorial design inspired by well-designed reading apps and focused productivity tools.



\*\*Default theme: light.\*\*



\- Page background: warm off-white, approximately `#FAFAF8`.

\- Primary text: near-black, approximately `#20211F`.

\- Secondary text: muted gray, approximately `#777872`.

\- Borders: subtle warm gray, approximately `#E7E7E1`.

\- Accent: restrained forest green, approximately `#426B55`.

\- Completed state: muted green.

\- Overdue state: muted red, used only when necessary.

\- Dark mode: optional, with a carefully designed equivalent palette.



Use CSS variables so colors can be changed globally.



\### Typography



\- Use Inter, system UI, or a comparable highly readable sans-serif.

\- Page titles: 24–28 px on mobile.

\- Section headings: 16–18 px.

\- Body text: 14–16 px.

\- Secondary metadata: 12–13 px.

\- Use font weight and spacing instead of multiple colors to establish hierarchy.



\### Spacing and layout



\- Mobile horizontal padding: 18–20 px.

\- Consistent spacing scale: 4, 8, 12, 16, 24, 32 px.

\- Cards: white or near-white backgrounds, subtle borders, 12–16 px corner radius.

\- Avoid heavy shadows.

\- Avoid nested cards.

\- Avoid showing more than three or four important information groups on one screen.

\- Use dividers, expandable sections, and progressive disclosure to manage complexity.

\- Maintain touch targets of at least 44 × 44 px.

\- Respect mobile safe areas.

\- Ensure readable contrast and visible keyboard focus.



\### Buttons and controls



Use three button styles:



1\. Primary: one restrained accent-colored action per major screen.

2\. Secondary: neutral outlined or low-emphasis button.

3\. Tertiary: text button or icon button for less frequent actions.



Use familiar controls. Do not use decorative controls that do nothing.



\### Avoid



\- Large hero illustrations.

\- Excessive progress rings.

\- Multiple competing accent colors.

\- Confetti, streak flames, XP points, coins, trophies, or leaderboard mechanics.

\- Constant motivational quotes.

\- Large empty dashboards.

\- A separate page for every small feature.

\- Unnecessary animations and loading skeletons for locally available data.



\## 5. Global navigation



Use a \*\*four-item bottom navigation bar on mobile\*\*.



1\. \*\*Today\*\* — home icon.

2\. \*\*Roadmap\*\* — map or route icon.

3\. \*\*Progress\*\* — chart icon.

4\. \*\*Journal\*\* — notebook icon.



The active tab should have a subtle accent indicator and a clear label.



Place a small hamburger icon in the top-right corner of the main app header. It opens a simple drawer containing:



\- Projects

\- Resources

\- Weekly review

\- Settings

\- Data backup and restore



Do not add these destinations to the bottom navigation.



On desktop, use a narrow left sidebar with the same four main navigation destinations and a compact secondary menu. Keep the main content centered with a maximum width of approximately 960 px.



Use a consistent header across primary pages:



\- Left: page title.

\- Right: hamburger menu or one relevant contextual action.



Avoid displaying the logo, page title, date, multiple icons, and several buttons simultaneously.



\## 6. Screen 1: Today



\*\*This is the default landing screen and the most important screen in the application.\*\*



The user should immediately understand what to do next.



\### Header



Display:



\- “Today”

\- Current local date, for example, “Tuesday, 20 October”

\- Hamburger menu



Do not display a greeting, quote, or large decorative banner.



\### Section A: Daily focus



Display one small section near the top:



\*\*Daily focus\*\*



“Build the foundations. Start with Java.”



The content should be editable by the user. If a roadmap task is scheduled for today, derive the focus from that task. Otherwise, use the current phase's next incomplete task.



\### Section B: Today's tasks



Display the day's scheduled or selected tasks as a short checklist.



Each task row contains:



\- Checkbox.

\- Task title.

\- Small estimated duration, if available.

\- Optional expand/collapse control for the task description.



For example:



\- \[ ] Verify Java JDK and IDE setup — 20 min

\- \[ ] Complete variables and data types exercises — 45 min

\- \[ ] Practise loops and conditionals — 45 min



These are illustrative examples. Populate the actual initial task list from the roadmap and its first-week checklist.



Interactions:



\- Tapping the checkbox marks the task complete.

\- Completion is saved immediately.

\- Completed tasks move below incomplete tasks or remain in place with a subtle strike-through.

\- Tapping the task title opens its details.

\- A simple “+ Add task” action allows custom tasks.

\- Users can select an existing roadmap task as a task for today.



Do not make every roadmap task appear on Today. Only show selected, scheduled, overdue, or currently relevant tasks.



\### Section C: Today's study time



Display a compact study-time control:



\- Total time logged today, e.g. “1h 20m”.

\- “Log session” button.

\- Optional quick-duration choices: 15, 30, 45, and 60 minutes.



When logging a session, allow the user to select:



\- Duration.

\- Category: Learning, DSA, Project, CS fundamentals, or Career.

\- Optional associated roadmap task.

\- Optional short note.



Allow manual entry of duration. Do not require a timer to be running for a session to be logged.



If a timer is implemented, it must continue correctly across navigation and app restarts, with elapsed time calculated from stored timestamps rather than an in-memory interval alone.



\### Section D: Next milestone



Show only one upcoming milestone:



\- Milestone title.

\- Target date.

\- A short progress indicator.

\- Link to open it in Roadmap.



\### Section E: End-of-day check-in



Keep this collapsed by default. When expanded, show:



\- “What did you work on?”

\- “What blocked you?”

\- “What will you do next?”



These are optional short text fields. Save them as the daily reflection.



\### Empty and completed states



If no tasks are scheduled, display a simple message and an “Choose a roadmap task” action.



If all tasks are completed, display a calm “Today's tasks are complete” message. Do not show confetti or a full-screen celebration.



\## 7. Screen 2: Roadmap



This screen contains the complete learning plan from October 2026 through December 2028.



\### Default view



Show:



\- “Roadmap”

\- Current phase and date range.

\- Overall roadmap completion.

\- A vertically stacked list of phases.



Each phase row contains:



\- Phase number and title.

\- Date range.

\- Short one-line objective.

\- Progress percentage or completed/total count.

\- Expand/collapse control.



Keep phases collapsed by default except for the current phase.



\### Phase detail



When a phase is expanded, show:



\- Phase objective.

\- Key topics.

\- Milestones.

\- Tasks in a checklist.

\- Recommended resources.

\- Completion requirements.



Each task should support:



\- Title.

\- Description.

\- Optional estimated duration.

\- Optional target date.

\- Priority: normal or important.

\- Status: not started, in progress, completed, or skipped.

\- Completion date.

\- Notes.

\- Associated milestone and project, if applicable.



Allow users to mark tasks complete, edit target dates, add notes, and reschedule incomplete tasks.



Do not automatically mark tasks complete based on time or a passed deadline.



\### Filters



Place filters behind a small filter icon or expandable row:



\- All phases.

\- Current phase.

\- Incomplete.

\- Completed.

\- Overdue.



Default to the current phase, with an obvious way to view the entire roadmap.



\### Milestone detail



Milestones must have measurable completion criteria, not just a title.



For example:



\*\*Milestone: First deployed backend API\*\*



Completion criteria:



\- REST API built with Spring Boot.

\- PostgreSQL database integrated.

\- Authentication and per-user authorization implemented.

\- Automated tests written.

\- Application deployed.

\- README includes setup instructions and API documentation.



A milestone can be marked complete only by the user. Its completion state and date must persist.



\### Roadmap phases and tasks



Seed the following complete roadmap.



\#### Phase 1: Programming foundations



Dates: 20 October–31 December 2026.



Objective: Become comfortable writing, debugging, testing, and explaining Java programs independently.



Topics:



\- Java installation, JDK, IDE, Git, and GitHub.

\- Variables, types, operators, input/output.

\- Conditionals, loops, methods, arrays, and strings.

\- Classes, objects, encapsulation, and basic OOP.

\- Collections, exceptions, and file handling.

\- Basic unit testing with JUnit.

\- Command-line applications.



Initial project: a command-line expense tracker with adding, listing, and totaling expenses; input validation; file persistence; and tests.



Initial seven-day checklist:



1\. Verify JDK, IntelliJ IDEA, Git, and GitHub; create a `java-foundations` repository.

2\. Practise variables, input/output, conditionals, and loops with five exercises.

3\. Practise methods, arrays, and strings with five exercises.

4\. Learn classes, objects, and encapsulation; model an expense record.

5\. Build a basic command-line expense tracker.

6\. Add validation, error handling, file persistence, and tests.

7\. Review the code, write a README, publish the project, and plan the following week.



End-of-phase criteria:



\- Can independently write and debug small Java programs.

\- Understands basic OOP and collections.

\- Uses Git commits and GitHub.

\- Has one working, documented project.



\#### Phase 2: Data structures and algorithms



Dates: January–March 2027.



Topics:



\- Big-O notation.

\- Arrays and strings.

\- Hash maps and sets.

\- Two pointers and sliding windows.

\- Linked lists.

\- Stacks and queues.

\- Sorting and binary search.

\- Recursion and backtracking.

\- Trees, heaps, BFS, and DFS.



Target: approximately 40–60 well-understood algorithm problems by the end of March.



Track each problem with:



\- Problem name and link.

\- Topic.

\- Difficulty.

\- Date attempted.

\- Status: attempted, solved independently, solved with help, or needs revision.

\- Time and space complexity.

\- Short explanation of the solution.

\- Next review date.



A problem solved with assistance must not count as independently mastered.



End-of-phase criteria:



\- Understands fundamental data structures and algorithms.

\- Can explain time and space complexity.

\- Has a revision list of problems that initially caused difficulty.



\#### Phase 3: Backend engineering



Dates: April–June 2027.



Topics:



\- HTTP, REST, JSON, and status codes.

\- SQL and PostgreSQL.

\- Relational schema design.

\- Joins, indexes, transactions, and constraints.

\- Spring Boot.

\- API validation and error handling.

\- Authentication and authorization.

\- JPA or equivalent database access.

\- Automated unit and integration tests.



Project 1: a deployed study/task management API.



Required features:



\- User authentication.

\- Per-user authorization.

\- Persistent PostgreSQL storage.

\- CRUD operations.

\- Pagination and filtering.

\- Input validation.

\- Tests.

\- API documentation.

\- Deployment and setup instructions.



End-of-phase criteria:



\- Can build and explain a complete backend API.

\- Understands basic relational database design.

\- Can test an API and troubleshoot common failures.



\#### Phase 4: Production practices and portfolio project



Dates: July–September 2027.



Topics:



\- Linux and command-line workflows.

\- Docker and containerization.

\- Environment variables and secret management.

\- CI/CD with GitHub Actions.

\- Logging and debugging.

\- Secure API practices.

\- Testing strategies.

\- Deployment and basic monitoring.



Project 2: a drone lap-timing and event management application, connecting the user's interest in drones with backend engineering.



Required features:



\- Events and participants.

\- User roles and permissions.

\- Lap-time records.

\- Leaderboards.

\- Data export.

\- Persistent database.

\- Automated tests.

\- CI workflow.

\- Deployed application.

\- Clear README with architecture and setup instructions.



End-of-phase criteria:



\- Can run the application locally and in a container.

\- Can explain the deployment pipeline.

\- Has a polished, publicly viewable portfolio project.



\#### Phase 5: Computer science fundamentals and collaboration



Dates: October–December 2027.



Topics:



\- Operating systems.

\- Processes and threads.

\- Concurrency, race conditions, and deadlocks.

\- Memory and basic computer architecture.

\- Networking fundamentals.

\- Database performance, indexing, query plans, and transactions.

\- Git branching, pull requests, code reviews, and documentation.



Activities:



\- Contribute meaningfully to an open-source project, or work on a team project.

\- Practise reviewing and improving other people's code.

\- Improve existing projects based on feedback.

\- Audit the portfolio.



Portfolio target:



\- One small, polished project.

\- One complete backend API.

\- One larger deployed application.



End-of-phase criteria:



\- Can explain fundamental CS concepts clearly.

\- Has evidence of collaborative engineering or meaningful external contributions.



\#### Phase 6: Interview foundations and applications



Dates: January–March 2028.



Topics:



\- More advanced data structures and algorithms.

\- Trees, graphs, dynamic programming, and common problem-solving patterns.

\- Basic system design.

\- Caching, queues, load balancing, replication, consistency, and reliability.

\- Resume and portfolio preparation.

\- Interview communication.



Activities:



\- Build a concise technical resume.

\- Review GitHub repositories and project READMEs.

\- Prepare explanations of project architecture and trade-offs.

\- Research internships, university research opportunities, and entry-level roles.

\- Verify each role's eligibility for candidates studying or residing in Nepal.



Target: approximately 80–120 well-understood algorithm problems cumulatively by the end of March 2028, adjusted to actual progress.



\#### Phase 7: Real engineering experience



Dates: April–June 2028.



Primary objective: obtain real engineering experience.



Priorities:



1\. Software engineering internship.

2\. Research or university engineering work involving software.

3\. Meaningful open-source contribution.

4\. Part-time development work.

5\. A substantial team or client project.



Activities:



\- Apply consistently to eligible opportunities.

\- Practise coding interviews.

\- Ask for project feedback and code reviews.

\- Improve weak areas based on actual interview or application results.



The app must track applications and outcomes without assuming that a particular opportunity will be obtained.



\#### Phase 8: Interview preparation



Dates: July–September 2028.



Topics:



\- Timed coding practice.

\- Algorithm patterns and revision.

\- Mock interviews.

\- System design fundamentals.

\- Behavioral questions.

\- Debugging and testing under time pressure.

\- Project walkthroughs.



Targets:



\- Two to four timed coding problems each week.

\- One mock interview each week.

\- One system-design practice session every one or two weeks.



These targets should be editable.



End-of-phase criteria:



\- Can solve unfamiliar coding problems while explaining the reasoning.

\- Can discuss projects, trade-offs, debugging, and collaboration.

\- Has a list of weak topics with scheduled revision.



\#### Phase 9: Applications and transition to work



Dates: October–December 2028.



Activities:



\- Apply to eligible new-graduate, junior, and internship positions as appropriate.

\- Research international companies and location/visa eligibility.

\- Track applications, assessments, interviews, and outcomes.

\- Seek referrals where appropriate.

\- Continue coding and system-design practice.

\- Prepare for technical interviews and offer evaluation.



Applications should begin earlier when relevant hiring cycles open. Do not assume December is the first month of applications or that an offer by January 2029 is guaranteed.



Track each application with:



\- Company.

\- Role.

\- Job URL.

\- Location and eligibility notes.

\- Application date.

\- Current status.

\- Next action and date.

\- Interview notes.

\- Outcome.



End-of-roadmap objective: become competitive for international software engineering opportunities by early 2029. This is a target, not a guarantee of employment or salary.



\## 8. Weekly study schedule



The default study target is \*\*17 hours per week outside university coursework\*\*.



Seed the following editable weekly plan:



| Category | Hours per week |

|---|---:|

| Projects and practical implementation | 7 |

| Data structures and algorithms | 4 |

| Learning concepts and tutorials | 3 |

| CS fundamentals and revision | 2 |

| Communication and career preparation | 1 |

| Total | 17 |



Allow users to change these targets in Settings.



Do not assume that every day has equal availability. Let the user schedule tasks on particular days and adjust the weekly plan around university exams.



The app should distinguish between:



\- Planned study time.

\- Actual logged time.

\- Weekly target.

\- Completed learning tasks.



Study duration alone must not count as roadmap completion.



\## 9. Screen 3: Progress



This screen answers: “How am I progressing over time?”



Keep it compact. Do not turn it into a wall of charts.



\### Section A: Overall progress



Display:



\- Overall roadmap completion.

\- Current phase.

\- Completed milestones.

\- Total study hours logged.

\- Total independently mastered algorithm problems.



Use simple horizontal progress bars and concise numbers.



Calculate roadmap completion from completed eligible tasks or milestones using a documented, consistent formula. Do not include custom journal entries or study minutes as completed roadmap tasks.



\### Section B: Weekly activity



Show the last eight weeks as a simple bar chart of actual study hours.



Display:



\- Weekly target.

\- Actual hours.

\- Difference from target.



Allow tapping a week to see its category breakdown.



Do not penalize the user with red warnings when a weekly target is missed.



\### Section C: Learning categories



Show compact progress summaries for:



\- Java and programming.

\- DSA.

\- Backend development.

\- CS fundamentals.

\- Projects.

\- Career preparation.



Each category should show completed tasks versus total tasks, plus time logged where relevant.



\### Section D: Milestones



List completed and upcoming milestones, with dates.



\### Section E: Consistency



Display days studied in the current week and a simple recent activity history.



Avoid aggressive streak mechanics. Missing a day must not reset or erase prior progress.



\### Progress calculation rules



\- Completed tasks count as completed regardless of when they were finished.

\- Overdue tasks remain incomplete until the user acts on them.

\- Rescheduling must not erase the task's history.

\- Imported or restored data must preserve timestamps.

\- Progress must update immediately after an action.

\- Never invent missing activity or fill in past study sessions automatically.



\## 10. Screen 4: Journal



The Journal is for brief daily reflections and weekly reviews, not long-form journaling.



\### Default view



Display a clean chronological list of dates.



Each entry shows:



\- Date.

\- Total logged study time.

\- One-line reflection preview.

\- Number of tasks completed.



Tap an entry to open or edit it.



\### Daily entry



Fields:



\- What I worked on.

\- What I learned.

\- What blocked me.

\- What I will do next.



All fields are optional.



Automatically associate the entry with the correct local date. Save drafts without requiring a separate Save button when practical, while displaying a subtle saved state.



\### Weekly review



Provide a weekly review template containing:



\- What went well?

\- What did I struggle with?

\- What did I finish?

\- What remains incomplete?

\- What is next week's most important outcome?

\- What adjustment should I make to my schedule?



Pre-fill factual summaries from logged activity and task completion. Do not generate invented interpretations.



Allow the user to save a weekly review and reopen it later.



\## 11. Secondary screen: Projects



Accessible through the hamburger menu.



Keep the project list simple, with one row per project.



Seed the following projects:



1\. Java command-line expense tracker.

2\. Study/task management backend API.

3\. Drone lap-timing and event management application.

4\. Optional collaborative or open-source project.



Each project has:



\- Name.

\- Description.

\- Status: planned, in progress, paused, or complete.

\- Start and target dates.

\- Linked roadmap phase.

\- Milestones.

\- Checklist of features.

\- Repository URL.

\- Live deployment URL.

\- Notes and lessons learned.



Project detail page:



\- Short description.

\- Current status.

\- Progress bar based on explicitly completed project tasks.

\- Expandable feature checklist.

\- Links to GitHub and deployment.

\- Notes.



Do not count a project as complete merely because a repository URL has been entered.



\## 12. Secondary screen: Resources



Accessible through the hamburger menu.



Organize resources by topic and link to these official or established learning resources:



\### Java



https://dev.java/learn/



\### Spring Boot



https://spring.io/guides



\### SQL practice



https://sqlbolt.com/



\### Git



https://git-scm.com/book/en/v2



\### Backend development roadmap



https://roadmap.sh/backend



\### Data structures and algorithms



https://neetcode.io/roadmap



\### Technical interview preparation



https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing.html



\### GitHub Student Developer Pack



https://education.github.com/pack



Each resource entry should contain:



\- Title.

\- Topic.

\- One-sentence description.

\- External link.

\- Optional user status: not started, in progress, or completed.

\- Optional notes.



Open links externally. Clearly indicate when a link requires an internet connection.



Do not embed videos or external websites inside the app. Do not require the user to complete every resource before progressing.



\## 13. Secondary screen: Settings



Accessible through the hamburger menu.



Use simple grouped settings with dividers.



\### Appearance



\- Light mode.

\- Dark mode.

\- System theme.



\### Study schedule



\- Weekly target hours.

\- Weekly category targets.

\- Preferred study days.

\- Optional daily reminder preference.



Do not implement push notifications by default. If reminders are implemented, make them opt-in and explain the platform requirements.



\### Roadmap settings



\- Change task target dates.

\- Pause or resume a phase.

\- Adjust study targets.

\- Show skipped tasks separately.

\- Restore default roadmap structure without deleting completed history.



\### Data management



\- Export all data to JSON.

\- Import JSON backup.

\- Download a CSV of study sessions if practical.

\- Reset all personal progress, with confirmation.

\- Show local storage status.



\### About



\- App version.

\- Roadmap date range.

\- Privacy note: “Your progress stays on this device unless you export it.”



\## 14. Hamburger drawer behavior



The hamburger menu opens a narrow side drawer on desktop and a bottom sheet or full-height drawer on mobile.



Include:



\- Projects.

\- Resources.

\- Weekly review.

\- Settings.



At the bottom, display a small “Local-first · No account required” label.



Close the drawer when:



\- A destination is selected.

\- The user taps outside it.

\- The user presses Escape on desktop.



Do not create an additional navigation bar within the drawer.



\## 15. Data model



Create a clean, typed data model. A suggested structure is below; adjust it if a better implementation is justified.



\### RoadmapPhase



\- `id`

\- `title`

\- `startDate`

\- `endDate`

\- `objective`

\- `topics`

\- `taskIds`

\- `milestoneIds`

\- `order`



\### RoadmapTask



\- `id`

\- `phaseId`

\- `title`

\- `description`

\- `category`

\- `estimatedMinutes`

\- `targetDate`

\- `status`

\- `priority`

\- `completedAt`

\- `notes`

\- `resourceIds`

\- `projectId`

\- `createdAt`

\- `updatedAt`



\### Milestone



\- `id`

\- `phaseId`

\- `title`

\- `description`

\- `completionCriteria`

\- `targetDate`

\- `completedAt`

\- `status`



\### StudySession



\- `id`

\- `date`

\- `durationMinutes`

\- `category`

\- `taskId`

\- `note`

\- `createdAt`



\### DailyReflection



\- `id`

\- `date`

\- `workedOn`

\- `learned`

\- `blockers`

\- `nextSteps`

\- `updatedAt`



\### WeeklyReview



\- `id`

\- `weekStartDate`

\- `wentWell`

\- `difficulties`

\- `completedWork`

\- `unfinishedWork`

\- `nextWeekPriority`

\- `scheduleAdjustment`

\- `updatedAt`



\### Project



\- `id`

\- `name`

\- `description`

\- `status`

\- `startDate`

\- `targetDate`

\- `repositoryUrl`

\- `deploymentUrl`

\- `notes`

\- `phaseId`

\- `taskIds`



\### AlgorithmProblem



\- `id`

\- `title`

\- `url`

\- `topic`

\- `difficulty`

\- `status`

\- `attemptedAt`

\- `solvedAt`

\- `complexity`

\- `solutionNotes`

\- `nextReviewDate`



\### Application



\- `id`

\- `company`

\- `role`

\- `url`

\- `location`

\- `eligibilityNotes`

\- `appliedAt`

\- `status`

\- `nextAction`

\- `nextActionDate`

\- `interviewNotes`

\- `outcome`



\### AppSettings



\- `theme`

\- `weeklyTargetHours`

\- `categoryTargets`

\- `preferredStudyDays`

\- `remindersEnabled`

\- `roadmapVersion`



Use stable IDs. Store timestamps consistently, and use local calendar dates for daily summaries so that time-zone changes do not move sessions into the wrong day.



Ensure the data model supports future schema migrations without losing user data.



\## 16. Interaction and usability requirements



\- Every visible button must perform a real action.

\- Every checkbox must persist its state.

\- Every navigation item must open the correct screen.

\- All forms must validate input and display useful errors.

\- Use accessible labels for icon-only controls.

\- Support keyboard navigation and screen readers.

\- Use confirmation dialogs for destructive actions.

\- Provide useful empty states.

\- Avoid unnecessary modal dialogs; prefer inline editing and small sheets.

\- Keep the number of clicks low for common actions.

\- Support small mobile screens without horizontal scrolling.

\- Do not use hover-only interactions for important controls.

\- Preserve scroll position when returning to a long roadmap list, where practical.

\- Provide an undo option for accidental task completion or deletion when feasible.



\## 17. Offline and PWA behavior



The application should remain useful offline after the initial installation or first load.



Implement:



\- PWA manifest.

\- App icons.

\- Service-worker caching of the app shell and static assets.

\- Offline fallback behavior.

\- Local database persistence.

\- Clear feedback when a resource link requires the internet.



Do not cache external websites as if they were part of the app.



Make sure app updates do not accidentally erase local data. If a new version introduces a database schema change, migrate it safely.



\## 18. Testing and acceptance criteria



The app is not complete until all of the following work.



\### Navigation



\- All four bottom tabs work.

\- Hamburger drawer works on mobile and desktop.

\- Secondary screens are accessible.

\- Active navigation state is correct.



\### Progress tracking



\- Completing a task updates progress immediately.

\- Reloading the app preserves task completion.

\- Completing a task does not accidentally complete its entire milestone.

\- Logging a study session updates daily and weekly totals.

\- Weekly charts use actual logged sessions.

\- Skipped tasks are not counted as completed.

\- Overdue tasks remain editable and can be rescheduled.

\- Changing a target date does not change completion history.



\### Local storage and backup



\- Data survives refreshes and browser restarts.

\- Export produces a valid JSON backup.

\- Import restores a valid backup correctly.

\- Invalid JSON is rejected with an understandable error.

\- Import replacement requires explicit confirmation.

\- Schema upgrades preserve existing progress.



\### Responsive design



Test at widths of approximately:



\- 320 px.

\- 375 px.

\- 430 px.

\- 768 px.

\- 1024 px.

\- 1440 px.



No clipped controls, unreadable text, accidental horizontal scrolling, or oversized cards.



\### Accessibility and reliability



\- Keyboard navigation works.

\- Focus states are visible.

\- Inputs have labels.

\- Buttons have appropriate accessible names.

\- Empty states and error states are handled.

\- No broken links within the application.

\- No console errors during normal use.



\## 19. Implementation sequence



Build in the following order. Keep the application runnable at each stage.



1\. Inspect the repository and establish the project structure.

2\. Implement the design system, app shell, responsive layout, and navigation.

3\. Implement the local database and persistence layer.

4\. Seed all nine roadmap phases, milestones, resources, and the initial seven-day checklist.

5\. Implement Today and task completion.

6\. Implement Roadmap, phase expansion, task editing, and milestones.

7\. Implement study logging and Progress calculations.

8\. Implement Journal and weekly reviews.

9\. Implement Projects, Resources, Settings, and applications tracking.

10\. Implement backup/restore, schema versioning, and CSV export if practical.

11\. Implement PWA/offline support.

12\. Add tests, run the production build, and fix all errors.

13\. Inspect the finished application at mobile and desktop widths. Refine spacing, typography, navigation, and clutter.



Do not stop after generating a plan or a set of mockups. Continue until the actual application is implemented.



If a feature is too large for one pass, prioritize a reliable, functional core and complete the remaining specified screens before adding optional features.



\## 20. Final design test



Before declaring the project complete, ask:



\- Can the user open the app and know what to do next within five seconds?

\- Can the user complete a task or log study time in a few taps?

\- Is the default screen calm and uncluttered?

\- Are secondary features hidden until needed?

\- Can the app work without an account or server?

\- Does the roadmap contain actual actionable tasks rather than vague topic headings?

\- Does progress represent real work rather than time spent with the app open?

\- Can the user back up and restore all personal data?

\- Does the app feel excellent on a phone rather than like a desktop website squeezed into a small screen?



If not, simplify and refine the interface.



\*\*Final instruction:\*\* Build a complete, usable application. Favor clarity, reliability, local privacy, and frictionless daily use over feature count. Do not add features that are not required by this specification unless they solve a clearly identified usability problem.



