/**
 * Keep and control current game state
 */
class GameModel {

	#correctAnswers = 0;
	#wrongAnswers = 0;
	#currentLevel = 1;
	#totalLevels = 5;
	#diffCount = 0;

	onRequestLoadLevel;
	changeCorrectAnswers;
	changeWrongAnswers;
	changeGameState;

	init() {
		this.onRequestLoadLevel(this.#currentLevel);
	}

	correctAnswer() {
		this.#correctAnswers++;
		this.updateCorrectAnswers();
		if (this.#correctAnswers === this.#diffCount)
			setTimeout(this.levelCompleteHandler.bind(this), 500);
	}

	updateCorrectAnswers() {
		this.changeCorrectAnswers(this.#correctAnswers, this.#diffCount);
	}

	wrongAnswer() {
		this.#wrongAnswers++;
		this.updateWrongAnswer();
	}

	updateWrongAnswer() {
		this.changeWrongAnswers(this.#wrongAnswers);
	}

	levelCompleteHandler() {
		this.#correctAnswers = 0;
		this.#wrongAnswers = 0;
		if (this.#currentLevel === this.#totalLevels) {
			this.changeGameState(GameState.GameComplete);
		} else {
			this.changeGameState(GameState.LevelComplete);
		}
	}

	next() {
		this.changeGameState(GameState.Loading);
		this.onRequestLoadLevel(++this.#currentLevel);
	}

	loaded(diffCount) {
		this.#diffCount = diffCount;
		this.#correctAnswers = 0;
		this.#wrongAnswers = 0;
		this.updateCorrectAnswers();
		this.updateWrongAnswer();
		this.changeGameState(this.#currentLevel);
	}

}