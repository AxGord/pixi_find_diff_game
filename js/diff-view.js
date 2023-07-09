/**
 * Listen for clicks and show image differences
 */
class DiffView {

	onSelect;

	#sprite;
	#linkedSprite;

	constructor(obj, linked, x, y, img) {
		this.#sprite = new PIXI.Sprite(img);
		this.#sprite.x = x;
		this.#sprite.y = y;
		obj.addChild(this.#sprite);

		this.#linkedSprite = new PIXI.Sprite();
		const sizeObject = new PIXI.Sprite();
		this.#linkedSprite.x = x;
		this.#linkedSprite.y = y;
		sizeObject.width = this.#sprite.width;
		sizeObject.height = this.#sprite.height;
		this.#linkedSprite.addChild(sizeObject);
		linked.addChild(this.#linkedSprite);
		this.#sprite.eventMode = 'static';
		this.#linkedSprite.eventMode = 'static';
		this.addClickListeners();
	}

	addClickListeners() {
		this.#sprite.on('pointerdown', this.clickHandler.bind(this));
		this.#linkedSprite.on('pointerdown', this.clickHandler.bind(this));
	}

	removeClickListeners() {
		this.#sprite.removeAllListeners();
		this.#linkedSprite.removeAllListeners();
	}


	clickHandler() {
		this.#sprite.addChild(this.createMark());
		this.#linkedSprite.addChild(this.createMark());
		this.removeClickListeners();
		this.onSelect();
	}

	createMark() {
		return new PIXI.Graphics()
			.lineStyle(5, 0xB4D862)
			.drawRoundedRect(0, 0, this.#sprite.width, this.#sprite.height, 30);
	}

}