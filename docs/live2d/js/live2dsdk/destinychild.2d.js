//default parameters
let modelName = "live2d";
let modelScale = 1.0;
let modelX = 0;
let modelY = 0.4;
let previewMade = false, previewRequested = false;
let pckModel = null;

function totsugeki() {
    let motionName = document.getElementById("modelMotions").value;
    if(pckModel) {
        pckModel.mainMotionManager.startMotionPrio(pckModel.motions[motionName], 1);
    }
}

function initModel() {
    console.log('initting model')
    //find document elements
	this.canvas = document.getElementById("canvas");
    this.selectMotions = document.getElementById("modelMotions");

    //create view and device matrix
    let width = this.canvas.width;
    let height = this.canvas.height;
    let ratio = height / width;

    this.viewMatrix = new L2DViewMatrix();
    this.viewMatrix.setScreenRect(-2, 2, -ratio, ratio);
    this.viewMatrix.setMaxScreenRect(-2, 2, -2, 2);
    this.viewMatrix.setMaxScale(2);
    this.viewMatrix.setMinScale(0.8);


    this.deviceToScreen = new L2DMatrix44();
    this.deviceToScreen.multTranslate(-width / 2.0, -height / 2.0);
    this.deviceToScreen.multScale(2 / width, -2 / width);

	//------------------------
	//model files loading
	//------------------------
    const thisRef = this;
	pckModel = new L2DPckModel();
    pckModel.viewMatrix = this.viewMatrix;
    pckModel.deviceToScreen = this.deviceToScreen;
    pckModel.load(this.canvas, 'model.json', function() {
        console.log('model files finished loading');

        //start cursor movement listener
        window.onmousemove = followPointer;

        //update motion picker
        for(let key in pckModel.modelSetting.getMotions()) {
            let option = document.createElement('option');
            option.value = key;
            option.text = key;
            thisRef.selectMotions.add(option);
        }

        //start frame loop
        (function tick() {
            //update & draw live2d
            pckModel.update();
            pckModel.draw();

            //draw preview image
            if((!previewMade) || previewRequested) {
                pckModel.drawModelPreview(thisRef.canvas, previewRequested, function(response) {
                    console.log(response);
                    if('reload' in response)
                        if(response['reload'])
                            window.location.reload(true);
                });
                previewMade = true;
                previewRequested = false;
            }

            //request next frame
            let requestAnimationFrame =
                window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.msRequestAnimationFrame;
            requestAnimationFrame(tick, thisRef.canvas);
        })();
    });
}

//Live2D follow user cursor
function followPointer(event) {
    let rect = this.canvas.getBoundingClientRect();
    let sx = this.deviceToScreen.transformX(event.clientX - rect.left);
    let sy = this.deviceToScreen.transformY(event.clientY - rect.top);
    let vx = transformViewX(event.clientX - rect.left);
    let vy = transformViewY(event.clientY - rect.top);


    if(pckModel) {
        if(pckModel.drag) {
            pckModel.dragMgr.setPoint(vx/2, vy/2);
        }else {
            pckModel.dragMgr.setPoint(0, 0);
        }
    }
}

function transformViewX(deviceX) {
    let screenX = this.deviceToScreen.transformX(deviceX); // 論理座標変換した座標を取得。
    return viewMatrix.invertTransformX(screenX); // 拡大、縮小、移動後の値。
}

function transformViewY(deviceY) {
    let screenY = this.deviceToScreen.transformY(deviceY); // 論理座標変換した座標を取得。
    return viewMatrix.invertTransformY(screenY); // 拡大、縮小、移動後の値。
}
