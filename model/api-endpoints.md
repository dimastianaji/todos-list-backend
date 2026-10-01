# API Endpoints — Todos List

## 1. Overview

Dokumen ini berisi rancangan endpoint API yang digunakan pada backend aplikasi **Todos List**.

API dirancang menggunakan:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- Express Validator

Endpoint dikelompokkan berdasarkan resource:

1. Authentication
2. Todo
3. Category
4. Activity Log
5. Statistics

---

# 2. Authentication API

Endpoint yang berkaitan dengan proses registrasi, login, dan informasi pengguna yang sedang login.

## 2.1 Register

### Endpoint

`POST /api/auth/register`

### Access

Public

### Description

Mendaftarkan pengguna baru ke dalam sistem.

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Response Success

```json
{
  "success": true,
  "message": "User berhasil didaftarkan",
  "data": {
    "id": "ObjectId",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Validation

- `name` wajib diisi
- `email` wajib diisi dan harus memiliki format email yang valid
- `email` harus unik
- `password` wajib diisi
- Password disimpan dalam bentuk hash menggunakan bcryptjs

---

## 2.2 Login

### Endpoint

`POST /api/auth/login`

### Access

Public

### Description

Melakukan autentikasi pengguna menggunakan email dan password.

### Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Response Success

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": "ObjectId",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### Authentication

Tidak membutuhkan JWT.

---

## 2.3 Get Current User

### Endpoint

`GET /api/auth/me`

### Access

Authenticated User

### Description

Mengambil informasi pengguna yang sedang login.

### Headers

```text
Authorization: Bearer <JWT_TOKEN>
```

### Response Success

```json
{
  "success": true,
  "data": {
    "id": "ObjectId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## 2.4 Logout

### Endpoint

`POST /api/auth/logout`

### Access

Authenticated User

### Description

Melakukan proses logout pengguna.

### Headers

```text
Authorization: Bearer <JWT_TOKEN>
```

### Response Success

```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

# 3. Todo API

Endpoint yang digunakan untuk mengelola data Todo milik pengguna.

## 3.1 Get All Todos

### Endpoint

`GET /api/todos`

### Access

Authenticated User

### Description

Mengambil seluruh Todo milik pengguna yang sedang login.

### Headers

```text
Authorization: Bearer <JWT_TOKEN>
```

### Query Parameters

```text
?page=1&limit=10
```

Filter yang dapat dikembangkan:

```text
?status=pending
?priority=high
?category=<categoryId>
```

### Response Success

```json
{
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "user": "ObjectId",
      "category": "ObjectId",
      "title": "Mengerjakan tugas",
      "description": "Menyelesaikan tugas backend",
      "status": "pending",
      "priority": "high",
      "dueDate": "2026-09-30T00:00:00.000Z",
      "completedAt": null
    }
  ]
}
```

---

## 3.2 Get Todo by ID

### Endpoint

`GET /api/todos/:id`

### Access

Authenticated User

### Description

Mengambil detail Todo berdasarkan ID.

### Headers

```text
Authorization: Bearer <JWT_TOKEN>
```

### Response Success

```json
{
  "success": true,
  "data": {
    "_id": "ObjectId",
    "user": "ObjectId",
    "category": "ObjectId",
    "title": "Mengerjakan tugas",
    "description": "Menyelesaikan tugas backend",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-09-30T00:00:00.000Z",
    "completedAt": null
  }
}
```

---

## 3.3 Create Todo

### Endpoint

`POST /api/todos`

### Access

Authenticated User

### Description

Membuat Todo baru.

### Headers

```text
Authorization: Bearer <JWT_TOKEN>
```

### Request Body

```json
{
  "category": "ObjectId",
  "title": "Mengerjakan tugas",
  "description": "Menyelesaikan tugas backend",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-09-30"
}
```

### Response Success

```json
{
  "success": true,
  "message": "Todo berhasil dibuat",
  "data": {
    "_id": "ObjectId",
    "title": "Mengerjakan tugas",
    "status": "pending",
    "priority": "high"
  }
}
```

### Activity Log

Mencatat aktivitas:

```text
action: create
resource: Todo
```

---

## 3.4 Update Todo

### Endpoint

`PUT /api/todos/:id`

### Access

Authenticated User

### Description

Mengubah data Todo berdasarkan ID.

### Headers

```text
Authorization: Bearer <JWT_TOKEN>
```

### Request Body

```json
{
  "title": "Mengerjakan tugas backend",
  "description": "Menyelesaikan seluruh tugas backend",
  "priority": "medium",
  "dueDate": "2026-10-01"
}
```

### Response Success

```json
{
  "success": true,
  "message": "Todo berhasil diperbarui",
  "data": {
    "_id": "ObjectId",
    "title": "Mengerjakan tugas backend",
    "priority": "medium"
  }
}
```

### Activity Log

Mencatat aktivitas:

```text
action: update
resource: Todo
```

---

## 3.5 Delete Todo

### Endpoint

`DELETE /api/todos/:id`

### Access

Authenticated User

### Description

Menghapus Todo berdasarkan ID.

### Headers

```text
Authorization: Bearer <JWT_TOKEN>
```

### Response Success

```json
{
  "success": true,
  "message": "Todo berhasil dihapus"
}
```

### Activity Log

Mencatat aktivitas:

```text
action: delete
resource: Todo
```

---

## 3.6 Complete Todo

### Endpoint

`PATCH /api/todos/:id/complete`

### Access

Authenticated User

### Description

Mengubah status Todo menjadi `completed`.

### Headers

```text
Authorization: Bearer <JWT_TOKEN>
```

### Response Success

```json
{
  "success": true,
  "message": "Todo berhasil diselesaikan",
  "data": {
    "_id": "ObjectId",
    "status": "completed",
    "completedAt": "2026-09-25T10:00:00.000Z"
  }
}
```

### Activity Log

Mencatat aktivitas:

```text
action: complete
resource: Todo
```

---

# 4. Category API

Endpoint untuk mengelola kategori Todo.

## 4.1 Get All Categories

### Endpoint

`GET /api/categories`

### Access

Authenticated User

### Description

Mengambil seluruh kategori milik pengguna yang sedang login.

### Headers

```text
Authorization: Bearer <JWT_TOKEN>
```

### Response Success

```json
{
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "user": "ObjectId",
      "name": "Kuliah",
      "description": "Kategori untuk tugas kuliah"
    }
  ]
}
```

---

## 4.2 Get Category by ID

### Endpoint

`GET /api/categories/:id`

### Access

Authenticated User

### Description

Mengambil detail kategori berdasarkan ID.

### Headers

```text
Authorization: Bearer <JWT_TOKEN>
```

### Response Success

```json
{
  "success": true,
  "data": {
    "_id": "ObjectId",
    "user": "ObjectId",
    "name": "Kuliah",
    "description": "Kategori untuk tugas kuliah"
  }
}
```

---

## 4.3 Create Category

### Endpoint

`POST /api/categories`

### Access

Authenticated User

### Description

Membuat kategori Todo baru.

### Headers

```text
Authorization: Bearer <JWT_TOKEN>
```

### Request Body

```json
{
  "name": "Kuliah",
  "description": "Kategori untuk tugas kuliah"
}
```

### Response Success

```json
{
  "success": true,
  "message": "Category berhasil dibuat",
  "data": {
    "_id": "ObjectId",
    "name": "Kuliah",
    "description": "Kategori untuk tugas kuliah"
  }
}
```

### Activity Log

Mencatat aktivitas:

```text
action: create
resource: Category
```

---

## 4.4 Update Category

### Endpoint

`PUT /api/categories/:id`

### Access

Authenticated User

### Description

Mengubah data kategori.

### Headers

```text
Authorization: Bearer <JWT_TOKEN>
```

### Request Body

```json
{
  "name": "Project Kuliah",
  "description": "Kategori untuk project dan tugas kuliah"
}
```

### Response Success

```json
{
  "success": true,
  "message": "Category berhasil diperbarui",
  "data": {
    "_id": "ObjectId",
    "name": "Project Kuliah",
    "description": "Kategori untuk project dan tugas kuliah"
  }
}
```

### Activity Log

Mencatat aktivitas:

```text
action: update
resource: Category
```

---

## 4.5 Delete Category

### Endpoint

`DELETE /api/categories/:id`

### Access

Authenticated User

### Description

Menghapus kategori berdasarkan ID.

### Headers

```text
Authorization: Bearer <JWT_TOKEN>
```

### Response Success

```json
{
  "success": true,
  "message": "Category berhasil dihapus"
}
```

### Activity Log

Mencatat aktivitas:

```text
action: delete
resource: Category
```

---

# 5. Activity Log API

Endpoint untuk melihat riwayat aktivitas pengguna dalam sistem.

## 5.1 Get Activity Logs

### Endpoint

`GET /api/activity-logs`

### Access

Authenticated User

### Description

Mengambil riwayat aktivitas pengguna.

### Headers

```text
Authorization: Bearer <JWT_TOKEN>
```

### Query Parameters

```text
?page=1&limit=10
```

Filter yang dapat digunakan:

```text
?action=create
?resource=Todo
```

### Response Success

```json
{
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "user": "ObjectId",
      "action": "create",
      "resource": "Todo",
      "resourceId": "ObjectId",
      "description": "User membuat Todo baru",
      "metadata": {},
      "createdAt": "2026-09-25T10:00:00.000Z"
    }
  ]
}
```

---

## 5.2 Get Activity Log by ID

### Endpoint

`GET /api/activity-logs/:id`

### Access

Authenticated User

### Description

Mengambil detail aktivitas berdasarkan ID.

### Headers

```text
Authorization: Bearer <JWT_TOKEN>
```

### Response Success

```json
{
  "success": true,
  "data": {
    "_id": "ObjectId",
    "user": "ObjectId",
    "action": "create",
    "resource": "Todo",
    "resourceId": "ObjectId",
    "description": "User membuat Todo baru",
    "metadata": {},
    "createdAt": "2026-09-25T10:00:00.000Z"
  }
}
```

---

# 6. Statistics API

Endpoint untuk mendapatkan statistik Todo pengguna.

## 6.1 Get Todo Statistics

### Endpoint

`GET /api/stats`

### Access

Authenticated User

### Description

Mengambil ringkasan statistik Todo milik pengguna.

### Headers

```text
Authorization: Bearer <JWT_TOKEN>
```

### Response Success

```json
{
  "success": true,
  "data": {
    "total": 20,
    "pending": 8,
    "inProgress": 5,
    "completed": 7
  }
}
```

### Statistik

Data statistik yang dapat ditampilkan:

- Total Todo
- Total Todo dengan status `pending`
- Total Todo dengan status `in_progress`
- Total Todo dengan status `completed`

---

## 6.2 Todo Statistics by Category

### Endpoint

`GET /api/stats/categories`

### Access

Authenticated User

### Description

Mengambil jumlah Todo berdasarkan kategori.

### Headers

```text
Authorization: Bearer <JWT_TOKEN>
```

### Response Success

```json
{
  "success": true,
  "data": [
    {
      "category": "Kuliah",
      "total": 10
    },
    {
      "category": "Pribadi",
      "total": 5
    }
  ]
}
```

---

# 7. API Access Rules

| Resource | Endpoint | Method | Access |
|---|---|---|---|
| Auth | `/api/auth/register` | POST | Public |
| Auth | `/api/auth/login` | POST | Public |
| Auth | `/api/auth/me` | GET | Authenticated |
| Auth | `/api/auth/logout` | POST | Authenticated |
| Todo | `/api/todos` | GET | Authenticated |
| Todo | `/api/todos/:id` | GET | Authenticated |
| Todo | `/api/todos` | POST | Authenticated |
| Todo | `/api/todos/:id` | PUT | Authenticated |
| Todo | `/api/todos/:id` | DELETE | Authenticated |
| Todo | `/api/todos/:id/complete` | PATCH | Authenticated |
| Category | `/api/categories` | GET | Authenticated |
| Category | `/api/categories/:id` | GET | Authenticated |
| Category | `/api/categories` | POST | Authenticated |
| Category | `/api/categories/:id` | PUT | Authenticated |
| Category | `/api/categories/:id` | DELETE | Authenticated |
| Activity Log | `/api/activity-logs` | GET | Authenticated |
| Activity Log | `/api/activity-logs/:id` | GET | Authenticated |
| Statistics | `/api/stats` | GET | Authenticated |
| Statistics | `/api/stats/categories` | GET | Authenticated |

---

# 8. HTTP Status Code

API menggunakan HTTP status code sesuai dengan kondisi response.

| Status Code | Description |
|---|---|
| `200` | Request berhasil |
| `201` | Data berhasil dibuat |
| `400` | Request tidak valid / validation error |
| `401` | Tidak terautentikasi |
| `403` | Tidak memiliki hak akses |
| `404` | Resource tidak ditemukan |
| `409` | Terjadi konflik data |
| `500` | Internal server error |

---

# 9. Authentication

Endpoint yang membutuhkan autentikasi menggunakan JWT.

Format header:

```text
Authorization: Bearer <JWT_TOKEN>
```

JWT digunakan untuk mengidentifikasi pengguna yang sedang melakukan request.

Data `user` pada resource Todo, Category, dan Activity Log menggunakan referensi ke collection `User`.

---

# 10. Resource Relationship

Relasi antar resource:

```text
User
 │
 ├── Todo
 │    └── Category
 │
 ├── Category
 │
 └── Activity Log
      └── Resource
```

### User → Todo

Satu User dapat memiliki banyak Todo.

```text
User 1 ---- * Todo
```

### User → Category

Satu User dapat memiliki banyak Category.

```text
User 1 ---- * Category
```

### Category → Todo

Satu Category dapat digunakan oleh banyak Todo.

```text
Category 1 ---- * Todo
```

### User → Activity Log

Satu User dapat memiliki banyak Activity Log.

```text
User 1 ---- * Activity Log
```

---

# 11. Summary

API Todos List terdiri dari beberapa kelompok endpoint utama:

- Authentication untuk registrasi dan login pengguna.
- Todo untuk membuat dan mengelola daftar tugas.
- Category untuk mengelompokkan Todo.
- Activity Log untuk mencatat aktivitas pengguna.
- Statistics untuk menampilkan ringkasan data Todo.

Seluruh endpoint yang berkaitan dengan data pengguna menggunakan autentikasi JWT untuk memastikan data hanya dapat diakses oleh pengguna yang memiliki hak akses.