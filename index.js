const https = require('https')
const path = require('path')
const fs = require('fs')

const express = require('express')
const errorHandler = require('errorhandler')

const gd = require('./googledrive.js')

class Hyperdrive {
	constructor(options) {
		if (options === undefined) options = {}
		this.name = options.name
		this.body = options.body
		this.loading = options.loading
		this.verbose = options.verbose
		this.mode = options.mode
		this.port = options.port
		this.captions = options.captions
		this.driveFolderId = options.driveFolderId
		this.refreshEndpoint = options.refreshEndpoint
		this.cleanEndpoint = options.cleanEndpoint
		this.imageEndpoint = options.imageEndpoint
		this.host = options.host
		this.sslKeyFile = options.sslKeyFile
		this.sslCertFile = options.sslCertFile
		this.publicAssetsFolder = options.publicAssetsFolder
		this.publicImagesFolder = options.publicImagesFolder
		this.templateFolder = options.templateFolder
		this.staticFolder = options.staticFolder
		this.landingPage = options.landingPage
		this.favicon = options.favicon
		this.colors = options.colors
		this.app = null
		this.config = null
		this.validate()
	}

	validate = () => {
		// verify name
		//  - default: Hyperdrive
		if (this.name === undefined) {
			this.name = 'Hyperdrive'
		}

		// verify body
		//  - default: text about Hyperdrive
		if (this.body === undefined) {
			this.body = 'Welcome to Hyperdrive! To get started, please check out the README and specify your Google Drive folder ID.'
		}

		// verify loading
		//  - default: Loading the latest and greatest, one moment please...
		if (this.loading === undefined) {
			this.loading = 'Loading the latest and greatest, one moment please...'
		}

		// verify verbose
		//  - default: false
		//  - must be a boolean
		if (this.verbose === undefined) {
			this.verbose = false
		}
		if (this.verbose !== false && this.verbose !== true) {
			throw Error(`Verbosity must be a boolean, found: ${this.verbose}`)
		}

		// verify run mode
		//  - must be DEV or PROD
		if (this.mode === undefined) {
			throw Error('Missing mode')
		}
		if (this.mode.toLowerCase() !== 'dev' && this.mode.toLowerCase() !== 'prod') {
			throw Error(`Mode must be set to one of: 'dev', 'prod' (found '${this.mode}'`)
		}

		// verify port
		//  - default for DEV:  80
		//  - default for PROD: 443
		if (this.port === undefined) {
			this.port = this.mode.toLowerCase() === 'dev' ? 80 : 443
		}

		// verify captions
		//  - default: false
		//  - must be a boolean
		if (this.captions === undefined) {
			this.captions = false
		}
		if (this.captions !== false && this.captions !== true) {
			throw Error(`Captions must be a boolean, found: ${this.captions}`)
		}

		// verify driveFolderId
		//  - cannot be empty
		if (this.driveFolderId === undefined) {
			throw Error('Missing Google Drive folder ID')
		}

		// verify refreshEndpoint
		//  - default: /refresh
		if (this.refreshEndpoint === undefined) {
			this.refreshEndpoint = '/refresh'
		}
		if (!this.refreshEndpoint.startsWith('/')) {
			throw Error('Invalid refresh endpoint: must start with \'/\'')
		}

		// verify cleanEndpoint
		//  - default: /clean
		if (this.cleanEndpoint === undefined) {
			this.cleanEndpoint = '/clean'
		}
		if (!this.cleanEndpoint.startsWith('/')) {
			throw Error('Invalid clean endpoint: must start with \'/\'')
		}

		// verify imageEndpoint
		//  - default: /clean
		if (this.imageEndpoint === undefined) {
			this.imageEndpoint = '/images'
		}
		if (!this.imageEndpoint.startsWith('/')) {
			throw Error('Invalid images endpoint: must start with \'/\'')
		}

		// verify SSL sslKeyFile and sslCertFile
		//  - if mode is DEV, ignore
		//  - if mode is PROD, verify sslKeyFile and sslCertFile
		//  - if not using default for sslKeyFile and sslCertFile, host cannot be empty
		if (this.mode.toLowerCase() === 'prod') {
			if (this.sslKeyFile === undefined) {
				if (this.host === undefined) {
					throw Error('Invalid configuration: missing host name, cannot use default SSL key file without a host name')
				}
			} else {
				this.sslKeyFile = `/etc/letsencrypt/live/${self.host}/privkey.pem`
			}

			if (this.sslCertFile === undefined) {
				if (this.host === undefined) {
					throw Error('Invalid configuration: missing host name, cannot use default SSL cert file without a host name')
				}
			} else {
				this.sslKeyFile = `/etc/letsencrypt/live/${self.host}/fullchain.pem`
			}
			
		}

		// verify publicAssetsFolder
		//  - default: public
		//  - directory must exist locally
		if (this.publicAssetsFolder === undefined) {
			this.publicAssetsFolder = 'public'
		}
		if (!this.publicAssetsFolder.startsWith('/') === true) {
			this.publicAssetsFolder = path.join(__dirname, this.publicAssetsFolder)
		}
		try {
			let stats = fs.statSync(this.publicAssetsFolder)
			if (!stats.isDirectory()) throw Error('')
		} catch (e) {
			throw Error(`No such public directory: ${this.publicAssetsFolder}, use \`mkdir -p ${this.publicAssetsFolder}\` before continuing`)
		}

		// verify publicImagesFolder
		//  - default: images
		//  - directory must exist locally
		if (this.publicImagesFolder === undefined) {
			this.publicImagesFolder = 'images'
		}
		if (!this.publicImagesFolder.startsWith('/')) {
			this.publicImagesFolder = path.join(__dirname, this.publicImagesFolder)
		}
		try {
			let stats = fs.statSync(this.publicImagesFolder)
			if (!stats.isDirectory()) throw Error('')
		} catch (e) {
			throw Error(`No such image directory: ${this.publicImagesFolder}, use \`mkdir -p ${this.publicImagesFolder}\` before continuing`)
		}

		// verify templateFolder
		//  - default: templates
		//  - directory must exist locally
		if (this.templateFolder === undefined) {
			this.templateFolder = 'templates'
		}
		if (!this.templateFolder.startsWith('/')) {
			this.templateFolder = path.join(__dirname, this.templateFolder)
		}
		try {
			let stats = fs.statSync(this.templateFolder)
			if (!stats.isDirectory()) throw Error('')
		} catch (e) {
			throw Error(`No such template directory: ${this.templateFolder}, use \`mkdir -p ${this.templateFolder}\` before continuing`)
		}

		// verify staticFolder
		//  - default: templates
		//  - directory must exist locally
		if (this.staticFolder === undefined) {
			this.staticFolder = 'static'
		}
		if (!this.staticFolder.startsWith('/')) {
			this.staticFolder = path.join(__dirname, this.staticFolder)
		}
		try {
			let stats = fs.statSync(this.staticFolder)
			if (!stats.isDirectory()) throw Error('')
		} catch (e) {
			throw Error(`No such static directory: ${this.staticFolder}, use \`mkdir -p ${this.staticFolder}\` before continuing`)
		}

		// verify landingPage
		//  - default: index.html
		//  - file must exist locally in this.templateFolder
		if (this.landingPage === undefined) {
			this.landingPage = 'index.html'
		}
		if (!this.landingPage.startsWith('/')) {
			this.landingPage = path.join(this.templateFolder, this.landingPage)
		}
		try {
			let stats = fs.statSync(this.landingPage)
			if (!stats.isFile()) throw Error('')
		} catch (e) {
			throw Error(`No such landing page: ${this.landingPage}`)
		}
		if (!this.landingPage.includes(this.templateFolder)) {
			throw Error('Landing page must be located in the templates folder')
		}

		// verify favicon
		//  - default: favicon.png
		//  - file must exist locally in this.templateFolder
		if (this.favicon === undefined) {
			this.favicon = 'favicon.png'
		}
		if (!this.favicon.startsWith('/')) {
			this.favicon = path.join(this.staticFolder, this.favicon)
		}
		try {
			let stats = fs.statSync(this.favicon)
			if (!stats.isFile()) throw Error('')
		} catch (e) {
			throw Error(`No such favicon: ${this.favicon}`)
		}
		if (!this.favicon.includes(this.staticFolder)) {
			throw Error('Favicon must be located in the static folder')
		}

		// verify colors
		//  - default: { main_background: #2F242C, caption_background: #FCFCFC, main_text: #000000, caption_text: #FCFCFC , loading_text: #808080 }
		//  - all color values must be in hex and start with '#'
		if (this.colors === undefined) {
			this.colors = {}
		}
		if (this.colors.main_background === undefined) {
			this.colors.main_background = '#2F242C'
		}
		if (this.colors.caption_background === undefined) {
			this.colors.caption_background = '#FCFCFC'
		}
		if (this.colors.main_text === undefined) {
			this.colors.main_text = '#FCFCFC'
		}
		if (this.colors.caption_text === undefined) {
			this.colors.caption_text = '#000000'
		}
		if (this.colors.loading_text === undefined) {
			this.colors.loading_text = '#808080'
		}
		if (Object.values(this.colors).filter(c => !c.startsWith('#') || c.length !== 7).length !== 0) {
			throw Error('Invalid color value, all colors must be 6 digit hex codes and start with \'#\'')
		}

		// build config
		this.config = {
			name: this.name,
			body: this.body,
			loading: this.loading,
			verbose: this.verbose,
			mode: this.mode,
			port: this.port,
			driveFolderId: this.driveFolderId,
			refreshEndpoint: this.refreshEndpoint,
			cleanEndpoint: this.cleanEndpoint,
			imageEndpoint: this.imageEndpoint,
			host: this.host,
			sslKeyFile: this.sslKeyFile,
			sslCertFile: this.sslCertFile,
			publicAssetsFolder: this.publicAssetsFolder,
			publicImagesFolder: this.publicImagesFolder,
			templateFolder: this.templateFolder,
			landingPage: this.landingPage,
			favicon: this.favicon,
			colors: this.colors
		}
	}

