var global={
	d1:null,
	d2:null,
	lastEvent:null
}
class PolygonsTest extends Phaser.Scene{
	
	constructor(){
		super({key:'PolygonsTest'});
	}
	
	preload(){
		this.load.atlas('polygons','/assets/images/polygons.png','/assets/images/polygons.json');
		this.load.json('shapes', '/assets/json/polygons.json');
	}
	
	update(delta){
	}
	
	create(){
		var s = new Shape({scene:this,x:50,y:50,key:'polygons'});
		let shapes = this.cache.json.get('shapes');
		
		//let tri=this.matter.add.sprite(500, 200, 'polygons', 'triangle',{shape: shapes.triangle});
		
		this.diamond1=this.matter.add.sprite(300, 200, 'polygons', 0,{shape: shapes.diamond});
		this.diamond2=this.matter.add.sprite(500, 200, 'polygons', 0,{shape: shapes.diamond});
		
		this.triangle=this.matter.add.sprite(500, 500, 'polygons', 1,{shape: shapes.triangle});
		this.triangle.setFrame(2);
		
		this.half=this.matter.add.sprite(200, 400, 'polygons', 2,{shape: shapes.halfDiamond});
		this.half.setFrame(1);
		
		global.d1=this.diamond1;
		global.d2=this.diamond2;
		
		this.diamond1.setSensor(true);
		//this.diamond1.body.isStatic=true;
		//this.diamond1.body.isSleeping=true;
		//this.diamond1.body.isStatic=true;
		this.diamond2.setSensor(true);
		this.diamond2.body.isStatic=true;
		//this.diamond2.body.isActive=false;
		//this.diamond2.body.isSleeping=false;
		
		/*let cat1 = this.matter.world.nextCategory();
		let cat2 = this.matter.world.nextCategory();
		this.diamond1.setCollisionCategory(cat1);
		this.diamond2.setCollisionCategory(cat2);
		this.diamond1.setCollidesWith([ cat1 ]);*/
		
		console.log(this.diamond1);
		
		this.diamond1.setInteractive();
		
		//this.diamond1.input.enableDrag();
		//this.diamond1.input.draggable = true;
		//this.input.setDraggable(this.diamond1);
		//this.diamond1.draggable=true;

		this.input.setDraggable(this.diamond1,true);
		this.input.topOnly = false;
		this.diamond1.on('drag', function () {
			this.diamond1.x = this.input.x;
			this.diamond1.y = this.input.y;
    	},this);
		
		this.diamond1.on('pointerup',function(){
			console.log(global.lastEvent);
			//this.diamond1.body.isStatic=true;
		},this);
		
		this.diamond1.on('pointerdown',function(){
			this.diamond1.body.isStatic=false;
		},this);
		
		//this.physics.add.overlap(this.diamond1, this.diamond2, this.overlaping, null, this);
		//this.matter.Detector.collisions([this.diamond1,this.diamond2]);
		this.matter.world.on('collisionactive',function(event,bodyA,bodyB){
			
			global.lastEvent=event;
		});
	}
	
	checkOverlap(){
		console.log(this.diamond1);
		
	}
	
	overlaping(){
		console.log('overlaping');
	}
}