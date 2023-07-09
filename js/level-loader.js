/**
 * Load and parse level data. Load images.
 */
class LevelLoader {

	onMainImageLoad;
	onLayerALoad;
	onLayerBLoad;
	onLoadComplete;

	#level;
	#tasks;
	#diffCount;

	loadLevel(level) {
		this.#tasks = 1;
		this.#level = `https://hgstudio.ru/jstesttask/levels/${level}/`;
		PIXI.Assets.load(`${this.#level}level.json`).then(this.parseJson.bind(this));
	}

	taskComplete() {
		if (--this.#tasks == 0) this.onLoadComplete(this.#diffCount);
	}

	parseJson(json) {
		this.#diffCount = json.slots.length - 1;
		for (const slot of json.slots) {
			switch (slot.layer) {
				case 'LayerA':
					this.#tasks++;
					this.loadImage(slot.name).then(this.layerALoadHandler.bind(this, slot.x, slot.y));
					break;
				case 'LayerB':
					this.#tasks++;
					this.loadImage(slot.name).then(this.layerBLoadHandler.bind(this, slot.x, slot.y));
					break;
				case 'standart':
					this.#tasks++;
					this.loadImage(slot.name).then(this.mainImageLoadHandler.bind(this));
					break;
				default:
					break;
			}
		}
		this.taskComplete();
	}

	layerALoadHandler(x, y, img) {
		this.onLayerALoad(x, y, img);
		this.taskComplete();
	}

	layerBLoadHandler(x, y, img) {
		this.onLayerBLoad(x, y, img);
		this.taskComplete();
	}

	mainImageLoadHandler(img) {
		this.onMainImageLoad(img);
		this.taskComplete();
	}

	loadImage(name) {
		return PIXI.Assets.load(`${this.#level}images/${name}.jpg`);
	}

}