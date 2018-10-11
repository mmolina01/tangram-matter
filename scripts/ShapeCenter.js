import Shape from './Shape.js';

class ShapeCenter extends Phaser.Physics.Matter.Sprite{
	
	constructor(config){
		
		super(config.world, config.x, config.y, 'polygons','shapeCenter.png',{shape:config.body});
		this.setOrigin(0.5, 0.5)
    	config.scene.add.existing(this);
		
		this.m_aCollidesWith=[];
		this.isBg=config.isBg;
		this.shapeLabel=config.shapeLabel;

		this.setCollisionCategory(config.scene.getCenterCollisionGroup());
		this.setCollidesWith([config.scene.getBodyCollisionGroup()]);
	}
	
	newCollisionStart(col){

		//if(col instanceof Shape){
			if(!col.isParentOfCenter(this) && this.m_aCollidesWith.indexOf(col)==-1){
				this.m_aCollidesWith.push(col);
				console.log(`${this.shapeLabel} collides with ${col.body.label}`);
				
			}
		//}
	}
	
	newCollisionEnd(col){
		console.log(`${this.shapeLabel} doesn't collides with ${col.body.label}`);
		this.removeCollision(col);
	}
	
	isColliding(){
		return this.m_aCollidesWith.length>0;
	}
	
	removeCollision(col){
	
		let idx = -1;
		for (let i = 0; i < this.m_aCollidesWith.length; i++) {
			if (this.m_aCollidesWith[i] == col) {
				idx = i;
				break;
			}
		}

		if (idx > -1)
			this.m_aCollidesWith.splice(idx, 1);
	}
}

export default ShapeCenter;