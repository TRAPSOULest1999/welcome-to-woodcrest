# Welcome to Woodcrest

An unofficial interactive editorial about Aaron McGruder’s The Boondocks. Arrive in Woodcrest through a scroll-controlled camera move, then explore the Freeman family by dragging, swiping, or using the keyboard. The final chapters introduce two neighbours and connect them to episode commentary.

## Development

Requires Node.js 22 or later.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Google Flow supplied the arrival sequence and Freeman portraits. FFmpeg prepared seekable video and still frames. React, TypeScript, Vite, and CSS implement the experience. Media files are served separately and the site uses relative paths for GitHub Pages. The soundtrack is opt-in. Reduced-motion mode uses the street still and immediate profile changes.

The supplied Judo Flip mix and show-reference screenshots were used for private exploration. This release uses a separately synthesized instrumental and typographic treatments for the two neighbour profiles. Typography uses Liberation Serif and Open Sans Condensed with accompanying font notices.

## GitHub Pages

Set the publishing source to GitHub Actions. The workflow builds the site from the main branch and deploys the generated `dist` directory.
