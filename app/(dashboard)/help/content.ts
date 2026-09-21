export type HelpSection = {
  heading: string;
  body: string;
};

export type HelpArticle = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  roles: ("super_admin" | "teacher" | "student")[];
  sections: HelpSection[];
};

export const HELP_ARTICLES: HelpArticle[] = [
  // =====================================================
  // GETTING STARTED — All roles
  // =====================================================
  {
    slug: "getting-started",
    title: "Getting Started",
    description: "Login, install, and basics",
    icon: "Rocket",
    roles: ["super_admin", "teacher", "student"],
    sections: [
      {
        heading: "How to Login",
        body: `1. Open the app link: \`https://quiz-application-for-students.vercel.app\`
2. Enter your **email** and **password**
3. Tap **"Sign In"**

**Note:** There is no **Sign Up** button. Your account is created by an admin or teacher. If you don't have one, contact them.`,
      },
      {
        heading: "Install on Phone",
        body: `**Android (Chrome):**
1. Open the app in Chrome
2. Menu (⋮) → **"Install app"**
3. Tap **"Install"**

**iPhone (Safari):**
1. Open the app in Safari (must be Safari)
2. Tap Share (⎋) → **"Add to Home Screen"**
3. Tap **"Add"**

**Why install:**
- Opens fast, fullscreen mode
- More secure during quizzes
- Auto-updates`,
      },
      {
        heading: "Navigation",
        body: `- 🏠 **Home** — Dashboard, invitations
- 🚪 **Rooms** — Your rooms (teacher, student)
- 📋 **Quiz** — Quiz listing (teacher, student)
- 🎓 **Students** — Manage students (teacher)
- ⚙️ **Dashboard** — System overview (super admin)
- 👤 **Profile** — Account, dark mode, help, logout

The items you see depend on your role.`,
      },
      {
        heading: "Dark Mode",
        body: `1. Go to **Profile**
2. Under **Appearance**, choose:
   - **Light** — Light theme
   - **Dark** — Dark theme
   - **System** — Follows phone settings`,
      },
      {
        heading: "Help Center",
        body: `1. Go to **Profile**
2. Find the **"Help"** section
3. Tap **"Documentation"**

You'll only see guides that apply to your role.`,
      },
      {
        heading: "Common Issues",
        body: `**Can't log in**
- Check email spelling
- Passwords are case-sensitive
- Contact your admin (teachers) or teacher (students) to reset

**No rooms**
- Students: accept the invitation first
- Check the Home page under **Room Invitations**

**No app icon**
- iPhone: use Safari, not Chrome
- Android: use Chrome, not Firefox

**Quiz froze**
- Don't close the app
- Refresh the browser
- Your progress is saved`,
      },
    ],
  },

  // =====================================================
  // TEACHER GUIDE
  // =====================================================
  {
    slug: "teacher-guide",
    title: "Teacher Guide",
    description: "Students, rooms, quizzes, grading",
    icon: "GraduationCap",
    roles: ["teacher", "super_admin"],
    sections: [
      {
        heading: "Managing Students",
        body: `**Create manually:**
1. Tap **"Students"** in the bottom nav
2. Fill in: Full Name, Email, Password
3. Optionally add Grade Level and Section
4. Tap **"Create User"**

**Note:** Other teachers can still invite your students via the **"All Students"** tab in their rooms — one account works for every teacher.`,
      },
      {
        heading: "Bulk Import Students",
        body: `**Format (.csv or .xlsx):**
Columns: \`full_name\`, \`email\`, \`grade_level\`, \`section\`

**How:**
1. Go to **/students**
2. Tap **"Bulk Import"**
3. Download the template
4. Fill in Excel/Sheets
5. Upload back
6. Preview → Import
7. **Print credentials** and give to students

**Limits:**
- Max **100 students** per batch
- Passwords are auto-generated (8 characters)`,
      },
      {
        heading: "Cross-Teacher Invite",
        body: `If a student was created by another teacher, you can still invite them.

1. Open your room
2. Tap **"Invite Students"**
3. Choose the **"All Students"** tab
4. Search by name, email, or section
5. Select → **Invite**

Look for the **"From other teacher"** badge to know who created them.`,
      },
      {
        heading: "Student Photo Approval",
        body: `Students need **teacher approval** for their profile photos.

1. Go to **Profile** → **Student Photos**
2. Tap **"Review Pending Photos"**
3. For each photo: **Approve** or **Reject**

**Rejecting:** optionally enter a reason. The photo is deleted and the student can upload again.

Teachers and admins don't need approval — their photos are auto-approved.`,
      },
      {
        heading: "Creating Rooms",
        body: `A Room is like a class. It holds students and quizzes.

1. Tap **"Rooms"** → **"+ New Room"**
2. Fill in: Room Name, Subject, Description
3. Tap **"Create Room"**

**To edit:** tap the pencil icon next to the room name.

**To remove students:** select one or more on the room page and use **Remove** or **Bulk Remove**. Attempts are preserved.`,
      },
      {
        heading: "Creating Quizzes",
        body: `1. Open a room → **"+ New Quiz"**
2. Fill in: Title, Description, Time Limit (optional)
3. Optional: **Shuffle questions** and **Shuffle options**
   - Each student gets a different order
4. Tap **"Create Quiz"**

**Statuses:**
- **Draft** — not visible to students
- **Published** — students can take it
- **Closed** — no new attempts`,
      },
      {
        heading: "Adding Questions",
        body: `**Multiple Choice:**
1. In the quiz editor, choose **"Multiple Choice"**
2. Fill question text and options A–D
3. Tap the letter to mark the correct answer (turns green)
4. Set points (default 1)
5. Tap **"Add Question"**

**Essay:**
1. Choose **"Essay"**
2. Fill question text, points (usually higher)
3. Optional: **Min Words**, **Max Words**, **Rubric**
4. Tap **"Add Question"**

**Notes:**
- Essay questions are **manually graded**
- The rubric is shown to students and to you during grading
- You can mix both types in one quiz`,
      },
      {
        heading: "Importing from Excel",
        body: `1. In the quiz editor, tap **"Import"**
2. Download the template
3. Fill in Excel/Sheets
4. Save as .xlsx or .csv
5. Upload back to the app

The template includes both MCQ and Essay examples.

**See:** the Excel Import Guide for full column details.`,
      },
      {
        heading: "Publishing & Closing",
        body: `**Publish:**
- At least 1 question required
- Tap **"Publish"** in the quiz header

**Close:**
- Tap **"Close"** — no new attempts allowed
- Reopen anytime via **"Re-open"**`,
      },
      {
        heading: "Monitoring Results",
        body: `1. Open a quiz → tap **"Attempts"**
2. You'll see summary stats and the attempt list

**Search** by name/email. **Filter** by status. **Sort** by name, score, or date.

**Export CSV** — tap the button to download (or select specific attempts first).

**Expand an attempt** to see integrity events and timing.`,
      },
      {
        heading: "Grading Essays",
        body: `Attempts with essays show an **"Ungraded"** badge.

1. On the Attempts page, tap **"Grade Now"**
2. For each essay:
   - Enter **Points Awarded** (0 to max)
   - Optionally add per-answer **Feedback**
3. Add **Overall Feedback** (optional)
4. Tap **"Save Grade"**

Once saved:
- The badge becomes **"Graded"**
- The score is computed (MCQ + essay points)
- The student's result page updates

**Edit anytime:** tap **"View / Edit Grade"** on a graded attempt.`,
      },
      {
        heading: "Override & Terminate",
        body: `**Override a score:**
1. Expand the attempt
2. Enter the correct score in **"Override Score"**
3. Tap **"Save Score"**

**Force terminate:**
1. Expand an **In Progress** attempt
2. Tap **"Force Terminate"**
3. Confirm — score becomes 0, student cannot submit`,
      },
      {
        heading: "Bulk Actions",
        body: `**Bulk Terminate:**
1. Check the attempts you want to terminate
2. Tap **"Bulk Terminate"** in the sticky toolbar
3. Only in-progress attempts are terminated

**Quick select:**
- **"Select all"** — everything filtered
- **"Select X in-progress"** — in-progress only

**Bulk Export:** select attempts first, then tap **"Export (N)"**.`,
      },
      {
        heading: "Password Reset (Students)",
        body: `1. Go to **/students**
2. Find the student
3. Tap the **"Reset Password"** button (amber key)
4. Choose **Auto-generate** or **Custom**
5. Copy the password and give it to the student

The old password stops working immediately.`,
      },
      {
        heading: "Delete Student (7-Day Retention)",
        body: `Deletion is **not permanent** right away.

**To delete:**
1. On **/students**, tap **"Delete"** (red trash)
2. Confirm → 7-day countdown starts

**During 7 days:**
- Student can't log in
- Data is preserved
- You can **restore** anytime

**After 7 days:** the super admin purges permanently.

**To restore:**
1. Expand **"Pending Deletion"** on /students
2. Tap **"Restore"** on the student's card`,
      },
      {
        heading: "Anti-Cheat Rules",
        body: `Students are flagged for:
- Switching tabs or apps
- Minimizing
- Exiting fullscreen
- Copy/paste
- Right-click
- Browser back button

**3 violations = auto-terminate, score 0.**

**Violation types:**
- \`visibility_hidden\` — switched tab
- \`blur\` — lost focus
- \`fullscreen_exit\` — exited fullscreen
- \`copy\` / \`paste\`
- \`context_menu\` — right-clicked
- \`MAX_STRIKES_REACHED\` — 3rd strike`,
      },
    ],
  },

  // =====================================================
  // STUDENT GUIDE
  // =====================================================
  {
    slug: "student-guide",
    title: "Student Guide",
    description: "Taking quizzes and rules",
    icon: "BookOpen",
    roles: ["student"],
    sections: [
      {
        heading: "Joining a Room",
        body: `Your teacher invites you. You just need to accept.

1. Open the **Home** page
2. Find **"Room Invitations"**
3. Tap **"Accept"** or **"Decline"**

Once accepted, the room appears on your **Rooms** page.

**Note:** One account works for every teacher — even 8 subjects.`,
      },
      {
        heading: "Viewing Classmates",
        body: `On the room page, scroll to **"Classmates"**.

You'll see names, emails, and Grade/Section badges.

Use the **search box** (visible with more than 3 classmates) to find someone specific.`,
      },
      {
        heading: "Taking a Quiz",
        body: `**Before you start:**
1. On the room page, tap the quiz
2. Read the warning card
3. Tap **"Start Quiz"**
4. Allow fullscreen

**While taking:**
- Tap an answer → checkmark appears
- **Next →** / **← Prev** to move
- Number grid at the bottom to jump
- Tap **"Submit Quiz"** when done

**Timer:** if enabled, a countdown shows at the top. It pulses red under 1 minute and auto-submits at 0.`,
      },
      {
        heading: "Taking an Essay Quiz",
        body: `Some quizzes include essay questions.

**How they look:**
- A text box instead of choices
- A word counter
- Optional word limit and rubric

**Answering:**
- Type your answer
- Your answer auto-saves when you leave the box
- Watch the word counter (turns amber if below the minimum)
- Tap **"Next →"** when ready

**After submitting:** MCQ answers score instantly. Essay answers wait for your teacher. Your result page shows **"Pending Grading"** until then.`,
      },
      {
        heading: "Understanding Your Result",
        body: `**Pending Grading** (essay quizzes)
- Amber clock icon
- Your MCQ score so far
- Wait for your teacher to grade

**Passed / Keep Practicing**
- Score, percentage, submitted time
- 60%+ = Passed (default threshold)

**Terminated**
- 🚫 Exam Terminated
- Reason shown (e.g. \`max_strikes:visibility_hidden\`)
- Score: 0`,
      },
      {
        heading: "My Quiz History",
        body: `See all your past attempts.

1. Go to **Profile**
2. Under **My Progress**, tap **"Quiz History"**

**You'll see:**
- Stats: Quizzes Taken, Average Score, Best Score, Terminated
- All attempts with quiz name, room, status, and score

**Search, filter, and sort** to find specific attempts.

Tap any attempt to open the detailed result.`,
      },
      {
        heading: "Anti-Cheat Rules",
        body: `**Do NOT:**
- ❌ Switch tabs
- ❌ Switch apps (Messenger, etc.)
- ❌ Minimize the app
- ❌ Exit fullscreen
- ❌ Copy or paste
- ❌ Right-click
- ❌ Use the browser back button

**Consequences:**
- 1st violation — warning
- 2nd violation — warning
- 3rd violation — **auto-terminate, score 0**

**Tips:**
- ✅ Install the app
- ✅ Turn on Do Not Disturb
- ✅ Close other apps
- ✅ Tell your family you're taking an exam`,
      },
      {
        heading: "Profile & Settings",
        body: `**Edit your name:** tap **"Edit name"** under your profile.

**Upload photo:** tap **"Upload photo"**, crop, and apply. Requires **teacher approval** — you'll see ⏳ until approved.

**Change password:** tap **"Change Password"** under Security.

**Dark mode:** Profile → Appearance → Light / Dark / System.

**Log out:** scroll to the bottom of Profile and tap **"Log Out"**.`,
      },
      {
        heading: "Understanding Your Score",
        body: `| Score | Meaning |
|-------|---------|
| **60%+** | ✅ Passed |
| **< 60%** | 📝 Keep Practicing |
| **Terminated** | 🚫 0 due to violations |
| **Pending** | ⏳ Waiting for teacher |

Your teacher sets the passing threshold (60% is the default).`,
      },
      {
        heading: "FAQ",
        body: `**Can I retake a quiz?**
No. One attempt per quiz. Contact your teacher if you need a retake.

**Can my teacher see if I switched apps?**
Yes. All violations are logged.

**Why is my score zero?**
Either terminated (3 violations) or all answers were wrong. Check the result page.

**What if my score is wrong?**
Contact your teacher — they can override it.

**Can I see my past attempts?**
Yes. Go to **Profile → My Progress → Quiz History**.

**Why is my essay score not showing?**
Your teacher grades essays manually. You'll see **"Pending Grading"** until then. MCQ points are already counted.`,
      },
    ],
  },

  // =====================================================
  // ADMIN GUIDE
  // =====================================================
  {
    slug: "admin-guide",
    title: "Admin Guide",
    description: "Users and system management",
    icon: "Shield",
    roles: ["super_admin"],
    sections: [
      {
        heading: "Admin Dashboard",
        body: `When you log in, you land on the **Dashboard**.

**What you'll see:**
- **User stats** — Admins, Teachers, Students
- **Content stats** — Rooms, Quizzes, Attempts
- **Needs Attention** — Pending Deletions, Pending Photos
- **Recent Activity** — new users, published quizzes, violations
- **Quick Links** — jump to Manage Users

**Note:** The bottom nav shows **Dashboard**, not "Users". Reach user management from the Dashboard.`,
      },
      {
        heading: "Managing Users",
        body: `**Create a Teacher:**
1. Dashboard → **Manage Users** (or the Users stat card)
2. Fill in: Full Name, Email, Password, Role = Teacher
3. Tap **"Create User"**

**Create a Student:**
Same, but Role = Student. Optionally add Grade Level and Section.

**View all users:**
- Stats cards at the top
- Collapsible sections: Admins, Teachers, Students
- **Search** by name/email
- **Filter** by role`,
      },
      {
        heading: "Roles & Permissions",
        body: `| Action | Admin | Teacher | Student |
|--------|:-----:|:-------:|:-------:|
| Manage all users | ✅ | ❌ | ❌ |
| Create teachers | ✅ | ❌ | ❌ |
| Create students | ✅ | ✅ (own) | ❌ |
| Create rooms | ✅ | ✅ (own) | ❌ |
| Create quizzes | ✅ | ✅ (own) | ❌ |
| Take quizzes | ❌ | ❌ | ✅ |
| Override scores | ✅ | Own only | ❌ |
| Reset passwords | ✅ | Own students | ❌ |
| Purge deletions | ✅ | ❌ | ❌ |`,
      },
      {
        heading: "Password Reset",
        body: `**In-app (recommended):**
1. Go to **/admin/users**
2. Find the user
3. Tap **"Reset Password"** (amber key icon)
4. Auto-generate or custom
5. Copy and give to the user

**Manual via Supabase (emergency):**
1. Supabase dashboard → Authentication → Users
2. Find the email
3. **"..."** menu → **"Reset password"**`,
      },
      {
        heading: "Deleting Users",
        body: `**7-day retention system:**

1. On **/admin/users**, tap **"Delete"** on a user
2. Confirm → countdown starts

**During 7 days:**
- User can't log in
- Data is preserved
- Restorable anytime

**After 7 days:** you can **purge** the account permanently.

**Restore:** expand **"Pending Deletion"** and tap **"Restore"**.

**Purge:** run the purge action from /admin/users or /students. Only super admins can do this.`,
      },
      {
        heading: "Pending Photo Approvals",
        body: `Students need approval for profile photos.

1. Dashboard → **Pending Photo Approvals** flag
2. You'll land on **/admin/pending-photos**
3. For each card: **Approve** or **Reject**

As super admin, you can approve **any** student's photo (teachers can only approve their own students' photos).`,
      },
      {
        heading: "Auditing Data",
        body: `Log in to **Supabase → SQL Editor** for advanced queries.

**Common queries:**

\`\`\`sql
-- All students
select full_name, email, created_at
from profiles where role = 'student';

-- Pending deletions
select full_name, email, deletion_scheduled_for
from profiles where deletion_scheduled_for is not null;

-- Recent terminations
select p.full_name, q.title, a.termination_reason, a.submitted_at
from attempts a
join profiles p on p.id = a.student_id
join quizzes q on q.id = a.quiz_id
where a.status = 'terminated'
order by a.submitted_at desc;
\`\`\``,
      },
      {
        heading: "Security Notes",
        body: `- ⚠️ Never share your credentials
- ⚠️ Never commit \`.env.local\` to Git
- ✅ RLS is enabled — keep it that way
- ✅ Review terminated attempts regularly
- ✅ Back up the database weekly
- ✅ Set up a backup super admin account
- ✅ Purge expired deletions weekly
- ✅ Rotate admin passwords every school year`,
      },
    ],
  },

  // =====================================================
  // EXCEL IMPORT GUIDE
  // =====================================================
  {
    slug: "excel-import",
    title: "Excel Import Guide",
    description: "Bulk quiz and student import",
    icon: "FileSpreadsheet",
    roles: ["teacher", "super_admin"],
    sections: [
      {
        heading: "Quiz Import — MCQ",
        body: `**Columns:**
| Header | Required | Example |
|--------|:--------:|---------|
| \`question_type\` | ⚪ | multiple_choice |
| \`question\` | ✅ | What is 2+2? |
| \`option_a\` | ✅ | 3 |
| \`option_b\` | ✅ | 4 |
| \`option_c\` | ⚪ | 5 |
| \`option_d\` | ⚪ | 6 |
| \`correct\` | ✅ | B |
| \`points\` | ⚪ | 1 |

**Rules:**
- Headers are **case-sensitive**
- \`correct\` = single letter A / B / C / D
- 2 to 4 options (at least 2)`,
      },
      {
        heading: "Quiz Import — Essay",
        body: `**Columns:**
| Header | Required | Example |
|--------|:--------:|---------|
| \`question_type\` | ✅ | essay |
| \`question\` | ✅ | Explain photosynthesis. |
| \`points\` | ⚪ | 20 |
| \`word_limit_min\` | ⚪ | 50 |
| \`word_limit_max\` | ⚪ | 300 |
| \`rubric\` | ⚪ | Content: 10pts, Grammar: 5pts |

**Rules:**
- Leave \`option_a..d\` and \`correct\` blank
- Essay answers are **manually graded** by you
- Rubric is shown to students and used during grading

**Mix both types** in one file — just set \`question_type\` per row.`,
      },
      {
        heading: "Students Import",
        body: `**Columns:**
| Header | Required | Example |
|--------|:--------:|---------|
| \`full_name\` | ✅ | Juan Dela Cruz |
| \`email\` | ✅ | juan@school.com |
| \`grade_level\` | ⚪ | Grade 8 |
| \`section\` | ⚪ | A Hydrogen |

**Rules:**
- Emails must be **unique**
- Passwords are **auto-generated** (8 chars)
- Max **100 students** per batch
- \`grade_level\` and \`section\` are **separate columns**

**How:**
1. Go to **/students**
2. Tap **"Bulk Import"**
3. Download template
4. Fill in Excel/Sheets
5. Upload back
6. Print credentials for students`,
      },
      {
        heading: "Common Mistakes",
        body: `| ❌ Wrong | ✅ Correct | Why |
|----------|-----------|-----|
| \`Question\` | \`question\` | Case-sensitive |
| \`A. 3\` | \`3\` | No letter prefix |
| \`true\` in correct | \`A\` | Letter only |
| 5+ options | Max 4 | Not supported |
| \`MCQ\` in question_type | \`multiple_choice\` | Full value required |
| Grade + section combined | Two columns | Separate headers |
| Duplicate emails | Unique emails | Import fails |

**Tips:**
- Save as .xlsx or .csv
- Refresh the page after import if questions don't appear
- Check the quiz editor to verify imported rows`,
      },
    ],
  },
];

// Helper: get article by slug
export function getArticle(slug: string): HelpArticle | undefined {
  return HELP_ARTICLES.find((a) => a.slug === slug);
}

// Helper: get articles for a role
export function getArticlesForRole(
  role: "super_admin" | "teacher" | "student",
): HelpArticle[] {
  return HELP_ARTICLES.filter((a) => a.roles.includes(role));
}
