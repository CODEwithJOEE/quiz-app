# 🎓 Teacher Guide

Complete guide for teachers — managing students, rooms, quizzes, and results.

---

## Table of Contents

1. [First Time Setup](#1-first-time-setup)
2. [Managing Students](#2-managing-students)
3. [Student Photo Approval](#3-student-photo-approval)
4. [Creating Rooms](#4-creating-rooms)
5. [Managing Room Members](#5-managing-room-members)
6. [Creating Quizzes](#6-creating-quizzes)
7. [Adding Questions](#7-adding-questions)
8. [Importing Questions from Excel](#8-importing-questions-from-excel)
9. [Publishing and Closing Quizzes](#9-publishing-and-closing-quizzes)
10. [Monitoring Results](#10-monitoring-results)
11. [Grading Essay Answers](#11-grading-essay-answers)
12. [Bulk Actions](#12-bulk-actions)
13. [Understanding Integrity Events](#13-understanding-integrity-events)
14. [Managing Student Accounts](#14-managing-student-accounts)
15. [Tips for Teachers](#15-tips-for-teachers)
16. [Troubleshooting](#16-troubleshooting)

---

## 1. First Time Setup

### Login

1. Open the app
2. Enter the email and password provided by your **super admin**
3. Tap **"Sign In"**

### Recommended: Install on Phone

See [Getting Started Guide](./getting-started.md) → "Install on Phone"

---

## 2. Managing Students

Before you can create rooms and quizzes, you need **student accounts**.

### How to Create a Student (Manual)

1. Tap **"Students"** in the bottom nav (🎓 icon)
2. In the "Create New User" form, fill in:
   - **Full Name** — e.g. `Juan Dela Cruz`
   - **Email** — valid email, e.g. `juan.delacruz@school.com`
   - **Password** — minimum 6 characters. Give this to the student.
   - **Grade Level** — e.g. `Grade 8` (optional, recommended)
   - **Section** — e.g. `A Hydrogen` (optional, recommended)
3. Tap **"Create User"**

**⚠️ Reminders:**

- A student only appears in **your list** by default
- But other teachers can still invite your students to their rooms via the **"All Students"** tab (see [Section 4](#4-creating-rooms))
- Write down the password to hand to the student

### Bulk Import Students (Excel/CSV)

For 20+ students, use bulk import.

**Format (`.csv` or `.xlsx`):**

```csv
full_name,email,grade_level,section
Juan Dela Cruz,juan.delacruz@school.com,Grade 8,A Hydrogen
Maria Santos,maria.santos@school.com,Grade 8,A Hydrogen
Pedro Reyes,pedro.reyes@school.com,Grade 8,B Oxygen
```

**How to:**

1. Go to the **/students** page
2. Tap **"Bulk Import"** (green button)
3. Tap **"Download template"** for a starter file
4. Fill in the rows in Google Sheets or Excel
5. Save as `.csv` or `.xlsx`
6. Upload back to the app
7. **Preview** the list
8. Tap **"Import"**
9. **Print** or copy the credentials sheet
10. Hand passwords to students

**Limits:**

- Max **100 students** per batch
- Passwords are **auto-generated** (8 characters)
- **Print credentials** and give to students

### How to View Your Students

On the **/students** page, you'll see:

- **Total count** at the top
- **Active Students** list (collapsible)
- **Pending Deletion** list (collapsible, if any)

**Search and Filter:**

- **Search box** — find a student by name or email
- **Section filter** — filter by Grade + Section

---

## 3. Student Photo Approval

Students can upload profile photos, but they need **teacher approval** before appearing on their account.

### When a Student Uploads a Photo

1. The photo goes into a **pending** state
2. You (or the super admin) get a **"Pending Photos"** entry
3. The student sees "⏳ Pending approval ng teacher mo" on their profile

### How to Review Pending Photos

1. Go to **Profile** page
2. Look for the **"Student Photos"** section
3. Tap **"Review Pending Photos"**
4. You'll see each student's uploaded photo with:
   - Student name and email
   - Upload timestamp
   - **Approve** and **Reject** buttons

### Approving a Photo

1. Tap **"Approve"**
2. The photo immediately appears on the student's profile, in the room member list, and in classmate lists

### Rejecting a Photo

1. Tap **"Reject"**
2. Optionally enter a **reason** (e.g. "Blurry photo", "Inappropriate")
3. Tap **"Confirm Reject"**
4. The photo is deleted from storage
5. The student sees the rejection reason on their profile and can upload a new one

**Note:** Teachers and super admins don't need approval — their photos are auto-approved.

---

## 4. Creating Rooms

A **Room** is like a class or section. It contains:

- A student roster
- All quizzes for that class

### How to Create a Room

1. Tap **"Rooms"** in the bottom nav
2. Tap **"+ New Room"**
3. Fill in the form:
   - **Room Name\*** — e.g. `Math 101 - Section A`
   - **Subject** — e.g. `Mathematics`
   - **Description** — optional notes for students
4. Tap **"Create Room"**

### How to Edit a Room

1. Open the room
2. Tap the **"Edit"** button (pencil icon) next to the room name
3. Update the name, subject, or description
4. Tap **"Save Changes"**

### How to Invite Students

1. Open the room
2. Find the **"Invite Students"** panel
3. Choose a tab:
   - **My Students** — students you created
   - **All Students** — every student in the system (including those created by other teachers)
4. **Search** by name or email
5. **Tap a student** to select them (a checkmark appears)
6. Select multiple students if needed
7. Tap **"Invite Selected (N)"**

**What happens:**

- The student sees the invitation on their **Home** dashboard
- They need to **accept** to join
- On your room page you'll see:
  - **Joined Students** — accepted
  - **Pending Invitations** — not yet accepted

**Cross-teacher note:** If a student was created by another teacher, they still only need **one account**. The "All Students" tab lets any teacher invite any student to their room. Students show a **"From other teacher"** badge so you know who created them.

### How to Delete a Room

1. Open the room
2. Scroll to the bottom
3. Tap **"Delete Room"**
4. Confirm

**⚠️ Warning:** Deleting a room removes all its quizzes and attempts. This cannot be undone.

---

## 5. Managing Room Members

### Removing a Single Student

1. Open the room
2. Find the student under **"Joined Students"** or **"Pending Invitations"**
3. Tap the **remove icon** (red trash icon) on their row
4. Confirm

**What happens:**

- The student is removed from this room only
- Their attempts and account are **preserved**
- You can re-invite them anytime

### Bulk Removing Students

1. Open the room
2. In the "Joined Students" or "Pending Invitations" section, **check the boxes** next to students you want to remove
3. A **"Remove (N)"** button appears
4. Tap it, confirm the preview list, and confirm
5. Removed students no longer see the room

---

## 6. Creating Quizzes

A **Quiz** lives inside a room. It has 3 statuses:

| Status        | Meaning                                             |
| ------------- | --------------------------------------------------- |
| **Draft**     | Not visible to students; still editable             |
| **Published** | Visible to students; they can take it               |
| **Closed**    | No new attempts allowed; existing results preserved |

### How to Create a Quiz

1. Open the room
2. Tap **"+ New Quiz"**
3. Fill in the form:
   - **Quiz Title\*** — e.g. `Chapter 1 Quiz`
   - **Description** — optional
   - **Time Limit (minutes)** — optional. If set, students see a countdown timer. Leave blank for no limit.
4. Configure **Randomization**:
   - ✅ **Shuffle questions** — each student gets a different question order
   - ✅ **Shuffle options** — each student gets a different A/B/C/D order per question
5. Tap **"Create Quiz"**

**Notes on Shuffle:**

- The order is fixed **once a student starts** — the same order is used when they resume
- Shuffle works **per student**, not per room
- Combine both for maximum anti-cheating

---

## 7. Adding Questions

Quizzes support **two question types**:

- **Multiple Choice (MCQ)** — auto-graded
- **Essay** — manually graded by you

You can mix both types in a single quiz.

### Adding a Multiple Choice Question (Manual)

1. In the quiz editor, on the **"Questions"** tab
2. Choose the **"Multiple Choice"** type
3. Fill in:
   - **Question text**
   - **Options A, B, C, D**
   - Tap the **letter button** next to the correct option (turns green)
   - **Points** — default 1
4. Tap **"Add Question"**

Repeat as needed.

**Tips:**

- 2, 3, or 4 options allowed (minimum 2)
- Only **one** correct answer per question
- Leave unused options blank

### Adding an Essay Question (Manual)

1. In the quiz editor, on the **"Questions"** tab
2. Choose the **"Essay"** type
3. Fill in:
   - **Question text** (the essay prompt)
   - **Points** — set explicitly (essays are usually higher points)
   - **Minimum Words** — optional, e.g. `50`
   - **Maximum Words** — optional, e.g. `300`
   - **Rubric / Guidelines** — optional, shown to students and used during grading
4. Tap **"Add Question"**

**Notes:**

- Essay questions do **not** have options or a "correct" answer
- Essay answers are **manually graded** — students see a "Pending Grading" state until you grade them
- The rubric is displayed to students before they answer and to you during grading

### Deleting a Question

1. On the question card, tap the **trash icon**
2. Confirm

### Deleting the Whole Quiz

1. In the quiz header, tap **"Delete"**
2. Confirm

**⚠️ Warning:** Deletes all questions, options, and attempts. Cannot be undone.

---

## 8. Importing Questions from Excel

For bulk-adding questions, use Excel/CSV import.

### How to Import

1. In the quiz editor, tap the **"Import"** tab
2. Tap **"Download template"** for a sample file
3. Fill in the rows in Excel/Google Sheets
4. Save as `.xlsx` or `.csv`
5. Upload the file to the app
6. Questions are added to the quiz automatically

### Supported Columns

| Column           | MCQ | Essay |
| ---------------- | :-: | :---: |
| `question_type`  | ⚪  |  ⚪   |
| `question`       | ✅  |  ✅   |
| `option_a..d`    | ✅  |  ❌   |
| `correct`        | ✅  |  ❌   |
| `points`         | ⚪  |  ⚪   |
| `word_limit_min` | ❌  |  ⚪   |
| `word_limit_max` | ❌  |  ⚪   |
| `rubric`         | ❌  |  ⚪   |

**See:** [Excel Import Guide](./excel-import-guide.md) for full details, examples, and common mistakes.

---

## 9. Publishing and Closing Quizzes

### Publishing a Quiz

Once all questions are added:

1. In the quiz header, tap **"Publish"**
2. Requirement: at least 1 question

Once published, students can take the quiz.

### Closing a Quiz

When the quiz period is over:

1. In the quiz header, tap **"Close"**
2. Status: **Closed** — no new attempts allowed
3. Reopen at any time via **"Re-open"**

---

## 10. Monitoring Results

### Viewing Attempts

1. Open the quiz
2. Tap **"Attempts"** in the header

You'll see:

- **Summary stats** — Total, In Progress, Submitted, Terminated, Average Score, Violations
- **List of attempts** — each student with:
  - Name, email
  - Status (In Progress / Submitted / Terminated)
  - Score and percentage
  - Violation count (if any)
  - **Grading status** badge (Ungraded / Graded) for quizzes with essays

### Search, Filter, Sort

On the attempts page:

- **Search box** — find a student by name or email
- **Filter** — by status (All / In Progress / Submitted / Terminated)
- **Sort** — by name, score (high/low), recent, oldest

### Exporting to CSV

1. On the attempts page, tap **"Export CSV"**
2. The file downloads automatically
3. If you have selected attempts, only those are exported; otherwise all filtered attempts are exported
4. Open in Excel/Sheets for grading records

### Expanding Attempt Details

1. Tap **"Show details"** on an attempt card
2. You'll see:
   - Start time and submitted time
   - Integrity events (violations)
   - Termination reason (if terminated)

### Overriding a Score

If a score needs correction:

1. Expand the attempt
2. In the **"Override Score"** field, enter the correct score
3. Tap **"Save Score"**

**⚠️ Note:** Overrides are permanent — there's no undo.

### Force-Terminating an Attempt

If a student needs to be stopped:

1. Expand the attempt (must be **In Progress**)
2. Tap **"Force Terminate"**
3. Confirm — score becomes 0, student cannot submit

---

## 11. Grading Essay Answers

When a quiz contains essay questions, submissions require **manual grading**.

### Identifying Ungraded Attempts

- The **Attempts page** shows an **"Ungraded"** badge (amber) on any attempt with pending essays
- The summary counts include ungraded attempts

### How to Grade an Attempt

1. On the attempts page, find an attempt with the **"Ungraded"** badge
2. Tap **"Grade Now"**
3. You'll see each answer:
   - **MCQ answers** — auto-scored, shown with correct/incorrect highlighting
   - **Essay answers** — with the student's text, rubric, and inputs
4. For each essay answer:
   - Enter **Points Awarded** (must be between 0 and the max points)
   - Optionally add **Feedback** (comment for that specific answer)
5. Add **Overall Feedback** for the student (optional)
6. Tap **"Save Grade"**

### What Happens After Saving

- The attempt's `grading_status` becomes **"graded"**
- The total score is computed (MCQ auto-score + essay points)
- The student's result page updates to show the final score
- You can revisit and **edit grades** anytime via **"View / Edit Grade"**

### Editing a Grade

1. On the attempts page, find the attempt with the **"Graded"** badge
2. Tap **"View / Edit Grade"**
3. Adjust points, feedback, or overall comment
4. Tap **"Save Grade"** again

### Notes

- A grade **overwrites the previous one** — there is no separate revision history
- MCQ points are **locked** and cannot be edited here (use **Override Score** instead if you need to change the total)
- The per-answer feedback is visible to the student on the result page

---

## 12. Bulk Actions

For quizzes with many students:

### Selecting Attempts

- **Check the box** on each attempt you want to act on
- Or use quick-select buttons:
  - **"Select all"** — selects all filtered attempts
  - **"Select X in-progress"** — selects only in-progress attempts (useful before bulk terminate)

### Bulk Terminate

1. Select the attempts you want to terminate
2. In the **sticky toolbar**, tap **"Bulk Terminate"**
3. Confirm — all selected in-progress attempts are terminated with score 0

**Note:** Only **in-progress** attempts can be terminated. Submitted and already-terminated attempts are skipped.

### Bulk Export

1. Select attempts (optional — if none selected, all filtered are exported)
2. Tap **"Export (N)"** or **"Export CSV"**
3. Download the CSV

---

## 13. Understanding Integrity Events

**Integrity Events** are violations detected during quiz-taking:

| Event Type            | Meaning                                       |
| --------------------- | --------------------------------------------- |
| `visibility_hidden`   | Switched tabs or minimized the app            |
| `blur`                | Lost focus (notification, split-screen, etc.) |
| `fullscreen_exit`     | Exited fullscreen mode                        |
| `copy` / `paste`      | Attempted to copy or paste text               |
| `context_menu`        | Right-clicked                                 |
| `before_unload`       | Tried to close the tab or go back             |
| `MAX_STRIKES_REACHED` | Auto-terminate (3rd violation)                |

**3 violations = auto-terminate + score 0.**

**In practice:**

- **1 violation** = warning only
- **2 violations** = another warning
- **3 violations** = terminated, score 0

For more on what students see, see [Student Guide](./student-guide.md).

---

## 14. Managing Student Accounts

### Resetting a Student's Password

If a student forgets their password:

1. Go to the **/students** page
2. Find the student
3. Tap the **"Reset Password"** button (amber key icon)
4. Choose:
   - **Auto-generate** — creates a secure random password
   - **Custom** — type your own
5. Tap **"Reset Password"**
6. **Copy** the new password and give it to the student

**Note:** The old password stops working immediately.

### Deleting a Student Account (7-day retention)

When you delete a student, the account is **not permanently removed** right away.

**How to Delete:**

1. On the **/students** page, tap the **"Delete"** button (red trash icon)
2. Confirm
3. **Countdown starts:** 7 days

**During the 7-day period:**

- The student **cannot log in**
- All data is preserved (attempts, quiz history)
- You can **restore** the account anytime

**After 7 days:**

- The super admin can **purge** the account permanently

**How to Restore:**

1. On the **/students** page, expand the **"Pending Deletion"** section
2. Find the student
3. Tap **"Restore"** and confirm
4. The student can log in again

---

## 15. Tips for Teachers

### Before an Exam

- [ ] Test the quiz yourself (create a test student account)
- [ ] Publish the quiz 5 minutes before start time
- [ ] Remind students to **install the app on their phone**
- [ ] Remind them of the **anti-cheat rules** (3 strikes = 0)
- [ ] Check for pending invitations that haven't been accepted

### During the Exam

- Monitor the **Attempts page** — it updates live
- Look for **"In Progress"** students
- If someone is terminated early, contact them

### After the Exam

- Review the **integrity events** on each attempt
- Investigate any suspicious activity
- Override scores if needed
- Export to CSV for records
- **Grade essays** if the quiz has any (look for "Ungraded" badges)

### Best Practices

- **Keep quizzes short** — 10–15 questions is better than 50+
- **Set a time limit** — discourages Googling
- **Split long exams** into chunks
- **Test before exam day** — avoid technical issues
- **Use shuffle settings** — for high-stakes quizzes
- **Grade essays promptly** — students wait for their results

---

## 16. Troubleshooting

**I can't see my students**

- Check your Profile — your role should be `Teacher`
- On `/students`, there should be a list
- If empty, create students first

**I can't invite a student**

- They may not have an account yet — check `/students`
- They may already be invited — check "Pending Invitations"
- They may have declined — re-invite from "All Students"

**Excel import fails**

- Verify column headers — must match the template exactly
- Try saving as `.csv` if `.xlsx` fails
- See [Excel Import Guide](./excel-import-guide.md)

**Student was terminated too quickly**

- Check integrity events on their attempt
- Common causes: tab switch, minimize, fullscreen exit
- If a false positive, override the score

**Attempts aren't showing up**

- Students may not have started yet
- The quiz may still be in **Draft** — it must be **Published**

**"Ungraded" badge won't go away**

- The attempt still has essays waiting for grading
- Tap **"Grade Now"**, enter points, and save

**Student says they can't see their score**

- If the quiz has essays, the score is **pending until you grade**
- Grade the attempt and their result page will update

**Student can't log in after I deleted them**

- That's expected — during the 7-day window they're locked out
- Restore the account from "Pending Deletion" if needed

---

## Related Guides

- [Getting Started](./getting-started.md) — login, install, basics
- [Excel Import Guide](./excel-import-guide.md) — bulk import details
- [Student Guide](./student-guide.md) — what students see
- [Admin Guide](./admin-guide.md) — for super admins

---

**Questions?** Contact your school's IT support.
