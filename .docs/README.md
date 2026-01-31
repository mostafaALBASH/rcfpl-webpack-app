# FPL Return Consistency - Webpack App

Professional FPL analytics app built with Alpine.js and Webpack.

## ✨ Latest Updates

**✅ FOUC (Flash of Unstyled Content) Fix Implemented** (January 2026)
- Zero unstyled flash on first load
- Smooth, professional loading experience
- Critical CSS optimization
- Production-ready deployment

See [FOUC-FIX-DOCUMENTATION.md](FOUC-FIX-DOCUMENTATION.md) for technical details.

## 🚀 Quick Start

### Installation

```bash
cd webpack-app
npm install
```

### Development

Start the development server with hot reload:

```bash
npm start
# or
npm run dev
```

This will automatically open `http://localhost:8082` in your browser.

### Production Build

Create an optimized production bundle:

```bash
npm run build
```

The built files will be in the `dist/` folder, ready for deployment.

## 📦 What's Included

- **Alpine.js 3.13+** - Reactive framework for interactivity
- **Tailwind CSS 4.1+** - Utility-first CSS framework (compiled via PostCSS)
- **Tippy.js 6.3+** - Interactive tooltips
- **Webpack 5** - Module bundler with HMR dev server
- **MiniCssExtractPlugin** - CSS extraction for production
- **FOUC Prevention** - Critical CSS for instant loading

## 🎨 Styling Architecture

**Development Mode**: CSS injected via style-loader (hot reload enabled)  
**Production Mode**: CSS extracted to separate file with content hash

**Critical CSS**: Inline styles in `<head>` prevent FOUC:
- Branded background gradient displays immediately
- Content hidden until fully styled
- Smooth fade-in transition when ready

## 🔧 Configuration

### Development Server

The app runs on `http://localhost:8082` by default. To change this, edit `webpack.config.js`:

```javascript
devServer: {
  port: 8082,  // Change to your preferred port
  // ...
}
```

## 📁 Project Structure

```
webpack-app/
├── src/
│   ├── index.html          # HTML template with critical CSS
│   ├── main.js             # JavaScript entry point & Alpine app
│   ├── config.js           # App configuration constants
│   ├── utils.js            # Utility functions
│   └── styles.css          # Tailwind CSS & custom styles
├── public/                 # Static files (copied to dist/)
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── _headers            # Netlify headers
│   └── _redirects          # Netlify redirects
├── dist/                   # Production build output
│   ├── bundle.[hash].js    # Minified JavaScript bundle
│   ├── styles.[hash].css   # Extracted & minified CSS
│   └── index.html          # Optimized HTML
├── player-metrics.json     # FPL data
├── package.json            # Dependencies & scripts
├── webpack.config.js       # Webpack configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS plugins
├── README.md               # This file
├── FOUC-FIX-DOCUMENTATION.md        # Technical FOUC fix details
├── PRODUCTION-READY-SUMMARY.md      # Production status
├── FOUC-FIX-VISUAL-COMPARISON.md    # Before/after comparison
└── QUICK-REFERENCE-FOUC.md          # Quick maintenance guide
```

## 🎯 Features

- ✅ **Zero FOUC** - Professional loading with no unstyled flash
- ✅ Pagination & sorting
- ✅ Real-time search functionality
- ✅ Filter by club & position
- ✅ Interactive tooltips (Tippy.js)
- ✅ Responsive design (mobile & desktop)
- ✅ CSV export functionality
- ✅ Card view / Table view toggle
- ✅ Hot module reload (HMR) in dev mode
- ✅ Production optimization (minification, code splitting)
- ✅ Content-hashed filenames for cache busting

## � Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server on port 8082 |
| `npm run dev` | Alias for `npm start` |
| `npm run build` | Create optimized production build |

## 🚀 Deployment

### Production Checklist
1. ✅ Run `npm run build`
2. ✅ Verify `dist/` folder contains:
   - `bundle.[hash].js` (~305 KB)
   - `styles.[hash].css` (~59 KB)
   - `index.html` with inline critical CSS
3. ✅ Test locally: `npx serve dist`
4. ✅ Deploy `dist/` folder to your hosting service

### Hosting Options

**Netlify** (Recommended):
```bash
# Option 1: Drag & drop dist/ folder to Netlify
# Option 2: Connect Git repository
#   Build command: npm run build
#   Publish directory: dist
```

**Vercel**:
```bash
# Build command: npm run build
# Output directory: dist
```

**Any Static Host**:
Upload contents of `dist/` folder to your web server.

## ✅ Production Status

- **FOUC Fix**: ✅ Fully implemented and tested
- **All Features**: ✅ Working perfectly
- **Performance**: ✅ Optimized and production-ready
- **Browser Compatibility**: ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile Support**: ✅ Fully responsive
- **Bundle Size**: ✅ Optimized (~365 KB total)
- **Cache Strategy**: ✅ Content-hashed filenames

**Ready for End Users**: ✅ YES

## 🔍 Troubleshooting

### FOUC appears after update
- Check `src/index.html` has critical CSS in `<head>`
- Verify `webpack.config.js` has `inject: 'body'`
- Run fresh build: `rm -rf dist && npm run build`

### Styles not applying
- Clear browser cache (Ctrl+Shift+R)
- Check `dist/styles.[hash].css` exists
- Verify Tailwind is compiling: check build output

### Build fails
- Delete `node_modules` and `dist`
- Run `npm install` then `npm run build`

See [QUICK-REFERENCE-FOUC.md](QUICK-REFERENCE-FOUC.md) for more help.

## 📚 Documentation

- **[FOUC-FIX-DOCUMENTATION.md](FOUC-FIX-DOCUMENTATION.md)** - Complete technical documentation
- **[PRODUCTION-READY-SUMMARY.md](PRODUCTION-READY-SUMMARY.md)** - Production status & checklist  
- **[FOUC-FIX-VISUAL-COMPARISON.md](FOUC-FIX-VISUAL-COMPARISON.md)** - Before/after visual timeline
- **[QUICK-REFERENCE-FOUC.md](QUICK-REFERENCE-FOUC.md)** - Quick maintenance guide

## 🌐 Browser Support

- ✅ Chrome/Edge (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Note**: Requires ES6+ support (2015+ browsers)

## 📄 License

ISC
