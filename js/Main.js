var Rollantor;
(function (Rollantor) {
    window.addEventListener("load", setup);
    let canvas;
    let crc2;
    let fps = 60;
    let internalWidth = 3508;
    let internalHeight = 2481;
    let dementor;
    let leftIsPressed = false;
    let rightIsPressed = false;
    let upIsPressed = false;
    let downIsPressed = false;
    let qIsPressed = false;
    let eIsPressed = false;
    let rollantorRotAccel = 0.1;
    ///   IMAGES   \\\
    let bgImg = new Image();
    bgImg.src = "./img/Grund.jpg";
    let signImg = new Image();
    signImg.src = "./img/Schilder.png";
    let shrubsImg = new Image();
    shrubsImg.src = "./img/Pflanzen.png";
    let dementorImg = new Image();
    dementorImg.src = "./img/Alter_Mann.png";
    function setup() {
        defineValues();
        crc2.scale(crc2.canvas.width / internalWidth, crc2.canvas.height / internalHeight);
        resize();
        window.setInterval(update, (1000 / fps));
        window.addEventListener("keydown", keyDownHandler);
        window.addEventListener("keyup", keyUpHandler);
        window.addEventListener("resize", resize);
    }
    function update() {
        renderBG();
        dementor.update(leftIsPressed, rightIsPressed, upIsPressed, downIsPressed);
        renderWorld();
    }
    function renderBG() {
        crc2.drawImage(bgImg, 0, 0);
    }
    function renderWorld() {
        if (dementor.getPos().y > 900) {
            crc2.drawImage(signImg, 0, 0);
            dementor.draw();
        }
        else {
            dementor.draw();
            crc2.drawImage(signImg, 0, 0);
        }
        crc2.drawImage(shrubsImg, 0, 0);
    }
    function keyDownHandler(_key) {
        switch (_key.code) {
            case "ArrowLeft":
            case "KeyA":
                leftIsPressed = true;
                break;
            case "ArrowRight":
            case "KeyD":
                rightIsPressed = true;
                break;
            case "ArrowUp":
            case "KeyW":
                upIsPressed = true;
                break;
            case "ArrowDown":
            case "KeyS":
                downIsPressed = true;
                break;
            case "KeyQ":
                qIsPressed = true;
                break;
            case "KeyE":
                eIsPressed = true;
                break;
            default:
                console.log("hier wurde etwas gedrückt, das es nicht gibt.");
        }
    }
    function keyUpHandler(_key) {
        switch (_key.code) {
            case "ArrowLeft":
            case "KeyA":
                leftIsPressed = false;
                break;
            case "ArrowRight":
            case "KeyD":
                rightIsPressed = false;
                break;
            case "ArrowUp":
            case "KeyW":
                upIsPressed = false;
                break;
            case "ArrowDown":
            case "KeyS":
                downIsPressed = false;
                break;
            case "KeyQ":
                qIsPressed = false;
                break;
            case "KeyE":
                eIsPressed = false;
                break;
            default:
                console.log("hier wurde etwas losgelassen, das es nicht gibt.");
        }
    }
    function defineValues() {
        canvas = document.querySelector("canvas");
        crc2 = canvas.getContext("2d");
        dementor = new Rollantor.Dementor(crc2, dementorImg);
    }
    function resize() {
        canvas.height = window.innerHeight;
        canvas.width = window.innerHeight * (internalWidth / internalHeight);
        crc2.scale(crc2.canvas.width / internalWidth, crc2.canvas.height / internalHeight);
    }
})(Rollantor || (Rollantor = {}));
//# sourceMappingURL=Main.js.map