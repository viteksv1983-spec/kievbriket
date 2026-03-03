const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'components', 'ProductPage.jsx');
let content = fs.readFileSync(file, 'utf8');

// Replace the problematic line 58 that has curly quote \u2019 breaking JS
// Find the broken FAQ line and replace it with one using backticks
const brokenPattern = /\{ q: 'Який обʼєм складометра\?'.*?автомобіля\.' \}/;
const fixed = "{ q: `Який об\\u02BCєм складометра?`, a: `Складометр \\u2014 це щільно укладене паливо в об\\u02BCємі 1 метр на 1 метр на 1 метр. Ми завжди гарантуємо чесний об\\u02BCєм при завантаженні автомобіля.` }";

content = content.replace(brokenPattern, fixed);
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed curly quote issue in ProductPage.jsx');
