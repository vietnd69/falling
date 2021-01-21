class Falling {
    constructor(doms, imgObj) {
        this.eles = document.querySelectorAll(doms)
        this.fallingObjsCont = 20
        this.mouse = {
            x: -100,
            y: -100
        }
        this.canvas = []
        this.minDist = 100
        this.image = new Image()
        this.image.src = imgObj
        this.objSize = {}
        this.render()
    }
    async render() {
        await this.getObjSize()
        // console.log("render")
        this.creatElement()
        this.draw()
        // setTimeout(this.render(), 5000)
    }

    getObjSize() {
        return new Promise(res => {
            let cache = 0
            this.image.addEventListener("load", e => {
                cache = {
                    width: e.target.width,
                    height: e.target.height
                }
                res(cache)
            })
        })
            .then(dataSize => this.objSize = dataSize)
    }
    
    setupObj(obj, canvas) {
        obj.width = Math.floor(Math.random() * 20) + 20;
        obj.height = this.image.naturalHeight / this.image.naturalWidth * obj.width;
        obj.startX = Math.floor(Math.random() * canvas.width);
        obj.startY = 0 - obj.height;
        obj.speed = Math.floor(Math.random() * 2) + 0.5
        obj.vY = obj.speed;
        obj.vX = 0;
        obj._ratate = Math.floor(Math.random());
    }

    creatElement() {
        // console.log("creatElement")
        let dataEle = {}
        this.eles.forEach(ele => {
            const eleWidth = ele.clientWidth
            const eleHeight = ele.clientHeight
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            canvas.width = eleWidth
            canvas.height = eleHeight
            ele.appendChild(canvas)

            const fallingObjs = []
            fallingObjs.push(this.makeFallingObj(canvas))

            dataEle = {
                canvasWidth: eleWidth,
                canvasHeight: eleHeight,
                canvas: canvas,
                ctx: ctx,
                objs: fallingObjs[0]
            }
            this.canvas.push(dataEle)
        })
        // console.log(this.canvas)
    }

    makeFallingObj(canvas) {
        // console.log("makeFallingObj")
        const cacheFallingObjs = []
        for (let i = 0; i < this.fallingObjsCont; i++) {

            // console.log(this.objSize.height, this.objSize.height)
            const fallingObjsWidth = Math.floor(Math.random() * 10) + 20;
            const fallingObjsHeight = this.objSize.height / this.objSize.height * fallingObjsWidth
            const speed = Math.floor(Math.random() * 2) + 0.5

            cacheFallingObjs.push({
                width: fallingObjsWidth,
                height: fallingObjsHeight,
                startX: Math.random() * canvas.width,
                startY: Math.random() * canvas.height - fallingObjsHeight,
                speed: speed,
                vY: speed,
                vX: 0,
                wind: Math.random() * 1.2 - 0.6,
                stepSize: (Math.random()) / 20,
                step: 0,
                angle: Math.random() * 180 - 90,
                rad: Math.floor(Math.random()),
                opacity: Math.random() + 0.4,
                _rotate: Math.floor(Math.random())
            })
        }
        return cacheFallingObjs
    }

    draw() {
        // console.log("draw")
        this.canvas.forEach(ele => {
            // console.log(ele)
            ele.ctx.clearRect(0, 0, ele.canvasWidth, ele.canvasHeight);
            this.drawFallingObjs(ele.objs, ele.ctx)
            this.update(ele.objs, ele.canvas)
            // window.requestAnimationFrame(() => {this.update(ele.objs, ele.canvas)})
        })

        window.requestAnimationFrame(() => {this.draw()})
    }

    drawFallingObjs(objs, ctx) {
        // console.log(objs)
        objs.map(obj => {
            // console.log(obj)
            ctx.beginPath()
            obj.rad = (obj.angle * Math.PI) / 180
            ctx.save()
            let cx = obj.startX + obj.width / 2
            let cy = obj.startY + obj.height / 2

            ctx.globalAlpha = obj.opacity

            ctx.setTransform(
                Math.cos(obj.rad),
                Math.sin(obj.rad),
                -Math.sin(obj.rad),
                Math.cos(obj.rad),
                cx - cx * Math.cos(obj.rad) + cy * Math.sin(obj.rad),
                cy - cx * Math.sin(obj.rad) - cy * Math.cos(obj.rad)
            )
            ctx.drawImage(this.image, obj.startX, obj.startY, obj.width, obj.height);
            ctx.restore();
        })
    }

    update(objs, canvas) {
        console.log("update")
        objs.map(obj => {
            const dist = Math.sqrt((obj.startX - this.mouse.x) ** 2 + (obj.startY - this.mouse.y) ** 2)
            if (dist < this.minDist) {
                const force = this.minDist / (dist * dist)
                const    xcomp = (this.mouse.x - obj.startX) / dist
                const    ycomp = (this.mouse.y - obj.startY) / dist
                const    deltaV = force * 2;

                obj.vX -= deltaV * xcomp;
                obj.vY -= deltaV * ycomp;

                    (obj.d * xcomp > 0) && (obj.wind = 0 - obj.wind)
            } else {
                obj.vX *= .98;

                (obj.vY < obj.speed) && (obj.vY = obj.speed)

                obj.vx += Math.cos(
                    obj.step += (Math.random() * 0.05) * obj.stepSize
                )
            }
            obj.startY += obj.vY
            obj.startX += obj.vX + obj.wind

            const _angle = Math.random() + 0.2;

            (obj._rotate == 0) ? (obj.angle += _angle) : (obj.angle -= _angle);

            (obj.startY > canvas.height) && (this.reset(obj, canvas));

            (obj.startX > canvas.width || obj.startX < (0 - obj.width)) && (this.reset(obj, canvas))
        })
        this.checkMouse(canvas)
        // requestAnimationFrame(this.update(fallingObjs, canvas));
    }

    checkMouse(canvas) {
        // console.log("check mouse")
        canvas.addEventListener('mousemove', e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        })
    }

    reset(obj, canvas) {
        // console.log("reset")
        obj.width = Math.floor(Math.random() * 20) + 20;
        obj.height = this.image.naturalHeight / this.image.naturalWidth * obj.width;
        obj.startX = Math.floor(Math.random() * canvas.width);
        obj.startY = 0 - obj.height;
        obj.speed = Math.floor(Math.random() * 2) + 0.5
        obj.vY = obj.speed;
        obj.vX = 0;
        obj._ratate = Math.floor(Math.random());
    }
}

const roi = new Falling('.roi', './test.png')