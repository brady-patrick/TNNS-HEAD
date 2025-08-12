# TNNS HEAD

A modern Next.js application built with Untitled UI components, featuring beautiful design and excellent user experience.

## Features

- 🎨 **Modern Design** - Built with the latest design principles and components
- 📱 **Responsive** - Fully responsive design that works on all devices
- ♿ **Accessible** - Built with accessibility in mind using React Aria
- ⚡ **Fast** - Optimized for performance and speed
- 🔧 **Customizable** - Easy to customize with Tailwind CSS
- 🛡️ **Type Safe** - Full TypeScript support for better development

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS v4
- **Components**: Untitled UI Icons + React Aria Components
- **Theme**: next-themes for dark/light mode support
- **Language**: TypeScript
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd "TNNS HEAD"
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
TNNS HEAD/
├── app/
│   ├── components/     # Reusable components
│   ├── lib/           # Utility functions
│   ├── globals.css    # Global styles and Tailwind directives
│   ├── layout.tsx     # Root layout component
│   └── page.tsx       # Home page component
├── public/            # Static assets
├── tailwind.config.js # Tailwind CSS configuration
├── postcss.config.js  # PostCSS configuration
├── next.config.js     # Next.js configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Colors

The project includes a custom brand color palette defined in `tailwind.config.js`. You can customize these colors to match your brand:

```js
colors: {
  brand: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    // ... more shades
  }
}
```

### Components

The project uses React Aria Components for accessible UI elements. You can customize the styling by modifying the CSS classes in `globals.css`.

### Theme

The project supports light, dark, and system themes using `next-themes`. Theme switching is available in the header.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Untitled UI](https://www.untitledui.com/) for the beautiful icon library
- [React Aria](https://react-spectrum.adobe.com/react-aria/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Next.js](https://nextjs.org/) for the React framework
