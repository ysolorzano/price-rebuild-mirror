# price-rebuild
Price app, built in Ionic

Use `ionic state reset` to grab the plugins located in `package.json`
Then `ionic build ios` to compile the binary
Then `ionic emulate ios` to run on the emulator

It should be able to be tested on a local machine by simply opening `index.html`

`ionic serve` will only work if you disable CORS in the browser (`allow-control-allow-origin:*`)