	buildPage = (from, to) => {
		let data = fs.readFileSync(from).toString()
		data = data.replace(/{{hyperdrive-title}}/g, this.name)
		data = data.replace(/{{hyperdrive-body}}/g, this.body)
		data = data.replace(/{{hyperdrive-loading}}/g, this.loading)
		data = data.replace(/{{hyperdrive-color-main_background}}/g, this.colors.main_background)
		data = data.replace(/{{hyperdrive-color-caption_background}}/g, this.colors.caption_background)
		data = data.replace(/{{hyperdrive-color-main_text}}/g, this.colors.main_text)
		data = data.replace(/{{hyperdrive-color-caption_text}}/g, this.colors.caption_text)
		data = data.replace(/{{hyperdrive-color-loading_text}}/g, this.colors.loading_text)
		fs.writeFileSync(to, data)
	}

	build = () => {
		// set up express app
		const app = express()
		app.use(express.json())
		app.set('json spaces', 2)

		// allow CORS so can call from another web client
		app.use((req, res, next) => {
			res.header('Access-Control-Allow-Origin', '*')
			res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
			next()
		})

		// log all HTTP routes and errors
		const routeLogger = () => {
			const router = express.Router()
			router.use((req, res, next) => {
				console.log(`${req.method} ${req.originalUrl}`)
				next()
			})
			return router
		}
		app.use(routeLogger())
		app.use(errorHandler({ dumpExceptions: true, showStack: true }))

		// build public UI files
		this.buildPage(this.landingPage, path.join(this.publicAssetsFolder, 'index.html'))
		fs.copyFileSync(this.favicon, path.join(this.publicAssetsFolder, 'favicon.png'))

		// serve static image files
		app.use(this.imageEndpoint, express.static(this.publicImagesFolder))

		// dynamic middlewares
		let config = {
			id: this.driveFolderId,
			cache: this.publicImagesFolder,
		}
		app.use(this.refreshEndpoint, gd.ImageCache(config))
		app.use(this.cleanEndpoint, gd.Cleaner(config))

		// serve UI
		app.use(express.static(this.publicAssetsFolder))
		app.use('/static', express.static(this.staticFolder))

		this.app = app
	}

