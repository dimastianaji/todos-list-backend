# Data Structure --- Todos List

## 1. Overview

Dokumen ini mendefinisikan struktur dokumen yang akan digunakan pada
backend aplikasi **Todos List**. Struktur data dibagi menjadi empat
resource utama:

1.  User
2.  Todo
3.  Category
4.  Activity Log

Dokumen ini menjadi acuan pada tahap perancangan database dan
implementasi Mongoose Schema.

------------------------------------------------------------------------

# 2. Resource User

Resource `User` digunakan untuk menyimpan data akun pengguna yang dapat
mengakses aplikasi.

## 2.1 Fields

  --------------------------------------------------------------------------
  Field         Type                 Required           Unique Description
  ------------- ------------ ---------------- ---------------- -------------
  `_id`         ObjectId                 Auto              Yes Identifier
                                                               unik pengguna
                                                               yang dibuat
                                                               oleh MongoDB

  `name`        String                    Yes               No Nama pengguna

  `email`       String                    Yes              Yes Alamat email
                                                               pengguna

  `password`    String                    Yes               No Password yang
                                                               telah di-hash
                                                               menggunakan
                                                               bcryptjs

  `role`        String                    Yes               No Role
                                                               pengguna,
                                                               misalnya
                                                               `user` atau
                                                               `admin`

  `createdAt`   Date                     Auto               No Waktu ketika
                                                               akun dibuat

  `updatedAt`   Date                     Auto               No Waktu ketika
                                                               data akun
                                                               terakhir
                                                               diperbarui
  --------------------------------------------------------------------------

## 2.2 Allowed Values

### Role

-   `user`
-   `admin`

## 2.3 Example Document

``` json
{
  "_id": "ObjectId",
  "name": "Nama User",
  "email": "user@example.com",
  "password": "hashed_password",
  "role": "user",
  "createdAt": "2026-09-25T00:00:00.000Z",
  "updatedAt": "2026-09-25T00:00:00.000Z"
}
```

> Password tidak disimpan dalam bentuk plaintext. Password harus di-hash
> sebelum disimpan ke database.

------------------------------------------------------------------------

# 3. Resource Todo

Resource `Todo` digunakan untuk menyimpan tugas yang dibuat dan dikelola
oleh pengguna.

## 3.1 Fields

  Field           Type         Required Description
  --------------- ---------- ---------- ----------------------------------------
  `_id`           ObjectId         Auto Identifier unik Todo
  `user`          ObjectId          Yes Referensi ke User sebagai pemilik Todo
  `category`      ObjectId           No Referensi ke Category
  `title`         String            Yes Judul atau nama Todo
  `description`   String             No Deskripsi atau detail Todo
  `status`        String            Yes Status pengerjaan Todo
  `priority`      String            Yes Tingkat prioritas Todo
  `dueDate`       Date               No Batas waktu penyelesaian Todo
  `completedAt`   Date               No Waktu ketika Todo diselesaikan
  `createdAt`     Date             Auto Waktu ketika Todo dibuat
  `updatedAt`     Date             Auto Waktu ketika Todo terakhir diperbarui

## 3.2 Allowed Values

### Status

-   `pending` --- Todo belum mulai dikerjakan.
-   `in_progress` --- Todo sedang dikerjakan.
-   `completed` --- Todo telah selesai.

### Priority

-   `low`
-   `medium`
-   `high`

## 3.3 Example Document

``` json
{
  "_id": "ObjectId",
  "user": "UserObjectId",
  "category": "CategoryObjectId",
  "title": "Mengerjakan laporan",
  "description": "Menyelesaikan laporan proyek Todos List",
  "status": "in_progress",
  "priority": "high",
  "dueDate": "2026-09-30T00:00:00.000Z",
  "completedAt": null,
  "createdAt": "2026-09-25T00:00:00.000Z",
  "updatedAt": "2026-09-25T00:00:00.000Z"
}
```

