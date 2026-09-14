export type HelpSection = {
  heading: string;
  body: string; // Supports markdown-like syntax: **bold**, `code`, - bullets
};

export type HelpArticle = {
  slug: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  roles: ("super_admin" | "teacher" | "student")[];
  sections: HelpSection[];
};

export const HELP_ARTICLES: HelpArticle[] = [
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
- 👤 **Profile** — Account info, dark mode, logout`,
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
        heading: "Common Issues",
        body: `**Hindi maka-login**
- I-check ang email spelling
- Password is case-sensitive
- Kung nalimutan, kontakin ang admin/teacher

**Wala kang makitang room**
- I-accept ang invitation sa Home page
- Hintayin ang teacher mag-invite

**Hindi lumalabas ang app icon**
- iPhone: dapat **Safari** (hindi Chrome)
- Android: dapat **Chrome** (hindi Firefox)`,
      },
    ],
  },

  {
    slug: "teacher-guide",
    title: "Teacher Guide",
    description: "Rooms, quizzes, at students",
    icon: "GraduationCap",
    roles: ["teacher", "super_admin"],
    sections: [
      {
        heading: "Managing Students",
        body: `**Paano Gumawa ng Student**
1. Tap **"Students"** sa bottom nav
2. Sa "Create New User" form, i-fill:
   - **Full Name** — e.g. Juan Dela Cruz
   - **Email** — valid email
   - **Password** — minimum 6 characters
3. Tap **"Create User"**

**Note:** Makikita mo lang ang **iyong** students. Ang students ng ibang teachers ay hindi makikita.`,
      },
      {
        heading: "Creating Rooms",
        body: `Ang **Room** ay parang section o class. Naglalaman ito ng:
- Listahan ng students
- Lahat ng quizzes para sa class

**Paano Gumawa:**
1. Tap **"Rooms"** → **"+ New Room"**
2. Fill in:
   - **Room Name** — e.g. Math 101 - Section A
   - **Subject** — e.g. Mathematics
   - **Description** — optional
3. Tap **"Create Room"**`,
      },
      {
        heading: "Inviting Students",
        body: `1. Buksan ang room
2. Sa "Invite Students" panel:
   - **Search** ang pangalan ng student
   - **Tap** ang student para i-select
   - Pwedeng marami
3. Tap **"Invite Selected"**

**Anong mangyayari:**
- Makikita ng student ang invitation sa Home dashboard
- Kailangan nilang **i-accept** para makasali
- Sa room detail, makikita mo:
  - **Joined Students** — naka-accept na
  - **Pending Invitations** — hindi pa nag-a-accept`,
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

**Bulk actions:**
- Select multiple attempts → **Bulk Terminate**
- **"Select X in-progress"** quick button`,
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

Pag na-accept, lalabas ang room sa **Rooms** page.`,
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

**Paano kung mali ang score?**
Kontakin ang teacher mo — pwede nilang i-override.`,
      },
    ],
  },

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
| Create students | ✅ | ✅ (own) | ❌ |
| Create rooms | ✅ | ✅ (own) | ❌ |
| Create quizzes | ✅ | ✅ (own) | ❌ |
| Take quizzes | ❌ | ❌ | ✅ |`,
      },
      {
        heading: "Password Reset",
        body: `**Para sa ngayon, manual via Supabase dashboard:**

1. Login sa Supabase dashboard
2. Authentication → Users
3. Hanapin ang email
4. Tap **"..."** → **"Reset password"**
5. Set bagong password
6. Ibigay sa user

**Future:** Pwedeng i-add in-app reset flow later.`,
      },
      {
        heading: "Security Notes",
        body: `- ⚠️ **Never** i-share ang admin credentials
- ⚠️ **Never** i-commit ang \`.env.local\` sa Git
- ✅ I-enable ang Row Level Security (naka-set na)
- ✅ I-review ang terminated attempts regularly
- ✅ I-backup ang database weekly`,
      },
    ],
  },

  {
    slug: "excel-import",
    title: "Excel Import Guide",
    description: "Bulk quiz import format",
    icon: "FileSpreadsheet",
    roles: ["teacher", "super_admin"],
    sections: [
      {
        heading: "Required Format",
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
        heading: "Example",
        body: `| question | option_a | option_b | option_c | option_d | correct | points |
|----------|----------|----------|----------|----------|---------|--------|
| What is 2+2? | 3 | 4 | 5 | 6 | B | 1 |
| Capital of France? | London | Berlin | Paris | Rome | C | 1 |
| The sun is a star. | True | False | | | A | 1 |`,
      },
      {
        heading: "Common Mistakes",
        body: `| ❌ Mali | ✅ Tama | Bakit |
|--------|--------|-------|
| \`Question\` | \`question\` | Case-sensitive |
| \`A. 3\` | \`3\` | Walang prefix |
| \`true\` sa correct | \`A\` | Letter lang |
| 5+ options | Max 4 | Hindi supported |`,
      },
      {
        heading: "Paano Mag-upload",
        body: `1. Buksan ang quiz → **"Import"** tab
2. Tap **"Download Template"** (kung wala pang file)
3. Fill in sa Excel/Google Sheets
4. Save as \`.xlsx\` o \`.csv\`
5. Tap **file upload area** sa app
6. Select ang file → auto-import`,
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
