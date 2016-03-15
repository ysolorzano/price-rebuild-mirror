# price-rebuild
Price app, built in Ionic

First, you must...
`cd src`
`git clone https://github.com/Telerik-Verified-Plugins/Facebook.git`
`cd ..`

Then...
Use `ionic state reset` to grab the plugins located in `package.json`
Then `ionic build ios` to compile the binary
Then `ionic emulate ios` to run on the emulator

Or navigate to `platforms/ios/price.xcodeproj` and run from there

It should be able to be tested on a local machine by simply opening `index.html`

`ionic serve` will only work if you disable CORS in the browser (`allow-control-allow-origin:*`) There are extensions available for both Chrome and Firefox. This should enable the live reload feature.
