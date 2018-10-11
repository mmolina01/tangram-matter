import Preloader from './Preloader.js';
import VerticesTest from './VerticesTest.js';

var config = {
	type: Phaser.CANVAS,
	width: 1000,
	height: 600,
	physics: {
		default: 'matter',
		matter: {
			debug: true,
			gravity: {
				y: 0
			}
		}
	},
	backgroundColor: '#000',
	scene: [Preloader, VerticesTest]//PolygonsTest
};

var game = new Phaser.Game(config);

export default game;
