import Vertice from './Vertice.js';
import ShapeCenter from './ShapeCenter.js';

class Shape extends Phaser.Physics.Matter.Sprite {
	constructor(config) {

		super(config.world, config.x, config.y, config.key, config.frame, {
			shape: config.body
		});
		this.scene = config.scene;
		this.world = config.world;
		this.scene.add.existing(this);
		this.frameName = config.body.label;
		this.rotation = config.rotation;
		this.volume = this.setVolume();

		this.m_bCollidingWithVert = false;
		this.m_bCollidingWithShape = false;
		this.m_aCollidesWith = [];
		this.vertices = [];
		this.center=null;
		this.m_bIsColliding = false;
		this.m_iCurrentDegreeAngle = 0;
		this.m_bIsBg = config.isBg;
		this.setInteractive(); //{pixelPerfect: true}

		if (config.isBg) {
			
			this.setCollisionCategory(config.collisionCats[2]);
			this.setCollidesWith([this.scene.getBodyCollisionGroup(), this.scene.getVerticeCollisionGroup()]);
			this.createVertices(config.verticeBody, config.collisionCats[3]);
		} 
		else {
			
			this.setCollisionCategory(config.collisionCats[0]);
			this.setCollidesWith([this.scene.getBgBodyCollisionGroup(),this.scene.getCenterCollisionGroup()]);
			this.createVertices(config.verticeBody, config.collisionCats[1]);
			this.createCenter(config.centerBody);
		}

		this.update();
		//this.createDiamon();
	}

	//+ updates
	update() {

		if (this.frameName == 'bigTriangle' || this.frameName == 'mediumTriangle' || this.frameName == 'smallTriangle')
			this.updateTriangle();
		else if (this.frameName == 'diamond')
			this.updateDiamond();
		else if (this.frameName == 'parallelogram')
			this.updateParallelogram();

		if (this.justSnaped) {
			this.tryToSnap();
		}
	}

	updateTriangle() {
		//128x128 91x91 64x64
		
		//top
		let x = -(this.width * this.originX);
		let y = -(this.height * this.originY);
		let rotX = x * Math.cos(this.rotation) - y * Math.sin(this.rotation);
		let rotY = x * Math.sin(this.rotation) + y * Math.cos(this.rotation);
		this.vertices[0].x = this.x + rotX;
		this.vertices[0].y = this.y + rotY;

		//bottom right
		x = this.width - (this.width * this.originX);
		y = this.height - (this.height * this.originY);
		rotX = x * Math.cos(this.rotation) - y * Math.sin(this.rotation);
		rotY = x * Math.sin(this.rotation) + y * Math.cos(this.rotation);
		this.vertices[1].x = this.x + rotX;
		this.vertices[1].y = this.y + rotY;

		//bottom left
		x = -(this.width * this.originX);
		y = this.height - (this.height * this.originY);
		rotX = x * Math.cos(this.rotation) - y * Math.sin(this.rotation);
		rotY = x * Math.sin(this.rotation) + y * Math.cos(this.rotation);
		this.vertices[2].x = this.x + rotX;
		this.vertices[2].y = this.y + rotY;
		
		//center
		if(this.center){
			x=(this.vertices[0].x+this.vertices[1].x+this.vertices[2].x)/3;
			y=(this.vertices[0].y+this.vertices[1].y+this.vertices[2].y)/3;
			this.center.x=x;
			this.center.y=y;
		}
	}

	updateDiamond() {
		//64x64
		let x = -this.width * this.originX;
		let y = -this.height * this.originY;
		let rotX = x * Math.cos(this.rotation) - y * Math.sin(this.rotation);
		let rotY = x * Math.sin(this.rotation) + y * Math.cos(this.rotation);
		this.vertices[0].x = this.x + rotX;
		this.vertices[0].y = this.y + rotY;

		x = this.width - (this.width * this.originX);
		y = -this.height * this.originY;
		rotX = x * Math.cos(this.rotation) - y * Math.sin(this.rotation);
		rotY = x * Math.sin(this.rotation) + y * Math.cos(this.rotation);
		this.vertices[1].x = this.x + rotX;
		this.vertices[1].y = this.y + rotY;

		x = this.width - (this.width * this.originX);
		y = this.height - (this.height * this.originY);
		rotX = x * Math.cos(this.rotation) - y * Math.sin(this.rotation);
		rotY = x * Math.sin(this.rotation) + y * Math.cos(this.rotation);
		this.vertices[2].x = this.x + rotX;
		this.vertices[2].y = this.y + rotY;

		x = -this.width * this.originX;
		y = this.height - (this.height * this.originY);
		rotX = x * Math.cos(this.rotation) - y * Math.sin(this.rotation);
		rotY = x * Math.sin(this.rotation) + y * Math.cos(this.rotation);
		this.vertices[3].x = this.x + rotX;
		this.vertices[3].y = this.y + rotY;
		
		//center
		if(this.center){
			this.center.x=this.x;
			this.center.y=this.y;
		}
	}

