# FPL Return Consistency - Webpack App

Professional FPL analytics app built with Alpine.js and Webpack.

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
```

This will automatically open `http://localhost:8080` in your browser.

### Production Build

Create an optimized production bundle:

```bash
npm run build
```

The built files will be in the `dist/` folder, ready for deployment.

## 📦 What's Included

- **Alpine.js 3.x** - Reactive framework
- **Tippy.js** - Interactive tooltips
- **Webpack 5** - Module bundler with dev server
- **Tailwind CSS** - Utility-first CSS (via CDN)

## 🔧 Configuration

### API Endpoint

The app connects to `http://localhost:3001` by default. To change this, edit `src/main.js`:

```javascript
apiBase: 'http://localhost:3001',  // Change to your API URL
```

### Port Configuration

To change the dev server port, edit `webpack.config.js`:

```javascript
devServer: {
  port: 8080,  // Change to your preferred port
  // ...
}
```

## 📁 Project Structure

```
webpack-app/
├── src/
│   ├── index.html      # HTML template
│   └── main.js         # JavaScript entry point
├── dist/               # Production build output
├── package.json        # Dependencies
├── webpack.config.js   # Webpack configuration
└── README.md          # This file
```

## 🎯 Features

- ✅ Pagination & sorting
- ✅ Search functionality
- ✅ Filter by club & position
- ✅ Interactive tooltips
- ✅ Responsive design
- ✅ CSV export
- ✅ Hot module reload (HMR)
- ✅ Production optimization

## 🔌 API Requirements

The app expects the following API endpoints:

- `GET /clubs` - List of clubs
- `GET /data-paginate` - Paginated player data
- `GET /data-search` - Search players
- `GET /data-file` - Download CSV

Ensure your backend server is running on port 3001 before starting the app.

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server (port 8080) |
| `npm run dev` | Alias for `npm start` |
| `npm run build` | Create production build |

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 📄 License

ISC
