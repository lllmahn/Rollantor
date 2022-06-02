namespace Rollantor {

    window.addEventListener("load", setup);

    let canvas: HTMLCanvasElement;
    let crc2: CanvasRenderingContext2D;
    let fps: number = 60;
    let internalWidth: number = 3508;
    let internalHeight: number = 2481;

    let dementor: Dementor;
    let leftIsPressed: boolean = false;
    let rightIsPressed: boolean = false;
    let upIsPressed: boolean = false;
    let downIsPressed: boolean = false;
    let qIsPressed: boolean = false;
    let eIsPressed: boolean = false;

    let rollantorRotAccel: number = 0.1;

    ///   IMAGES   \\\
    let bgImg: HTMLImageElement = new Image();
    bgImg.src = "./img/Grund.jpg";
    let signImg: HTMLImageElement = new Image();
    signImg.src = "./img/Schilder.png";
    let shrubsImg: HTMLImageElement = new Image();
    shrubsImg.src = "./img/Pflanzen.png";
    let dementorImg: HTMLImageElement = new Image();
    dementorImg.src = "./img/Alter_Mann.png"

    function setup(): void {
        defineValues();
        crc2.scale(crc2.canvas.width / internalWidth, crc2.canvas.height / internalHeight);
        resize();
        window.setInterval(update, (1000 / fps));
        window.addEventListener("keydown", keyDownHandler);
        window.addEventListener("keyup", keyUpHandler);
        window.addEventListener("resize", resize);
    }

    function update(): void {
        renderBG();
        dementor.update(leftIsPressed, rightIsPressed, upIsPressed, downIsPressed);
        renderWorld();
    }

    function renderBG(): void{
        crc2.drawImage(bgImg, 0, 0);
    }

    function renderWorld(): void {
        if (dementor.getPos().y > 900) {
            crc2.drawImage(signImg, 0, 0);
            dementor.draw();
        } else {
            dementor.draw();
            crc2.drawImage(signImg, 0, 0);
        }
        crc2.drawImage(shrubsImg, 0, 0);
    }

    function keyDownHandler(_key: any): void {
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

    function keyUpHandler(_key: any): void {
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

    function defineValues(): void {
        canvas = document.querySelector("canvas");
        crc2 = canvas.getContext("2d");
        dementor = new Dementor(crc2, dementorImg);
    }

    function resize() {
        canvas.height = window.innerHeight;
        canvas.width = window.innerHeight * (internalWidth / internalHeight);
        crc2.scale(crc2.canvas.width / internalWidth, crc2.canvas.height / internalHeight);
    }
}