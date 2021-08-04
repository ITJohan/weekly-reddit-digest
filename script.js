const generateTopic = (subreddit, token) => {
  fetch(`https://oauth.reddit.com/r/${subreddit}/top/?t=week&limit=5`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((result) => result.json())
    .then((data) => {
      root.innerHTML += `<h2>${subreddit}</h2>`;
      for (let topic of data.data.children) {
        root.innerHTML += `<p>${topic.data.title}</p>`;
      }
    })
    .catch((error) => console.log(error));
};

const root = document.getElementById('root');

fetch('https://www.reddit.com/api/v1/access_token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic ' + btoa(`${key}:${secret}`),
  },
  body: `grant_type=password&username=${username}&password=${password}&redirect_uri=${redirectUri}`,
})
  .then((response) => response.json())
  .then((data) => {
    generateTopic('Science', data.access_token);
    generateTopic('Games', data.access_token);
    generateTopic('Technology', data.access_token);
    generateTopic('Programming', data.access_token);
  })
  .catch((error) => console.log(error));
