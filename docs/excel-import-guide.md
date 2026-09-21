# 📊 Excel / CSV Import Guide

Complete guide for importing quiz questions and students from Excel/CSV files.

---

## Table of Contents

1. [Quiz Questions Import](#quiz-questions-import)
2. [Students Bulk Import](#students-bulk-import)
3. [Common Mistakes](#common-mistakes)
4. [Troubleshooting](#troubleshooting)

---

## Quiz Questions Import

Quiz questions support **two types**:

- **Multiple Choice (MCQ)** — auto-graded
- **Essay** — manually graded by the teacher

Both types can be mixed in a single import file.

### Column Headers (Row 1)

| Header           | Required (MCQ) | Required (Essay) | Description                                                            | Example                         |
| ---------------- | :------------: | :--------------: | ---------------------------------------------------------------------- | ------------------------------- |
| `question_type`  |       ⚪       |        ⚪        | `multiple_choice` or `essay`. If blank, defaults to `multiple_choice`. | `multiple_choice`               |
| `question`       |       ✅       |        ✅        | The question text                                                      | `What is 2 + 2?`                |
| `option_a`       |       ✅       |        ❌        | Choice A                                                               | `3`                             |
| `option_b`       |       ✅       |        ❌        | Choice B                                                               | `4`                             |
| `option_c`       |       ⚪       |        ❌        | Choice C (optional)                                                    | `5`                             |
| `option_d`       |       ⚪       |        ❌        | Choice D (optional)                                                    | `6`                             |
| `correct`        |       ✅       |        ❌        | Correct answer — letter `A`, `B`, `C`, or `D`                          | `B`                             |
| `points`         |       ⚪       |        ⚪        | Points for this question (default 1)                                   | `1`                             |
| `word_limit_min` |       ❌       |        ⚪        | Minimum word count (essay only)                                        | `50`                            |
| `word_limit_max` |       ❌       |        ⚪        | Maximum word count (essay only)                                        | `300`                           |
| `rubric`         |       ❌       |        ⚪        | Grading rubric / guidelines (essay only)                               | `Content: 10pts, Grammar: 5pts` |

**⚠️ IMPORTANT:**

- **Header names are case-sensitive.** Use exactly `question`, `option_a`, `correct`, etc.
- **`correct` is a letter only** — not the answer text. Use `A`, `B`, `C`, or `D`.
- **MCQ:** 2, 3, or 4 options allowed — but at least 2 required.
- **Essay:** leave `option_*` and `correct` columns blank.
- **Mixed imports:** if `question_type` is empty for a row, it's treated as `multiple_choice`.

---

## Complete Examples

### Example 1 — Basic 4-option MCQ

| question_type   | question           | option_a | option_b | option_c | option_d | correct | points |
| --------------- | ------------------ | -------- | -------- | -------- | -------- | ------- | ------ |
| multiple_choice | What is 2 + 2?     | 3        | 4        | 5        | 6        | B       | 1      |
| multiple_choice | Capital of France? | London   | Berlin   | Paris    | Rome     | C       | 1      |
| multiple_choice | Largest planet?    | Earth    | Mars     | Jupiter  | Venus    | C       | 1      |

### Example 2 — True/False (2 options)

| question_type   | question              | option_a | option_b | option_c | option_d | correct | points |
| --------------- | --------------------- | -------- | -------- | -------- | -------- | ------- | ------ |
| multiple_choice | The sun is a star.    | True     | False    |          |          | A       | 1      |
| multiple_choice | Water boils at 100°C. | True     | False    |          |          | A       | 1      |

**Note:** Blank cells in `option_c` and `option_d` are fine.

### Example 3 — Mixed Points (MCQ)

| question_type   | question           | option_a | option_b | option_c | option_d | correct | points |
| --------------- | ------------------ | -------- | -------- | -------- | -------- | ------- | ------ |
| multiple_choice | 2 + 2 = ?          | 3        | 4        | 5        | 6        | B       | 1      |
| multiple_choice | Solve: 2x + 5 = 15 | 3        | 5        | 7        | 10       | B       | 2      |
| multiple_choice | Derivative of x²   | x        | 2x       | x³       | 2        | B       | 5      |

### Example 4 — Essay Question

| question_type | question                                   | points | word_limit_min | word_limit_max | rubric                        |
| ------------- | ------------------------------------------ | ------ | -------------- | -------------- | ----------------------------- |
| essay         | Explain the water cycle in your own words. | 20     | 50             | 300            | Content: 10pts, Grammar: 5pts |
| essay         | Describe the importance of trees.          | 15     | 100            | 500            | Content: 10pts, Grammar: 5pts |

**Notes:**

- Essay questions do **not** use `option_a..d` or `correct`.
- `word_limit_min` and `word_limit_max` are optional but recommended.
- `rubric` is shown to students before they answer and to the teacher during grading.
- Essay questions require **manual grading** — students see a "Pending Grading" result until the teacher grades them.

### Example 5 — Mixed MCQ + Essay in One File

| question_type   | question                     | option_a | option_b | option_c | option_d | correct | points | word_limit_min | word_limit_max | rubric                        |
| --------------- | ---------------------------- | -------- | -------- | -------- | -------- | ------- | ------ | -------------- | -------------- | ----------------------------- |
| multiple_choice | What is 2 + 2?               | 3        | 4        | 5        | 6        | B       | 1      |                |                |                               |
| essay           | Explain photosynthesis.      |          |          |          |          |         | 20     | 50             | 300            | Content: 15pts, Clarity: 5pts |
| multiple_choice | Capital of France?           | London   | Berlin   | Paris    | Rome     | C       | 1      |                |                |                               |
| essay           | Describe your favorite book. |          |          |          |          |         | 15     | 100            | 500            | Content: 10pts, Grammar: 5pts |

---

## How to Prepare

### Method 1 — Excel / Google Sheets (Recommended)

1. Open **Excel** or **Google Sheets**
2. In **Row 1**, type the exact column headers (see tables above)
3. Fill in one row per question
4. For MCQ: fill `option_a..d` and set `correct` to a letter
5. For Essay: leave `option_*` and `correct` blank; fill `word_limit_*` and `rubric` if desired
6. Save as `.xlsx` or `.csv`
7. In the app: quiz editor → **Import** tab → upload the file

### Method 2 — Template Download

1. In the quiz editor, tap the **Import** tab
2. Tap **"Download template"**
3. The template includes both MCQ and Essay examples
4. Edit the rows with your own questions
5. Save and upload

### Method 3 — CSV via Text Editor

1. Create a plain `.csv` file with comma-separated values
2. First row = headers
3. Use double quotes for values containing commas (e.g. rubric)
4. Save with UTF-8 encoding

---

## Students Bulk Import

Bulk-create student accounts with auto-generated passwords.

### Column Headers (Row 1)

| Header        | Required | Description                | Example                    |
| ------------- | :------: | -------------------------- | -------------------------- |
| `full_name`   |    ✅    | Student's full name        | `Juan Dela Cruz`           |
| `email`       |    ✅    | Unique email address       | `juan.delacruz@school.com` |
| `grade_level` |    ⚪    | Grade level (recommended)  | `Grade 8`                  |
| `section`     |    ⚪    | Section name (recommended) | `A Hydrogen`               |

**⚠️ IMPORTANT:**

- **Email must be unique.** Duplicates will fail.
- **Passwords are auto-generated** (8 characters) — the app shows them after import.
- **Maximum 100 students per batch.** Split larger lists into chunks.
- **`grade_level` and `section` are separate columns.** Don't combine them.

### Example

| full_name      | email                    | grade_level | section    |
| -------------- | ------------------------ | ----------- | ---------- |
| Juan Dela Cruz | juan.delacruz@school.com | Grade 8     | A Hydrogen |
| Maria Santos   | maria.santos@school.com  | Grade 8     | A Hydrogen |
| Pedro Reyes    | pedro.reyes@school.com   | Grade 8     | B Oxygen   |
| Ana Garcia     | ana.garcia@school.com    | Grade 9     | A Gumamila |

### How to Import

1. Go to the **/students** page
2. Tap **"Bulk Import"** (green button)
3. Tap **"Download template"** for a starter file
4. Fill in the rows in Excel / Google Sheets
5. Save as `.xlsx` or `.csv`
6. Upload back to the app
7. **Preview** the list — check for typos
8. Tap **"Import"**
9. **Print** or copy the credentials sheet
10. Distribute passwords to students

**Result:**

- One account per student (used across all rooms, even across teachers)
- Students appear in your `/students` list
- They can be invited to any room using the "All Students" tab

---

## Common Mistakes

### Quiz Import

| ❌ Wrong                                      | ✅ Correct              | Why                             |
| --------------------------------------------- | ----------------------- | ------------------------------- |
| `Question`                                    | `question`              | Headers are case-sensitive      |
| `A. 3`                                        | `3`                     | No letter prefix in option text |
| `true` in `correct`                           | `A`                     | `correct` must be a letter      |
| 5+ options                                    | Max 4                   | Only A, B, C, D supported       |
| `question_type` = `MCQ`                       | `multiple_choice`       | Full value required             |
| `question_type` = `essay` with options filled | Leave options blank     | Essays don't have options       |
| Essay without `points`                        | Set `points` explicitly | Essays need weighted points     |

### Student Import

| ❌ Wrong                  | ✅ Correct                   | Why                        |
| ------------------------- | ---------------------------- | -------------------------- |
| `Full Name`               | `full_name`                  | Headers are case-sensitive |
| Duplicate emails          | Unique emails                | Import will fail per-row   |
| `Grade 8 - A` in one cell | `Grade 8` and `A` separately | Two separate columns       |
| More than 100 rows        | Split into batches           | Batch limit is 100         |
| Blank email               | Fill in email                | Required field             |

---

## Troubleshooting

**"Missing 'question' column" error**

- The first row must contain exact header `question`
- Check for extra spaces or capitalization

**"Row N: 'correct' must be A, B, C, or D"**

- The `correct` cell has something other than a single letter
- Fix: use `A`, `B`, `C`, or `D` (uppercase or lowercase works)

**"Row N: at least 2 options required"**

- MCQ must have at least 2 non-empty options
- Check that `option_a` and `option_b` both have values

**"Row N: correct answer 'X' not found in options"**

- You set `correct = D` but `option_d` is empty
- Fix: fill in the matching option or change `correct` to a filled option

**"Invalid question_type"**

- Only `multiple_choice` or `essay` are valid
- Leave blank to default to `multiple_choice`

**Import succeeded but no questions appear**

- Refresh the page (pull down on mobile)
- Check that the quiz is in **Draft** or **Published** status (not closed)
- Verify you're looking at the correct quiz

**Essay questions show "Ungraded"**

- That's expected — essays need manual grading
- Go to the quiz → **Attempts** → tap **"Grade Now"** on any attempt

**Student import: "Email already exists"**

- That email is already in the system
- Either skip that row or use a different email
- Check `/students` or `/admin/users` for existing accounts

**Student import: "Maximum 100 students per batch"**

- Split the file into smaller chunks
- Import 100 at a time, then repeat

---

## Related Guides

- [Teacher Guide](./teacher-guide.md) — creating quizzes, grading essays, managing students
- [Student Guide](./student-guide.md) — taking quizzes with essays
- [Admin Guide](./admin-guide.md) — managing all users

---

**Questions?** Contact your school's IT support.
