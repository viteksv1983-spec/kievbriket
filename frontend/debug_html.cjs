const fs = require('fs');
const html = fs.readFileSync('dist/index.html', 'utf8');

const regex = /src=["']([^"']+)["']/g;
let match;
const srcs = [];
while ((match = regex.exec(html)) !== null) {
    if (match[1].includes('media/')) {
        srcs.push(match[1]);
    }
}
console.log(srcs.join('\n'));
