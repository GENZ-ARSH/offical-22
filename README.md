# GenZZ Library 📚

Welcome to **GenZZ Library**, a *swaggy* platform for students to unlock premium study material (PDFs) with 24-hour or 48-hour access keys! 🚀 Built by *GenZ-Coders*, this project uses a sleek skyblue gradient UI, Linkpays for ad revenue, and a secure admin panel (password: `GENZISKING`). Click the 24hr/48hr buttons, earn revenue via short URLs, and land on a protected PDF library page. Perfect for JEE, class 12, and more! 😎

## Features
- **Access Control**: Generate 24hr/48hr access keys via `index.html`.
- **Revenue Generation**: Linkpays short URLs show ads before redirecting to `protected.html`.
- **Admin Panel**: Triple-click footer, enter `GENZISKING` to access `admin.html`.
- **UI**: Skyblue gradient (`#bfdbfe` to `#60a5fa`), yellow-orange buttons (`#facc15` to `#f97316`), click sounds.
- **Backend**: Node.js/Express with `/api/generate-key` and `/api/admin-login`.

## Tech Stack
- **Frontend**: HTML, Tailwind CSS (CDN for dev, CLI for prod), SweetAlert2, Bootstrap Icons.
- **Backend**: Node.js, Express, CORS, dotenv.
- **Shortener**: Linkpays (manual URLs; API optional), Cuttly (fallback).
- **Deployment**: Netlify (frontend), Render (backend).
- **Tools**: npm, Git, curl (for testing).

## Folder Structure
```
genzz-library/
├── frontend/
│   ├── assets/
│   │   ├── favicon.ico
│   │   └── xml/
│   ├── index.html        # Landing page with 24hr/48hr buttons
│   ├── protected.html    # Protected PDF library page
│   ├── admin.html        # Admin panel for key management
├── backend/
│   ├── server.js         # Express server
│   ├── package.json
│   └── .env
├── .gitignore
└── README.md
```