------------------------------------------------------------------------

# 4. Resource Category

Resource `Category` digunakan untuk mengelompokkan Todo berdasarkan
kategori tertentu.

## 4.1 Fields

  ------------------------------------------------------------------------
  Field            Type                          Required Description
  ---------------- ---------------- --------------------- ----------------
  `_id`            ObjectId                          Auto Identifier unik
                                                          kategori

  `user`           ObjectId                           Yes Referensi ke
                                                          User sebagai
                                                          pemilik kategori

  `name`           String                             Yes Nama kategori

  `description`    String                              No Deskripsi
                                                          kategori

  `createdAt`      Date                              Auto Waktu ketika
                                                          kategori dibuat

  `updatedAt`      Date                              Auto Waktu ketika
                                                          kategori
                                                          terakhir
                                                          diperbarui
  ------------------------------------------------------------------------

## 4.2 Example Document

``` json
{
  "_id": "ObjectId",
  "user": "UserObjectId",
  "name": "Project",
  "description": "Kategori untuk pekerjaan project",
  "createdAt": "2026-09-25T00:00:00.000Z",
  "updatedAt": "2026-09-25T00:00:00.000Z"
}
```

## 4.3 Example Categories

Contoh kategori yang dapat dibuat oleh pengguna:

-   Kuliah
-   Project
-   Personal
-   Work

Daftar tersebut hanya merupakan contoh. Pengguna dapat membuat kategori
sesuai kebutuhan aplikasi.

------------------------------------------------------------------------

# 5. Resource Activity Log

Resource `Activity Log` digunakan untuk mencatat aktivitas pengguna di
dalam sistem. Log dapat digunakan untuk mengetahui aktivitas seperti
membuat, mengubah, menghapus, atau menyelesaikan Todo.

## 5.1 Fields

  ------------------------------------------------------------------------
  Field            Type                          Required Description
  ---------------- ---------------- --------------------- ----------------
  `_id`            ObjectId                          Auto Identifier unik
                                                          activity log

  `user`           ObjectId                           Yes Referensi ke
                                                          User yang
                                                          melakukan
                                                          aktivitas

  `action`         String                             Yes Jenis aktivitas
                                                          yang dilakukan

  `resource`       String                             Yes Resource yang
                                                          terkena
                                                          aktivitas

  `resourceId`     ObjectId                            No Identifier dari
                                                          resource yang
                                                          terkena
                                                          aktivitas

  `description`    String                             Yes Deskripsi
                                                          aktivitas

  `metadata`       Object                              No Data tambahan
                                                          yang berkaitan
                                                          dengan aktivitas

  `createdAt`      Date                              Auto Waktu aktivitas
                                                          dilakukan
  ------------------------------------------------------------------------

## 5.2 Allowed Values

### Action

Contoh aktivitas:

-   `create`
-   `update`
-   `delete`
-   `complete`
-   `login`
-   `logout`

### Resource

Contoh resource:

-   `User`
-   `Todo`
-   `Category`

Nilai `action` dan `resource` dapat diperluas apabila kebutuhan sistem
pada tahap implementasi mengharuskannya.

## 5.3 Example Document

``` json
{
  "_id": "ObjectId",
  "user": "UserObjectId",
  "action": "create",
  "resource": "Todo",
  "resourceId": "TodoObjectId",
  "description": "Membuat Todo baru",
  "metadata": {},
  "createdAt": "2026-09-25T00:00:00.000Z"
}
```

------------------------------------------------------------------------

# 6. Relationships

Hubungan antar resource dirancang sebagai berikut.

## 6.1 User → Todo

Satu `User` dapat memiliki banyak `Todo`.

``` text
User 1 ──────────── * Todo
```

Pada dokumen `Todo`, field `user` menyimpan `ObjectId` dari User.

------------------------------------------------------------------------

## 6.2 User → Category

Satu `User` dapat memiliki banyak `Category`.

