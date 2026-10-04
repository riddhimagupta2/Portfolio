# Developer Series Portfolio

Modern React + Vite interactive developer series portfolio.

## Structure

- `src/components/` - modular, reusable React components
- `src/components/shared/` - shared UI design system (badges, headings, chips, spotlights)
- `src/data/portfolioData.example.js` - template configuration for personal details, projects, and skills
- `src/App.jsx` - portfolio application layout
- `src/index.css` - TailwindCSS and cinematic animations

## Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

## Customization

To personalize the portfolio data, copy `src/data/portfolioData.example.js` to `src/data/portfolioData.local.js` and add your details. `portfolioData.local.js` is automatically excluded by `.gitignore` to protect personal information.
