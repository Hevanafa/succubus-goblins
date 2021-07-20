import React from "react";

import random from "./modules/random";
import { attemptLoadScore, saveBestScore } from "./modules/scores";
import { playSound, loadSoundFiles } from "./modules/sounds";
import { aboutAppFragment, bestScoreFragment, gameOverFragment, guideFragment, heroFragment, livesFragment, mapFragment, scoreFragment, soundsFragment, symbolListFragment } from "./modules/fragments";
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

	// v2 with game UI
	isOver: boolean;
	playSounds: boolean;
	isLoreVisible: boolean;

	buttonPress: boolean[]; // length: 3
	smallButtonPress: Map<string, boolean>;
}

const isDev = () => window.location.href.includes("localhost");

export default class App extends React.Component<{}, IState> {
	readonly goblinAryCap = 50;
	readonly restartMessage = "You ran out of lives!  Press R to restart.";
	readonly terrainCols = 3;
	readonly keyGuide = "123"; // "123" | "DFJK" | "SDF JKL";

	readonly racistMode: number = 0;

	protected loadedSoundFiles: Map<string, HTMLAudioElement> | null = null;

	private smallButtons = ["lore", "sounds", "reset"];

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

			isOver: false,
			playSounds: true, // Todo: save sounds into the save data
			isLoreVisible: false,

			buttonPress: [false, false, false],
			smallButtonPress: this.smallButtons.reduce((prev, newKey) => {
				prev.set(newKey, false);
				return prev;
			}, new Map())
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
		this.bindKeyUpEvent();

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
			const keys = this.keyGuide.toLowerCase(); // "123" or "dfjk";

			if (keys.includes(inputKey)) {
				const { buttonPress } = this.state;
				buttonPress[keys.indexOf(inputKey)] = true;
				this.setState({ buttonPress });

				this.attemptHit(keys.indexOf(inputKey) + 1);
			}

			if (inputKey === "r"
				&& this.checkGameOver())
				this.startNewGame();
		});
	}

	bindKeyUpEvent() {
		window.addEventListener("keyup", (e) => {
			const inputKey = e.key.toLowerCase(),
				keys = this.keyGuide.toLowerCase(); // "123" or "dfjk";

			if (keys.includes(inputKey)) {
				const { buttonPress } = this.state;
				buttonPress[keys.indexOf(inputKey)] = false;
				this.setState({ buttonPress });
			}
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
			isOver: false,

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
	scoreFragment = scoreFragment;
	bestScoreFragment = bestScoreFragment;
	soundsFragment = soundsFragment;
	gameOverFragment = gameOverFragment;
	guideFragment = guideFragment;
	heroFragment = heroFragment;
	livesFragment = livesFragment;
	mapFragment = mapFragment;
	symbolListFragment = symbolListFragment;

	noop() { }

	mouseDownEventHandler(e: React.MouseEvent) {
		const name = e.currentTarget.getAttribute("name");

		console.log("MouseDown", name);

		if (!name || !name.startsWith("btn_"))
			return;

		const buttonName = name.split("_")[1],
			{ smallButtonPress } = this.state;

		if (this.smallButtons.includes(buttonName)) {
			smallButtonPress.set(buttonName, true);
			this.setState({ smallButtonPress });
		}

		switch (buttonName) {
			case "1":
			case "2":
			case "3":
				this.attemptHit(Number(buttonName));

				const { buttonPress } = this.state;
				buttonPress[Number(name.split("_")[1]) - 1] = true;
				this.setState({ buttonPress });
				break;

			// Done: small buttons
			case "lore":
				this.setState({
					isLoreVisible: !this.state.isLoreVisible
				});
				break;

			case "sounds":
				this.setState({
					playSounds: !this.state.playSounds
				});
				break;
			case "reset":
				// Todo: set isOver state
				if (this.state.isOver)
					this.startNewGame();
		}
	}

	mouseUpEventHandler(e: React.MouseEvent) {
		const name = e.currentTarget.getAttribute("name");

		console.log("MouseUp", name);

		if (!name || !name.startsWith("btn_"))
			return;

		const buttonName = name.split("_")[1];

		switch (buttonName) {
			case "1":
			case "2":
			case "3":
				const { buttonPress } = this.state;
				buttonPress[Number(name.split("_")[1]) - 1] = false;
				this.setState({ buttonPress });
				break;

			// Small buttons
			case "lore":
			case "sounds":
			case "reset":
				const { smallButtonPress } = this.state;
				smallButtonPress.set(buttonName, false);
				this.setState({ smallButtonPress });
				break;

		}
	}

	render() {
		const {
			initialised,

			buttonPress,
			smallButtonPress
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
					{/* Done: make this interactive */}
					{
						// Done: make the keyboard input look like the buttons on the screen
						[1, 2, 3].map((num, idx) =>
							<BigButton
								key={`btn_${num}`}
								className={`btn-${num}`}
								name={`btn_${num}`}

								isPressed={buttonPress[idx]}
								mouseDownEventHandler={this.mouseDownEventHandler.bind(this)}
								mouseUpEventHandler={this.mouseUpEventHandler.bind(this)}
							/>
						)
					}
				</div>

				<div className="small-buttons">
					{
						this.smallButtons.map(item =>
							<SmallButton
								key={`BS_${item}`}
								className=""
								name={`btn_${item}`}

								isPressed={smallButtonPress.get(item) || false}
								mouseDownEventHandler={this.mouseDownEventHandler.bind(this)}
								mouseUpEventHandler={this.mouseUpEventHandler.bind(this)}
							/>
						)
					}
				</div>

				<div className="screen">
					<div className="left-panel">
						{this.guideFragment()}
						{this.mapFragment()}
						{this.guideFragment()}
						{this.heroFragment()}
					</div>

					<div className="right-panel">
						{this.scoreFragment()}
						<br />
						{this.bestScoreFragment()}
						<br />
						{this.livesFragment()}
						<br />
						{this.soundsFragment()}
						<br />
						{this.gameOverFragment()}
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
