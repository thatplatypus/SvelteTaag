# SvelteTaag - Modern Text to ASCII Art Generator

A sleek, modern Text to ASCII Art Generator built with SvelteKit, TailwindCSS, ShadCn UI, and figlet.js.

## Live Demo

[View the live demo on GitHub Pages](#) (Link will be available after deployment)

## Features

- **Modern UI**: Built with SvelteKit, TailwindCSS, and ShadCn UI components
- **ASCII Art Generation**: Uses figlet.js to convert text to ASCII art
- **Font Selection**: Choose from over 100 ASCII art fonts
- **Customization**: Adjust character width to fit your needs
- **Copy & Share**: Easily copy or share your generated ASCII art
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes
- **PWA Support**: Can be installed as a Progressive Web App
- **Favorites & History**: Save your favorite fonts and see recently used ones
- **Animations**: Smooth animations with Framer Motion

## Project Structure

```
SvelteTaag/
├── src/                  # Main source code
│   ├── app.css           # Global styles
│   ├── app.html          # HTML template
│   ├── lib/              # Library code
│   │   ├── components/   # UI components
│   │   └── types/        # TypeScript definitions
│   └── routes/           # SvelteKit routes
├── static/               # Static assets
│   ├── manifest.json     # PWA manifest
│   ├── service-worker.js # PWA service worker
│   └── icons/            # PWA icons
├── package.json          # Project dependencies
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/SvelteTaag.git
   cd SvelteTaag
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`

### Building for Production

To create a production build:

```
npm run build
```

The built files will be in the `build` directory, ready to be deployed to GitHub Pages or any static hosting service.

## Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages using the static adapter. After building, the contents of the `build` directory can be pushed to the `gh-pages` branch of your repository.

## Credits

- [figlet.js](https://github.com/patorjk/figlet.js) - The core ASCII art generation library
- [SvelteKit](https://kit.svelte.dev/) - The web framework used
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [ShadCn UI](https://ui.shadcn.com/) - UI component library
- [Framer Motion](https://www.framer.com/motion/) - Animation library

## License

This project is licensed under the MIT License - see the LICENSE file for details. 