const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function makeSignage() {
  const logoPath = path.join(__dirname, '../public/images/partner-logo.png');
  const logo = sharp(logoPath);
  const logoMeta = await logo.metadata();
  
  const w = 340;
  const h = Math.round((logoMeta.height / logoMeta.width) * w);
  const padX = 16;
  const padY = 12;
  const totalW = w + padX * 2;
  const totalH = h + padY * 2;
  
  const svgBg = `<svg width="${totalW}" height="${totalH}">
    <defs>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.3" />
      </filter>
    </defs>
    <rect x="0" y="0" width="${totalW}" height="${totalH}" rx="16" fill="#ffffff" fill-opacity="0.95" stroke="rgba(255,255,255,0.9)" stroke-width="2" filter="url(#shadow)" />
  </svg>`;
  
  const resizedLogo = await sharp(logoPath)
    .resize(w, h, { fit: 'contain' })
    .toBuffer();
    
  const signage = await sharp(Buffer.from(svgBg))
    .composite([{ input: resizedLogo, left: padX, top: padY }])
    .png()
    .toBuffer();
    
  // Composite onto the new generated fleet image
  const fleetImg = 'C:/Users/spxth71637/.gemini/antigravity-ide/brain/e9a76966-f1aa-4c56-9503-9f66fa96ca4a/hero_logistics_fleet_1792735979711.jpg';
  if (fs.existsSync(fleetImg)) {
    await sharp(fleetImg)
      .composite([{ input: signage, left: 660, top: 120 }])
      .jpeg({ quality: 95 })
      .toFile(path.join(__dirname, '../public/images/hero-fleet.jpg'));
    console.log('Created hero-fleet.jpg with signage logo at (660, 120)');
  }
  
  // Also composite onto hero.jpg
  // Place on the warehouse building facade
  const baseImg = fs.existsSync(fleetImg) ? fleetImg : path.join(__dirname, '../public/images/thai_transport_hero.jpg');
  await sharp(baseImg)
    .composite([{ input: signage, left: 660, top: 120 }])
    .jpeg({ quality: 95 })
    .toFile(path.join(__dirname, '../public/images/hero.jpg'));
  console.log('Created hero.jpg with signage logo');

  // Also composite onto thai_transport_hero.jpg for fallback
  const thaiHeroPath = path.join(__dirname, '../public/images/thai_transport_hero.jpg');
  if (fs.existsSync(thaiHeroPath)) {
    await sharp(thaiHeroPath)
      .composite([{ input: signage, left: 660, top: 110 }])
      .jpeg({ quality: 95 })
      .toFile(path.join(__dirname, '../public/images/thai_transport_hero_logo.jpg'));
    console.log('Created thai_transport_hero_logo.jpg');
  }
}

makeSignage().catch(console.error);
