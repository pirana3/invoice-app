const path = require("path");

// EAS/Xcode can execute Metro from ios/, but NativeWind's Expo integration
// resolves config via process.cwd(). Ensure cwd is always app root.
if (process.cwd() !== __dirname) {
  process.chdir(__dirname);
}

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  input: path.resolve(__dirname, "app/global.css"),
  configPath: path.resolve(__dirname, "tailwind.config.js"),
});
