class Vertice extends Phaser.Physics.Matter.Sprite{
	constructor(config){
		
		super(config.world, config.x, config.y, 'polygons','vertice.png',{shape:config.body});
		this.setOrigin(0.5, 0.5)
    	config.scene.add.existing(this);
		
		this.m_bIsColliding=false;
		this.m_bIsBg=config.isBg;
		this.m_bCollidesWithVert=false;
		this.m_bCollidesWithBody=false;
		this.m_aCollidesWith=[];
		this.shapeLabel=config.shapeLabel;
		
		this.setCollisionCategory(config.collCat);
		
		if(this.m_bIsBg)
			this.setCollidesWith([config.scene.getVerticeCollisionGroup()]);
		else
			this.setCollidesWith([config.scene.getBgVerticeCollisionGroup(),config.scene.getBgBodyCollisionGroup()]);
	}
	//TODO revidar el agregado y removido de colisiones (cambiarlo a object en vez de label)
	newCollisionStart(col){
		
		this.m_aCollidesWith.push(col);
		this.reviewCollisions();
	}
	
	newCollisionEnd(col){
		this.removeCollision(col);
	}
	
	removeCollision(col){
		
		let idx=-1;
		for(let i=0; i<this.m_aCollidesWith.length; i++){
			if(this.m_aCollidesWith[i]==col){
				idx=i;
				break;
			}
		}
		
		if(idx>-1)
			this.m_aCollidesWith.splice(idx, 1);
		
		this.reviewCollisions();
	}
	
	reviewCollisions(){
		
		let withVert=false;
		let withBody=false;
		
		for(let i=0; i<this.m_aCollidesWith.length; i++){
			if(this.m_aCollidesWith[i].body.label=='vertice' || this.m_aCollidesWith[i].body.label=='vertice5')
				withVert=true;
			else
				withBody=true;
		}
		
		this.setCollidesWithBody(withBody);
		this.setCollidesWithVert(withVert);
	}
	
	isValid(){
		return (this.isCollidingWithVert() && this.isCollidingWithBody());
	}
	
	setColliding(col){
		this.m_bIsColliding=col;
	}
	
	setCollidesWithVert(col){
		this.m_bCollidesWithVert=col;
	}
	
	setCollidesWithBody(col){
		this.m_bCollidesWithBody=col;
	}
	
	isColliding(){
		return this.m_bIsColliding;
	}
	
	isCollidingWithVert(){
		return this.m_bCollidesWithVert;
	}
	
	isCollidingWithBody(){
		return this.m_bCollidesWithBody;
	}
}