	start = () => {
		// build app
		this.build()

		// run app
		if (this.mode.toLowerCase() === 'dev') {
			this.app.listen(this.port, '0.0.0.0', () => {
				console.log(`Starting ${this.name} (${this.mode.toUpperCase()})...`)
				if (this.verbose) {
					console.log(JSON.stringify(this.config, null, 2))
				}
				console.log(`Listening on port ${this.port}`)
			}).on('error', (e) => {
				console.log(e)
			}).on('exit', (e) => {
				console.log(e)
			})
		} else if (this.mode.toLowerCase() === 'prod') {
			console.log(`Starting ${this.name} (${this.mode.toUpperCase()})...`)
			if (this.verbose) {
				console.log(JSON.stringify(this.config, null, 2))
			}
			https.createServer({
				key: fs.readFileSync(this.sslKeyFile),
				cert: fs.readFileSync(this.sslCertFile)
			}, this.app).listen(this.port)

			// enforce HTTPS
			let http = express()
			http.get('*', (req, res) => {
				console.log(`Upgrading http://${req.headers.host + req.url} to https://${req.headers.host + req.url}`)
				res.redirect('https://' + req.headers.host + req.url)
			})
			http.listen(80)
		} else {
			throw Error(`Invalid mode: '${this.mode}', mode must be set to one of: 'dev', 'prod'`)
		}
	}
}

module.exports = {
	Hyperdrive
}
