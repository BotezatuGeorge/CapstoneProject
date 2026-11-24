// Local, network-free artwork. Covers and avatars are generated SVG data URIs so the
// app never depends on external image hosts.

interface CoverOptions {
  title: string;
  author: string;
  bg: string;
  fg: string;
  accent: string;
}

const escapeXml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&apos;');

function wrapWords(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let current = '';
  for (const word of text.split(' ')) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

const toDataUri = (svg: string): string => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export function makeCover({ title, author, bg, fg, accent }: CoverOptions): string {
  const lines = wrapWords(title.toUpperCase(), 11).slice(0, 3);
  const titleText = lines
    .map(
      (line, i) =>
        `<text x="80" y="${46 + i * 22}" text-anchor="middle" font-family="IBM Plex Sans, Arial, sans-serif" font-weight="700" font-size="18" fill="${fg}">${escapeXml(line)}</text>`
    )
    .join('');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 240">` +
    `<rect width="160" height="240" fill="${bg}"/>` +
    titleText +
    `<circle cx="80" cy="146" r="30" fill="${accent}"/>` +
    `<rect x="52" y="146" width="56" height="30" fill="${bg}" opacity="0.35"/>` +
    `<text x="80" y="224" text-anchor="middle" font-family="IBM Plex Sans, Arial, sans-serif" font-weight="600" font-size="10" letter-spacing="1.5" fill="${fg}">${escapeXml(author.toUpperCase())}</text>` +
    `</svg>`;
  return toDataUri(svg);
}

export function makeAvatar(name: string, bg: string): string {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">` +
    `<rect width="80" height="80" fill="${bg}"/>` +
    `<text x="40" y="51" text-anchor="middle" font-family="IBM Plex Sans, Arial, sans-serif" font-weight="600" font-size="30" fill="#f4f4f4">${escapeXml(initials)}</text>` +
    `</svg>`;
  return toDataUri(svg);
}
