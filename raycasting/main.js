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
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
		];
	}

	collideWithWall(plyrX, plyrY, newX, newY) {
		if (newX < 0 || newX > this.width || newY < 0 || newY > this.height)
			return (true);
		if (this.grid[Math.floor(plyrY / this.tile)][Math.floor(newX / this.tile)] === 1)
			return (true);
		if (this.grid[Math.floor(newY / this.tile)][Math.floor(plyrX / this.tile)] === 1)
			return (true);
		return (false);
	}

	isWall(newX, newY) {
		if (newX < 0 || newX > this.width || newY < 0 || newY > this.height)
			return (true);
		if (this.grid[Math.floor(newY / this.tile)][Math.floor(newX / this.tile)] == 1)
			return (true);
		return (false);
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
		this.side = 12;
		this.fov = 60 * Math.PI / 180;
		this.speed = 3;

		this.numberOfRays = map.width;
		this.rayInc = this.fov / this.numberOfRays;
	}

	render() {
		fill("lime");
		ellipse(this.x, this.y, this.side);
		this.castRays();
		stroke("red");
		line(this.x, this.y, this.x + Math.cos(this.r_angle) * 50, this.y + Math.sin(this.r_angle) * 50);
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
			let newX, newY;
			let sign = 1;
			if (keyIsDown(DOWN_ARROW))
				sign *= -1;
			newX = this.x + sign * Math.cos(this.r_angle) * this.speed;
			newY = this.y + sign * Math.sin(this.r_angle) * this.speed;
			if (!map.collideWithWall(this.x, this.y, newX, newY)) {
				this.x = newX;
				this.y = newY;
			}
		}
	}

	castRays() {
		let rayAngle = normalizeAngle(this.r_angle - this.fov / 2);
		for (let rayId = 0; rayId < this.numberOfRays; rayId++) {
			stroke("yellow");
			line(this.x, this.y, this.x + Math.cos(rayAngle) * 50, this.y + Math.sin(rayAngle) * 50);
			stroke("black");
			rayAngle = normalizeAngle(rayAngle + this.rayInc);
		}
	}
}

const player = new Player();

function normalizeAngle(angle) {
	angle = angle % (2 * Math.PI);
	if (angle < 0)
		angle += 2 * Math.PI;
	return (angle);
}

function setup() {
	createCanvas(map.width, map.height);
}

function draw() {
	background(220);
	map.render();
	player.render();
	player.move();
}