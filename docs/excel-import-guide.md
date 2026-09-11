# 📊 Excel / CSV Import Guide

Detalyadong gabay para sa pag-import ng quiz questions from Excel.

---

## Required Format

Ito ang **exact na format** na kailangan:

### Column Headers (Row 1)

| Header     | Required | Description                              | Example        |
| ---------- | :------: | ---------------------------------------- | -------------- |
| `question` |    ✅    | Ang tanong                               | `What is 2+2?` |
| `option_a` |    ✅    | Choice A                                 | `3`            |
| `option_b` |    ✅    | Choice B                                 | `4`            |
| `option_c` |    ⚪    | Choice C (optional)                      | `5`            |
| `option_d` |    ⚪    | Choice D (optional)                      | `6`            |
| `correct`  |    ✅    | Tamang sagot — letter `A`, `B`, `C`, `D` | `B`            |
| `points`   |    ⚪    | Points (default 1)                       | `1`            |

**⚠️ IMPORTANT:**

- **Case-sensitive ang headers.** Dapat exact `question`, `option_a`, etc.
- **`correct` ay letter lang** — hindi ang text ng answer.
- Pwedeng 2, 3, o 4 options — basta at least 2.

---

## Complete Examples

### Example 1 — Basic 4-option MCQ

| question           | option_a | option_b | option_c | option_d | correct | points |
| ------------------ | -------- | -------- | -------- | -------- | ------- | ------ |
| What is 2 + 2?     | 3        | 4        | 5        | 6        | B       | 1      |
| Capital of France? | London   | Berlin   | Paris    | Rome     | C       | 1      |
| Largest planet?    | Earth    | Mars     | Jupiter  | Venus    | C       | 1      |

### Example 2 — True/False (2 options)

| question              | option_a | option_b | option_c | option_d | correct | points |
| --------------------- | -------- | -------- | -------- | -------- | ------- | ------ |
| The sun is a star.    | True     | False    |          |          | A       | 1      |
| Water boils at 100°C. | True     | False    |          |          | A       | 1      |

**Note:** Blank cells sa `option_c` at `option_d` — ok lang.

### Example 3 — Mixed Points

| question         | option_a | option_b | option_c | option_d | correct | points |
| ---------------- | -------- | -------- | -------- | -------- | ------- | ------ |
| 2 + 2 = ?        | 3        | 4        | 5        | 6        | B       | 1      |
| Solve: 2x+5=15   | 3        | 5        | 7        | 10       | B       | 2      |
| Derivative of x² | x        | 2x       | x³       | 2        | B       | 5      |

---

## Paano Mag-prepare

### Method 1 — Excel / Google Sheets (Recommended)

1. Buksan ang **Excel** o **Google Sheets**
2. Sa **Row 1**, i-type exactly:
