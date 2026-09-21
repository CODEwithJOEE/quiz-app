# 🛡️ Super Admin Guide

Complete guide for super admins — managing the entire system.

---

## Table of Contents

1. [Login](#1-login)
2. [Admin Dashboard](#2-admin-dashboard)
3. [Super Admin Capabilities](#3-super-admin-capabilities)
4. [Managing Users](#4-managing-users)
5. [Password Reset](#5-password-reset)
6. [Deleting Users (7-Day Retention)](#6-deleting-users-7-day-retention)
7. [Pending Photo Approvals](#7-pending-photo-approvals)
8. [Auditing Data](#8-auditing-data)
9. [Security Notes](#9-security-notes)

---

## 1. Login

Use the email and password you set up (or that your IT admin gave you) during initial setup.

If you lose your password:

- Reset it via the **Supabase dashboard**, or
- Contact your IT support

---

## 2. Admin Dashboard

When you log in, you land on the **Dashboard** (`/admin/dashboard`). It's your at-a-glance system overview.

### What You'll See

**User Stats:**

- **Admins** — total super admin accounts
- **Teachers** — total teacher accounts
- **Students** — total student accounts

**Content Stats:**

- **Rooms** — total rooms in the system
- **Quizzes** — total quizzes
- **Attempts** — total student submissions

**Needs Attention** (only shown when there's something to act on):

- **Pending Deletions** — accounts scheduled for permanent deletion
- **Pending Photo Approvals** — student photos waiting for review

Both flags link directly to the relevant admin page.

**Recent Activity:**

- **New Users** — the 5 most recently created accounts
- **Recently Published Quizzes** — the 5 most recent published quizzes
- **Recent Violations** — the 5 latest integrity events across all quizzes

**Quick Links:**

- **Manage Users** — jumps to `/admin/users`

### Navigating to Other Admin Pages

The bottom nav shows **"Dashboard"** for super admins (not "Users"). To reach user management:

1. From the Dashboard, tap **"Manage Users"** in the Quick Links, or
2. Tap the **"Users"** stat card for Admins/Teachers/Students

---

## 3. Super Admin Capabilities

| Action                   | Super Admin |      Teacher      | Student  |
| ------------------------ | :---------: | :---------------: | :------: |
| Manage all users         |     ✅      |        ❌         |    ❌    |
| Create teachers          |     ✅      |        ❌         |    ❌    |
| Create students          |     ✅      |   ✅ (own only)   |    ❌    |
| View all users           |     ✅      | Only own students |    ❌    |
| Create rooms             |     ✅      |   ✅ (own only)   |    ❌    |
| Create quizzes           |     ✅      |   ✅ (own only)   |    ❌    |
| Take quizzes             |     ❌      |        ❌         |    ✅    |
| See all attempts         |     ✅      | Only own quizzes  | Only own |
| Override scores          |     ✅      | Own quizzes only  |    ❌    |
| Reset passwords          |     ✅      | Own students only |    ❌    |
| Approve photos           |     ✅      | Own students only |    ❌    |
| Restore deleted accounts |     ✅      | Own students only |    ❌    |
| Purge expired deletions  |     ✅      |        ❌         |    ❌    |

---

## 4. Managing Users

### How to Create a Teacher

1. From the Dashboard, tap **"Manage Users"** (or the Users stat card)
2. In the **"Create New User"** form, fill in:
   - **Full Name** — e.g. `Maria Santos`
   - **Email** — e.g. `maria.santos@school.com`
   - **Password** — minimum 6 characters (give this to the teacher)
   - **Role** — select **"Teacher"**
3. Tap **"Create User"**

### How to Create a Student

Same as above, but:

- **Role** — select **"Student"**
- Optionally fill in **Grade Level** and **Section**

**Note:** Students you create are listed under your account. Teachers also create their own students — those are separate. However, any teacher can invite any student via the cross-teacher "All Students" tab.

### How to View All Users

On the **Users** page (`/admin/users`), you'll see:

- **Stats cards** — Admins, Teachers, Students counts
- **Collapsible sections** — Admins, Teachers, Students (each expandable)
- **Search box** — find a user by name or email
- **Filter** — by role (All / Admin / Teacher / Student)
- **Reset Password** button (amber key icon) on each non-admin row
- **Delete** button (red trash icon) on each non-admin row

---

## 5. Password Reset

### In-App Password Reset (Recommended)

To reset a teacher's or student's password:

1. Go to `/admin/users`
2. Find the user in the list
3. Tap the **"Reset Password"** button (amber key icon)
4. Choose:
   - **Auto-generate** — creates a secure random password, or
   - **Custom** — type your own
5. Tap **"Reset Password"**
6. **Copy** the new password and give it to the user via a secure channel

**Note:** The old password stops working immediately.

### Manual Recovery via Supabase (Emergency)

If you're locked out of your own super admin account:

1. Log in to the **Supabase dashboard**
2. Go to **Authentication → Users**
3. Find the email
4. Tap the **"..."** menu → **"Reset password"** (or "Send password recovery")
5. Set the new password
6. Log in with the new password

---

## 6. Deleting Users (7-Day Retention)

When you delete a user, the account is **not removed immediately**. It enters a **7-day retention window** during which it can be restored.

### How to Delete a User

1. Go to `/admin/users`
2. Find the user
3. Tap the **"Delete"** button (red trash icon)
4. Confirm

**What happens immediately:**

- The user **cannot log in** (their auth account is banned)
- The account appears in the **"Pending Deletion"** section
- All data (attempts, quizzes, room memberships) is preserved

### During the 7-Day Window

- The user stays in **Pending Deletion**
- You can **restore** them anytime
- The system shows a countdown with urgency tiers:
  - **Green** — 3+ days left
  - **Amber** — 2 days left
  - **Red (pulsing)** — 1 day or less

### How to Restore a User

1. Go to `/admin/users`
2. Expand the **"Pending Deletion"** section
3. Find the user
4. Tap **"Restore"** and confirm
5. The user is unbanned and can log in again

### Purging Expired Deletions

After 7 days, the account is ready for **permanent deletion**. This must be triggered manually:

- A **purge** action runs on the `/students` page or `/admin/users` page (super-admin only)
- It permanently deletes all accounts whose `deletion_scheduled_for` has passed
- **This cannot be undone**

**Recommended:** Check for expired deletions weekly, especially after exam periods.

---

## 7. Pending Photo Approvals

Students can upload profile photos, but they require **approval** before they appear on their account.

### How to Review Pending Photos

As a super admin, you can approve **any** student's photo (teachers can only approve their own students' photos).

1. From the Dashboard, look for the **"Pending Photo Approvals"** flag
2. Tap it to go to `/admin/pending-photos`
3. Each card shows:
   - Student name and email
   - Upload timestamp
   - The uploaded photo
4. Choose **"Approve"** or **"Reject"**

### Approving

- The photo is immediately visible on the student's profile, in room member lists, and in classmate lists

### Rejecting

- Optionally enter a reason (e.g. "Blurry photo")
- The photo is deleted from storage
- The student sees the rejection reason and can upload a new one

---

## 8. Auditing Data

For advanced queries, log in to the **Supabase dashboard** → **SQL Editor**.

### Common Queries

**All students:**

```sql
select full_name, email, created_at
from profiles
where role = 'student'
order by created_at desc;
```

**All teachers:**

```sql
select full_name, email, created_at
from profiles
where role = 'teacher'
order by created_at desc;
```

**Users pending deletion:**

```sql
select full_name, email, deletion_scheduled_for, deletion_reason
from profiles
where deletion_scheduled_for is not null
order by deletion_scheduled_for asc;
```

**Recent terminated attempts:**

```sql
select
  p.full_name,
  q.title as quiz_title,
  a.termination_reason,
  a.submitted_at
from attempts a
join profiles p on p.id = a.student_id
join quizzes q on q.id = a.quiz_id
where a.status = 'terminated'
order by a.submitted_at desc
limit 50;
```

**Integrity events in the last 7 days:**

```sql
select
  event_type,
  count(*) as occurrences
from integrity_events
where occurred_at >= now() - interval '7 days'
group by event_type
order by occurrences desc;
```

**Total attempts per teacher:**

```sql
select
  t.full_name as teacher_name,
  count(distinct a.id) as total_attempts
from profiles t
join rooms r on r.teacher_id = t.id
join quizzes q on q.room_id = r.id
join attempts a on a.quiz_id = q.id
where t.role = 'teacher'
group by t.full_name
order by total_attempts desc;
```

---

## 9. Security Notes

- ⚠️ **Never** share your super admin credentials
- ⚠️ **Never** commit `.env.local` to Git
- ✅ Row Level Security (RLS) is enabled — do not disable it
- ✅ Review terminated attempts regularly for cheating patterns
- ✅ Back up the database weekly
- ✅ Set up a **backup super admin account** as a fallback
- ✅ Purge expired deletions weekly to keep the DB clean
- ✅ Rotate admin passwords every school year
- ✅ Audit the "Recent Violations" panel on the dashboard for anomalies

---

## Related Guides

- [Getting Started](./getting-started.md) — login, install, basics
- [Teacher Guide](./teacher-guide.md) — for understanding teacher workflows
- [Student Guide](./student-guide.md) — for understanding student view
- [Excel Import Guide](./excel-import-guide.md) — for bulk operations

---

**Questions?** Contact your IT support.
