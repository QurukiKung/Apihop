# Server Finder — API Hop (Vercel Edge)

## โครงสร้างไฟล์
```
api-hop/
├── api/
│   └── servers.js    ← Edge Function หลัก
├── vercel.json
└── package.json
```

## วิธี Deploy

### 1. แก้ URL ต้นทาง
เปิด `api/servers.js` แล้วแก้บรรทัดนี้:
```js
const SOURCE_API_URL = "https://YOUR_SOURCE_API.com/servers";
```

### 2. Deploy ผ่าน Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### 3. Deploy ผ่าน GitHub (แนะนำ)
1. Push โฟลเดอร์นี้ขึ้น GitHub repo
2. ไปที่ https://vercel.com → Import Project
3. เลือก repo → Deploy

## URL ที่ได้
```
https://your-project.vercel.app/api/servers
```
นำ URL นี้ไปใส่ใน **API Endpoint** ของ Server Finder ได้เลย

## สิ่งที่ API Hop ทำ
- ✅ Proxy ไปยัง API ต้นทาง (แก้ปัญหา CORS)
- ✅ กรอง server เต็มออก (player_count >= max_players)
- ✅ เพิ่ม header `cached_at` ให้รู้เวลา
- ✅ Cache ที่ Vercel Edge 1 วินาที
- ✅ รองรับ CORS จากทุก origin
