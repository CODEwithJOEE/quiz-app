# 🎓 Teacher Guide

Kompletong gabay para sa mga teachers.

---

## 1. First Time Setup

### Login

1. Buksan ang app
2. I-enter ang email at password na binigay ng **super admin** mo
3. Tap **"Sign In"**

### Recommended: Install sa Phone

See [Getting Started Guide](./getting-started.md#paano-mag-install-sa-phone)

---

## 2. Managing Students

Bago ka makagawa ng rooms at quizzes, kailangan mo munang gumawa ng **student accounts**.

### Paano Gumawa ng Student

1. Tap **"Students"** sa bottom nav (🎓 icon)
2. Sa "Create New User" form, i-fill:
   - **Full Name** — Buong pangalan (e.g., `Juan Dela Cruz`)
   - **Email** — Valid email (e.g., `juan.delacruz@school.com`)
   - **Password** — Minimum 6 characters. Ibigay ito sa student.
3. Tap **"Create User"**

**⚠️ Paalala:**

- Lalabas lang ang student sa **iyong list** — hindi makikita ng ibang teachers ang students mo
- Isulat ang password para maibigay sa student

### Paano Mag-view ng Students List

Sa `/students` page, makikita mo:

- **Total count** sa taas
- **Listahan** ng lahat ng students mo

---

## 3. Creating Rooms

Ang **Room** ay parang section o class. Naglalaman ito ng:

- Listahan ng students
- Lahat ng quizzes para sa class na ito

### Paano Gumawa ng Room

1. Tap **"Rooms"** sa bottom nav
2. Tap **"+ New Room"** button
3. Fill ang form:
   - **Room Name\*** — Halimbawa: `Math 101 - Section A`
   - **Subject** — Halimbawa: `Mathematics`
   - **Description** — Optional notes para sa students
4. Tap **"Create Room"**

### Paano Mag-invite ng Students

1. Buksan ang room (tap sa room name)
2. Hanapin ang **"Invite Students"** panel
3. **Search** mo ang pangalan ng student
4. **Tap ang student** para i-select (may checkmark)
5. Pwede kang pumili ng **marami**
6. Tap **"Invite Selected (N)"**

**Anong mangyayari:**

- Makikita ng student ang invitation sa Home dashboard nila
- Kailangan nilang **i-accept** para makasali
- Sa room detail page mo, makikita mo:
  - **Joined Students** — naka-accept
  - **Pending Invitations** — hindi pa nag-a-accept

### Paano I-delete ang Room

1. Buksan ang room
2. Scroll down sa pinakailalim
3. Tap **"Delete Room"**
4. Confirm

**⚠️ Warning:** Mabubura lahat ng quizzes at attempts sa room.

---

## 4. Creating Quizzes

Ang **Quiz** ay nasa loob ng isang room. May 3 statuses:

| Status        | Meaning                                         |
| ------------- | ----------------------------------------------- |
| **Draft**     | Hindi pa visible sa students; pwede pang i-edit |
| **Published** | Visible na sa students; pwede nang mag-take     |
| **Closed**    | Hindi na pwede mag-take ng bagong attempts      |

### Paano Gumawa ng Quiz

1. Buksan ang room
2. Tap **"+ New Quiz"** button
3. Fill ang form:
   - **Quiz Title\*** — Halimbawa: `Chapter 1 Quiz`
   - **Description** — Optional
   - **Time Limit (minutes)** — Optional. Kung may value, may countdown timer ang students. Blank = walang limit.
4. Tap **"Create Quiz"**

### Pag-add ng Questions — Manu-mano

Sa quiz editor, sa **"Questions"** tab:

1. I-type ang **question text**
2. Fill in ang options (A, B, C, D):
   - **Tap ang letter button** sa kaliwa para i-mark ang **correct answer** (magiging green)
   - Fill in ang option text
3. **Points** — Default 1. Palitan kung weighted.
4. Tap **"Add Question"**

Repeat hanggang matapos.

**Tips:**

- Pwedeng 2, 3, o 4 options — basta at least 2
- Isa lang ang pwedeng "correct answer" per question
- Iwan blank kung hindi gagamitin ang option

### Pag-add ng Questions — Bulk (Excel Import)

Para sa mabilisang pag-add ng maraming questions:

1. Sa quiz editor, tap ang **"Import"** tab
2. Tap **"Download template"** para sa sample
3. Buksan sa Excel/Google Sheets
4. Fill in bawat row
5. Save as `.xlsx` o `.csv`
6. Sa app, tap ang **file upload area** → select ang file
7. Auto-import lahat

**See:** [Excel Import Guide](./excel-import-guide.md)

### Paano I-publish ang Quiz

Pag tapos na lahat ng questions:

1. Sa quiz header, tap **"Publish"** button
2. Requirement: at least 1 question

Pag na-publish, maaari nang mag-take ang students.

### Paano I-close ang Quiz

Pag tapos na ang quiz period:

1. Sa quiz header, tap **"Close"**
2. Status: **Closed** — hindi na makakapag-take ng bagong attempts
3. Pwedeng i-reopen via **"Re-open"** button

### Paano I-delete ang Question

1. Sa question card, tap ang **trash icon** (🗑️)
2. Confirm

### Paano I-delete ang Buong Quiz

1. Sa quiz header, tap **"Delete"**
2. Confirm

**⚠️ Warning:** Mabubura lahat ng questions, options, at attempts.

---

## 5. Monitoring Results

### Paano Makita ang Attempts ng Students

1. Buksan ang quiz
2. Tap **"Attempts"** button sa header

Makikita mo:

- **Summary stats** — Total, In Progress, Submitted, Terminated, Average Score, Violations
- **Listahan ng attempts** — bawat student na may:
  - Name, email
  - Status (In Progress / Submitted / Terminated)
  - Score at percentage
  - Violation count (kung meron)

### Paano Mag-search at Mag-filter

Sa attempts page:

- **Search box** — hanapin ang student by name o email
- **Filter button** — i-filter by status (All / In Progress / Submitted / Terminated)
- **Sort** — by name, score (high/low), recent, oldest

### Paano Mag-export to CSV

1. Sa attempts page, tap **"Export CSV"**
2. Auto-download lahat ng attempts (o yung selected lang)
3. Buksan sa Excel/Sheets para sa grading records

### Paano I-expand ang Attempt Details

1. Tap **"Show details"** sa attempt card
2. Makikita mo:
   - Start time at submitted time
   - Integrity events (violations)
   - Termination reason (kung terminated)

### Paano I-override ang Score

Kung may scoring error:

1. Expand ang attempt
2. Sa **"Override Score"** field, i-type ang tamang score
3. Tap **"Save Score"**

**⚠️ Note:** Permanent ang override. Walang undo.

### Paano Force-terminate ang Attempt

Kung may report na nag-cheat:

1. Expand ang attempt (dapat status = **In Progress**)
2. Tap **"Force Terminate"**
3. Confirm — magiging 0 ang score, hindi na makakapag-submit

### Bulk Actions — Para sa Maraming Students

Kung may 50+ students:

1. **Check boxes** ng mga students
2. Sa **sticky toolbar** sa taas, tap **"Bulk Terminate"**
3. Auto-terminate lahat ng in-progress sa selection

**Quick buttons:**

- **"Select all"** — piliin lahat
- **"Select X in-progress"** — auto-select mga in-progress lang

---

## 6. Understanding Integrity Events

Ang **Integrity Events** ay violations na na-detect during quiz-taking:

| Event Type            | Meaning                                       |
| --------------------- | --------------------------------------------- |
| `visibility_hidden`   | Nag-switch ng tab o nag-minimize ng app       |
| `blur`                | Nawala ang focus (notification, split screen) |
| `fullscreen_exit`     | Nag-exit ng fullscreen mode                   |
| `copy` / `paste`      | Nag-copy o nag-paste ng text                  |
| `context_menu`        | Nag-right-click                               |
| `before_unload`       | Nag-tangka mag-close ng tab o mag-back        |
| `MAX_STRIKES_REACHED` | Auto-terminate (3 violations)                 |

**3 violations = auto-terminate + score 0.**

**Sa practice:**

- **1 violation** = warning lang
- **2 violations** = warning ulit
- **3 violations** = terminated, score = 0

---

## 7. Tips for Teachers

### Bago Mag-exam:

- [ ] Test ang quiz mo as a student (gumawa ng test account)
- [ ] I-publish ang quiz 5 minutes bago mag-start
- [ ] I-remind ang students na **i-install ang app sa phone**
- [ ] I-remind sila sa **anti-cheat rules** (3 strikes = 0)
- [ ] I-check kung may pending invitations na hindi pa na-accept

### Habang Nag-e-exam:

- I-monitor ang **Attempts page** — live ang updates
- Makikita mo ang **"In Progress"** students
- Kung may terminated agad, kontakin ang student

### Pagkatapos:

- I-review ang **integrity events** ng bawat attempt
- Kung may suspicious, i-investigate
- I-override ang score kung kailangan
- I-export sa CSV para sa records

### Best Practices:

- **Konti lang ang questions per quiz** — 10-15 per quiz, hindi 50+
- **Time limit** — i-set para maiwasan ang Googling
- **Hatiin ang long exams** — sa chunks
- **I-test bago ang exam day** — para iwas technical issues

---

## 8. Troubleshooting

**Hindi ko makita ang students ko**

- I-check ang Profile — dapat `Teacher` ang role mo
- Sa `/students`, dapat may listahan

**Hindi ko ma-invite ang student**

- Baka wala pang account — check sa `/students`
- Baka naka-invite na — check ang "Pending Invitations"

**Hindi makapag-import ng Excel**

- I-verify ang column headers — exact match sa template
- Kung may issues, i-save as `.csv` muna
- See [Excel Import Guide](./excel-import-guide.md)

**Naka-terminate agad ang student**

- I-check ang integrity events
- Common: tab switch, minimize, fullscreen exit
- Kung false positive, i-override ang score

**Hindi lumalabas ang attempts**

- Baka hindi pa nag-start ang students
- Baka naka-draft pa ang quiz (dapat Published)
