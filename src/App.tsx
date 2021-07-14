import React from "react";

import { attemptLoadScore, saveBestScore } from "./modules/scores";
import { playSound, loadSoundFiles } from "./modules/sounds";

import "./App.scss";
import { aboutAppFragment, bestScoreFragment, guideFragment, heroFragment, livesFragment, mapFragment, scoreFragment, symbolListFragment } from "./modules/fragments";

// Taken from:
// https://lodash.com/docs/4.17.15#random
const random = require("lodash.random") as (lower?: number, upper?: number, floating?: boolean) => number;

interface IState {
	initialised: boolean;

	score: number;
	bestScore: number;
	// Either 0, 1 or 2
	goblinPosAry: number[];
	lives: number;

	// Decorations
	soilAry: string[][];
	deadBodyAry: boolean[]; // length: 2
	floorBlood: boolean[]; // length: 3
}

export default class App extends React.Component<{}, IState> {
	readonly goblinAryCap = 50;

	constructor(props?: any) {
		super(props);

		this.state = {
			initialised: false,

			score: 0,
			bestScore: 0,
			goblinPosAry: [],
			lives: 0,

			soilAry: this.getSoilMap(),
			deadBodyAry: [],
			floorBlood: []
		};

		// console.log(this.state.goblinPosAry);

		this.loadSoundFiles();
	}

	componentDidMount() {
		this.startNewGame();

		this.attemptLoadScore();

		window.addEventListener("keydown", (e) => {
			console.log("keydown", e.key);

			if ("123".includes(e.key))
				this.attemptHit(Number(e.key));

			if (e.key === "r")
				if (this.checkGameOver())
					this.startNewGame();
		});
	}

	getSoilMap = () =>
		[...new Array(10)]
			.map(_ =>
				[...new Array(3)].map(
					_ => ".,'`"[random(0, 3)]
				)
			);

	getStartingGoblins = () =>
		[...new Array(this.goblinAryCap)]
			.map(_ =>
				random(0, 2)
			);

	startNewGame() {
		this.setState({
			initialised: true,

			score: 0,
			goblinPosAry: this.getStartingGoblins(),
			lives: 3,

			deadBodyAry: [...new Array(2)].map(_ => false),
			floorBlood: [...new Array(3)].map(_ => false)
		});
	}

	// scores.ts
	attemptLoadScore = attemptLoadScore;
	saveBestScore = saveBestScore;

	loadedSoundFiles: Map<string, HTMLAudioElement> | null = null;

	// sounds.ts
	playSound = playSound;
	loadSoundFiles = loadSoundFiles;

	readonly restartMessage = "You ran out of lives!  Press R to restart.";

	/**
	 * 
	 * @param num The index starting from 1
	 */
	attemptHit(num: number) {
		if (this.checkGameOver()) {
			alert(this.restartMessage);
			return;
		}

		const lastGoblin = Number(
			this.state.goblinPosAry.slice(-1) + ""
		);

		if (lastGoblin === num - 1)
			this.commitHit();
		else this.missHit();
	}

	commitHit() {
		const {
			goblinPosAry,
			score,

			deadBodyAry,
			floorBlood
		} = this.state;

		const lastGoblin = Number(
			goblinPosAry.slice(-1) + ""
		);

		deadBodyAry[random(0, 1)] = true;
		floorBlood[lastGoblin] = true;

		this.playSound("slash" + (random(0, 2) + 1));

		this.setState({
			score: score + 10,
			// Extend the goblin array
			goblinPosAry: goblinPosAry.length < 20
				? [...this.getStartingGoblins(), ...goblinPosAry.slice(0, -1)]
				: goblinPosAry.slice(0, -1),
			deadBodyAry
		});
	}

	missHit() {
		this.playSound("miss");

		this.setState({
			lives: this.state.lives - 1
		}, () => {
			if (this.checkGameOver()) {
				this.saveBestScore();
				alert(this.restartMessage);
			}
		});
	}

	checkGameOver = () => this.state.lives < 1;

	// randInt = (max: number) =>
	// 	Math.round(Math.random() * max);

	get goblinMap() {
		return this.state.goblinPosAry
			.slice(-10)
			.map(cell =>
				[...new Array(3)]
					.map((_, idx) => cell === idx)
			)
	}

	// fragments.tsx
	aboutAppFragment = aboutAppFragment;
	bestScoreFragment = bestScoreFragment;
	guideFragment = guideFragment;
	heroFragment = heroFragment;
	livesFragment = livesFragment;
	mapFragment = mapFragment;
	scoreFragment = scoreFragment;
	symbolListFragment = symbolListFragment;

	render() {
		if (!this.state.initialised)
			return null;

		return (
			<div className="App">
				{this.livesFragment()}
				{this.scoreFragment()}
				{this.guideFragment()}
				{this.mapFragment()}
				{this.guideFragment()}
				{this.heroFragment()}
				{this.symbolListFragment()}
				{this.aboutAppFragment()}
			</div>
		);
	}
}
