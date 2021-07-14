import React from "react";

import { attemptLoadScore, saveBestScore } from "./modules/scores";
import { playSound, loadSoundFiles } from "./modules/sounds";

import "./App.scss";
import { aboutAppFragment, bestScoreFragment, guideFragment, heroFragment, livesFragment, mapFragment, scoreFragment, symbolListFragment } from "./modules/fragments";
import { attemptHit, checkGameOver, commitHit, missHit } from "./modules/combatMethods";
import random from "./modules/random";

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
	readonly restartMessage = "You ran out of lives!  Press R to restart.";

	protected loadedSoundFiles: Map<string, HTMLAudioElement> | null = null;

	constructor(props?: any) {
		super(props);

		this.state = {
			initialised: false,

			score: 0,
			bestScore: 0,
			goblinPosAry: [],
			lives: 0,

			soilAry: this.newSoilMap(),
			deadBodyAry: [],
			floorBlood: []
		};

		this.loadSoundFiles();
	}

	componentDidMount() {
		this.attemptLoadScore();
		this.bindKeyDownEvent();
		this.startNewGame();
	}

	bindKeyDownEvent() {
		window.addEventListener("keydown", (e) => {
			console.log("keydown", e.key);

			if ("123".includes(e.key))
				this.attemptHit(Number(e.key));

			if (e.key === "r"
				&& this.checkGameOver())
					this.startNewGame();
		});
	}

	get goblinMap() {
		return this.state.goblinPosAry
			.slice(-10)
			.map(cell =>
				[...new Array(3)]
					.map((_, idx) => cell === idx)
			)
	}

	newSoilMap = () =>
		[...new Array(10)]
			.map(_ =>
				[...new Array(3)].map(
					_ => ".,'`"[random(0, 3)]
				)
			);

	protected getStartingGoblins = () =>
		[...new Array(this.goblinAryCap)]
			.map(_ =>
				random(0, 2)
			);

	private startNewGame() {
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

	// sounds.ts
	playSound = playSound;
	loadSoundFiles = loadSoundFiles;

	// combatMethods.ts
	attemptHit = attemptHit;
	checkGameOver = checkGameOver;
	commitHit = commitHit;
	missHit = missHit;

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
