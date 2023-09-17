/**
 * 1- init map
 * 2- init player
 * 3- render map
 * 4- render player
 * 5- handle player movements
 * 6- handle player coalision with the walls
 * 7- raycast rays
 * 8- check horizontal and vertical intersections
 * 9- generate 3d view
 */

class Map {
	constructor() {
		this.rows = 15;
		this.cols = 11;
		this.tile = 45;
		this.width = this.rows * this.tile;
		this.height = this.cols * this.tile;
		this.grid = [
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
		];
	}
	render() {
		for (let j = 0; j < this.cols; j++) {
			for (let i = 0; i < this.rows; i++) {
				fill("#777");
				if (this.grid[j][i] == 1)
					fill("white");
				rect(i * this.tile, j * this.tile, this.tile, this.tile);
			}
		}
	}
};

const map = new Map();

class Player {
	constructor() {
		this.x = map.width / 2;
		this.y = map.height / 2;
		this.r_angle = 3 * Math.PI / 2;
		this.side = 15;
		this.fov = 60 * Math.PI / 180;
		this.speed = 3;
	}
	render() {
		fill("lime");
		ellipse(this.x, this.y, this.side);
		stroke("red");
		line(this.x, this.y, this.x + cos(this.r_angle) * 20, this.y + sin(this.r_angle) * 20);
		stroke("black");
	}
	move() {
		if (keyIsDown(RIGHT_ARROW) || keyIsDown(LEFT_ARROW)) {
			let sign = 1;
			if (keyIsDown(LEFT_ARROW))
				sign *= -1;
			this.r_angle += sign * 0.05;
		}
		if (keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW)) {
			let sign = 1;
			if (keyIsDown(DOWN_ARROW))
				sign *= -1;
			this.x += sign * cos(this.r_angle) * this.speed;
			this.y += sign * sin(this.r_angle) * this.speed;
		}
	}
}

const player = new Player();

function setup() {
	createCanvas(map.width, map.height);
}

function draw() {
	background(220);
	map.render();
	player.render();
	player.move();
}