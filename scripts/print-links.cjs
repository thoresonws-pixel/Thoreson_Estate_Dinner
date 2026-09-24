// Print sheets are rendered from JSON by the shared browser pages.
// Usage: npm run print:links -- [storyId]
const fs=require('fs'),path=require('path');
const catalog=JSON.parse(fs.readFileSync(path.join(__dirname,'..','stories/catalog.json'),'utf8'));
const requested=process.argv[2]||catalog.legacyRoutes['qr-codes.html?'];
const id=catalog.aliases[requested]||requested;
if(!/^[a-zA-Z0-9_-]+$/.test(id))throw Error('Invalid story ID');
const story=JSON.parse(fs.readFileSync(path.join(__dirname,'..','stories',id,'package.json'),'utf8'));
console.log('Print '+story.metadata.name+': https://thorsmystery.com/qr-codes.html?story='+encodeURIComponent(id));
console.log('Reference: https://thorsmystery.com/qr-cheatsheet.html?story='+encodeURIComponent(id));
