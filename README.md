# React Cheque Printer

A full-featured web application for printing Egyptian bank cheques with precise layout control, drag-and-drop positioning, and multilingual support (English/Arabic).

## Features

### ✅ Core Features

- **Multi-Bank Support**: CIB (6 templates), Banque Misr, ADIB
- **Interactive Template Editor**: Drag and drop text fields with real-time positioning
- **Resizable Fields**: Adjust field size with visual resize handles
- **Field Styling**: Control font size, weight, and text alignment
- **Automatic Arabic Conversion**: Converts numeric amounts to proper Arabic cheque wording
- **Print Calibration**: Fine-tune print alignment with X/Y offset controls (in mm)
- **Preview Mode**: Toggle preview to see final print appearance
- **Template Management**: Export and import cheque templates as JSON
- **Multilingual Interface**: Full English/Arabic support with RTL layout
- **Persistent Storage**: All templates and settings saved to localStorage

### 🎨 User Experience

- **Visual Field Selection**: Click fields to select and edit properties
- **Real-time Updates**: Changes reflect immediately on the cheque
- **Responsive Design**: Works on desktop and tablet devices
- **Dark Mode Support**: Automatic dark mode based on system preferences

## Technology Stack

- **Frontend**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS (via CDN)
- **Fonts**: Cairo (Arabic), Roboto (Latin)
- **Storage**: localStorage for templates and settings

## Installation

### Prerequisites

- Node.js 18+ and npm

### Setup Steps

1. **Clone or download the repository**

2. **Move cheque images to public folder** (if not already):
   - Create a `public` folder in the project root (if it doesn't exist)
   - Move the `cheques` folder into the `public` folder
   - The structure should be: `public/cheques/*.png`

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to `http://localhost:3000`

## Usage Guide

### Basic Workflow

1. **Select Bank**: Choose from CIB, Banque Misr, or ADIB
2. **Select Template**: Pick a cheque template for the selected bank
3. **Fill Information**:
   - Enter payee name
   - Enter amount (automatically converts to Arabic words)
   - Select date
   - Add signature (optional)
4. **Position Fields**: Click and drag fields to adjust their position
5. **Resize Fields**: Use the resize handle (bottom-right corner) to adjust size
6. **Style Fields**: Select a field from the dropdown to edit font size, weight, and alignment
7. **Calibrate Print**: Adjust X/Y offset if needed for accurate printing
8. **Preview**: Toggle preview mode to see final appearance
9. **Print**: Click "Print Cheque" to print

### Advanced Features

#### Field Selection and Editing

1. Click on any field in the cheque editor, OR
2. Select a field from the "Select Field" dropdown
3. Adjust properties in the "Field Properties" panel:
   - Font Size (8-72px)
   - Font Weight (Normal/Bold)
   - Text Alignment (Left/Center/Right)

#### Template Export/Import

**Export**:
- Click "Export Template" to save current template as JSON
- File includes all field positions, styles, and settings

**Import**:
- Click "Import Template"
- Select a previously exported JSON file
- Template will be loaded and selected automatically

#### Print Calibration

If printed text doesn't align perfectly:

1. Print a test cheque
2. Measure the offset in millimeters
3. Adjust "Print Offset X" and "Print Offset Y" values
4. Negative values move left/up, positive values move right/down
5. Re-print to verify alignment

## Project Structure

```
react-cheque-printer/
├── components/
│   ├── ChequeEditor.tsx      # Main cheque editor with drag-and-drop
│   └── ControlsPanel.tsx     # Control panel with forms and settings
├── contexts/
│   └── LocalizationContext.tsx  # Language switching and translations
├── data/
│   └── templates.ts          # Cheque template definitions
├── hooks/
│   └── useLocalization.ts    # Localization hook
├── services/
│   └── amountToWords.ts      # Arabic number-to-words converter
├── cheques/                  # Cheque template images
│   ├── CIB01.png - CIB06.png
│   ├── Banqe_Misr.png
│   └── ADIB01.png
├── App.tsx                   # Main application component
├── types.ts                  # TypeScript type definitions
├── index.tsx                 # Application entry point
├── index.html                # HTML template
└── vite.config.ts            # Vite configuration
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deployment

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Build: `npm run build`
3. Deploy: `netlify deploy --prod --dir=dist`

### Firebase Hosting

1. Install Firebase CLI: `npm i -g firebase-tools`
2. Initialize: `firebase init hosting`
3. Set public directory to `dist`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Known Limitations

- Print alignment may vary between printers
- Field positioning is pixel-based (may need adjustment for different screen sizes)
- Arabic font rendering depends on system fonts

## Future Enhancements

- Multi-cheque batch printing
- User accounts and cloud sync
- Additional bank templates
- PDF export functionality
- Mobile app version
- Template marketplace

## License

This project is provided as-is for educational and commercial use.

## Support

For issues or questions, please check the code comments or create an issue in the repository.
