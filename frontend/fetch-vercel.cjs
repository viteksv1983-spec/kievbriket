const https = require('https');
https.get('https://kievbriket.vercel.app/', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const matches = data.match(/<img[^>]+src=["']([^"']+)["']/g);
        console.log("Images found on React page:", matches ? matches.length : 0);
        if (matches) {
            matches.forEach(m => {
                if (m.includes('categories') || m.includes('media') || m.includes('placehold')) {
                    console.log(m);
                }
            });
        }
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
