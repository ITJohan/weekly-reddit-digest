const generateTopic = (subreddit, token) => {
  fetch(`https://oauth.reddit.com/r/${subreddit}/top/?t=week&limit=5`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((result) => result.json())
    .then((data) => {
      root.innerHTML += `<h2>${subreddit}</h2>`;
      root.innerHTML += '<ul>';
      for (let topic of data.data.children) {
        console.log(topic);
        root.innerHTML += `
        <li><a href="${topic.data.url}" target="_blank">${topic.data.title
          .slice(0, 40)
          .concat('...')}</a></li>
        `;
      }
      root.innerHTML += '</ul>';
    })
    .catch((error) => console.log(error));
};

const root = document.getElementById('root');

fetch('https://www.reddit.com/api/v1/access_token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic ' + btoa(`%process.env.KEY%:%SECRET%`),
  },
  body: `grant_type=password&username=%USERNAME%&password=%PASSWORD%&redirect_uri=%REDIRECT_URI%`,
})
  .then((response) => response.json())
  .then((data) => {
    generateTopic('Science', data.access_token);
    generateTopic('Games', data.access_token);
    generateTopic('Technology', data.access_token);
    generateTopic('Programming', data.access_token);
  })
  .catch((error) => console.log(error));
