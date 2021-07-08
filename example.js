const { Hyperdrive } = require('./index.js')

const testConfig = {
	verbose: true,
	mode: 'DEV',
	driveFolderId: '1_GFHA4I_Ilq7zmxOM8ht_4VrYrThUQ-K',
	landingPage: 'main.html',
	name: 'Hyperdrive Test App',
	body: 'This is a Hyperdrive test app, for testing purposes only.',
	loading: 'Stuff\'s comin\', yo...',
	colors: {
		// main_background: '#E0FFFF',
		// main_text: '#000000'
	}
}

hyperdrive = new Hyperdrive({
	mode: 'DEV',
	driveFolderId: '1_GFHA4I_Ilq7zmxOM8ht_4VrYrThUQ-K'
})

hyperdrive.start()