	updateParallelogram() {
		//136x47
		let x = this.width - (this.width * this.originX);
		let y = -this.height * this.originY;
		let rotX = x * Math.cos(this.rotation) - y * Math.sin(this.rotation);
		let rotY = x * Math.sin(this.rotation) + y * Math.cos(this.rotation);
		this.vertices[0].x = this.x + rotX;
		this.vertices[0].y = this.y + rotY;

		x = (this.width / 2) - (this.width * this.originX) + (this.width / 6);
		y = this.height - (this.height * this.originY);
		rotX = x * Math.cos(this.rotation) - y * Math.sin(this.rotation);
		rotY = x * Math.sin(this.rotation) + y * Math.cos(this.rotation);
		this.vertices[1].x = this.x + rotX;
		this.vertices[1].y = this.y + rotY;

		x = (this.width / 2) - (this.width * this.originX) - (this.width / 6);
		y = -this.height * this.originY;
		rotX = x * Math.cos(this.rotation) - y * Math.sin(this.rotation);
		rotY = x * Math.sin(this.rotation) + y * Math.cos(this.rotation);
		this.vertices[2].x = this.x + rotX;
		this.vertices[2].y = this.y + rotY;

		x = -this.width * this.originX;
		y = this.height - (this.height * this.originY)
		rotX = x * Math.cos(this.rotation) - y * Math.sin(this.rotation);
		rotY = x * Math.sin(this.rotation) + y * Math.cos(this.rotation);
		this.vertices[3].x = this.x + rotX;
		this.vertices[3].y = this.y + rotY;
		
		if(this.center){
			this.center.x=this.x;
			this.center.y=this.y;
		}
	}
	//- updtes
	
	createCenter(body){
		
		let config = {
			scene: this.scene,
			world: this.world,
			body: body,
			x: 0,
			y: 0,
			isBg: this.m_bIsBg,
			shapeLabel: this.frameName
		}
		this.center = new ShapeCenter(config);
	}

	createVertices(vBody, collCat) {

		let vConf = {
			scene: this.scene,
			world: this.world,
			body: vBody,
			collCat: collCat,
			x: 0,
			y: 0,
			isBg: this.m_bIsBg,
			shapeLabel: this.frameName
		};

		let v1 = new Vertice(vConf);
		this.vertices.push(v1);

		let v2 = new Vertice(vConf);
		this.vertices.push(v2);

		let v3 = new Vertice(vConf);
		this.vertices.push(v3);

		let v4 = null;
		if (this.frameName == 'parallelogram' || this.frameName == 'diamond') {
			v4 = new Vertice(vConf);
			this.vertices.push(v4);
		}

		if (!game.config.physics.matter.debug) {
			v1.alpha = 0;
			v2.alpha = 0;
			v3.alpha = 0;

			if (v4 != null)
				v4.alpha = 0;
		}
	}

	//+ functions
	setVolume() {

		if (this.frameName == 'smallTriangle')
			return 1;
		else if (this.frameName == 'mediumTriangle' || this.frameName == 'parallelogram' || this.frameName == 'diamond')
			return 2;
		else if (this.frameName == 'bigTriangle')
			return 4;

		return 0;
	}

	selected() {
		this.tint = 0xffaa00;
	}

	unselect() {
		this.tint = 0xffffff;
	}

	rotateLeft() {
		this.rotation -= (15 * (Math.PI / 180));
		//this.tryToSnap();
	}
	rotateRight() {
		this.rotation += (15 * (Math.PI / 180));
		//this.tryToSnap();
	}

	moveUp() {
		this.y -= 1;
		//this.tryToSnap();
	}
	moveDown() {
		this.y += 1;
		//this.tryToSnap();
	}

	moveLeft() {
		this.x -= 1;
		//this.tryToSnap();
	}
	moveRight() {
		this.x += 1;
		//this.tryToSnap();
	}

	inPosition() {

		if (this.m_bIsBg) {
			return this.isBgShapeValid();
		} else {
			return this.isShapeValid();
		}
	}

	isBgShapeValid() {

		if (!this.isColliding())
			console.log(`bg ${this.frameName} is not colliding`);
		if (!this.oneVertOnVert())
			console.log(`bg ${this.frameName} is not vert on vert`);

		return (this.isColliding() && this.oneVertOnVert());
	}

