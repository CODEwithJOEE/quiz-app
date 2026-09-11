# 🎓 Teacher Guide

Kompletong gabay para sa mga teachers kung paano gamitin ang Quiz App.

---

## 1. First Time Setup

### Login

1. Buksan ang app
2. I-enter ang email at password na binigay ng **super admin** mo
3. Tap "Sign In"

### Recommended: Install sa Phone

See [Getting Started Guide](./getting-started.md#paano-mag-install-sa-phone-recommended)

---

## 2. Managing Students

Bago ka makagawa ng rooms at quizzes, kailangan mo munang gumawa ng **student accounts**.

### Paano Gumawa ng Student

1. Tap **"Students"** sa bottom nav (may icon na graduation cap)
2. Sa "Create New User" section, i-fill ang form:
   - **Full Name** — Buong pangalan ng student (e.g., `Juan Dela Cruz`)
   - **Email** — Valid email (e.g., `juan.delacruz@school.com`)
   - **Password** — Minimum 6 characters. Ibigay ito sa student.
3. Tap **"Create User"**

**Paalala:**

- Ang student ay lalabas sa list mo **pagkatapos ng iyong account lang** — hindi mo makikita ang students ng ibang teachers.
- Isulat o i-print ang password para maibigay sa student.

### Paano I-reset ang Password ng Student

_(Hindi pa supported sa current version. Kontakin ang super admin para mag-reset.)_

---

## 3. Creating Rooms

Ang **Room** ay parang section o class. Naglalaman ito ng:

- Listahan ng students
- Lahat ng quizzes para sa class na ito

### Paano Gumawa ng Room

1. Tap **"Rooms"** sa bottom nav
2. Tap **"+ New Room"** button sa taas
3. Fill ang form:
   - **Room Name\*** — Halimbawa: `Math 101 - Section A`
   - **Subject** — Halimbawa: `Mathematics`
   - **Description** — Optional notes para sa students
4. Tap **"Create Room"**

### Paano Mag-invite ng Students

1. Buksan ang room (tap sa room name)
2. Hanapin ang **"Invite Students"** panel
3. Search mo ang pangalan ng student (o scroll sa list)
4. **Tap ang student** para i-select (may checkmark na lalabas)
5. Pwede kang pumili ng marami
6. Tap **"Invite Selected (N)"**

**Anong mangyayari:**

- Makikita ng student ang invitation sa **Home dashboard** nya
- Kailangan nyang **i-accept** para makasali sa room
- Sa room detail page mo, makikita mo ang status:
  - **Joined Students** — mga naka-accept
  - **Pending Invitations** — mga hindi pa nag-a-accept

### Paano I-delete ang Room

1. Buksan ang room
2. Scroll down sa pinaka-ilalim
3. Tap **"Delete Room"**
4. Confirm — **Warning:** mabubura lahat ng quizzes at attempts sa room na ito.

---

## 4. Creating Quizzes

Ang **Quiz** ay nasa loob ng isang room. May 3 statuses:

- **Draft** — hindi pa visible sa students, pwede pa i-edit
- **Published** — visible na sa students, pwede nang mag-take
- **Closed** — hindi na pwede mag-take ng bagong attempts

### Paano Gumawa ng Quiz

1. Buksan ang room
2. Tap **"+ New Quiz"** button
3. Fill ang form:
   - **Quiz Title\*** — Halimbawa: `Chapter 1 Quiz`
   - **Description** — Optional
   - **Time Limit** — Optional. Kung may value, mag-countdown ang timer sa student. Blank = no time limit.
4. Tap **"Create Quiz"**

### Pag-add ng Questions — Manu-mano

Sa quiz page, sa **"Add Question"** section:

1. I-type ang **question text** sa textarea
2. Fill in ang options (A, B, C, D):
   - **Tap ang letter button** (A/B/C/D) sa kaliwa para i-mark ang **correct answer**
   - Yung na-click na letter ay magiging **green**
   - Fill in ang option text sa katabi nyang input
3. **Points** — Default 1. Palitan kung gusto mong weighted.
4. Tap **"Add Question"**

Repeat hanggang matapos ang lahat ng questions.

**Tips:**

- Pwedeng 2, 3, o 4 options — basta't meron at least 2
- Ang isa lang ang pwedeng maging "correct answer" per question
- Iwan na blank ang option kung hindi mo gagamitin

### Pag-add ng Questions — Bulk (Excel Import)

Para sa mas mabilis na pag-add, i-import mo na lang from Excel/CSV.

**Steps:**

1. Sa quiz page, tap ang **"Import"** tab
2. Tap **"Download template"** para makuha ang sample CSV
3. Buksan sa Excel / Google Sheets
4. Fill in ang bawat row ng questions
5. Save as `.xlsx` or `.csv`
6. Sa app, tap ang **file upload area** → i-select ang file
7. Auto-import lahat

**See:** [Excel Import Guide](./excel-import-guide.md) para sa detailed format.

### Paano I-publish ang Quiz

Pag tapos na lahat ng questions:

1. Sa quiz page, sa taas, hanapin ang **"Publish"** button
2. Tap ito

**Publish Requirements:**

- Dapat may **at least 1 question**
- Pag na-publish, hindi na magiging visible ang **"Draft"** badge

### Paano I-close ang Quiz

Pag tapos na ang quiz period (o gusto mong i-lock):

1. Sa quiz page, tap **"Close"**
2. Status: **Closed** — hindi na makakapag-take ng bagong attempts ang students, pero naka-save pa rin ang dati nilang attempts

Pwedeng i-re-open via **"Re-open"** button.

### Paano I-edit ang Questions

_(Hindi pa supported sa current version. Ang workaround: delete the question, tapos i-add ulit.)_

### Paano I-delete ang Question

1. Sa question card, tap ang **trash icon** (🗑️) sa kanan
2. Confirm

### Paano I-delete ang Buong Quiz

1. Sa quiz header, tap **"Delete"** button
2. Confirm
3. **Warning:** Mabubura lahat ng questions, options, at attempts.

---

## 5. Monitoring Results

### Paano Makita ang Attempts ng Students

1. Buksan ang quiz
2. Tap **"Attempts"** button sa header
3. Makikita mo ang:
   - **Summary stats:** Total attempts, submitted, terminated, average score, pass rate
   - **Listahan ng attempts** — pangalan ng student, score, status (Submitted / Terminated / In Progress)
   - **Violations** — kung may integrity violations, may amber badge

### Paano I-expand ang Attempt Details

1. Tap **"Show details"** sa attempt card
2. Makikita mo:
   - **Start time** at **submitted time**
   - **Integrity events** — listahan ng violations (tab switch, etc.)
   - **Termination reason** kung terminated

### Paano I-override ang Score

Kung may scoring error (halimbawa, mali ang naka-mark na correct answer na nadetect):

1. Expand ang attempt
2. Sa **"Override Score"** field, i-type ang tamang score
3. Tap **"Override Score"**

### Paano Force-terminate ang Attempt

Kung may report na nag-cheat pero hindi na-detect ng system:

1. Expand ang attempt (dapat status = **In Progress**)
2. Tap **"Force Terminate"**
3. Confirm — magiging 0 ang score at hindi na makakapag-submit ang student.

---

## 6. Tips for Teachers

### Bago Mag-exam

- [ ] Test ang quiz mo as a student (gumawa ng test account)
- [ ] I-publish ang quiz 5 minutes bago mag-start
- [ ] I-remind ang students na **i-install ang app sa phone** para fullscreen mode
- [ ] I-remind sila sa **anti-cheat rules** (3 strikes = 0 score)

### Habang Nag-e-exam

- I-monitor ang **Attempts** page — makikita mo live ang "In Progress" attempts
- Kung may makita kang terminated agad, pwede mong kontakin ang student

### Pagkatapos ng Exam

- I-check ang **integrity events** ng bawat attempt
- Kung may suspicious events, i-review ang videos (kung naka-record) o interview ang student
- Kung kelangan, i-override ang score manually

### Best Practices

- **Shuffle questions** — hindi pa supported, pero naka-plan
- **Time limit** — mag-set ng timer para maiwasan ang Google-searching
- **Konti lang ang questions per quiz** — 10-15 questions per quiz, hindi 50+, para mabilis
- **Multiple quizzes** — para sa long exam, hatiin sa chunks

---

## Troubleshooting for Teachers

**Hindi ko makita ang students ko**

- Baka hindi ka naka-login as teacher
- I-check ang Profile — dapat `Teacher` ang role mo

**Hindi ko ma-invite ang student**

- Baka hindi pa gumawa ng account ang student — check sa `/students` list
- Baka na-invite mo na sya dati — i-check ang "Pending Invitations"

**Hindi makapag-import ng Excel**

- I-verify ang column headers — dapat exact match sa template
- Baka may special characters sa CSV — subukan i-save as `.xlsx`
- See [Excel Import Guide](./excel-import-guide.md) for details

**Naka-terminate agad ang student**

- I-check ang integrity events sa attempts page
- Common reasons: na-minimize ang app, nag-switch ng tab, o nag-exit ng fullscreen
- Kung false positive, i-override ang score manually
