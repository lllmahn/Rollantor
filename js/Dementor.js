var Rollantor;
(function (Rollantor) {
    class Dementor {
        constructor(_crc2, _img) {
            this.internalWidth = 3508;
            this.pos = new Rollantor.Vector(0, 0);
            this.velocity = new Rollantor.Vector(0, 0);
            this.speed = 0;
            this.maxSpeed = 6;
            this.accel = 0.1;
            this.rot = 0;
            this.rotFacMax = 3;
            this.rotFac = 0;
            this.turnAccel = 0.1;
            this.rollantorForce = 0;
            this.divider = 15;
            this.width = 50;
            this.height = 50;
            this.pathSpeed = 4;
            this.grassSpeed = 2;
            //Rollantor\\
            this.mainTurn = new Rollantor.Vector(1700, 900);
            this.mainTurnDest = new Rollantor.Vector(2350, 1100);
            this.mainRadius = 500;
            this.mainMaxRotDiff = 120;
            this.backTurn = new Rollantor.Vector(750, 750);
            this.backTurnDest = new Rollantor.Vector(730, 1170);
            this.backRadius = 350;
            this.backMaxRotDiff = 110;
            this.frontTurn = new Rollantor.Vector(1845, 2250);
            this.frontTurnDest = new Rollantor.Vector(1750, 1800);
            this.frontRadius = 400;
            this.frontMaxRotDiff = 120;
            this.crc2 = _crc2;
            this.img = _img;
            this.pos.set(1750, 2000);
        }
        draw() {
            this.crc2.save();
            this.crc2.fillStyle = "#00ffff";
            this.crc2.translate(this.pos.x, this.pos.y);
            this.crc2.rotate(this.rot * (Math.PI / 180));
            this.crc2.fillRect(-this.width / this.divider, -this.height / this.divider, this.width, this.height);
            this.crc2.drawImage(this.img, -this.img.width / (this.divider * 2), -this.img.height / (this.divider * 2), this.img.width / this.divider, this.img.height / this.divider);
            this.crc2.fillRect(0, 5, 80 * this.rotFac, 10);
            this.crc2.fillStyle = "#ffff00";
            this.crc2.fillRect(0, 5, 80 * this.rollantorForce, 10);
            this.crc2.restore();
        }
        update(_left, _right, _up, _down) {
            this.updateRotation(_left, _right);
            this.updatePos(_up, _down);
            //console.log(this.pos);
        }
        updateRotation(_left, _right) {
            if (_left && !_right) {
                if (this.rotFac > -this.rotFacMax) {
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
                    }
                    else {
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
        updatePos(_up, _down) {
            this.adaptMaxSpeed();
            if (_up) {
                if (this.speed < this.maxSpeed) {
                    this.speed += this.accel;
                }
                else {
                    this.speed -= this.accel * 3;
                }
            }
            else if (_down) {
                if (this.speed > -this.maxSpeed) {
                    this.speed -= this.accel;
                }
                else {
                    this.speed += this.accel * 3;
                }
            }
            if (!_up && !_down) {
                this.speed = 0;
                this.velocity.set(0, 0);
            }
            else {
                this.velocity = Rollantor.Vector.getRotVector(this.speed, this.rot);
            }
            this.pos.add(this.velocity);
        }
        updateRollantor() {
            /// Main Turn \\\
            let mainForce = this.getTurnForce(this.mainRadius, this.mainTurn, this.mainTurnDest, this.mainMaxRotDiff);
            /// BackTurn \\\
            let backForce = this.getTurnForce(this.backRadius, this.backTurn, this.backTurnDest, this.backMaxRotDiff);
            /// FrontTurn \\\
            let frontForce = this.getTurnForce(this.frontRadius, this.frontTurn, this.frontTurnDest, this.frontMaxRotDiff);
            this.rollantorForce = (mainForce + backForce + frontForce) * 0.8;
        }
        getTurnForce(_influence, _turnPos, _turnDest, _maxRotDiff) {
            let strength = Math.max(0, _influence - Rollantor.Vector.getDifference(this.pos, _turnPos).length) / 500;
            let rotDifferce = Rollantor.Vector.getRotOfVector(Rollantor.Vector.getDifference(_turnDest, this.pos)) - this.rot;
            if (Math.abs(rotDifferce) > _maxRotDiff) {
                rotDifferce = 0;
            }
            return this.accel * rotDifferce * strength;
        }
        getPos() {
            return this.pos;
        }
        isOnPath() {
            let tempLoc = this.getRelativePos(this.crc2.canvas.width / this.internalWidth);
            let img = this.crc2.getImageData(tempLoc.x, tempLoc.y, 1, 1);
            //console.log(", r: " + img.data[0] + ", g: " + img.data[1] + ", b: " + img.data[2]);
            if (img.data[0] == 235 && img.data[1] == 235 && img.data[2] == 235 || img.data[0] == 215 && img.data[1] == 163 && img.data[2] == 87) {
                return true;
            }
            else {
                return false;
            }
        }
        getRelativePos(_scale) {
            return new Rollantor.Vector(Math.round(this.pos.x * _scale), Math.round(this.pos.y * _scale));
        }
        adaptMaxSpeed() {
            if (this.isOnPath()) {
                this.maxSpeed = this.pathSpeed;
            }
            else {
                this.maxSpeed = this.grassSpeed;
            }
        }
        fixOverRot() {
            if (this.rot > 180) {
                this.rot -= 360;
            }
            else if (this.rot < -180) {
                this.rot += 360;
            }
        }
    }
    Rollantor.Dementor = Dementor;
})(Rollantor || (Rollantor = {}));
//# sourceMappingURL=Dementor.js.map