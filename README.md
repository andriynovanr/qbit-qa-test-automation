# QA Test Assignment - Playwright Automation

Proyek automation testing untuk QA Test Assignment menggunakan Playwright dengan TypeScript.

## 📋 Ringkasan Project

Project ini berisi **60 automated tests** untuk 3 skenario testing:

| Skenario | Jumlah Test | Deskripsi |
|----------|-------------|-----------|
| **Input Profile** | 19 tests | Testing form input dengan validasi field |
| **Borobudur Marathon** | 18 tests | Testing website live borobudurmarathon.com |
| **E-commerce Flow** | 23 tests | Testing flow split payment & diskon |

## 🗂️ Struktur Folder

```
qbit-qa-test/
├── pages/                      # Page Object Model (POM)
│   ├── InputProfilePage.ts
│   ├── BorobudurMarathonPage.ts
│   └── EcommercePage.ts
├── tests/                      # Test automation scripts
│   ├── input-profile.spec.ts
│   ├── borobudur-marathon.spec.ts
│   └── ecommerce-flow.spec.ts
└── playwright.config.ts        # Konfigurasi Playwright
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
npx playwright install
```

### 2. Jalankan Test
```bash
# Jalankan semua test
npm test

# Jalankan test tertentu
npm test input-profile
npm test borobudur-marathon
npm test ecommerce-flow
```

### 3. Lihat Report
```bash
npm run report
```

## 📝 Test Cases

### 1. Input Profile Form (19 tests)
Testing form input dengan validasi field wajib dan opsional.

**Field Wajib:** First Name, Nickname, Gender, Birth Date  
**Field Opsional:** Middle Name, Last Name

**Coverage:**
- Validasi field wajib dan opsional
- Validasi input (karakter khusus, batas maksimal)
- Responsivitas UI

### 2. Borobudur Marathon Website (18 tests)
Testing website live https://borobudurmarathon.com/

**Coverage:**
- Navigasi menu dan halaman
- Scroll ke section (The Race, Program, Media, Contact)
- Responsivitas (mobile & tablet)
- Handling URL tidak valid

### 3. E-commerce Flow (23 tests)
Testing flow split payment dan sistem diskon.

**Coverage:**
- Split payment 40:60 (Tunai & QRIS)
- Diskon minimal belanja Rp 100.000
- Manajemen keranjang (tambah, hapus, hitung total)
- Alur pembayaran dan pembuatan struk

## 🛠️ Commands

| Command | Deskripsi |
|---------|-----------|
| `npm test` | Jalankan semua test (headless) |
| `npm run test:headed` | Jalankan test dengan browser visible |
| `npm run test:ui` | Buka Playwright UI Mode |
| `npm run report` | Buka HTML test report |

## 📊 Test Results

### Summary
- **Total Tests:** 60
- **Input Profile:** 19 tests
- **Borobudur Marathon:** 18 tests (✅ All Passed)
- **E-commerce:** 23 tests

## 🔧 Technology Stack

- **Playwright** - Framework automation testing
- **TypeScript** - Programming language
- **Node.js** - Runtime environment
- **Page Object Model** - Design pattern untuk maintainability


## 📧 Contact

Assignment untuk: **qbit.co.id**

---

**Note:** Test untuk Input Profile dan E-commerce menggunakan mock URL untuk simulasi, sedangkan Borobudur Marathon menggunakan website live yang sebenarnya.
