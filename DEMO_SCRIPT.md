# BOLTLOOP Demo Script (Video Voiceover)

**Duration:** 2–4 minutes  
**App:** BOLTLOOP — Suppliers App (Hardware)  
**Figma Link:** https://www.figma.com/design/MgQAAUktJpEogHoTOlpa5s/SELF?node-id=0-1&t=KexTXqy8Kt0parpU-1

## Recording Setup

- **Screen recording:** Capture your screen showing Figma in a browser, then the iPhone running Expo Go (side-by-side works well).
- **Audio:** Clear microphone, test levels before starting.
- **Terminal:** Show briefly at the start (`npx expo start --tunnel`).
- **Device:** iPhone with Expo Go installed, on same network or using tunnel.

## Script

### 0:00 – 0:15 | Introduction
**Visual:** Show Figma file/page on screen (or title card).  
**Voiceover:**
> "I'm [Your Name]. This is a demonstration of BOLTLOOP — a suppliers app for hardware, covering Dashboard, Inventory, POS, Payment, and Reports."

---

### 0:15 – 0:45 | Show Figma Design Reference
**Visual:** Open/navigate the Figma link. Flip through the 5 main frames (Dashboard, Inventory, POS, Payment, Reports). Highlight spacing, radius, colors, and typography.
**Voiceover:**
> "Here is the Figma design reference. The theme follows a 60:30:10 palette with background #CAF7E2, primary #386150, and accent #F59E0B. Layout is based on iPhone 12 Pro Max at 428 by 926."

---

### 0:45 – 1:15 | Run App & Dashboard
**Visual:** Terminal shows `cd boltloop && npx expo start --tunnel`, QR code visible. Expo Go scans QR and app loads to Dashboard.
**Voiceover:**
> "Running in Expo Go with no custom native code. On first launch, the store is fresh — no sales yet, revenue, orders, and values are all zero dollars as specified. Recent orders is empty, ready for the first sale."

---

### 1:15 – 2:15 | POS Flow (Core Demo)
**Visual:** Switch to POS tab. Show cart empty. Add a couple of products (tap +). Cart count and total update in real time. Tap Charge, go to Checkout. Select a payment method (e.g. Cash). Tap Collect to reach Confirmation screen.
**Voiceover:**
> "This is the working POS flow — add items to cart, see totals update, proceed to checkout, select a payment method, and complete the sale with a confirmation screen."

---

### 2:15 – 3:00 | Data Propagates Across App
**Visual:** Return to Dashboard — Recent Orders appears, Today's Sales and Orders update. Go to Inventory — stock decremented. Go to Payment — recent transaction appears; if Pay later was chosen, Amount Due reflects it. Go to Reports — Revenue, Profit, Orders, Average Order update; switch between Today, 7D, 30D, and Custom range.
**Voiceover:**
> "All data persists locally with AsyncStorage. When a sale completes, stock decreases and the numbers update in real time across Dashboard, Inventory, Payment, and Reports."

---

### 3:00 – 3:45 | Inventory Management + Search/Menu
**Visual:** Inventory tab. Tap + to open Add Item modal, create a new product, save — it appears in the list. Use search to filter live. Show categories filtering. Tap the bell (Notifications) and the hamburger (Menu) briefly.
**Voiceover:**
> "You can add and edit inventory items. Search filters live across name, variant, and category. Quick actions like notifications and navigation are wired in."

---

### 3:45 – 4:00 | Wrap Up
**Visual:** Show the app name "BOLTLOOP" on screen (Dashboard header or splash area).
**Voiceover:**
> "BOLTLOOP — a suppliers app for hardware, built with Expo and TypeScript, ready to run on iOS via Expo Go. Thank you."

## Notes
- Keep movements smooth and deliberate. Don't rush narration.
- If you want a tighter video (closer to 2 minutes), trim the middle sections slightly.
- For the cleanest demo, consider resetting the store state before recording (fresh install / clear AsyncStorage) so it shows "no sales yet" clearly.