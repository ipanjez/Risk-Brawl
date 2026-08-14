import placeholderSvg from './logo-placeholder.svg';

// Dynamically resolve logo-tkmr.png if present locally, otherwise use placeholder SVG
let logoTkmrUrl = placeholderSvg;

try {
  // Vite static/dynamic asset resolution
  const resolved = new URL('./logo-tkmr.png', import.meta.url).href;
  if (resolved) {
    logoTkmrUrl = resolved;
  }
} catch {
  logoTkmrUrl = placeholderSvg;
}

export default logoTkmrUrl;
