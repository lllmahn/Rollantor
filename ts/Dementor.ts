namespace Rollantor {
    export class Dementor {
        private crc2: CanvasRenderingContext2D;
        private internalWidth: number = 3508;

        private pos: Vector = new Vector(0, 0);
        private velocity: Vector = new Vector(0, 0);
        private speed: number = 0;
        private maxSpeed: number = 6;
        private accel: number = 0.1;
        private rot: number = 0;
        private rotFacMax: number = 3;
        private rotFac: number = 0;
        private turnAccel: number = 0.1;

        private rollantorForce: number = 0;

        private divider: number = 15;
        private width: number = 50;
        private height: number = 50;

        private img: HTMLImageElement;
        private pathSpeed: number = 4;
        private grassSpeed: number = 2;

        //Rollantor\\
        private mainTurn: Vector = new Vector(1700, 900);
        private mainTurnDest: Vector = new Vector(2350, 1100);
        private mainRadius: number = 500;
        private mainMaxRotDiff: number = 120;

        private backTurn: Vector = new Vector(750, 750);
        private backTurnDest: Vector = new Vector(730, 1170);
        private backRadius: number = 350;
        private backMaxRotDiff: number = 110;

        private frontTurn: Vector = new Vector(1845, 2250);
        private frontTurnDest: Vector = new Vector(1750, 1800);
        private frontRadius: number = 400;
        private frontMaxRotDiff: number = 120;

        constructor(_crc2: CanvasRenderingContext2D, _img: HTMLImageElement) {
            this.crc2 = _crc2;
            this.img = _img;
            this.pos.set(1750, 2000);
        }

        public draw(): void {
            this.crc2.save();
            this.crc2.fillStyle = "#00ffff";
            this.crc2.translate(this.pos.x, this.pos.y);
            this.crc2.rotate(this.rot * (Math.PI / 180));
            this.crc2.fillRect(- this.width / this.divider, - this.height / this.divider, this.width, this.height);
            this.crc2.drawImage(this.img, - this.img.width / (this.divider * 2), - this.img.height / (this.divider * 2), this.img.width / this.divider, this.img.height / this.divider);
            this.crc2.fillRect(0, 5, 80 * this.rotFac, 10);
            this.crc2.fillStyle = "#ffff00";
            this.crc2.fillRect(0, 5, 80 * this.rollantorForce, 10);
            this.crc2.restore();
        }

        public update(_left: boolean, _right: boolean, _up: boolean, _down: boolean): void {
            this.updateRotation(_left, _right);
            this.updatePos(_up, _down);
            //console.log(this.pos);
        }

        private updateRotation(_left: boolean, _right: boolean) {
            if (_left && !_right) {
                if (this.rotFac > - this.rotFacMax) {
                    if (this.rotFac > 0) {
                        this.rotFac -= this.turnAccel * 3;
                    }
                    this.rotFac -= this.turnAccel;
                }
            }
            if (_right && !_left) {
                if (this.rotFac < this.rotFacMax) {
                    if (this.rotFac < 0) {
                        this.rotFac += this.turnAccel * 3;
                    }
                    this.rotFac += this.turnAccel;
                }
            }
            if (!_right && !_left || _right && _left) {
                if (this.rotFac != 0) {
                    if (this.rotFac > 0) {
                        this.rotFac -= this.turnAccel * 3;
                    } else {
                        this.rotFac += this.turnAccel * 3;
                    }
                    if (Math.abs(this.rotFac) < this.turnAccel * 3) {
                        this.rotFac = 0;
                    }
                }
            }
            this.rot += this.rotFac;
            if (Math.abs(this.rotFac) < Math.abs(this.rotFacMax)) {
                this.updateRollantor();
                this.rot += this.rollantorForce;
            }
            this.fixOverRot();
        }

        private updatePos(_up: boolean, _down: boolean) {
            this.adaptMaxSpeed();
            if (_up) {
                if (this.speed < this.maxSpeed) {
                    this.speed += this.accel;
                } else {
                    this.speed -= this.accel * 3;
                }
            } else if (_down) {
                if (this.speed > -this.maxSpeed) {
                    this.speed -= this.accel;
                } else {
                    this.speed += this.accel * 3;
                }
            }
            if (!_up && !_down) {
                this.speed = 0;
                this.velocity.set(0, 0);
            } else {
                this.velocity = Vector.getRotVector(this.speed, this.rot);
            }
            this.pos.add(this.velocity);
        }

        private updateRollantor() {

            /// Main Turn \\\
            let mainForce: number = this.getTurnForce(this.mainRadius, this.mainTurn, this.mainTurnDest, this.mainMaxRotDiff);

            /// BackTurn \\\
            let backForce: number = this.getTurnForce(this.backRadius, this.backTurn, this.backTurnDest, this.backMaxRotDiff);

            /// FrontTurn \\\
            let frontForce: number = this.getTurnForce(this.frontRadius, this.frontTurn, this.frontTurnDest, this.frontMaxRotDiff);

            this.rollantorForce = (mainForce + backForce + frontForce)*0.8;
        }

        private getTurnForce(_influence: number, _turnPos: Vector, _turnDest: Vector, _maxRotDiff: number): number {
            let strength: number = Math.max(0, _influence - Vector.getDifference(this.pos, _turnPos).length) / 500;
            let rotDifferce: number = Vector.getRotOfVector(Vector.getDifference(_turnDest, this.pos)) - this.rot;
            if (Math.abs(rotDifferce) > _maxRotDiff) {
                rotDifferce = 0;
            }
            return this.accel * rotDifferce * strength;
        }

        public getPos(): Vector {
            return this.pos;
        }

        private isOnPath(): boolean {
            let tempLoc: Vector = this.getRelativePos(this.crc2.canvas.width / this.internalWidth);
            let img: ImageData = this.crc2.getImageData(tempLoc.x, tempLoc.y, 1, 1);
            //console.log(", r: " + img.data[0] + ", g: " + img.data[1] + ", b: " + img.data[2]);
            if (img.data[0] == 235 && img.data[1] == 235 && img.data[2] == 235 || img.data[0] == 215 && img.data[1] == 163 && img.data[2] == 87) {
                return true;
            } else {
                return false;
            }
        }

        private getRelativePos(_scale: number): Vector {
            return new Vector(Math.round(this.pos.x * _scale), Math.round(this.pos.y * _scale));
        }

        private adaptMaxSpeed(): void {
            if (this.isOnPath()) {
                this.maxSpeed = this.pathSpeed;
            } else {
                this.maxSpeed = this.grassSpeed;
            }
        }

        private fixOverRot(): void {
            if (this.rot > 180) {
                this.rot -= 360;
            } else if (this.rot < -180) {
                this.rot += 360;
            }
        }
    }
}