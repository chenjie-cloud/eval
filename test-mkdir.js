import fs from 'fs';
const text = fs.readFileSync('src/apps/Terminal.tsx', 'utf-8');
console.log(text.includes('path.normalize') ? 'Handles ..' : 'Does not handle ..');
