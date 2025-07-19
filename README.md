# Mini Project Dashboard Web App

📊 **ระบบจัดการข้อมูลสินค้าและการวิเคราะห์ข้อมูล** สร้างด้วย Next.js และ Supabase

## 🚀 Features

### 🔐 Authentication System
- ✅ ระบบลงทะเบียน/เข้าสู่ระบบ
- ✅ Forgot Password & Reset Password
- ✅ Session Management ด้วย Cookies
- ✅ Password Security Logging

### 📋 Data Management
- ✅ จัดการข้อมูลสินค้า (เพิ่ม/แก้ไข/ลบ)
- ✅ ระบบหัวข้อ (Topics) สำหรับจัดกลุ่มข้อมูล
- ✅ การค้นหาและกรองข้อมูล
- ✅ การเรียงลำดับข้อมูลหลายเกณฑ์
- ✅ กรองตามช่วงวันที่
- ✅ Pagination

### 🎨 User Interface
- ✅ Responsive Design ด้วย Tailwind CSS
- ✅ Dark/Light Theme Toggle
- ✅ Interactive Data Tables
- ✅ Real-time Data Updates
- ✅ Toast Notifications
- ✅ Loading States

### 📊 Analytics & Visualization
- ✅ Dashboard ภาพรวมข้อมูล
- ✅ กราฟแสดงข้อมูลด้วย Chart.js
- ✅ สถิติข้อมูลแบบ Real-time

### 💾 Advanced Features
- ✅ Bulk Edit Mode (แก้ไขหลายรายการพร้อมกัน)
- ✅ Soft Delete ด้วย Undo Functionality
- ✅ Data Validation
- ✅ Error Handling
- ✅ Security Audit Logging

## 🛠️ Tech Stack

- **Frontend:** Next.js 15.4.1, React 19.1.0, TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Charts:** Chart.js, React-ChartJS-2
- **HTTP Client:** Axios
- **Icons:** Heroicons (SVG)

## 📂 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication APIs
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── logout/
│   │   │   ├── forgot_password/
│   │   │   ├── reset_password/
│   │   │   └── me/
│   │   ├── form/          # Data CRUD APIs
│   │   ├── topic/         # Topic Management
│   │   └── stats/         # Analytics APIs
│   ├── component/         # Reusable Components
│   │   ├── DataTable/
│   │   ├── Navbar/
│   │   ├── Popup/
│   │   ├── LoadingSpinner/
│   │   ├── ToastNotification/
│   │   └── ...
│   ├── context/          # React Context
│   │   ├── useAuth.tsx
│   │   └── useTheme.tsx
│   ├── pages/            # App Pages
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot_password/
│   │   └── reset_password/
│   └── utils/            # Utilities
│       ├── auth.ts
│       └── supabase.ts
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm หรือ yarn
- Supabase Account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/wuttichai-jeenkaew/Mini-Project-Dashboard.git
cd mini-project-web-app
```

2. **Install dependencies**
```bash
npm install
# หรือ
yarn install
```

3. **Setup Environment Variables**

สร้างไฟล์ `.env.local` ใน root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# JWT Secret (สำหรับ development)
JWT_SECRET=your_jwt_secret_key
```

4. **Setup Supabase Database**

สร้างตารางในฐานข้อมูล Supabase:

