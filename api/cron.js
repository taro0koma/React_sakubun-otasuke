const https = require('https');
const urls = [ 'https://react-sakubun-otasuke.vercel.app/src/pages/HyougenPage', 'https://react-sakubun-otasuke.vercel.app//src/pages/StylePage', 'https://react-sakubun-otasuke.vercel.app/src/pages/ContactPage', 'https://react-sakubun-otasuke.vercel.app/src/pages/ConsolePage' ];
const keepAlive = (url) => { const options = { hostname: new URL(url).hostname, path: new URL(url).pathname, method: 'GET', };
const req = https.request(options, (res) => { console.log(`STATUS: ${res.statusCode} for ${url}`);
res.on('data', (chunk) => { console.log(`BODY: ${chunk}`); }); });
req.on('error', (e) => { console.error(`Problem with request for ${url}: ${e.message}`); });
req.end(); };
// 各URLに対してリクエストを送信
const keepAliveAll = () => { urls.forEach((url) => keepAlive(url)); };
 // 毎15分に一度、すべてのページにリクエストを送信 
setInterval(keepAliveAll, 15 * 60 * 1000);
 // 初回実行 
 keepAliveAll();


 //#####################################################
 //変更した部分：
 //・このファイルを作った。
 //・Vercel.jsonにCronの処理を入れた。
 
 //エラーが出た場合上記を削除するといい。