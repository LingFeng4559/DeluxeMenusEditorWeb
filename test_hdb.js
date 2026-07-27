import fs from 'fs';

async function testHdb() {
  const url = 'https://minecraft-heads.com/custom-heads/head/63124';
  try {
    const res = await fetch(url);
    const html = await res.text();
    
    // Find texture hash or image URL
    const imgMatch = html.match(/textures\.minecraft\.net\/texture\/([a-f0-9]+)/i);
    const headNameMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);

    console.log('Head 63124 H1 Title:', headNameMatch ? headNameMatch[1].trim() : 'Unknown');
    if (imgMatch) {
      console.log('Texture Hash:', imgMatch[1]);
      console.log('Direct Texture URL:', `https://textures.minecraft.net/texture/${imgMatch[1]}`);
      console.log('Mineatar 3D Head URL:', `https://api.mineatar.io/head/${imgMatch[1]}`);
      console.log('MC-Heads Texture Render URL:', `https://mc-heads.net/avatar/${imgMatch[1]}/32`);
    } else {
      console.log('No texture match found in HTML');
    }
  } catch (e) {
    console.error(e);
  }
}

testHdb();
