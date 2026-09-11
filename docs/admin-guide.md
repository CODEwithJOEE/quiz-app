# 🛡️ Super Admin Guide

Guide para sa super admins — ang nag-manage ng buong system.

---

## 1. Login

Gamitin ang email at password na ginawa mo (o ng IT admin) sa unang setup.

Kung nawala ang password mo, kailangan mong:

- Mag-create ng bago via Supabase dashboard
- O kontakin ang IT support

---

## 2. Super Admin Capabilities

| Action           | Super Admin |      Teacher      | Student  |
| ---------------- | :---------: | :---------------: | :------: |
| Manage all users |     ✅      |        ❌         |    ❌    |
| Create teachers  |     ✅      |        ❌         |    ❌    |
| Create students  |     ✅      |   ✅ (own only)   |    ❌    |
| View all users   |     ✅      | Only own students |    ❌    |
| Create rooms     |     ✅      |   ✅ (own only)   |    ❌    |
| Create quizzes   |     ✅      |   ✅ (own only)   |    ❌    |
| Take quizzes     |     ❌      |        ❌         |    ✅    |
| See all attempts |     ✅      | Only own quizzes  | Only own |
| Override scores  |     ✅      | Own quizzes only  |    ❌    |

---

## 3. Managing Users

### Paano Gumawa ng Teacher

1. Tap **"Users"** sa bottom nav (⚙️ icon)
2. Sa **"Create New User"** form:
   - **Full Name** — e.g., `Maria Santos`
   - **Email** — e.g., `maria.santos@school.com`
   - **Password** — min 6 chars (ibigay sa teacher)
   - **Role** — select **"Teacher"**
3. Tap **"Create User"**

### Paano Gumawa ng Student

Same as above pero:

- **Role** — select **"Student"**

**Note:** Ang students na ginawa mo ay nasa ilalim ng iyong account. Ang teacher ay gumagawa rin ng sariling students (nahahati sa kanila).

### Paano Mag-view ng Lahat ng Users

Sa **Users** page, makikita mo:

- **Stats cards** — Admins, Teachers, Students counts
- **All Users list** — lahat ng accounts sa system, sorted by recent

### Paano Mag-reset ng Password

Sa ngayon, **manual via Supabase dashboard**:

1. Login sa **Supabase dashboard**
2. Puntahan ang **Authentication → Users**
3. Hanapin ang email
4. Tap ang **"..."** menu → **"Reset password"** (o "Send password recovery")
5. I-set ang bagong password
6. Ibigay sa user

**Future improvement:** Pwedeng i-add ang in-app password reset later.

---

## 4. Viewing Data (Para sa Auditing)

Pwede kang mag-login sa **Supabase dashboard** para sa advanced queries.

### Common Queries

**Lahat ng students:**

```sql
select full_name, email, created_at
from profiles
where role = 'student'
order by created_at desc;
```
