class Preloader extends Phaser.Scene{
	
	constructor(){
		super({key:'Preloader'});
	}
	
	preload(){
		this.load.json('shapes', '/assets/json/polygons_edit.json');
		this.load.multiatlas('polygons', '/assets/images/polygons_edit.json', 'assets/images');
	}
	
	create(){
		this.scene.start('VerticesTest');
	}
}