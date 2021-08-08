require('dotenv').config();
const fetch = require('node-fetch');
const btoa = require('btoa');

module.exports = async function (context, req) {
    try {
        let body = '';

        const response = await fetch('https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${btoa(`${process.env.REDDIT_KEY}:${process.env.REDDIT_SECRET}`)}`,
            },
            body: `grant_type=password&username=${process.env.REDDIT_USERNAME}&password=${process.env.REDDIT_PASSWORD}&redirect_uri=${process.env.REDIRECT_URI}`,
        });
        const data = await response.json();

        body += await generateTopic('Science', data.access_token);
        body += await generateTopic('Games', data.access_token);
        body += await generateTopic('Technology', data.access_token);
        body += await generateTopic('Programming', data.access_token);
        
        context.res = {
            headers: {
                'Content-Type': 'text/html',
            },
            body 
        };
    } catch (error) {
        context.res = {
            headers: {
                'Content-Type': 'text/html'
            },
            body: `${error}`
        }       
    }
}

const generateTopic = async (subreddit, token) => {
    let body = '';

    const response = await fetch(`https://oauth.reddit.com/r/${subreddit}/top/?t=week&limit=5`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();

    body += `<h2>${subreddit}</h2>`;
    body += '<ul>';
    for (let topic of data.data.children) {
        console.log(topic);
        body += `
            <li><a href="${topic.data.url}" target="_blank">${topic.data.title
            .slice(0, 40)
            .concat('...')}</a></li>
        `;
    }
    body += '</ul>';

    return body;
};