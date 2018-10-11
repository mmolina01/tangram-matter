let global = {
	diamond: [],
	bigTriangle: [],
	mediumTriangle: [],
	smallTriangle: [],
	parallelogram: []
};

let globalBg = {
	diamond: [],
	bigTriangle: [],
	mediumTriangle: [],
	smallTriangle: [],
	parallelogram: []
};

window.global=global;
window.globalBg=globalBg;

import Shape from './Shape.js';
import shapeManager from './randomForms.js';

class VerticesTest extends Phaser.Scene {

	constructor() {
		super({
			key: 'VerticesTest'
		});
	}

	preload() {}

	update(delta) {
		//this.bigTriangle1.update();
		if (this.m_gShapes) {
			for (let i = 0; i < this.m_gShapes.children.entries.length; i++) {
				this.m_gShapes.children.entries[i].update();
			}
		}

		if (this.m_bIsLevelEditor) {
			if (this.m_gBgShapes) {
				for (let i = 0; i < this.m_gBgShapes.children.entries.length; i++) {
					this.m_gBgShapes.children.entries[i].update();
				}
			}
		}
	}

	create() {

		this.initVariables();

		this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {

			for (let i = 0; i < event.pairs.length; i++) {

				event.pairs[i].bodyA.parent.gameObject.newCollisionStart(event.pairs[i].bodyB.parent.gameObject);
				event.pairs[i].bodyB.parent.gameObject.newCollisionStart(event.pairs[i].bodyA.parent.gameObject);
			}
		});

		/*this.matter.world.on('collisionactive', function (event, bodyA, bodyB) {
			//console.log(event);
		});*/

