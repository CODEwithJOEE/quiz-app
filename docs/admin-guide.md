# 🛡️ Super Admin Guide

Guide para sa super admins — ang nag-manage ng buong system.

---

## 1. Login

Gamitin ang email at password na ginawa mo (o ng IT admin) sa unang setup.

---

## 2. Super Admin Capabilities

| Action           | Super Admin |      Teacher      | Student |
| ---------------- | :---------: | :---------------: | :-----: |
| Manage all users |     ✅      |        ❌         |   ❌    |
| Create teachers  |     ✅      |        ❌         |   ❌    |
| Create students  |     ✅      |   ✅ (own only)   |   ❌    |
| Create rooms     |     ✅      |   ✅ (own only)   |   ❌    |
| Create quizzes   |     ✅      |   ✅ (own only)   |   ❌    |
| Take quizzes     |     ❌      |        ❌         |   ✅    |
| See all users    |     ✅      | Only own students |   ❌    |

---

## 3. Managing Users

### Paano Gumawa ng Teacher

1. Tap **"Users"** sa bottom nav (settings icon)
2. Sa **"Create New User"** form:
   - **Full Name** — e.g., `Maria Santos`
   - **Email** — e.g., `maria.santos@school.com`
   - **Password** — min 6 chars, ibigay sa teacher
   - **Role** — select **"Teacher"**
3. Tap **"Create User"**

### Paano Gumawa ng Student

Same as above pero:

- **Role** — select **"Student"**

**Note:** Ang student na ginawa mo ay under sa'yo (`created_by = super_admin`). Ang teacher ay maaari ring gumawa ng sariling students.

### Paano Mag-view ng Lahat ng Users

Sa **Users** page, makikita mo:

- **Stats cards** — bilang ng admins, teachers, students
- **All Users list** — lahat ng accounts sa system

### Paano Mag-reset ng Password

_(Hindi pa supported sa current version — naka-plan. Sa ngayon, gawin via Supabase dashboard.)_

**Manual reset via Supabase:**

1. Login sa Supabase dashboard
2. Puntahan ang **Authentication → Users**
3. Hanapin ang email
4. Tap ang **"..."** menu → **"Reset password"**
5. I-set ang bagong password
6. Ibigay sa user

---

## 4. Viewing All Data (Para sa Auditing)

Pwede kang mag-login sa **Supabase dashboard** para makita ang raw data:

- **Table Editor** — browse tables: `profiles`, `rooms`, `quizzes`, `attempts`, `integrity_events`
- **SQL Editor** — gumawa ng custom queries

### Common Queries

**Lahat ng students:**

```sql
select full_name, email, created_at
from profiles
where role = 'student'
order by created_at desc;
```
