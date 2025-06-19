
const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();

app.get('/api/search', async (req, res) => {
    const movieTitle = req.query.title;

    if (!movieTitle) return res.status(400).json({ error: 'يرجى إدخال اسم الفيلم' });

    const searchSites = [
        { name: 'Wecima', url: `https://wecima.show/?s=${encodeURIComponent(movieTitle)}`, selector: '.Grid--WecimaPosts .GridItem--WecimaPosts a' },
        { name: 'Fushaar', url: `https://fushaar.com/?s=${encodeURIComponent(movieTitle)}`, selector: '.post-thumbnail a' },
        { name: 'EgyBest', url: `https://egy.best/?s=${encodeURIComponent(movieTitle)}`, selector: '.movie a' },
        { name: 'Cima4u', url: `https://cima4u.life/?s=${encodeURIComponent(movieTitle)}`, selector: '.GridItem--WecimaPosts a' },
        { name: 'Shahid4U', url: `https://shahid4u.cam/?s=${encodeURIComponent(movieTitle)}`, selector: '.GridItem--WecimaPosts a' }
    ];

    for (let site of searchSites) {
        try {
            const response = await fetch(site.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            const body = await response.text();
            const $ = cheerio.load(body);
            const link = $(site.selector).first().attr('href');

            if (link) {
                return res.json({ site: site.name, link });
            }
        } catch (err) {
            console.error(`Error searching ${site.name}:`, err.message);
            continue;
        }
    }

    return res.status(404).json({ error: 'لم يتم العثور على الفيلم في المواقع المتوفرة' });
});

module.exports = app;
