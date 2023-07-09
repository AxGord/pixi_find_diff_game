/**
 * Main game class. Connects the parts of the system together.
 */
class GameController {

	#gameWidth = 1260;
	#gameHeight = 2240;
	#model = new GameModel();
	#levelLoader = new LevelLoader();
	#view = new GameView(this.#gameWidth, this.#gameHeight);

	constructor() {
		new Application(this.#gameWidth, this.#gameHeight).stage.addChild(this.#view);
		this.#view.onWrong = this.#model.wrongAnswer.bind(this.#model);
		this.#view.onNext = this.#model.next.bind(this.#model);

		this.#model.onRequestLoadLevel = this.#levelLoader.loadLevel.bind(this.#levelLoader);
		this.#model.changeGameState = this.#view.setGameState.bind(this.#view);
		this.#model.changeCorrectAnswers = this.#view.setCorrect.bind(this.#view);
		this.#model.changeWrongAnswers = this.#view.setWrong.bind(this.#view);

		this.#levelLoader.onMainImageLoad = this.#view.setLayersImage.bind(this.#view);
		this.#levelLoader.onLayerALoad = this.layerALoadHandler.bind(this);
		this.#levelLoader.onLayerBLoad = this.layerBLoadHandler.bind(this);
		this.#levelLoader.onLoadComplete = this.#model.loaded.bind(this.#model);

		this.#model.init();
	}

	layerALoadHandler(x, y, img) {
		new DiffView(this.#view.layerA, this.#view.layerB, x, y, img).onSelect = this.#model.correctAnswer.bind(this.#model);
	}

	layerBLoadHandler(x, y, img) {
		new DiffView(this.#view.layerB, this.#view.layerA, x, y, img).onSelect = this.#model.correctAnswer.bind(this.#model);
	}

}

window.addEventListener('load', () => {
	GameView.preload().then(() => new GameController());
});
