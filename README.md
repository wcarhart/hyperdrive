<p align="center"><img alt="Hyperdrive logo" src="static/favicon.png" /></p>
<h1 align="center">Hyperdrive</h1>
<h5 align="center">simple websites powered by <a href="https://www.google.com/drive/" target="_blank">Google Drive</a></h5>

## About
Hyperdrive takes a [Google Drive](https://www.google.com/drive/) folder of images and transforms it into a dynamic image showcase website.
<p align="center"><img alt="Hyperdrive demo screenshot" src="demo.png" /></p>

## Install
Install Hyperdrive with [yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/).
```bash
yarn add hyper-drive
```
```bash
npm install hyper-drive
```

## Setup
#### Google Drive API
Hyperdrive uses the Google Drive API. You'll need to set up a GCP service account and download your credentials for Hyperdrive to use. Use this article to create a GCP Service Account: https://developers.google.com/identity/protocols/oauth2/service-account. By default, Hyperdrive looks for `credentials.json` in your project directory. If you want to save it somewhere else, like `/etc/keys`, you can use the `gcpCredentialsFile` config when starting Hyperdrive to specify your credential file's location.

#### Google Drive folder ID
Next, you'll need a valid public Google Drive folder. Once you have a folder with your desired images, you can either make the folder public, or add your GCP service account as a contributor to the folder. After you complete one of the previous options to make the folder accessible, you'll need the Google Drive folder ID. Navigate to the folder in Google Drive. Copy the Folder ID found in the URL. This is everything that comes after `folder/` in the URL. For example, if the URL was `https://drive.google.com/drive/folders/1dyUEebJaFnWa3Z4n0BFMVAXQ7mfUH11g`, then the folder ID would be `1dyUEebJaFnWa3Z4n0BFMVAXQ7mfUH11g`.

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

## Supported Image Formats
Hyperdrive supports the majority of browser supported image formats. The following formats will be rendered with no additional manipulation: `.apng`, `.avif`, `.gif`, `.jpg`, `.jpeg`, `.jfif`, `.pjpeg`, `.pjp`, `.png`, `.svg`, `.webp`

In addition, Hyperdrive will attempt to convert proprietary or non-web standard formats to more conventional ones. The following formats will be converted before being rendered:
* `.heic` will be converted to `.jpeg` using the main image
* `.mov` will be converted to `.gif`

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
The `captions` config controls whether or not to display captions under each image in the client. If `captions` is true, the image's name in the Google Drive folder minus the file extension will become the image caption. For instance, if the image file's name in the Google Drive folder was `My cool vacation picture.jpeg`, the caption that appears in the UI will be `My cool vacation picture` (default: false).

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

#### gcpCredentialsFile
The `gcpCredentialsFile` config defines the local server-side path to the GCP credentials file that will be used to access the Google Drive API. The path can be absolute or relative. The file must exist (default: `credentials.json`).

#### publicAssetsFolder
The `publicAssetsFolder` config defines the local server-side path to the public assets folder, which are built from templates and served directly from the URL path `/`. The path can be absolute or relative. If the directory does not exist, it will be created (default: `public`).

#### publicImagesFolder
The `publicImagesFolder` config defines the local server-side path to the public images folder, which will be used to serve static image files. The path can be absolute or relative. If the directory does not exist, it will be created (default: `images`).

#### templateFolder
The `templateFolder` config defines the local server-side path to the templates folder, which will be used to build the assets in `publicAssetsFolder`. The path can be absolute or relative. If the directory does not exist, it will be created (default: `templates`).

#### staticFolder
The `staticFolder` config defines the local server-side path to the static assets folder, which are served directly from the URL path `/static`. The path can be absolute or relative. If the directory does not exist, it will be created (default: `static`).

#### landingPage
The `landingPage` config defines the name of the landing page HTML file within the `templateFolder`. The path must be relative to the `templateFolder`, meaning the `landingPage` file must reside within the `templateFolder` directory (default: `index.html`).

#### stylesheet
The `stylesheet` config defines the name of an optional external CSS stylesheet within the `staticFolder`. If included, additional styles from `stylesheet` will be preferred over Hyperdrive's default CSS rules. The path must be relative to the `staticFolder`, meaning the `stylesheet` file must reside within the `staticFolder` directory (default: none).

#### favicon
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

#### config
The `config` config is a JSON object of the app's configurations. It is printed when `verbose` is true and is not directly manipulable, but is accessible via `Hyperdrive().config`.

#### app
The `app` config is a reference to Hyperdrive's underlying [Express.js](https://expressjs.com/) app. It is created when `build()` is called and is not directly manipulable, but is accessible via `Hyperdrive().app`. Before `build()` is called, `app` is null.
