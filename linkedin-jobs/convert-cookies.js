#!/usr/bin/env node
// Convierte Cookie-Editor JSON → Playwright storage state
const fs = require('fs');

const input = fs.readFileSync('/tmp/linkedin-cookies.json', 'utf8');
const cookies = JSON.parse(input);

const sameSiteMap = {
  'no_restriction': 'None',
  'lax': 'Lax',
  'strict': 'Strict',
  'unspecified': 'None',
};

const playwrightState = {
  cookies: cookies.map(c => ({
    name: c.name,
    value: c.value,
    domain: c.domain,
    path: c.path || '/',
    expires: c.expirationDate || -1,
    httpOnly: c.httpOnly || false,
    secure: c.secure || false,
    sameSite: sameSiteMap[c.sameSite?.toLowerCase()] || c.sameSite || 'None',
  })),
  origins: []
};

fs.writeFileSync('/root/linkedin-playwright/session.json', JSON.stringify(playwrightState, null, 2));
console.log('Session guardada en /root/linkedin-playwright/session.json');
console.log('Cookies convertidas:', playwrightState.cookies.length);
