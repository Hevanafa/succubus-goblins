import App from "../App";

const LSSaveDataKey = "SaveData";

interface ISaveDataFormat {
	bestScore: number;
	playCount: number;
}

function attemptLoadScore(this: App) {
	let data = localStorage.getItem(LSSaveDataKey) as (string | null);

	if (data) {
		const savedData = JSON.parse(data) as ISaveDataFormat;
		const {bestScore, playCount} = savedData;

		this.setState({
			bestScore,
			playCount
		});
	}
}

function saveBestScore(this: App) {
	const {
		bestScore,
		playCount,
		score
	} = this.state;

	const saveData = JSON.stringify(
		score > bestScore
			? { bestScore: score, playCount }
			: { bestScore, playCount }
	);

	localStorage.setItem(LSSaveDataKey, saveData);

	if (score > bestScore)
		this.setState({
			bestScore: score
		});
}

export {
	attemptLoadScore,
	saveBestScore
}