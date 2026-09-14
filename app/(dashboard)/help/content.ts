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
    description: "Login, install sa phone, at basics",
    icon: "Rocket",
    roles: ["super_admin", "teacher", "student"],
    sections: [
      {
        heading: "Paano Mag-login",
        body: `1. Buksan ang app link: \`https://quiz-application-for-students.vercel.app\`
2. I-enter ang **email** at **password** na binigay ng admin o teacher
3. Tap **"Sign In"**

**Note:** Walang "Sign Up" button. Ang account mo ay ginawa ng admin o teacher. Kung wala kang account, kontakin sila.`,
      },
      {
        heading: "Paano Mag-install sa Phone",
        body: `**Android (Chrome):**
1. Buksan ang app sa Chrome
2. Tap menu (⋮) sa taas
3. Tap **"Install app"** o **"Add to Home screen"**
4. Tap **"Install"**

**iPhone (Safari):**
1. Buksan ang app sa Safari (dapat Safari)
2. Tap Share button (⎋) sa ilalim
3. Scroll down → **"Add to Home Screen"**
4. Tap **"Add"**

**Bakit mag-install:**
- Mabilis mag-open
- Fullscreen mode (walang browser controls)
- Mas secure sa quiz-taking`,
      },
      {
        heading: "Navigation",
        body: `- 🏠 **Home** — Dashboard at invitations
- 🚪 **Rooms** — Lahat ng rooms mo
- 📋 **Quiz** — Quiz listing
- 🎓 **Students** — (Teacher only) Manage students
- ⚙️ **Users** — (Admin only) Manage all users
- 👤 **Profile** — Account info, dark mode, logout, help`,
      },
      {
        heading: "Dark Mode",
        body: `1. Puntahan ang **Profile** page
2. Sa **Appearance** section, pumili:
   - **Light** — Light theme
   - **Dark** — Dark theme
   - **System** — Auto (sumusunod sa phone settings)`,
      },
      {
        heading: "Help Center",
        body: `Para sa lahat ng guides:
1. Puntahan ang **Profile** page
2. Hanapin ang **"Help"** section
3. Click **"Documentation"**

Makikita mo ang lahat ng guides base sa role mo.`,
      },
      {
        heading: "Common Issues",
        body: `**Hindi maka-login**
- I-check ang email spelling
- Password is case-sensitive
- Kung nalimutan, kontakin ang teacher mo (students) o super admin (teachers)

**Wala kang makitang room**
- I-accept ang invitation sa Home page
- Hintayin ang teacher mag-invite

**Hindi lumalabas ang app icon**
- iPhone: dapat **Safari** (hindi Chrome)
- Android: dapat **Chrome** (hindi Firefox)

**Nag-crash habang nag-take ng quiz**
- I-refresh ang browser (pull down)
- Naka-save ang progress mo
- Kung hindi pa rin, kontakin ang teacher`,
      },
    ],
  },

  // =====================================================
  // TEACHER GUIDE
  // =====================================================
  {
    slug: "teacher-guide",
    title: "Teacher Guide",
    description: "Rooms, quizzes, at students",
    icon: "GraduationCap",
    roles: ["teacher", "super_admin"],
    sections: [
      {
        heading: "Managing Students",
        body: `**Paano Gumawa ng Student (Manu-mano)**
1. Tap **"Students"** sa bottom nav
2. Sa "Create New User" form, i-fill:
   - **Full Name** — e.g. Juan Dela Cruz
   - **Email** — valid email
   - **Password** — minimum 6 characters
   - **Section** — e.g. Grade 8-A (optional but recommended)
3. Tap **"Create User"**

**Note:** Ang students na ginawa mo ay makikita rin ng ibang teachers sa kanilang "All Students" tab — kaya isang account lang per student, kahit 8 teachers siya.`,
      },
      {
        heading: "Bulk Import Students",
        body: `Para sa 20+ students, mas mabilis gamitin ang bulk import.

**Format (Excel/CSV):**
\`\`\`
full_name        | email                  | section
Juan Dela Cruz   | juan@school.com        | Grade 8-A
Maria Santos     | maria@school.com       | Grade 8-A
\`\`\`

**Paano:**
1. Puntahan **/students** page
2. Click **"Bulk Import"** (green button)
3. Download ang **CSV template**
4. Fill in sa Google Sheets o Excel
5. Save as **.csv** o **.xlsx**
6. Upload pabalik sa app
7. **Preview** ang list
8. Click **"Import"**
9. **Print** o i-copy ang credentials
10. Ibigay sa students

**Limits:**
- Max **100 students** per batch
- Auto-generated ang passwords (8 chars)
- I-print ang credentials at ibigay sa students`,
      },
      {
        heading: "Cross-Teacher Invite (High School)",
        body: `**Scenario:** Ikaw ay subject teacher (Filipino), pero ibang teacher (Science) ang gumawa ng students.

**Flow:**
1. Buksan ang room mo
2. Sa **"Invite Students"** panel, may 2 tabs:
   - **My Students** — sarili mong ginawa
   - **All Students** — lahat ng students sa system
3. Click **"All Students"** tab
4. Search by name, email, o section
5. Pumili ng students → **Invite**

**Note:** Ang students ay may badge na **"From other teacher"** para malaman mo kung kanino galing.

**Result:** Isang account lang per student kahit 8 subjects pa siya.`,
      },
      {
        heading: "Creating Rooms",
        body: `Ang **Room** ay parang section o class. Naglalaman ito ng:
- Listahan ng students
- Lahat ng quizzes para sa class

**Paano Gumawa:**
1. Tap **"Rooms"** → **"+ New Room"**
2. Fill in:
   - **Room Name** — e.g. Science 8-A
   - **Subject** — e.g. Science
   - **Description** — optional
3. Tap **"Create Room"**`,
      },
      {
        heading: "Creating Quizzes",
        body: `Ang **Quiz** ay nasa loob ng isang room. May 3 status:
- **Draft** — hindi visible sa students, pwedeng i-edit
- **Published** — visible, pwedeng mag-take
- **Closed** — hindi na pwedeng mag-take

**Paano Gumawa:**
1. Buksan ang room → **"+ New Quiz"**
2. Fill in:
   - **Quiz Title** — e.g. Chapter 1 Quiz
   - **Description** — optional
   - **Time Limit** — optional (minutes)
   - ✅ **Shuffle questions** — iba-ibang order per student
   - ✅ **Shuffle options** — iba-ibang A/B/C/D per student
3. Tap **"Create Quiz"**`,
      },
      {
        heading: "Adding Questions",
        body: `**Manu-mano:**
1. Sa quiz editor, fill in:
   - **Question text**
   - **Options A, B, C, D**
   - **Tap ang letter button** para i-mark ang correct answer (magiging green)
   - **Points** — default 1
2. Tap **"Add Question"**

**Bulk (Excel/CSV):**
1. Sa quiz, tap **"Import"** tab
2. Tap **"Download Template"**
3. Fill in sa Excel/Sheets
4. Save as .xlsx o .csv
5. Upload pabalik sa app`,
      },
      {
        heading: "Publishing a Quiz",
        body: `1. Verify na may at least 1 question
2. Sa quiz header, tap **"Publish"**
3. **Status:** Draft → Published
4. Ready na para mag-take ang students

**Para i-close:** Tap **"Close"** — hindi na makakapag-take ng bago`,
      },
      {
        heading: "Monitoring Results",
        body: `1. Buksan ang quiz → **"Attempts"** button
2. Makikita mo:
   - **Summary stats** — total, in-progress, submitted, terminated, average
   - **Listahan ng attempts** — may search, filter, sort
3. **Search box** — hanapin ang student
4. **Filter** — by status
5. **Export CSV** — download sa Excel
6. Click **"Show details"** — makita ang integrity events
7. **Override Score** — manual adjustment

**Bulk actions:**
- Select multiple attempts → **Bulk Terminate**
- **"Select X in-progress"** quick button`,
      },
      {
        heading: "Password Reset (Students)",
        body: `Kung nakalimutan ng student ang password:

1. Puntahan **/students** page
2. Hanapin ang student
3. Click **"Reset Password"** button (amber)
4. Pumili:
   - **Auto-generate** — secure random password
   - **Custom** — type your own
5. Click **"Reset Password"**
6. **Copy** ang password → ibigay sa student

**Note:** Hindi na gagana ang lumang password.`,
      },
      {
        heading: "Delete Student Account",
        body: `**7-day retention system:** Hindi tuluyang nabura agad.

**Paano:**
1. Sa **/students** page, click **"Delete"** (red)
2. Confirm ang delete
3. **Countdown starts:** 7 days

**During 7-day period:**
- Student **hindi na makaka-login**
- **Naka-save pa ang data** (attempts, quizzes)
- **Pwedeng i-restore** anytime

**After 7 days:**
- Permanent delete (once admin purges)

**Restore:**
1. Hanapin ang student sa **"Pending Deletion"** section
2. Click **"Restore"** → confirm
3. Student can login again`,
      },
      {
        heading: "Anti-Cheat Rules",
        body: `**Bawal sa students:**
- Mag-switch ng tab
- Mag-switch ng app
- Mag-minimize
- I-exit ang fullscreen
- Mag-copy / paste
- Mag-right-click
- Mag-back button

**3 violations = auto-terminate + score 0.**

**Violation types:**
- \`visibility_hidden\` — nag-switch ng tab
- \`blur\` — nawala ang focus
- \`fullscreen_exit\` — nag-exit ng fullscreen
- \`copy\` / \`paste\` — nag-copy/paste
- \`MAX_STRIKES_REACHED\` — 3rd violation`,
      },
    ],
  },

  // =====================================================
  // STUDENT GUIDE
  // =====================================================
  {
    slug: "student-guide",
    title: "Student Guide",
    description: "Taking quizzes at rules",
    icon: "BookOpen",
    roles: ["student"],
    sections: [
      {
        heading: "Joining a Room",
        body: `Ang teacher mo ang mag-a-invite sa'yo.

**Paano Mag-accept:**
1. Buksan ang **Home** page
2. Hanapin ang **"Room Invitations"**
3. Tap **"Accept"** para sumali, o **"Decline"**

Pag na-accept, lalabas ang room sa **Rooms** page.

**Note:** Kung may 8 subjects ka, lahat ng teachers mo ay makakapag-invite sa **isang account** mo. Hindi mo kailangan ng iba't-ibang accounts.`,
      },
      {
        heading: "Taking a Quiz",
        body: `**Bago mag-start:**
1. Rooms → open room
2. Tap quiz under "Available Quizzes"
3. Basahin ang warning card
4. Tap **"Start Quiz"**
5. Allow fullscreen

**Habang nag-take:**
- Tap ang sagot — may checkmark
- **Next →** para sa susunod
- **← Prev** para bumalik
- Number grid sa ibaba para mag-jump
- Tap **"Submit Quiz"** pag tapos

**Kung may timer:**
- May countdown sa taas
- Pag nag-0, auto-submit`,
      },
      {
        heading: "My Quiz History",
        body: `Tingnan lahat ng past quizzes mo:

1. Puntahan ang **Profile** page
2. Click **"Quiz History"** sa **"My Progress"** section
3. Makikita mo:
   - **Stats** — total quizzes taken, average score, best score, terminated count
   - **Listahan** ng lahat ng attempts
   - **Search** — hanapin ang quiz or room
   - **Filter** — by status
   - **Sort** — by recent, oldest, score

Click any attempt → makita ang detailed result.`,
      },
      {
        heading: "Anti-Cheat Rules",
        body: `**Bawal gawin:**
- ❌ Mag-switch ng tab
- ❌ Mag-switch ng app (WhatsApp, Messenger)
- ❌ I-minimize
- ❌ I-exit ang fullscreen
- ❌ Mag-copy / paste
- ❌ Mag-right-click

**Consequences:**
- 1st violation — warning
- 2nd violation — warning ulit
- 3rd violation — **auto-terminate, score 0**

**Tips:**
- ✅ I-install ang app
- ✅ I-DND ang phone
- ✅ I-close ang ibang apps
- ✅ I-inform ang pamilya`,
      },
      {
        heading: "Understanding Your Score",
        body: `| Score | Meaning |
|-------|---------|
| **60%+** | ✅ Passed |
| **< 60%** | 📝 Keep Practicing |
| **Terminated** | 🚫 0 score dahil sa violations |

Ang teacher mo ang mag-set ng passing threshold.`,
      },
      {
        heading: "FAQ",
        body: `**Pwede bang mag-retake?**
Hindi. One attempt lang per quiz.

**Makikita ba ng teacher kung nag-switch ako?**
Oo. Naka-log lahat ng violations.

**Bakit zero ang score ko?**
Either terminated (3 violations) o mali lahat ng sagot.

**Nakalimutan ko ang password ko, ano gagawin?**
Kontakin ang teacher mo. Pwede nilang i-reset ang password mo.

**Paano kung mali ang score?**
Kontakin ang teacher mo — pwede nilang i-override.`,
      },
    ],
  },

  // =====================================================
  // ADMIN GUIDE
  // =====================================================
  {
    slug: "admin-guide",
    title: "Admin Guide",
    description: "User management at system admin",
    icon: "Shield",
    roles: ["super_admin"],
    sections: [
      {
        heading: "Managing Users",
        body: `**Paano Gumawa ng Teacher:**
1. Tap **"Users"** sa bottom nav
2. Sa form:
   - **Full Name** — e.g. Maria Santos
   - **Email** — e.g. maria@school.com
   - **Password** — min 6 chars
   - **Role** — select **"Teacher"**
3. Tap **"Create User"**

**Para sa Student:** Same, pero **Role = Student**.

**Stats cards:**
- Admins count
- Teachers count
- Students count`,
      },
      {
        heading: "Roles & Permissions",
        body: `| Action | Admin | Teacher | Student |
|--------|:-----:|:-------:|:-------:|
| Manage all users | ✅ | ❌ | ❌ |
| Create teachers | ✅ | ❌ | ❌ |
| Create students | ✅ | ✅ (any) | ❌ |
| Create rooms | ✅ | ✅ (own) | ❌ |
| Create quizzes | ✅ | ✅ (own) | ❌ |
| Invite students | ✅ | ✅ (any) | ❌ |
| Take quizzes | ❌ | ❌ | ✅ |
| Reset passwords | ✅ | ✅ (own students) | ❌ |
| Delete accounts | ✅ | ✅ (own students) | ❌ |`,
      },
      {
        heading: "Password Reset",
        body: `**Para sa Teachers (kung nalimutan):**
1. Login as **super admin**
2. Puntahan **/admin/users**
3. Hanapin ang teacher
4. Click **"Reset Password"** (amber button)
5. Auto-generate o custom password
6. **Copy** at ibigay sa teacher (secure channel)

**Note:** Pwede ring i-reset ang students mula dito.

**Manual recovery via Supabase:**
Kung naka-lock out ka mismo:
1. Supabase dashboard → Authentication → Users
2. Hanapin ang email
3. **"..."** menu → **"Reset password"**`,
      },
      {
        heading: "Delete Users",
        body: `**7-day retention system:**

1. Sa **/admin/users**, hanapin ang user
2. Click **"Delete"** (red)
3. Confirm → countdown starts

**During 7 days:**
- User cannot login
- Data preserved
- Pwedeng i-restore

**After 7 days:**
- **Purge** — pwede i-trigger manually via admin action (future: cron job)

**Restore:**
- Hanapin sa **"Pending Deletion"** section
- Click **"Restore"**`,
      },
      {
        heading: "Security Notes",
        body: `- ⚠️ **Never** i-share ang admin credentials
- ⚠️ **Never** i-commit ang \`.env.local\` sa Git
- ✅ I-enable ang Row Level Security (naka-set na)
- ✅ I-review ang terminated attempts regularly
- ✅ I-backup ang database weekly
- ✅ I-setup ang **backup super admin account** as fallback`,
      },
    ],
  },

  // =====================================================
  // EXCEL IMPORT GUIDE
  // =====================================================
  {
    slug: "excel-import",
    title: "Excel Import Guide",
    description: "Bulk quiz at student import format",
    icon: "FileSpreadsheet",
    roles: ["teacher", "super_admin"],
    sections: [
      {
        heading: "Quiz Questions Import",
        body: `**Column Headers (Row 1):**

| Header | Required | Example |
|--------|:--------:|---------|
| \`question\` | ✅ | What is 2+2? |
| \`option_a\` | ✅ | 3 |
| \`option_b\` | ✅ | 4 |
| \`option_c\` | ⚪ | 5 |
| \`option_d\` | ⚪ | 6 |
| \`correct\` | ✅ | B |
| \`points\` | ⚪ | 1 |

**⚠️ Important:**
- **Case-sensitive** ang headers
- \`correct\` = letter lang (A, B, C, D)
- Pwedeng 2, 3, o 4 options`,
      },
      {
        heading: "Quiz Questions Example",
        body: `| question | option_a | option_b | option_c | option_d | correct | points |
|----------|----------|----------|----------|----------|---------|--------|
| What is 2+2? | 3 | 4 | 5 | 6 | B | 1 |
| Capital of France? | London | Berlin | Paris | Rome | C | 1 |
| The sun is a star. | True | False | | | A | 1 |`,
      },
      {
        heading: "Students Bulk Import",
        body: `**Column Headers (Row 1):**

| Header | Required | Example |
|--------|:--------:|---------|
| \`full_name\` | ✅ | Juan Dela Cruz |
| \`email\` | ✅ | juan@school.com |
| \`section\` | ⚪ | Grade 8-A |

**⚠️ Important:**
- Email ay dapat **unique** — hindi pwede duplicate
- Password ay **auto-generated** (8 chars)
- Max **100 students** per batch

**Paano:**
1. Puntahan **/students** page
2. Click **"Bulk Import"**
3. Download template
4. Fill in sa Excel/Sheets
5. Save as .xlsx o .csv
6. Upload pabalik sa app
7. **Print credentials** at ibigay sa students`,
      },
      {
        heading: "Students Bulk Example",
        body: `| full_name | email | section |
|-----------|-------|---------|
| Juan Dela Cruz | juan@school.com | Grade 8-A |
| Maria Santos | maria@school.com | Grade 8-A |
| Pedro Reyes | pedro@school.com | Grade 8-A |
| Ana Garcia | ana@school.com | Grade 8-B |`,
      },
      {
        heading: "Common Mistakes",
        body: `| ❌ Mali | ✅ Tama | Bakit |
|--------|--------|-------|
| \`Question\` | \`question\` | Case-sensitive |
| \`A. 3\` | \`3\` | Walang prefix |
| \`true\` sa correct | \`A\` | Letter lang |
| 5+ options | Max 4 | Hindi supported |
| \`Full Name\` | \`full_name\` | Exact header |
| Duplicate email | Unique emails | Import mag-fail |`,
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
