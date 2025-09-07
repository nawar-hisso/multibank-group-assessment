/**
 * Placeholder image generator for NFTs and avatars
 */

export function generatePlaceholderImage(
  width: number = 300,
  height: number = 300,
  text: string = "NFT",
  bgColor: string = "#3B3B3B",
  textColor: string = "#A259FF"
): string {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${bgColor}"/>
      <circle cx="${width / 2}" cy="${height / 2 - 20}" r="${
    Math.min(width, height) * 0.2
  }" fill="${textColor}" fill-opacity="0.3"/>
      <circle cx="${width / 2}" cy="${height / 2 - 20}" r="${
    Math.min(width, height) * 0.1
  }" fill="${textColor}" fill-opacity="0.6"/>
      <text x="${width / 2}" y="${
    height / 2 + 40
  }" font-family="Arial, sans-serif" font-size="16" fill="#999999" text-anchor="middle">${text}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function generateAvatarPlaceholder(
  size: number = 100,
  name: string = "User"
): string {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const colors = [
    "#A259FF",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
  ];
  const bgColor = colors[name.length % colors.length];

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${
    size / 2
  }" fill="${bgColor}"/>
      <text x="${size / 2}" y="${
    size / 2 + 6
  }" font-family="Arial, sans-serif" font-size="${
    size * 0.4
  }" font-weight="600" fill="white" text-anchor="middle">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Pre-generated placeholder images for common NFT types
export const PLACEHOLDER_IMAGES = {
  nft: generatePlaceholderImage(300, 300, "NFT"),
  art: generatePlaceholderImage(300, 300, "ART", "#2D1B69"),
  collectible: generatePlaceholderImage(300, 300, "COLLECTIBLE", "#1A5490"),
  photography: generatePlaceholderImage(300, 300, "PHOTO", "#0F4C75"),
  music: generatePlaceholderImage(300, 300, "MUSIC", "#6A0572"),
  video: generatePlaceholderImage(300, 300, "VIDEO", "#900C3F"),
  utility: generatePlaceholderImage(300, 300, "UTILITY", "#2E8B57"),
  sport: generatePlaceholderImage(300, 300, "SPORT", "#FF6347"),
  virtual_worlds: generatePlaceholderImage(300, 300, "VIRTUAL", "#4B0082"),
} as const;

// Artist avatar placeholders
export const ARTIST_AVATARS = {
  shroomie: generateAvatarPlaceholder(100, "Shroomie"),
  beKind2Robots: generateAvatarPlaceholder(100, "BeKind2Robots"),
  mrFox: generateAvatarPlaceholder(100, "Mr Fox"),
  keepitreal: generateAvatarPlaceholder(100, "Keepitreal"),
  robotica: generateAvatarPlaceholder(100, "Robotica"),
  moonDancer: generateAvatarPlaceholder(100, "MoonDancer"),
  nebulaKid: generateAvatarPlaceholder(100, "NebulaKid"),
  animakid: generateAvatarPlaceholder(100, "Animakid"),
  catch22: generateAvatarPlaceholder(100, "Catch 22"),
  iceApeClub: generateAvatarPlaceholder(100, "Ice Ape Club"),
  puppyPower: generateAvatarPlaceholder(100, "PuppyPower"),
} as const;
