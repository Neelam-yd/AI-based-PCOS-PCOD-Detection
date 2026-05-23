# PCOS / PCOD AI Detection System
### B.Tech CSE Final Year Project

---

## SETUP ON WINDOWS LAPTOP (Step-by-Step)

---

### STEP 1 — Install Node.js

1. Open browser → go to https://nodejs.org
2. Download the **LTS** version (big green button)
3. Open the downloaded `.msi` file → Click Next → Next → Install → Finish
4. Restart your laptop after install
5. To verify: press **Win+R** → type `cmd` → Enter
6. Type `node -v` → should show v18 or v20
7. Type `npm -v`  → should show a version number

---

### STEP 2 — Extract the Project

1. Right-click `pcos-detection.zip` → Extract All
2. Put the extracted folder on your Desktop

---

### STEP 3 — Open Command Prompt in the Project Folder

Option A (easy):
1. Open the `pcos-detection` folder
2. Click on the address bar at the top
3. Type `cmd` and press Enter → Command Prompt opens inside the folder

Option B:
1. Press Win+R → type `cmd` → Enter
2. Type: `cd C:\Users\YourName\Desktop\pcos-detection`

---

### STEP 4 — Install Dependencies

In Command Prompt, type:
```
npm install
```
Wait 1–2 minutes. A `node_modules` folder will appear.

---

### STEP 5 — Run the Project

```
npm run dev
```

You will see:
```
▲ Next.js 14.2.3
- Local:  http://localhost:3000
```

---

### STEP 6 — Open in Browser

Go to: **http://localhost:3000**

Your website is now running! ✅

---

## PAGES

| Page | URL |
|------|-----|
| Home Page | http://localhost:3000 |
| Image Detection | http://localhost:3000/detection |
| AI Chatbot | http://localhost:3000/chatbot |

---

## HOW TO GET THE FREE API KEY (for Chatbot)

1. Go to: **https://console.anthropic.com**
2. Click **Sign Up** → create account with email or Google
3. Verify your phone number (required)
4. On the left sidebar → click **API Keys**
5. Click **+ Create Key**
6. Give it any name (e.g., "pcos-project")
7. **Copy the key** (starts with `sk-ant-api03-...`)
8. Anthropic gives **$5 free credits** on signup

When you open the Chatbot page at http://localhost:3000/chatbot, it will show a setup screen where you paste the key. Done!

---

## HOW TO STOP THE SERVER

In Command Prompt: press **Ctrl + C** then type `Y` and Enter.

---

## HOW TO RESTART NEXT TIME

```
cd C:\Users\YourName\Desktop\pcos-detection
npm run dev
```
Then open http://localhost:3000

---

## PROJECT STRUCTURE

```
pcos-detection/
├── src/
│   ├── app/
│   │   ├── layout.js          ← Root layout (Navbar lives here, shows on all pages)
│   │   ├── page.js            ← Home page
│   │   ├── globals.css        ← Global styles
│   │   ├── detection/
│   │   │   └── page.js        ← Image upload & AI analysis
│   │   └── chatbot/
│   │       └── page.js        ← AI chatbot with Claude API
│   └── components/
│       └── Navbar.js          ← Navigation bar component
├── package.json
├── tailwind.config.js
├── next.config.js
└── postcss.config.js
```

---

## COMMON ERRORS & FIXES

| Error | Fix |
|-------|-----|
| 'next' is not recognized | Run `npm install` again |
| Port 3000 already in use | Run `npm run dev -- -p 3001` and open http://localhost:3001 |
| Chatbot API error | Check the API key is correct and starts with `sk-ant-` |
| Page shows blank | Hard refresh: Ctrl+Shift+R |
| node_modules missing | Run `npm install` |

---

## VIVA TALKING POINTS

- **Frontend:** Next.js 14 with App Router + Tailwind CSS
- **Chatbot AI:** Claude claude-sonnet-4-20250514 via Anthropic API (real AI responses)
- **Detection:** Prototype with mock results — production would use a CNN (ResNet-50/VGG) trained on ovarian ultrasound dataset
- **Architecture:** Client-side React, file-based routing, component-based design
- **Design:** Responsive, dark theme, glassmorphism, mobile-friendly navbar

---

*B.Tech CSE Final Year Project*