``` text
User 1 ──────────── * Category
```

Pada dokumen `Category`, field `user` menyimpan `ObjectId` dari User.

------------------------------------------------------------------------

## 6.3 Category → Todo

Satu `Category` dapat digunakan oleh banyak `Todo`.

``` text
Category 1 ──────── * Todo
```

Pada dokumen `Todo`, field `category` menyimpan `ObjectId` dari
Category.

------------------------------------------------------------------------

## 6.4 User → Activity Log

Satu `User` dapat memiliki banyak `Activity Log`.

``` text
User 1 ──────────── * Activity Log
```

Pada dokumen `Activity Log`, field `user` menyimpan `ObjectId` dari
User.

------------------------------------------------------------------------

## 6.5 Activity Log → Resource

Satu `Activity Log` dapat mengacu pada resource tertentu melalui
kombinasi:

-   `resource`
-   `resourceId`

Contoh:

``` text
action     : create
resource   : Todo
resourceId : TodoObjectId
```

Dengan struktur tersebut, sistem dapat mengetahui aktivitas apa yang
dilakukan dan resource mana yang berkaitan dengan aktivitas tersebut.

------------------------------------------------------------------------

# 7. Relationship Overview

``` text
                         ┌─────────────┐
                         │    USER     │
                         └──────┬──────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              │                 │                 │
              ▼                 ▼                 ▼
        ┌───────────┐      ┌──────────┐     ┌───────────────┐
        │   TODO    │      │ CATEGORY │     │ ACTIVITY LOG  │
        └─────┬─────┘      └────┬─────┘     └───────────────┘
              │                 │
              └─────────────────┘
```

Relasi utamanya:

``` text
User
 ├── has many → Todo
 ├── has many → Category
 └── has many → Activity Log

Todo
 ├── belongs to → User
 └── belongs to → Category

Category
 └── belongs to → User

Activity Log
 ├── belongs to → User
 └── references → Resource
```

------------------------------------------------------------------------

# 8. Data Validation Considerations

Beberapa aturan validasi yang perlu diperhatikan ketika schema
diimplementasikan:

1.  `User.email` harus memiliki format email yang valid.
2.  `User.email` harus unik.
3.  `User.password` harus disimpan dalam bentuk hash.
4.  `User.role` hanya menggunakan role yang tersedia.
5.  `Todo.title` wajib diisi.
6.  `Todo.status` hanya menggunakan status yang telah ditentukan.
7.  `Todo.priority` hanya menggunakan prioritas yang telah ditentukan.
8.  `Todo.user` harus mengacu pada User yang valid.
9.  `Todo.category`, jika diisi, harus mengacu pada Category yang valid.
10. `Category.name` wajib diisi.
11. `Activity Log.user` harus mengacu pada User yang valid.
12. `Activity Log.action` dan `Activity Log.resource` harus menggunakan
    nilai yang valid.
13. `createdAt` dan `updatedAt` dikelola secara otomatis oleh Mongoose
    ketika schema diimplementasikan dengan timestamps.

------------------------------------------------------------------------

# 9. Summary

  -----------------------------------------------------------------------
  Resource                Fungsi Utama            Relasi Utama
  ----------------------- ----------------------- -----------------------
  `User`                  Menyimpan data akun     Memiliki Todo,
                          pengguna                Category, dan Activity
                                                  Log

  `Todo`                  Menyimpan daftar tugas  Dimiliki User dan dapat
                                                  memiliki Category

  `Category`              Mengelompokkan Todo     Dimiliki User dan
                                                  digunakan oleh Todo

  `Activity Log`          Mencatat aktivitas      Dimiliki User dan
                          sistem                  mengacu pada resource
                                                  tertentu
  -----------------------------------------------------------------------

Struktur data pada dokumen ini akan digunakan sebagai dasar untuk tahap
berikutnya, yaitu pembuatan **Mongoose Schema dan Collection** untuk
masing-masing resource.
