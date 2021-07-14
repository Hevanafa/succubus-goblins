import React from "react";
import "./App.scss";

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

	attemptLoadScore() {
		let bestScore = localStorage.getItem("best_score");

		if (bestScore)
			this.setState({
				bestScore: Number(bestScore)
			});
	}

	saveBestScore() {
		const { score, bestScore } = this.state;

		if (score > bestScore) {
			localStorage.setItem("best_score", score + "");
			this.setState({
				bestScore: score
			});
		}
	}

	readonly soundFiles = [
		"miss",
		"slash1",
		"slash2",
		"slash3"
	];

	loadedSoundFiles: Map<string, HTMLAudioElement> | null = null;

	playSound(key: string) {
		const soundFile = this.loadedSoundFiles?.get(key);

		if (!soundFile)
			throw new Error("Can't find " + key + "!");

		soundFile.volume = 0.2;
		soundFile.play();
	}

	loadSoundFiles() {
		// Skip loading if it's already loaded
		if (this.loadedSoundFiles)
			return;

		this.loadedSoundFiles = new Map<string, HTMLAudioElement>();

		for (const name of this.soundFiles)
			this.loadedSoundFiles.set(
				name,
				new Audio(`./assets/ogg/${name}.ogg`)
			);
	}

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

	get bestScoreLine() {
		return <>
			<br />
			Best: {this.state.bestScore}
		</>;
	}

	get guideFragment() {
		return this.state.score <= 100
			?
			<div className="guide">
				123
			</div> : <div className="guide">
				···
			</div>;
	}

	render() {
		const {
			lives,
			score,
			soilAry,

			deadBodyAry,
			floorBlood
		} = this.state;

		if (!this.state.initialised)
			return null;

		return (
			<div className="App">
				<div className="lives">
					<span className="heart">♥ </span>
					<span>
						{lives}
					</span>
				</div>

				<div className="score">
					Score: {score}
					{this.bestScoreLine}
				</div>

				{this.guideFragment}

				<div className="terrain">
					{
						this.goblinMap
							.map((row, rowIdx) => {
								const [
									isSecondLastIdx,
									isLastIdx
								] = [
									rowIdx === this.goblinMap.length - 2,
									rowIdx === this.goblinMap.length - 1
								];

								return (
									<div key={`gm_${rowIdx}`}>
										{
											isLastIdx && deadBodyAry[0]
												? <span className="dead goblin">g</span>
												: "\u00a0"
										}
										{
											row.map((cell, cellIdx) => {
												const isBloody = (isSecondLastIdx || isLastIdx)
													&& floorBlood[cellIdx];

												return (
													cell
													? <span
														key={`gm_${rowIdx}_${cellIdx}`}
														className={
															(isBloody ? "bloody " : "") +
															"goblin"
														}>
														g
													</span> : <span
														key={`gm_${rowIdx}_${cellIdx}`}
														className={
															(isBloody ? "bloody " : "") +
															"soil"
														}>
														{soilAry[rowIdx][cellIdx]}
													</span>
												);
												}
											) // "\u00a0"
										}
										{
											isLastIdx && this.state.deadBodyAry[1]
												? <span className="dead goblin">g</span>
												: "\u00a0"
										}
									</div>
								);
							})
					}
				</div>

				{this.guideFragment}

				<div className="hero">
					<span>s</span>
					<span className="bonker">!</span>
				</div>

				<div className="symbol-list">
					<div>
						How to play:<br />
						Use the keys 1, 2 or 3 to bonk the goblins.<br />
						Their h*rny minds must be stopped!
					</div>

					<div>
						<br />
						Symbols:
					</div>

					<div>
						<span className="succubus">s</span>
						<span>: Succubus</span>
					</div>
					<div>
						<span className="bonker">!</span>
						<span>: Two-handed silver spiked club</span>
					</div>
					<div>
						<span className="goblin">g</span>
						<span>: Goblin</span>
					</div>
				</div>

				<div className="about-app">
					Made with <span className="heart">♥</span> by Hevanafa<br />
					Last update: 14 July 2021
				</div>
			</div>
		);
	}
}