	isShapeValid() {

		if (!this.isColliding())
			console.log(`g ${this.frameName} is not colliding`);
		if (!this.oneVerticeValid())
			console.log(`g ${this.frameName} is not one vert valid`);
		if (!this.allVertsOnBodies())
			console.log(`g ${this.frameName} is not all verts on bodies`);
		if (this.center.isColliding())
			console.log(`g ${this.frameName} center colliding`);

		return (this.oneVerticeValid() && this.isColliding() && this.allVertsOnBodies() && !this.center.isColliding());
	}

	verticesValid() {

		let allColliding = true;

		for (let i = 0; i < this.vertices.length; i++) {
			if (!this.vertices[i].isValid()) {
				allColliding = false;
				break;
			}
		}
		return allColliding;
	}

	oneVertOnVert() {
		let oneColliding = false;

		for (let i = 0; i < this.vertices.length; i++) {
			if (this.vertices[i].isCollidingWithVert()) {
				oneColliding = true;
				break;
			}
		}
		return oneColliding;
	}

	oneVerticeValid() {

		let oneColliding = false;

		for (let i = 0; i < this.vertices.length; i++) {
			if (this.vertices[i].isValid()) {
				oneColliding = true;
				break;
			}
		}
		return oneColliding;
	}

	allVertsOnBodies() {

		let allColliding = true;

		for (let i = 0; i < this.vertices.length; i++) {
			if (!this.vertices[i].isCollidingWithBody()) {
				allColliding = false;
				break;
			}
		}
		return allColliding;
	}

	allVertsOnVerts() {

		let allColliding = true;

		for (let i = 0; i < this.vertices.length; i++) {

			if (!this.vertices[i].isCollidingWithVert()) {
				allColliding = false;
				break;
			}
		}
		return allColliding;
	}

	tryToSnap() {

		let verts = [];
		let isSameShape = false;
		for (let i = 0; i < this.vertices.length; i++) {

			let closest = this.scene.closestVerticeTo(this.vertices[i], this);
			verts.push({
				vert: this.vertices[i],
				closest: closest.vertice,
				distance: closest.distance
			});
		}
		//console.log(verts);
		let closestVert = null;
		for (let j = 0; j < verts.length; j++) {

			if (verts[j].closest != null) {

				if (this.scene.m_bForceSameShape) {
					if (closestVert == null) {
						closestVert = verts[j];
					} else {
						//console.log(verts[j])
						if (verts[j].distance < closestVert.distance && !isSameShape)
							closestVert = verts[j];
						else if (verts[j].distance < closestVert.distance && verts[j].closest.shapeLabel == this.frameName && isSameShape) {
							closestVert = verts[j];
						} else if (!isSameShape && verts[j].closest.shapeLabel == this.frameName) {
							closestVert = verts[j];
						}
					}

					if (verts[j].closest.shapeLabel == this.frameName)
						isSameShape = true;
				} else {
					if (closestVert == null) {
						closestVert = verts[j];
					} else if (verts[j].distance < closestVert.distance)
						closestVert = verts[j];
				}

			}
		}

		if (closestVert) {
			//console.log(closestVert.closest.shapeLabel);
			let diffX = closestVert.vert.x - closestVert.closest.x;
			let diffY = closestVert.vert.y - closestVert.closest.y;

			this.x -= diffX;
			this.y -= diffY;

			if (this.justSnaped)
				this.justSnaped = false;
			else
				this.justSnaped = true;
		}

	}
	//- functions

	//+ collision managament
	setColliding(col) {
		this.m_bIsColliding = col;
	}

	isColliding() {
		return this.m_bIsColliding;
	}

	newCollisionStart(col) {

		let bLabel = col.body.label;
		if (bLabel != 'vertice' && bLabel != 'shapeCenter') {

			this.m_aCollidesWith.push(col);
			this.reviewCollisions();
		}
	}

	newCollisionEnd(col) {
		this.removeCollision(col);
	}

	removeCollision(col) {

		let idx = -1;
		for (let i = 0; i < this.m_aCollidesWith.length; i++) {
			if (this.m_aCollidesWith[i] == col) {
				idx = i;
				break;
			}
		}

		if (idx > -1)
			this.m_aCollidesWith.splice(idx, 1);

		this.reviewCollisions();
	}

	reviewCollisions() {

		if (this.m_aCollidesWith.length > 0)
			this.setColliding(true);
		else
			this.setColliding(false);
	}

	error() {
		this.alpha = 0.3;
		this.scene.time.addEvent({
			delay: 500,
			callback: () => {
				this.alpha = 1;
			},
			callbackScope: this
		});

	}
	
	isParentOfCenter(center){
		
		return this.center==center;
	}
	//- collision managament
}

import game from './game.js';

export default Shape;
