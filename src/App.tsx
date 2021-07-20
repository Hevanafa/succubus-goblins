import React from "react";

import random from "./modules/random";
import { attemptLoadScore, saveBestScore } from "./modules/scores";
import { playSound, loadSoundFiles } from "./modules/sounds";
import { aboutAppFragment, bestScoreFragment, guideFragment, heroFragment, livesFragment, mapFragment, scoreFragment, symbolListFragment } from "./modules/fragments";
import { attemptHit, checkGameOver, commitHit, missHit } from "./modules/combatMethods";

import "./App.scss";
import BigButton from "./components/BigButton";
import SmallButton from "./components/SmallButton";

interface IState {
	initialised: boolean;

	score: number;
	bestScore: number;
	isNewBestScore: boolean;
	playCount: number;

	playerPos: number;
	// Either 0, 1 or 2
	goblinPosAry: number[];
	lives: number;
	consecutiveHits: number;

	// Decorations
	soilAry: string[][];
	deadBodyAry: boolean[]; // length: 2
	floorBlood: boolean[]; // length: 3
	lastHitPos: number;

	controllerButtons: boolean[]; // length: 3
}

const isDev = () => window.location.href.includes("localhost");

export default class App extends React.Component<{}, IState> {
	readonly goblinAryCap = 50;
	readonly restartMessage = "You ran out of lives!  Press R to restart.";
	readonly terrainCols = 3;
	readonly keyGuide = "123"; // "123" | "DFJK" | "SDF JKL";

	readonly racistMode: number = 0;

	protected loadedSoundFiles: Map<string, HTMLAudioElement> | null = null;

	hitEffectTimeout = 0;

	constructor(props?: any) {
		super(props);

		this.state = {
			initialised: false,

			score: 0,
			bestScore: 0,
			isNewBestScore: false,
			playCount: 0,

			playerPos: 0,
			goblinPosAry: [],
			lives: 0,
			consecutiveHits: 0,

			soilAry: this.newSoilMap(),
			deadBodyAry: [],
			floorBlood: [],
			lastHitPos: 0,

			controllerButtons: [false, false, false]
		};

		this.loadSoundFiles();
	}

	componentDidMount() {
		if (!isDev())
			window.oncontextmenu = e => {
				e.preventDefault();
			};

		this.attemptLoadScore();
		this.bindKeyDownEvent();

		window.setTimeout(() => {
			this.startNewGame();
		}, 100);
	}

	bindKeyDownEvent() {
		window.addEventListener("keydown", (e) => {
			// console.log("keydown", e.key);

			// if ("123".includes(e.key))
			// 	this.attemptHit(Number(e.key));

			const inputKey = e.key.toLowerCase();
			const keys = this.keyGuide.toLowerCase();// "dfjk";

			if (keys.includes(inputKey))
				this.attemptHit(keys.indexOf(inputKey) + 1);

			if (inputKey === "r"
				&& this.checkGameOver())
				this.startNewGame();
		});
	}

	get goblinMap() {
		return this.state.goblinPosAry
			.slice(-10)
			.map(cell =>
				[...new Array(this.terrainCols)]
					.map((_, idx) => cell === idx)
			)
	}

	newSoilMap = () =>
		[...new Array(10)]
			.map(_ =>
				[...new Array(this.terrainCols)].map(
					_ => ".,'`"[random(0, 3)]
				)
			);

	protected getStartingGoblins = () =>
		[...new Array(this.goblinAryCap)]
			.map(_ =>
				random(0, this.terrainCols - 1)
			);

	private startNewGame() {
		this.setState({
			initialised: true,

			score: 0,
			playCount: this.state.playCount + 1,
			consecutiveHits: 0,
			isNewBestScore: false,

			playerPos: 2,
			goblinPosAry: this.getStartingGoblins(),
			lives: 3,

			deadBodyAry: [...new Array(2)].map(_ => false),
			floorBlood: [...new Array(3)].map(_ => false),
			lastHitPos: -1
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

	noop() { }

	buttonClickEventHandler(e: React.MouseEvent) {
		const name = e.currentTarget.getAttribute("name");

		console.log(name);
	}

	render() {
		const {
			initialised,
			consecutiveHits
		} = this.state;

		if (!initialised)
			return null;

		return (
			<div className={`App${isDev() ? " dev" : ""}`}>
				<img
					className="placeholder"
					src="/assets/img/bg_clean.png"
					alt="placeholder" />

				<div className="big-buttons">
					{/* Todo: make this interactive */}
					<BigButton
						className="btn-1"
						name="btn_1"
						clickEvent={this.buttonClickEventHandler.bind(this)}
					/>
					<BigButton
						className="btn-2"
						name="btn_2"
						clickEvent={this.buttonClickEventHandler.bind(this)}
					/>
					<BigButton
						className="btn-3"
						name="btn_3"
						clickEvent={this.buttonClickEventHandler.bind(this)}
					/>

					{/* <img
						className="btn-1"
						src="/assets/img/btn_big.png"
						alt="1" />
					<img
						className="btn-2"
						src="/assets/img/btn_big.png"
						alt="2" />
					<img
						className="btn-3"
						src="/assets/img/btn_big.png"
						alt="3" /> */}
				</div>

				<div className="small-buttons">
					{
						["lore", "sounds", "reset"].map(item =>
							<SmallButton
								key={`BS_${item}`}
								className=""
								name={`btn_${item}`}
								clickEvent={this.buttonClickEventHandler.bind(this)}
							/>
						)
					}
					{/* <img
						src="/assets/img/btn_small.png"
						alt="lore" />
					<img
						src="/assets/img/btn_small.png"
						alt="sounds" />
					<img
						src="/assets/img/btn_small.png"
						alt="reset" /> */}
				</div>

				<div className="screen">
					<div className="left-panel">

					</div>

					<div className="right-panel">
						{this.scoreFragment()}
						<br />
						{this.bestScoreFragment()}
						<br />
						{this.livesFragment()}
						<br />
						<div className="sounds">
							<img
								src="/assets/img/sounds.png"
								alt="sounds" />
							<div className="normal-font">
								SOUNDS
							</div>
						</div>
						<br />
						<div className="game-over normal-font">
							GAME<br />OVER!
						</div>
					</div>
				</div>

			</div>
		);

		/**
		 * Original return:
		 * 		{this.livesFragment()}
				{this.scoreFragment()}
				{this.guideFragment()}
				{this.mapFragment()}
				{this.guideFragment()}
				{this.heroFragment()}

				<div className="hit-counter">
					{
						consecutiveHits > 3
							? consecutiveHits + " hits!"
							: "\u00a0"
					}
				</div>

				{this.symbolListFragment()}
				{this.aboutAppFragment()}

		 */
	}
}
