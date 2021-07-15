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
											?
											// Goblin
											<span
												key={`gm_${rowIdx}_${cellIdx}`}
												className={
													(isBloody ? "bloody " : "") +
													"goblin"
												}>
												g
											</span> :
											// Soil
											<span
												key={`gm_${rowIdx}_${cellIdx}`}
												className={
													(isBloody ? "bloody " : "") +
													"soil"
												}>
												{soilAry[rowIdx][cellIdx]}
											</span>
									);
								}) // "\u00a0"
							}
							{
								isLastIdx && deadBodyAry[1]
									? <span className="dead goblin">g</span>
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
	return <>
		<br />
		Best: {this.state.bestScore}
	</>;
}

function guideFragment(this: App) {
	return <div className="guide">
		{
			this.state.score <= 100
				? "123"
				: "..."
		}
	</div>;
}

function heroFragment(this: App) {
	const { playerPos } = this.state;

	const leftMargin = playerPos > 0
		? "\u00a0".repeat(playerPos)
		: "",
		rightMargin = playerPos < 3
			? "\u00a0".repeat(3 - playerPos)
			: "";

	// {playerPos}
	// <br />

	return (
		<div className="hero">
			{leftMargin}
			<span>s</span>
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
	);
}

function aboutAppFragment(this: App) {
	return (
		<div className="about-app">
			Made with <span className="heart">♥</span> by Hevanafa<br />
			Last update: 14 July 2021
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
