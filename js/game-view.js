/**
 * Game visual and interactive
 */
class GameView extends PIXI.Container {

	static fontFamily = 'FilmotypeMajor';

	layerA = new PIXI.Container();
	layerB = new PIXI.Container();
	onWrong;
	onNext;
	#title;
	#button;
	#buttonBackground;
	#buttonText;
	#correct;
	#correctValue;
	#wrong;
	#wrongValue;
	#gameWidth;
	#gameHeight;
	#hor = true;

	constructor(gameWidth, gameHeight) {
		super();
		this.#gameWidth = gameWidth;
		this.#gameHeight = gameHeight;
		const style = new PIXI.TextStyle({
			fontFamily: GameView.fontFamily,
			fill: '#ffffff',
			fontSize: 140,
			align: 'center'
		});
		this.#title = new PIXI.Text('', style);
		this.addChild(this.#title);
		this.addChild(this.layerA);
		this.addChild(this.layerB);

		const buttonStyle = new PIXI.TextStyle({
			fontFamily: GameView.fontFamily,
			fill: '#ffffff',
			fontSize: 140,
			align: 'center',
			backgroundColor: 0x884455
		});
		this.#button = new PIXI.Container();
		this.#button.eventMode = 'static';
		this.#button.cursor = 'pointer';
		this.#buttonText = new PIXI.Text('Продолжить', buttonStyle);
		this.#buttonText.x = 50;
		this.#buttonText.y = 20;
		this.#buttonBackground = new PIXI.Graphics().beginFill(0xB4D862).drawRoundedRect(
			0, 0, this.#buttonText.x * 2 + this.#buttonText.width, this.#buttonText.y * 3 + this.#buttonText.height, 100
		);
		this.#buttonBackground.tint = 0x888888;
		this.#button.addChild(this.#buttonBackground);
		this.#button.addChild(this.#buttonText);
		this.addChild(this.#button);
		this.buttonOut();
		this.#button.on('mouseover', this.buttonOver.bind(this));
		this.#button.on('mouseout', this.buttonOut.bind(this));
		this.#button.on('pointerdown', this.buttonClick.bind(this));
		this.#button.x = (this.#gameWidth - this.#button.width) / 2;

		const smallStyle = new PIXI.TextStyle({
			fontFamily: GameView.fontFamily,
			fill: '#ffffff',
			fontSize: 80
		});

		this.#correct = new PIXI.Text('Отличий найдено:', smallStyle);
		this.addChild(this.#correct);

		const correctStyle = new PIXI.TextStyle({
			fontFamily: GameView.fontFamily,
			fill: '#B4D862',
			fontSize: 80
		});
		this.#correctValue = new PIXI.Text('-', correctStyle);
		this.addChild(this.#correctValue);

		this.#wrong = new PIXI.Text('Ошибок:', smallStyle);
		this.addChild(this.#wrong);

		const wrongStyle = new PIXI.TextStyle({
			fontFamily: GameView.fontFamily,
			fill: '#CA5F5B',
			fontSize: 80
		});
		this.#wrongValue = new PIXI.Text('-', wrongStyle);
		this.addChild(this.#wrongValue);
		this.loadState();
	}

	buttonOver() {
		this.#buttonBackground.tint = 0xFFFFFF;
	}

	buttonOut() {
		this.#buttonBackground.tint = 0x888888;
	}

	buttonClick() {
		this.onNext();
	}

	loadState() {
		this.setState('Загрузка...');
	}

	levelCompleteState() {
		this.setState('Уровень пройден!');
	}

	gameCompleteState() {
		this.setState('Все уровни\nпройдены!');
	}

	setGameState(state) {
		switch (state) {
			case GameState.Loading:
				this.loadState();
				break;
			case GameState.LevelComplete:
				this.levelCompleteState();
				this.#button.visible = true;
				break;
			case GameState.GameComplete:
				this.gameCompleteState();
				break;
			default: // Game process
				this.show(state);
				break;
		}
	}

	setState(text) {
		this.#button.visible = false;
		this.#title.text = text;
		this.layerA.visible = false;
		this.layerA.removeChildren();
		this.layerB.visible = false;
		this.layerB.removeChildren();
		this.#correct.visible = false;
		this.#correctValue.visible = false;
		this.#wrong.visible = false;
		this.#wrongValue.visible = false;
		this.invalidate();
	}

	show(level) {
		this.#title.text = `Уровень ${level}`;
		this.layerA.visible = true;
		this.layerB.visible = true;
		this.#correct.visible = true;
		this.#correctValue.visible = true;
		this.#wrong.visible = true;
		this.#wrongValue.visible = true;
		this.invalidate();
	}

	setAfter(prev, next, space) {
		next.y = prev.y + prev.height + space;
	}

	setCorrect(current, total) {
		this.#correctValue.text = `${current}/${total}`;
		this.invalidate();
	}

	setWrong(count) {
		this.#wrongValue.text = count;
		this.invalidate();
	}

	invalidate() {
		this.#title.x = (this.#gameWidth - this.#title.width) / 2;
		this.setAfter(this.#title, this.#button, 150);
		this.setAfter(this.#title, this.layerA, 50);
		if (this.#hor)
			this.setAfter(this.layerA, this.layerB, 20);
		else
			this.layerB.y = this.layerA.y;

		this.setAfter(this.layerB, this.#correct, 50);
		this.#correctValue.y = this.#correct.y;
		this.#correctValue.x = this.#gameWidth - this.#correctValue.width - 50;
		this.#correct.x = this.#correctValue.x - this.#correct.width - 20;

		this.setAfter(this.#correct, this.#wrong, 20);
		this.#wrongValue.y = this.#wrong.y;
		this.#wrongValue.x = this.#gameWidth - this.#wrongValue.width - 50;
		this.#wrong.x = this.#wrongValue.x - this.#wrong.width - 20;

		this.y = (this.#gameHeight - this.height) / 3; // 33%
	}

	setLayerImage(layer, img, first) {
		const sprite = new PIXI.Sprite(img);
		this.#hor = sprite.width > sprite.height;
		sprite.eventMode = 'static';
		sprite.on('pointerdown', event => {
			const graphics = new PIXI.Graphics()
				.lineStyle(15, 0xCA5F5B)
				.moveTo(-20, -20).lineTo(20, 20)
				.moveTo(-20, 20).lineTo(20, -20);
			graphics.position = sprite.toLocal(event.screen);
			layer.addChild(graphics);
			this.onWrong();
		});
		layer.addChildAt(sprite, 0);
		if (this.#hor) {
			layer.x = (this.#gameWidth - sprite.width) / 2;
		} else {
			layer.x = first ?
				(this.#gameWidth - sprite.width * 2) / 3 :
				(this.#gameWidth - sprite.width * 2) / 3 * 2 + sprite.width;
		}
		const mask = new PIXI.Graphics();
		mask.beginFill(0);
		mask.drawRoundedRect(0, 0, sprite.width, sprite.height, 30);
		layer.addChild(mask);
		layer.mask = mask;
	}

	setLayersImage(img) {
		this.setLayerImage(this.layerA, img, true);
		this.setLayerImage(this.layerB, img, false);
	}

	static preload() {
		return document.fonts.load(`16px ${GameView.fontFamily}`);
	}

}