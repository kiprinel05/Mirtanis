/**
 * Smoothly dismisses the static pre-bootstrap loader defined in index.html.
 * Instead of removing it abruptly (which causes a 1-frame "flash" on slow
 * connections), we fade it out so it crossfades into the rendered app.
 */
export function dismissBootLoader(): void {
  const el = document.getElementById('boot-loader');
  if (!el) return;
  el.style.transition = 'opacity .6s ease';
  el.style.opacity = '0';
  el.style.pointerEvents = 'none';
  window.setTimeout(() => el.remove(), 650);
}
