/**
 * PixiJS application with resize helper
 */
class Application extends PIXI.Application {

	#width;
	#height;

	constructor(width, height, backgroundColor = 0x0E1016) {
		super({
			width: width,
			height: height,
			resolution: 2,
			antialias: true,
			backgroundColor: backgroundColor
		});
		this.#width = width;
		this.#height = height;
		this.renderer.view.id = 'pixi-canvas';
		document.body.appendChild(this.view);
		window.addEventListener('resize', this.resizeHandler.bind(this), false);
		this.resizeHandler();
	}

	resizeHandler() {
		const scaleFactor = Math.min(window.innerWidth / this.#width, window.innerHeight / this.#height);
		const newWidth = Math.ceil(this.#width * scaleFactor);
		const newHeight = Math.ceil(this.#height * scaleFactor);
		this.renderer.view.style.width = `${newWidth}px`;
		this.renderer.view.style.height = `${newHeight}px`;
		this.renderer.resize(newWidth, newHeight);
		this.stage.scale.set(scaleFactor);
	}

}