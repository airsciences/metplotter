# nwac
North West Avalanche Center - Data Visualization Tools

On the plotter channel.

***Install Node Dependencies***

```sh
cd /path/to/nwac-repo
npm install
```

***Add your Development Access Token***

```sh
export NWAC_TOKEN={{ACCESS_TOKEN}}
```

Note this environment variable either needs to be added to your `.bash-profile` before opening the terminal you intend to run the emulator in. Alternatively, you need to export it in the same terminal you will use to run the emulator later.

***Run the NWAC Emulator***

```sh
$ node nwac-emulator.js
NWAC Development Emulator Listening (http://localhost:3000)...
API-Template: req.params { plotTemplateId: '1' }
API-Template: req.params { plotTemplateId: '1' }
```
