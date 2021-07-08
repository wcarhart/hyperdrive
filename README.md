# Hyperdrive
Simple websites powered by [Google Drive](https://www.google.com/drive/).

## Install
Install Hyperdrive with [yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/).
```bash
yarn add @wcarhart/hyperdrive
```
```bash
npm install @wcarhart/hyperdrive
```

## Setup
TODO: app should make these automatically

Hyperdrive uses a few folders for serving files, which you'll need to make manually. You can read the documentation below if you'd like some more information on how to configure these folders, but for now here is a good starting point.
```bash
cd /path/to/project/directory
mkdir public
mkdir images
```

## Usage
First, import Hyperdrive.
```javascript
const { Hyperdrive } = require('@wcarhart/hyperdrive')
```
Then, build your desired configurations. The two required options are `mode` and `driveFolderId`. See the documentation below for the full set of options.
```javascript
const config = {
    mode: 'DEV',
    driveFolderId: '1_GFHA4I_Ilq7zmxOM8ht_4VrYrThUQ-K'
}
```
Then, initialize a new Hyperdrive and start it.
```javascript
hyperdrive = new Hyperdrive(config)
hyperdrive.start()
```
Using the default parameters, your development Hyperdrive is available at http://localhost on port `80`.
Conversely, if you'd like to simply build the app and work out starting the server yourself, you can use the `build()` method.
```javascript
hyperdrive = new Hyperdrive(config)

// app is a standard Express.js application with all
// necessary routes already configured
hyperdrive.build()
const app = hyperdrive.app
```

## Configuration Documentation
There are many useful configurations for Hyperdrive. There are two required configurations, `mode` and `driveFolderId`. All other configurations are optional. For an example configuration definition, see [`example.js`](example.js)

#### name
The `name` config populates the browser tab's title as well as the main header on the website (default: `Hyperdrive`).

#### body
The `body` config populates the text below the main header on the website. It evaluates to a `<p>` tag so you can use `<br>` and other inline HTML. (default: `Welcome to Hyperdrive! To get started, please check out the README and specify your Google Drive folder ID.`).

#### loading
The `loading` config populates the loading text, which appears while images are being downloaded. (default: `Loading the latest and greatest, one moment please...`).

#### verbose
The `verbose` config controls the verbosity of logging at app launch. Setting `verbose` to true will print out all configurations before the app launches (default: `false`).

#### mode
The `mode` config controls the operation mode for the app. It is required and has only two options: `DEV` and `PROD`. Using `start()` with the `DEV` mode will create a local development HTTP server, while the `PROD` mode will create a production HTTPS server. See `port`, `host`, `sslKeyFile`, and `sslCertFile` for running in `PROD` mode.

#### port
The `port` configuration defines the port to which the app listens (default: 80 (`DEV`), 443 (`PROD`)).

#### captions
TODO: need to implement caption toggle/boolean

#### driveFolderId
The `driveFolderId` config defines the public Google Drive folder that will be used as the source of images for the website. It is required.

#### refreshEndpoint
The `refreshEndpoint` config defines the server-side API endpoint to use when refreshing client-side image content via `POST`. It must start with a '/' (default: `/refresh`).

#### cleanEndpoint
The `cleanEndpoint` config defines the server-side API endpoint to use when cleaning up server-side image files via `POST`. It must start with a '/' (default: `/clean`).

#### imagesEndpoint
The `imagesEndpoint` config defines the server-side API endpoint to use when accessing image content from the client via `GET`. It must start with a `/` (default: `/images`).

#### host
The `host` config defines the hostname to be used in `PROD` mode. It is required for `PROD` mode and if you are using the default SSL files, `sslKeyFile` and `sslCertFile`. It has no default.

#### sslKeyFile
The `sslKeyFile` config defines the local server-side path to the SSL key file to be used for the HTTPS server in `PROD` mode. Using the default requires `host` to also be set (default: `/etc/letsencrypt/live/${host}/privkey.pem`).

#### sslCertFile
The `sslCertFile` config defines the local server-side path to the SSL cert file to be used for the HTTPS server in `PROD` mode. Using the default requires `host` to also be set (default: `/etc/letsencrypt/live/${host}/fullchain.pem`).

#### publicAssetsFolder
The `publicAssetsFolder` config defines the local server-side path to the public assets folder, which are built from templates and served directly from the URL path `/`. The path can be absolute or relative (default: `public`).

#### publicImagesFolder
The `publicImagesFolder` config defines the local server-side path to the public images folder, which will be used to serve static image files. The path can be absolute or relative (default: `images`).

#### templateFolder
The `templateFolder` config defines the local server-side path to the templates folder, which will be used to build the assets in `publicAssetsFolder`. The path can be absolute or relative (default: `templates`).

#### staticFolder
The `staticFolder` config defines the local server-side path to the static assets folder, which are served directly from the URL path `/static`. The path can be absolute or relative (default: `static`).

#### landingPage
The `landingPage` config defines the name of the landing page HTML file within the `templateFolder`. The path must be relative to the `templateFolder`, meaning the `landingPage` file must reside within the `templateFolder` directory (default: `index.html`).

#### favicon
TODO: need to account for this in the front end if not named favicon.png - currently hardcoded

The `favicon` config defines the name of the favicon file within the `staticFolder`. The path must be relative to the `staticFolder`, meaning the `favicon` file must reside within the `staticFolder` directory (default: `favicon.png`).

#### colors
The `colors` config is an object that describes the color theme for the site.
| Color | Description | Default |
|-------|-------------|---------|
| `colors.main_background` | The main background color of the site. | ![#2F242C](https://via.placeholder.com/10/2F242C?text=+) `#2F242C` |
| `colors.caption_background` | The background color of the caption boxes. | ![#FCFCFC](https://via.placeholder.com/10/FCFCFC?text=+) `#FCFCFC` |
| `colors.main_text` | The main text color of the site. | ![#FCFCFC](https://via.placeholder.com/10/FCFCFC?text=+) `#FCFCFC` |
| `colors.caption_text` | The text color of the caption text. | ![#000000](https://via.placeholder.com/10/000000?text=+) `#000000` |
| `colors.loading_text` | The text color of the loading text and spinner. | ![#808080](https://via.placeholder.com/10/808080?text=+) `#808080` |