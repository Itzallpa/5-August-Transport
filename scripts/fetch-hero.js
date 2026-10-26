const https = require('https');

https.get('https://5augusttransport.com', (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const idx = body.indexOf('id="home"');
    if (idx !== -1) {
      console.log('=== HERO SECTION HTML ===');
      console.log(body.substring(idx, idx + 1800));
    } else {
      console.log('id="home" not found');
    }
  });
}).on('error', (e) => {
  console.error(e);
});