		this.matter.world.on('collisionend', function (event, bodyA, bodyB) {

			for (let i = 0; i < event.pairs.length; i++) {

				event.pairs[i].bodyA.parent.gameObject.newCollisionEnd(event.pairs[i].bodyB.parent.gameObject);
				event.pairs[i].bodyB.parent.gameObject.newCollisionEnd(event.pairs[i].bodyA.parent.gameObject);
			}
		});
	}

	initVariables() {

		this.m_gBgShapes = this.add.group();
		this.m_gShapes = this.add.group();

		this.m_gBgShapes.x = 0;
		this.m_gBgShapes.y = 0;
		this.m_gShapes.x = 0;
		this.m_gShapes.y = 0;

		let cat1 = this.matter.world.nextCategory(); // front piece vertice
		let cat2 = this.matter.world.nextCategory(); // front piece body
		let cat3 = this.matter.world.nextCategory(); // bg piece vertice
		let cat4 = this.matter.world.nextCategory(); // bg piece body
		let cat5 = this.matter.world.nextCategory(); // centers

		this.m_aCollisionGroups = [cat1, cat2, cat3, cat4, cat5];

		let shapes = this.cache.json.get('shapes');

		this.m_oValidators = {
			pieceDragged: false
		};

		this.setControls();

		this.m_bIsLevelEditor = false;
		this.m_bSnapPieces = true;

		this.m_bForceSameShape = false;

		this.m_bSnapPieces;

		this.createBgShapes(this.m_gBgShapes, [cat1, cat2, cat3, cat4], shapes);

		if (!this.m_bIsLevelEditor)
			this.createShapes(this.m_gShapes, [cat1, cat2, cat3, cat4, cat5], shapes);
		else {
			this.setEditorBtns();
		}
	}

	setControls() {

		this.input.keyboard.on('keyup', function (event) {

			if (this.m_goSelectedPiece) {
				switch (event.keyCode) {
					case 81: //q
						this.m_goSelectedPiece.rotateLeft();
						break;
					case 87: //w
						this.m_goSelectedPiece.moveUp();
						break;
					case 69: //e
						this.m_goSelectedPiece.rotateRight();
						break;
					case 65: //a
						this.m_goSelectedPiece.moveLeft();
						break;
					case 83: //s
						this.m_goSelectedPiece.moveDown();
						break;
					case 68: //d
						this.m_goSelectedPiece.moveRight();
						break;
				}
			}

			switch (event.keyCode) {
				case 67: //c
					this.createLevelMapFromBg();
					break;
				case 86: //v
					this.validateTangram();
					break;
			}
		}, this);

	}

	createShapes(group, colCats, shapes) {

		let shapeConf = {
			scene: this,
			key: 'polygons',
			world: this.matter.world,
			verticeBody: shapes.vertice,
			collisionCats: colCats,
			isBg: false,
			centerBody: shapes.shapeCenter
		};

		if (level.pieces.bigTriangles) {
			for (let j = 0; j < level.pieces.bigTriangles.length; j++) {
				shapeConf.x = level.pieces.bigTriangles[j].x;
				shapeConf.y = level.pieces.bigTriangles[j].y;
				shapeConf.rotation = level.pieces.bigTriangles[j].rotation;
				shapeConf.frame = 'bigTriangle_edit.png';
				shapeConf.body = shapes.bigTriangle_edit;

				let p = new Shape(shapeConf);
				group.add(p);
				global.bigTriangle.push(p);
				this.setDraggableShape(p);
				this.setMoveablePieceInput(p);
			}
		}

		if (level.pieces.mediumTriangle) {
			for (let j = 0; j < level.pieces.mediumTriangle.length; j++) {
				shapeConf.x = level.pieces.mediumTriangle[j].x;
				shapeConf.y = level.pieces.mediumTriangle[j].y;
				shapeConf.rotation = level.pieces.mediumTriangle[j].rotation;
				shapeConf.frame = 'mediumTriangle_edit.png';
				shapeConf.body = shapes.mediumTriangle_edit;

				let p = new Shape(shapeConf);
				group.add(p);
				global.mediumTriangle.push(p);
				this.setDraggableShape(p);
				this.setMoveablePieceInput(p);
			}
		}

		if (level.pieces.smallTriangles) {
			for (let j = 0; j < level.pieces.smallTriangles.length; j++) {
				shapeConf.x = level.pieces.smallTriangles[j].x;
				shapeConf.y = level.pieces.smallTriangles[j].y;
				shapeConf.rotation = level.pieces.smallTriangles[j].rotation;
				shapeConf.frame = 'smallTriangle_edit.png';
				shapeConf.body = shapes.smallTriangle_edit;

				let p = new Shape(shapeConf);
				group.add(p);
				global.smallTriangle.push(p);
				this.setDraggableShape(p);
				this.setMoveablePieceInput(p);
			}
		}

		if (level.bg.diamond) {
			for (let j = 0; j < level.pieces.diamond.length; j++) {
				shapeConf.x = level.pieces.diamond[j].x;
				shapeConf.y = level.pieces.diamond[j].y;
				shapeConf.rotation = level.pieces.diamond[j].rotation;
				shapeConf.frame = 'diamond_edit.png';
				shapeConf.body = shapes.diamond_edit;

				let p = new Shape(shapeConf);
				group.add(p);
				global.diamond.push(p);
				this.setDraggableShape(p);
				this.setMoveablePieceInput(p);
			}
		}

		if (level.pieces.parallelogram) {
			for (let j = 0; j < level.pieces.parallelogram.length; j++) {
				shapeConf.x = level.pieces.parallelogram[j].x;
				shapeConf.y = level.pieces.parallelogram[j].y;
				shapeConf.rotation = level.pieces.parallelogram[j].rotation;
				shapeConf.frame = 'parallelogram_edit.png';
				shapeConf.body = shapes.parallelogram_edit;

				let p = new Shape(shapeConf);
				group.add(p);
				global.parallelogram.push(p);
				this.setDraggableShape(p);
				this.setMoveablePieceInput(p);
			}
		}
	}

	createBgShapes(group, colCats, shapes) {
		//,x:200,y:200,frame:'bigTriangle.png',body:shapes.bigTriangle
		let shapeConf = {
			scene: this,
			key: 'polygons',
			world: this.matter.world,
			verticeBody: shapes.vertice,
			collisionCats: colCats,
			isBg: true
		};

		if (level.bg.bigTriangles) {
			for (let j = 0; j < level.bg.bigTriangles.length; j++) {
				shapeConf.x = level.bg.bigTriangles[j].x;
				shapeConf.y = level.bg.bigTriangles[j].y;
				shapeConf.rotation = level.bg.bigTriangles[j].rotation
				shapeConf.frame = 'bigTriangleBG_edit.png';
				shapeConf.body = shapes.bigTriangle_edit;

				let bgP = new Shape(shapeConf);
				group.add(bgP);
				globalBg.bigTriangle.push(bgP);

				if (this.m_bIsLevelEditor) {
					this.setDraggableShape(bgP);
					this.setMoveablePieceInput(bgP);
				}
			}
		}

		if (level.bg.mediumTriangle) {
			for (let j = 0; j < level.bg.mediumTriangle.length; j++) {
				shapeConf.x = level.bg.mediumTriangle[j].x;
				shapeConf.y = level.bg.mediumTriangle[j].y;
				shapeConf.rotation = level.bg.mediumTriangle[j].rotation
				shapeConf.frame = 'mediumTriangleBG_edit.png';
				shapeConf.body = shapes.mediumTriangle_edit;

				let bgP = new Shape(shapeConf);
				group.add(bgP);
				globalBg.mediumTriangle.push(bgP);

				if (this.m_bIsLevelEditor) {
					this.setDraggableShape(bgP);
					this.setMoveablePieceInput(bgP);
				}
			}
		}

		if (level.bg.smallTriangles) {
			for (let j = 0; j < level.bg.smallTriangles.length; j++) {
				shapeConf.x = level.bg.smallTriangles[j].x;
				shapeConf.y = level.bg.smallTriangles[j].y;
				shapeConf.rotation = level.bg.smallTriangles[j].rotation
				shapeConf.frame = 'smallTriangleBG_edit.png';
				shapeConf.body = shapes.smallTriangle_edit;

				let bgP = new Shape(shapeConf);
				group.add(bgP);
				globalBg.smallTriangle.push(bgP);

				if (this.m_bIsLevelEditor) {
					this.setDraggableShape(bgP);
					this.setMoveablePieceInput(bgP);
				}
			}
		}

		if (level.bg.diamond) {
			for (let j = 0; j < level.bg.diamond.length; j++) {
				shapeConf.x = level.bg.diamond[j].x;
				shapeConf.y = level.bg.diamond[j].y;
				shapeConf.rotation = level.bg.diamond[j].rotation
				shapeConf.frame = 'diamondBG_edit.png';
				shapeConf.body = shapes.diamond_edit;

				let bgP = new Shape(shapeConf);
				group.add(bgP);
				globalBg.diamond.push(bgP);

				if (this.m_bIsLevelEditor) {
					this.setDraggableShape(bgP);
					this.setMoveablePieceInput(bgP);
				}
			}
		}

		if (level.bg.parallelogram) {
			for (let j = 0; j < level.bg.parallelogram.length; j++) {
				shapeConf.x = level.bg.parallelogram[j].x;
				shapeConf.y = level.bg.parallelogram[j].y;
				shapeConf.rotation = level.bg.parallelogram[j].rotation
				shapeConf.frame = 'parallelogramBG_edit.png';
				shapeConf.body = shapes.parallelogram_edit;

				let bgP = new Shape(shapeConf);
				group.add(bgP);
				globalBg.parallelogram.push(bgP);

				if (this.m_bIsLevelEditor) {
					this.setDraggableShape(bgP);
					this.setMoveablePieceInput(bgP);
				}
			}
		}
	}

	setDraggableShape(shape) {
		this.input.setDraggable(shape, true);
		shape.on('drag', function () {
			if (shape == this.m_goSelectedPiece) {
				this.m_oValidators.pieceDragged = true;
				shape.x = this.input.x;
				shape.y = this.input.y;
			}
		}, this);
	}

	setMoveablePieceInput(piece) {

		piece.on('pointerdown', function () {

			if (piece != this.m_goSelectedPiece) {
				this.m_oValidators.justSelected = true;
				if (this.m_goSelectedPiece != null)
					this.m_goSelectedPiece.unselect();

				this.m_goSelectedPiece = piece;
				this.m_goSelectedPiece.selected();
			}
		}, this);

		piece.on('pointerup', function () {

			if (this.m_goSelectedPiece == piece && !this.m_oValidators.pieceDragged && !this.m_oValidators.justSelected) {
				this.m_goSelectedPiece.unselect();
				this.m_goSelectedPiece = null;
			} else if (this.m_oValidators.pieceDragged) {
				this.m_goSelectedPiece.tryToSnap();
			}

			this.m_oValidators.justSelected = false;
			this.m_oValidators.pieceDragged = false;
		}, this);
	}

	createLevelMapFromBg() {

		let map = {
			bigTriangles: [],
			mediumTriangle: [],
			smallTriangles: [],
			diamond: [],
			parallelogram: []
		};

		for (let i = 0; i < this.m_gBgShapes.children.entries.length; i++) {

			var shapeObj = {
				x: this.m_gBgShapes.children.entries[i].x,
				y: this.m_gBgShapes.children.entries[i].y,
				rotation: this.m_gBgShapes.children.entries[i].rotation
			};

			if (this.m_gBgShapes.children.entries[i].frameName == 'bigTriangle')
				map.bigTriangles.push(shapeObj);
			else if (this.m_gBgShapes.children.entries[i].frameName == 'mediumTriangle')
				map.mediumTriangle.push(shapeObj);
			else if (this.m_gBgShapes.children.entries[i].frameName == 'smallTriangle')
				map.smallTriangles.push(shapeObj);
			else if (this.m_gBgShapes.children.entries[i].frameName == 'diamond')
				map.diamond.push(shapeObj);
			else if (this.m_gBgShapes.children.entries[i].frameName == 'parallelogram')
				map.parallelogram.push(shapeObj);
		}

		let s = JSON.stringify(map);
		let r = s.replace(/"/g, '');
		console.log(r);
		return map;
	}

	getBodyCollisionGroup() {
		return this.m_aCollisionGroups[0];
	}
	getVerticeCollisionGroup() {
		return this.m_aCollisionGroups[1];
	}
	getBgBodyCollisionGroup() {
		return this.m_aCollisionGroups[2];
	}
	getBgVerticeCollisionGroup() {
		return this.m_aCollisionGroups[3];
	}
	getCenterCollisionGroup() {
		return this.m_aCollisionGroups[4];
	}

	closestVerticeTo(vertice, shape) {
		var closest = {
			distance: null,
			vertice: null
		};

		if (!this.m_bSnapPieces)
			return closest;

		for (let i = 0; i < this.m_gBgShapes.children.entries.length; i++) {

			if (this.m_gBgShapes.children.entries[i] != shape) {

				for (let j = 0; j < this.m_gBgShapes.children.entries[i].vertices.length; j++) {

					let distance = Math.hypot(this.m_gBgShapes.children.entries[i].vertices[j].x - vertice.x, this.m_gBgShapes.children.entries[i].vertices[j].y - vertice.y);

					if (this.m_bForceSameShape) {
						if (distance < 20 && (closest.vertice == null || distance < closest.distance || shape.frameName == this.m_gBgShapes.children.entries[i].vertices[j].shapeLabel)) {
							closest.distance = distance;
							closest.vertice = this.m_gBgShapes.children.entries[i].vertices[j];

							if (shape.frameName == this.m_gBgShapes.children.entries[i].vertices[j].shapeLabel)
								break;
						}
					} else {
						if (distance < 20 && (closest.vertice == null || distance < closest.distance)) {
							closest.distance = distance;
							closest.vertice = this.m_gBgShapes.children.entries[i].vertices[j];
						}
					}
				}
			}

		}
		return closest;
	}

	validateTangram() {
		if (this.checkBgShapes() && this.checkShapes() && this.noPieceMounted()) {
			console.log('valid');
		} else {
			console.log('invalid');
		}
	}

	checkBgShapes() {

		let valid = true;
		for (let i = 0; i < this.m_gBgShapes.children.entries.length; i++) {

			//console.log('bg: ' + this.m_gBgShapes.children.entries[i].frameName + ' ' + this.m_gBgShapes.children.entries[i].inPosition());

			if (!this.m_gBgShapes.children.entries[i].inPosition()) {
				this.m_gBgShapes.children.entries[i].error();
				valid = false;
				break;
			}
		}

		return valid;
	}

	checkShapes() {

		let valid = true;
		for (let i = 0; i < this.m_gShapes.children.entries.length; i++) {

			//console.log('moving: ' + this.m_gShapes.children.entries[i].frameName + ' ' + this.m_gShapes.children.entries[i].inPosition());

			if (!this.m_gShapes.children.entries[i].inPosition()) {
				this.m_gShapes.children.entries[i].error();
				valid = false;
				break;
			}
		}

		return valid;
	}

	noPieceMounted() {
		let valid = true;

		for (let i = 0; i < this.m_gShapes.children.entries.length; i++) {

			for (let j = 0; j < this.m_gShapes.children.entries.length; j++) {
				if (this.m_gShapes.children.entries[i] != this.m_gShapes.children.entries[j]) {

					let distance = Math.hypot(this.m_gShapes.children.entries[i].x - this.m_gShapes.children.entries[j].x, this.m_gBgShapes.children.entries[i].y - this.m_gShapes.children.entries[j].y);

					/*if(distance<50){
						console.log(this.m_gShapes.children.entries[i].frameName+' '+this.m_gShapes.children.entries[j].frameName+' '+distance);
						valid=false;
						break;
					}*/
				}
			}
		}

		return valid;
	}

	setEditorBtns() {

	}

	clearVariables() {

		this.m_goSelectedPiece = null;
		this.m_gBgShapes = null;
		this.m_gShapes = null;
		this.m_aCollisionGroups = [];
	}
}

var level = {
	bg: shapeManager.randomShape(),
	pieces: shapeManager.menuShape()

}

export default VerticesTest;
