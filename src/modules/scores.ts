import App from "../App";

const LSScoreKey = "best_score";

function attemptLoadScore(this: App) {
	let bestScore = localStorage.getItem(LSScoreKey);

	if (bestScore)
		this.setState({
			bestScore: Number(bestScore)
		});
}

function saveBestScore(this: App) {
	const { score, bestScore } = this.state;

	if (score > bestScore) {
		localStorage.setItem(LSScoreKey, score + "");

		this.setState({
			bestScore: score
		});
	}
}

export {
	attemptLoadScore,
	saveBestScore
}