```sql
-- Users table (จะถูกสร้างอัตโนมัติโดย Supabase Auth)

-- Topics table
CREATE TABLE topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forms table
CREATE TABLE forms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    color VARCHAR(50),
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Password reset logs table
CREATE TABLE password_reset_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (for additional user data)
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

5. **Setup Row Level Security (RLS)**

```sql
-- Enable RLS
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can access their own data" ON topics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own data" ON forms FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own data" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can access their own logs" ON password_reset_logs FOR SELECT USING (auth.uid() = user_id);
```

6. **Run the development server**
```bash
npm run dev
# หรือ
yarn dev
```

เปิดเบราว์เซอร์และไปที่ [http://localhost:3000](http://localhost:3000)

## 📱 Usage Guide

### 1. การเริ่มต้นใช้งาน

1. **ลงทะเบียน**: ไปที่ `/pages/register` เพื่อสร้างบัญชี
2. **เข้าสู่ระบบ**: ไปที่ `/pages/login` เพื่อเข้าสู่ระบบ
3. **Dashboard**: หลังเข้าสู่ระบบจะไปที่หน้า Dashboard โดยอัตโนมัติ

### 2. การจัดการหัวข้อ (Topics)

- **เพิ่มหัวข้อใหม่**: คลิกปุ่ม "+" ข้างหัวข้อ
- **แก้ไขหัวข้อ**: คลิกปุ่มแก้ไขข้างชื่อหัวข้อ
- **ลบหัวข้อ**: คลิกปุ่มลบ (จะลบข้อมูลในหัวข้อนั้นทั้งหมด)

### 3. การจัดการข้อมูลสินค้า

#### เพิ่มข้อมูล
- คลิกปุ่ม "เพิ่มข้อมูล" สีน้ำเงิน
- กรอกข้อมูล: วันที่, ชื่อสินค้า, สี, จำนวน, หน่วย
- คลิก "บันทึก"

#### แก้ไขข้อมูลทีละรายการ
- คลิกปุ่ม "แก้ไข" สีเขียว
- แก้ไขข้อมูลในตาราง
- คลิกปุ่มลบเพื่อลบรายการ (สามารถ Undo ได้)
- คลิก "บันทึก" เพื่อยืนยัน หรือ "ยกเลิก" เพื่อไม่บันทึก

#### การค้นหาและกรอง
- **ค้นหา**: ใช้ช่องค้นหาด้านบน
- **กรองวันที่**: คลิกไอคอนปฏิทินในคอลัมน์วันที่
- **เรียงลำดับ**: คลิกหัวคอลัมน์เพื่อเรียงลำดับ
- **ล้างการกรอง**: คลิกปุ่ม "ล้างการกรอง" สีแดง

### 4. การดูกราฟและสถิติ

- ไปที่ `/dashboard/graph` เพื่อดูกราฟและการวิเคราะห์ข้อมูล
- ดูสถิติสรุปที่ด้านบนของหน้า Dashboard

### 5. การจัดการบัญชี

- **เปลี่ยนรหัสผ่าน**: ไปที่ `/pages/forgot_password`
- **ออกจากระบบ**: คลิกปุ่มออกจากระบบที่ Navbar

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - ลงทะเบียน
- `POST /api/auth/login` - เข้าสู่ระบบ
- `POST /api/auth/logout` - ออกจากระบบ
- `GET /api/auth/me` - ดูข้อมูลผู้ใช้
- `POST /api/auth/forgot_password` - ขอรีเซ็ตรหัสผ่าน
- `POST /api/auth/reset_password` - รีเซ็ตรหัสผ่าน

### Data Management
- `GET /api/form` - ดึงข้อมูลสินค้า (พร้อม pagination และ filtering)
- `POST /api/form` - เพิ่มข้อมูลใหม่
- `PATCH /api/form/[id]` - แก้ไขข้อมูล
- `DELETE /api/form/[id]` - ลบข้อมูล

### Topics
- `GET /api/topic` - ดึงรายการหัวข้อ
- `POST /api/topic` - เพิ่มหัวข้อใหม่
- `PATCH /api/topic/[id]` - แก้ไขหัวข้อ
- `DELETE /api/topic/[id]` - ลบหัวข้อ

### Analytics
- `GET /api/stats` - ดึงสถิติและข้อมูลสำหรับกราฟ

## 🚀 Deployment

### Vercel (แนะนำ)

1. Push โค้ดขึ้น GitHub
2. เชื่อมต่อ Vercel กับ GitHub repository
3. ตั้งค่า Environment Variables ใน Vercel Dashboard
4. Deploy

### ข้อมูล Environment Variables สำหรับ Production

```env
Contact Email: [wuttichai.jennkaew@gmail.com]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Wuttichai Jeenkaew** - [GitHub Profile](https://github.com/wuttichai-jeenkaew)


## 📞 Support

หากต้องการความช่วยเหลือ สามารถติดต่อได้ที่:
- GitHub Issues
- Email: [wuttichai.jennkaew@gmail.com]

---

**Happy Coding! 🎉**