## Prerequisites
- **Node.js** (v16+): [Download](https://nodejs.org)
- **npm** (comes with Node.js)
- **Git**: [Download](https://git-scm.com)
- **Linkpays Account**: Sign up at [Linkpays](https://linkpays.in) for short URLs
- **Text Editor**: VS Code recommended
- **Browser**: Chrome/Firefox for testing

## Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/genzz-library.git
cd genzz-library
```

### 2. Set Up Backend
1. **Navigate to backend**:
   ```bash
   cd backend
   ```
2. **Initialize project**:
   ```bash
   npm init -y
   npm install express cors dotenv
   ```
3. **Create `.env`**:
   ```bash
   touch .env
   ```
   Add:
   ```
   PORT=5000
   ```
4. **Verify `server.js`**:
   - Ensure it matches the provided `server.js` (has `/api/generate-key`, `/api/admin-login`).
   - Check CORS for `http://localhost:4000`.
5. **Run backend**:
   ```bash
   npm start
   ```
   - Server runs on `http://localhost:5000`.
   - Test endpoints:
     ```bash
     curl -X POST -H "Content-Type: application/json" -d '{"duration":"24hr","userId":"guest"}' http://localhost:5000/api/generate-key
     curl -X POST -H "Content-Type: application/json" -d '{"password":"GENZISKING"}' http://localhost:5000/api/admin-login
     ```

### 3. Set Up Frontend
1. **Navigate to frontend**:
   ```bash
   cd ../frontend
   ```
2. **Create favicon**:
   ```bash
   mkdir -p assets/xml
   curl -o assets/favicon.ico https://www.google.com/favicon.ico
   ```
   - Replace with custom favicon if desired.
3. **Install serve** (for local server):
   ```bash
   npm install -g serve
   ```
4. **Verify `index.html`**:
   - Ensure `BASE_API_URL = 'http://localhost:5000'`.
   - Check `SHORT_URLS` for Linkpays URLs.
5. **Run frontend**:
   ```bash
   npx serve -l 4000
   ```
   - Access at `http://localhost:4000/index.html`.

### 4. Configure Linkpays Short URLs
1. **Sign up**: Go to [Linkpays](https://linkpays.in), create an account.
2. **Create short URLs**:
   - **24-hour**: Target `http://localhost:4000/protected.html`, name `linkpays.in/genz-24hr`.
   - **48-hour**: Target `http://localhost:4000/protected.html`, name `linkpays.in/genz-48hr`.
   - Enable ads for revenue.
3. **Update `index.html`**:
   - Edit `SHORT_URLS`:
     ```javascript
     const SHORT_URLS = {
         '24hr': 'https://linkpays.in/genz-24hr',
         '48hr': 'https://linkpays.in/genz-48hr'
     };
     ```
4. **Fallback (Cuttly)**:
   - Sign up at [Cuttly](https://cutt.ly).
   - Create:
     - 24-hour: `cutt.ly/genz-24hr` → `http://localhost:4000/protected.html`.
     - 48-hour: `cutt.ly/genz-48hr` → `http://localhost:4000/protected.html`.
   - Update `SHORT_URLS` if using Cuttly.

## Testing Locally
1. **Backend**:
   - Ensure server is running (`npm start` in `backend/`).
   - Test:
     ```bash
     curl -X POST -H "Content-Type: application/json" -d '{"duration":"24hr","userId":"guest"}' http://localhost:5000/api/generate-key
     ```
     Expected: `{"token":"GENZ-xxxxxxxx","expiry":<timestamp>}`
     ```bash
     curl -X POST -H "Content-Type: application/json" -d '{"password":"GENZISKING"}' http://localhost:5000/api/admin-login
     ```
     Expected: `{"success":true}`

2. **Frontend**:
   - Run `npx serve -l 4000` in `frontend/`.
   - Open `http://localhost:4000/index.html`.
   - **Test 24hr/48hr buttons**:
     - Click “24-Hour Access”:
       - Hear click sound.
       - See SweetAlert2 with short URL (`linkpays.in/genz-24hr`).
       - Click “Copy & Go” → opens URL, shows ad, redirects to `protected.html`.
     - Repeat for “48-Hour Access”.
   - **Test admin login**:
     - Triple-click footer (“Made with ❤️ by GenZ-Coders”).
     - Enter `GENZISKING` → redirects to `admin.html`.
     - Wrong password → error alert.
   - **Check Console** (`F12`):
     - No CORS, favicon, or fetch errors.

3. **Verify favicon**:
   ```bash
   ls frontend/assets
   ```
   Should show `favicon.ico`.

## Deployment

### 1. Netlify (Frontend)
1. **Prepare**:
   - Update `BASE_API_URL` in `index.html`:
     ```javascript
     const BASE_API_URL = 'https://genzz-library-backend.onrender.com';
     ```
   - Update `SHORT_URLS`:
     ```javascript
     const SHORT_URLS = {
         '24hr': 'https://linkpays.in/genz-24hr-prod', // Target: https://genzz-library.netlify.app/protected.html
         '48hr': 'https://linkpays.in/genz-48hr-prod'
     };
     ```
2. **Install Tailwind CLI** (remove CDN):
   ```bash
   cd frontend
   npm init -y
   npm install -D tailwindcss
   npx tailwindcss init
   ```
   - Create `input.css`:
     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```
   - Update `tailwind.config.js`:
     ```javascript
     module.exports = {
       content: ['./*.html'],
       theme: { extend: {} },
       plugins: []
     };
     ```
   - Build:
     ```bash
     npx tailwindcss -i input.css -o output.css
     ```
   - Replace `<script src="https://cdn.tailwindcss.com"></script>` in `index.html`, `protected.html`, `admin.html` with:
     ```html
     <link href="./output.css" rel="stylesheet">
     ```
3. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare frontend for Netlify"
   git push
   ```
4. **Deploy**:
   - Create Netlify site, connect to GitHub repo.
   - Settings:
     - Base directory: `frontend/`
     - Publish directory: `frontend/`
     - Build command: `npm run build` (if using Tailwind CLI) or leave blank.
   - Get site URL (e.g., `https://genzz-library.netlify.app`).
5. **Update Linkpays**:
   - Edit short URLs to target `https://genzz-library.netlify.app/protected.html`.

### 2. Render (Backend)
1. **Prepare**:
   - Add to `.env`:
     ```
     PORT=5000
     NODE_ENV=production
     ```
   - Update CORS in `server.js` (optional):
     ```javascript
     app.use(cors({
         origin: 'https://genzz-library.netlify.app',
         methods: ['GET', 'POST', 'OPTIONS'],
         allowedHeaders: ['Content-Type'],
         credentials: true
     }));
     ```
2. **Push to GitHub**:
   ```bash
   cd backend
   git add .
   git commit -m "Prepare backend for Render"
   git push
   ```
3. **Deploy**:
   - Create Render service, connect to GitHub repo.
   - Settings:
     - Build command: `npm install`
     - Start command: `node server.js`
   - Get URL (e.g., `https://genzz-library-backend.onrender.com`).
4. **Test**:
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"duration":"24hr","userId":"guest"}' https://genzz-library-backend.onrender.com/api/generate-key
   ```

## Revenue Tracking
- **Linkpays**:
  - Monitor clicks/earnings in [Linkpays dashboard](https://linkpays.in).
  - Payout: Check minimum threshold (e.g., $5, PayPal).
- **Cuttly (Fallback)**:
  - Monitor in [Cuttly dashboard](https://cutt.ly).
  - Payout: $5 minimum (PayPal).
- **Scale**:
  - Share `index.html` link on Telegram (`https://t.me/genzcoders1`).
  - More clicks = more revenue ($1–$10 CPM for India).

## Troubleshooting
- **CORS Errors**:
  - Check `server.js` CORS (`origin: 'http://localhost:4000'` locally, Netlify URL in prod).
  - Test backend: `curl http://localhost:5000/api/generate-key`.
- **Favicon 404**:
  - Ensure `frontend/assets/favicon.ico` exists.
  - Verify `<link rel="icon" href="./assets/favicon.ico">` in HTML.
- **Tailwind CDN Warning**:
  - Fine for local dev. Use Tailwind CLI for production (see Deployment).
- **Linkpays Issues**:
  - Verify short URLs in dashboard.
  - If API needed, share valid API key and test CORS.
- **Console Errors**:
  - Open `F12` > Console in browser.
  - Share errors for quick fixes.

## Contributing
- Fork the repo, create a branch, submit a PR.
- Add features like access expiry enforcement, dynamic Linkpays API, or more PDF categories.

## License
MIT License. See [LICENSE](LICENSE) for details.

## Contact
Join our Telegram: [GenZ-Coders](https://t.me/genzcoders1)  
Made with ❤️ by GenZ-Coders, 2025.