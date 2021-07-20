import App from "../App";
import random from "./random";

/**
	 * 
	 * @param num The index starting from 1
	 */
function attemptHit(this: App, num: number) {
	if (this.checkGameOver()) {
		alert(this.restartMessage);
		return;
	}

	const lastGoblin = Number(
		this.state.goblinPosAry.slice(-1) + ""
	);

	this.setState({
		playerPos: num
	});

	if (lastGoblin === num - 1)
		this.commitHit();
	else this.missHit();
}

function commitHit(this: App) {
	const {
		goblinPosAry,
		score,

		deadBodyAry,
		floorBlood,
		playSounds
	} = this.state;

	let {consecutiveHits} = this.state;

	const lastGoblin = Number(
		goblinPosAry.slice(-1) + ""
	);

	deadBodyAry[random(0, 1)] = true;
	floorBlood[lastGoblin] = true;
	consecutiveHits++;

	if (playSounds)
		this.playSound("slash" + (random(0, 2) + 1));

	this.setState({
		score: score + 10 + consecutiveHits,
		consecutiveHits,

		// Extend the goblin array
		goblinPosAry: goblinPosAry.length < 20
			? [...this.getStartingGoblins(), ...goblinPosAry.slice(0, -1)]
			: goblinPosAry.slice(0, -1),
		deadBodyAry,

		lastHitPos: lastGoblin
	}, () => {
		if (this.hitEffectTimeout)
			window.clearTimeout(this.hitEffectTimeout);

		this.hitEffectTimeout = window.setTimeout((app: App) => {
			app.setState({
				lastHitPos: -1
			});
		}, 200, this);
	});
}

function missHit(this: App) {
	const { playSounds } = this.state;
	let { lives } = this.state;

	lives--;

	if (playSounds)
		this.playSound("miss");

	this.setState({
		consecutiveHits: 0,
		lives
	}, () => {
		if (this.checkGameOver()) {
			this.saveBestScore();
			alert(this.restartMessage);
		}
	});
}

function checkGameOver(this: App) {
	return this.state.lives < 1;
}

export {
	attemptHit,
	checkGameOver,
	commitHit,
	missHit
};
