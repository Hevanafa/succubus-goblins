import App from "../App";

const soundFiles = [
	"miss",
	"slash1",
	"slash2",
	"slash3"
];

function playSound(this: App, key: string) {
	const soundFile = this.loadedSoundFiles?.get(key);

	if (!soundFile)
		throw new Error("Can't find " + key + "!");

	soundFile.volume = 0.2;
	soundFile.play();
}

function loadSoundFiles(this: App) {
	// Skip loading if it's already loaded
	if (this.loadedSoundFiles)
		return;

	this.loadedSoundFiles = new Map<string, HTMLAudioElement>();

	for (const name of soundFiles)
		this.loadedSoundFiles.set(
			name,
			new Audio(`./assets/ogg/${name}.ogg`)
		);
}

export {
	loadSoundFiles,
	playSound
}
