Github Commits Watcher
======================

Simple app developed using the MERN stack (MongoDB + Express + React + Node.js).

Description
-----------

The app allows you to add GitHub repositories so that it can lists their commits.

When a repository is added, the app fetches the last month commits. Subsequent commits are received and saved on app via a Hook that is created the moment the repository is added.

This app was developed using React/Redux and Bootstrap for the front-end and Express.js + MongoDB for the back-end.

Running
-------

Install the project Server dependencies by running ``npm install`` on the root of the project.

Then install the Client dependencies by running ``npm install`` inside ``./client`` folder.

Then set up the environment variables:

- ``MONGODB_URI``: the url to the MongoDb database,
- ``GITHUB_SECRET``: the GitHub OAuth Secret, received when you register your OAuth App,
- ``GITHUB_KEY``: the GitHub OAuth ClientId, received when you register your OAuth App,
- ``API_BASE_URL``: the base url to the GitHub API,
- ``APP_URL``: the url of the app,
- ``JWT_SECRET``: a random string used to sign the JSON Web Tokens
- ``PORT``: the port that the app will run.

The following commands are available to run the app:

- Runs eslint on the project's code:
```
npm run lint
```

- Builds the React client
```
npm run build-client
```

- Builds the Express server
```
npm run build-server
```

- Builds both client and server
```
npm run build
```

- Starts the app (requires builds for client and server)
```
npm run start
```

- Builds the React client and the Express server, then starts the server
```
npm run dev
```

- Re-builds the React client and the Express server, then restarts the server whenever a change is made to the code
```
npm run watch
```

License
-------

This project is available under the [GNU General Public License v3](https://www.gnu.org/licenses/gpl-3.0.en.html).
