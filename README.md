# <img src="https://github.com/Moha0170/vizsgaremek2025/blob/main/frontend/hypercharge.png" alt="drawing" width="60" height="60"/>  Hypercharge webshop mobilalkalmazás 😱



## App futtatása

1. Töltsük le a szükséges fájlokat 🤙

   ```bash
   npm install
   ```

2. irjuk át a frontend és a backend cimeket 🤩

         // 🌐 FRONTEND CÍM
         const [currentUrl, setCurrentUrl] = useState('🔶 http://26.44.9.76:5173/ 🔶');

         // 🔁 BACKEND CÍM
         const response = await fetch(`🔷 http://192.168.0.4:5000 🔷/coupon/addCoupon/${encodedType}`);




3. irjuk át a frontend .env nevű fájlban a localhost helyett a backend cimét 🤔

        Eredeti:
         - VITE_API_URI=http://localhost:5000   🔴
         
         Új:
         + VITE_API_URI=http://192.168.0.4:5000 🔵



4. Inditsük el az appot 😎

   ```bash
    npx expo start
   ```

## Projekt leírása

A **Hypercharge Market** egy webshop alkalmazás, amely lehetővé teszi a felhasználók számára a termékek böngészését, vásárlását.

### Főbb funkciók

- Termékek listázása és keresése
- Termék részleteinek megtekintése
- Kosárba helyezés
- Felhasználói profil
- Admin felület a termékek kezelésére
- +Mobil részen egy szerencsekerék funkció van, ami kuponkódot generál

---
## 💻 Webshop 

🔗 **A projekt Frontend és Backend részére készített GitHub repo:** [Frontend+Backend](https://github.com/Moha0170/vizsgaremek2025)
