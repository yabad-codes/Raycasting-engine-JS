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
		this.speed = 4;

		this.numberOfRays = map.width / 2;
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

	horizontalIntersection(rayAngle) {
		let sign = -1;
		let isRayFacingUp = rayAngle > Math.PI && rayAngle < 2 * Math.PI;
		let xstep, ystep;
		ystep = Math.floor(this.y / map.tile) * map.tile;
		if (!isRayFacingUp) {
			sign *= -1;
			ystep += map.tile;
		}
		xstep = this.x + (ystep - this.y) / Math.tan(rayAngle);
		while (true) {
			if ((isRayFacingUp && map.isWall(xstep, ystep - map.tile)) || (!isRayFacingUp && map.isWall(xstep, ystep)))
				break;
			xstep += sign * map.tile / Math.tan(rayAngle);
			ystep += sign * map.tile;
		}
		return ({xstep, ystep});
	}

	verticalIntersetion(rayAngle) {
		let sign = 1;
		let isRayFacingLeft = rayAngle > Math.PI / 2 && rayAngle < 1.5 * Math.PI;
		let xstep, ystep;
		xstep = Math.ceil(this.x / map.tile) * map.tile;
		if (isRayFacingLeft) {
			xstep -= map.tile;
			sign *= -1;
		}
		ystep = this.y - (this.x - xstep) * Math.tan(rayAngle);
		while (true) {
			if ((isRayFacingLeft && map.isWall(xstep - map.tile, ystep)) || (!isRayFacingLeft && map.isWall(xstep, ystep)))
				break;
			xstep += sign * map.tile;
			ystep += sign * map.tile * Math.tan(rayAngle);
		}
		return ({xstep, ystep});
	}

	minPoint(step1, step2) {
		let distance1 = Math.sqrt((step1.xstep - this.x) * (step1.xstep - this.x) + (step1.ystep - this.y) * (step1.ystep - this.y));
		let distance2 = Math.sqrt((step2.xstep - this.x) * (step2.xstep - this.x) + (step2.ystep - this.y) * (step2.ystep - this.y));
		if (distance1 < distance2)
			return (step1);
		return (step2);
	}
	
	castRays() {
		let rayAngle = normalizeAngle(this.r_angle - this.fov / 2);
		for (let rayId = 0; rayId < this.numberOfRays; rayId++) {
			let step = this.minPoint(this.horizontalIntersection(rayAngle), this.verticalIntersetion(rayAngle));
			stroke("yellow");
			line(this.x, this.y, step.xstep, step.ystep);
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