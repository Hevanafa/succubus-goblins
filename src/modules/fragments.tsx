import React from "react";
import App from "../App";

function livesFragment(this: App) {
	return (
		<div className="lives">
			<span className="heart">♥ </span>
			<span>{this.state.lives}</span>
		</div>
	);
}

function scoreFragment(this: App) {
	return (
		<div className="score">
			Score: {this.state.score}
			{this.bestScoreFragment()}
		</div>
	);
}

function mapFragment(this: App) {
	const {
		deadBodyAry,
		floorBlood,
		soilAry
	} = this.state;

	const goblinLetter = "gN☻"[this.racistMode],
		goblinClass = ["goblin", "n", "woman"][this.racistMode];

	return (
		<div className="terrain">
			{
				this.goblinMap.map((row, rowIdx) => {
					const [
						isSecondLastIdx,
						isLastIdx
					] = [
							rowIdx === this.goblinMap.length - 2,
							rowIdx === this.goblinMap.length - 1
						];

					return (
						<div
							key={`gm_${rowIdx}`}
							className="row">
							{
								isLastIdx && deadBodyAry[0]
									? <span
										className={`dead ${goblinClass}`}>
											{goblinLetter}
										</span>
									: "\u00a0"
							}
							{
								row.map((cell, cellIdx) => {
									const spanKey = `gm_${rowIdx}_${cellIdx}`;

									const hitCell = isLastIdx && cellIdx === this.state.lastHitPos
										? (
											<span
												key={spanKey}
												className="hit">
												X
											</span>
										) : null;

									const isBloody = (isSecondLastIdx || isLastIdx)
										&& floorBlood[cellIdx];

									return (
										cell
											?
											// Goblin
											<div
												key={spanKey}
												className={
													(isBloody ? "bloody " : "") +
													`${goblinClass} cell`
												}>
												{goblinLetter}
												{hitCell}
											</div> :
											// Soil
											<div
												key={spanKey}
												className={
													(isBloody ? "bloody " : "") +
													"soil cell"
												}>
												{soilAry[rowIdx][cellIdx]}
												{hitCell}
											</div>
									);
								}) // "\u00a0"
							}
							{
								isLastIdx && deadBodyAry[1]
									? <span
										className={`dead ${goblinClass}`}>
											{goblinLetter}
										</span>
									: "\u00a0"
							}
						</div>
					);
				})
			}
		</div>
	);
}

function bestScoreFragment(this: App) {
	const {
		bestScore,
		isNewBestScore
	} = this.state;

	return <>
		<br />
		Best: {bestScore} {isNewBestScore ? "NEW BEST!" : null}
	</>;
}

function guideFragment(this: App) {
	return <div className="guide">
		{
			this.state.consecutiveHits <= 10
				? this.keyGuide
				: ".".repeat(this.keyGuide.length)
		}
	</div>;
}

function heroFragment(this: App) {
	const { playerPos } = this.state;

	const leftMargin = playerPos > 0
		? "\u00a0".repeat(playerPos)
		: "",
		rightMargin = playerPos < this.terrainCols
			? "\u00a0".repeat(this.terrainCols - playerPos)
			: "";

	// {playerPos}
	// <br />

	return (
		<div className="hero">
			{leftMargin}
			<span>@</span>
			<span className="bonker">!</span>
			{rightMargin}
		</div>
	);
}

function symbolListFragment(this: App) {
	return (
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
				<span className="succubus">@</span>
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
	);
}

const lastUpdateDate = new Date(2021, 6, 16);

function aboutAppFragment(this: App) {
	const lastUpdateStr = Intl.DateTimeFormat("en-GB", {
		year: "numeric",
		month: "short",
		day: "numeric"
	}).format(lastUpdateDate);

	return (
		<div className="about-app">
			Made with <span className="heart">♥</span> by Hevanafa<br />
			Last update: {lastUpdateStr}
		</div>
	);
}

export {
	aboutAppFragment,
	bestScoreFragment,
	guideFragment,
	heroFragment,
	livesFragment,
	mapFragment,
	scoreFragment,
	symbolListFragment
};
