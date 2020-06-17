function L2DPckModel() {
    L2DBaseModel.prototype.constructor.call(this);
    this.gl = null;
    this.modelSetting = null;
    this.modelMatrix = [];
    this.dragMgr = new L2DTargetPoint();
    this.drag = true;
    this.imageCallback = null;
    this.viewMatrix = null;
    this.deviceToScreen = null;
}

L2DPckModel.prototype = new L2DBaseModel();

L2DPckModel.prototype.getIdleMotion = function() {
    if('idle' in this.motions)
        return this.motions['idle'];
    return null;
};

L2DPckModel.prototype.load = function(canvas, modelJsonPath, callback) {
    this.gl = getWebGLContext(canvas);

    Live2DFramework.setPlatformManager(new PlatformManager(this.gl));
	Live2D.setGL(this.gl);

    this.setUpdating(true);
    this.setInitialized(false);
    this.modelSetting = new ModelSettingJson();

    let thisRef = this;
    this.modelSetting.loadModelSetting(getPath('model.json'), function() {
        console.log('model json file loaded');
        thisRef.loadModelData(getPath(thisRef.modelSetting.getModelFile()), function(model) {
            console.log('model file loaded');
            for(let i = 0; i < thisRef.modelSetting.getTextureNum(); i++) {
                let texturePath = getPath(thisRef.modelSetting.getTextureFile(i));
                thisRef.loadTexture(i, texturePath, function(texture) {
                    if(thisRef.isTexLoaded) {
                        console.log('model texture files loaded');
                        let motionCounter = 0;
                        for(let name in thisRef.modelSetting.getMotions()) {
                            motionCounter++;
                            thisRef.loadMotion(name, getPath(thisRef.modelSetting.getMotionFile(name, 0)), function(motion) {
                                console.log('model motion file loaded '+name);
                                motionCounter--;
                                if(motionCounter === 0) {
                                    let physicsPath = thisRef.modelSetting.getPhysicsFile();
                                    if(physicsPath) {
                                        thisRef.loadPhysics(getPath(physicsPath), function(physics) {
                                            console.log('model physics file loaded');
                                            thisRef.setUpdating(false);
                                            thisRef.setInitialized(true);
                                            callback();
                                        })
                                    }else {
                                        thisRef.setUpdating(true);
                                        thisRef.setInitialized(false);
                                        callback();
                                    }
                                }
                            })
                        }
                    }
                })
            }
        });
    });

};

L2DPckModel.prototype.update = function() {
    //calculate time cycles
    let timeMSec = UtSystem.getUserTimeMSec() - this.startTimeMSec;
    let timeSec = timeMSec / 1000.0;
    let t = timeSec * 2 * Math.PI; // 2πt


    //start motions
    if(this.mainMotionManager.isFinished()) {
        this.mainMotionManager.startMotionPrio(this.getIdleMotion(), 0);
    }

    //load & update model params
    this.live2DModel.loadParam();
    this.mainMotionManager.updateParam(this.live2DModel);

    //save new params
    this.live2DModel.saveParam();

    //follow cursor with eyes
    this.live2DModel.addToParamFloat("PARAM_ANGLE_X", this.dragX * 30, 1);
    this.live2DModel.addToParamFloat("PARAM_ANGLE_Y", this.dragY * 30, 1);
    this.live2DModel.addToParamFloat("PARAM_ANGLE_Z", (this.dragX * this.dragY) * -30, 1);
    this.live2DModel.addToParamFloat("PARAM_BODY_ANGLE_X", this.dragX*10, 1);
    this.live2DModel.addToParamFloat("PARAM_EYE_BALL_X", this.dragX, 1);
    this.live2DModel.addToParamFloat("PARAM_EYE_BALL_Y", this.dragY, 1);

    this.live2DModel.addToParamFloat("PARAM_ANGLE_X",
                                     Number((15 * Math.sin(t / 6.5345))), 0.5);
    this.live2DModel.addToParamFloat("PARAM_ANGLE_Y",
                                     Number((8 * Math.sin(t / 3.5345))), 0.5);
    this.live2DModel.addToParamFloat("PARAM_ANGLE_Z",
                                     Number((10 * Math.sin(t / 5.5345))), 0.5);
    this.live2DModel.addToParamFloat("PARAM_BODY_ANGLE_X",
                                     Number((4 * Math.sin(t / 15.5345))), 0.5);
    this.live2DModel.setParamFloat("PARAM_BREATH",
                                   Number((0.5 + 0.5 * Math.sin(t / 3.2345))), 1);

    //update physics
    if(this.physics != null) {
        this.physics.updateParam(this.live2DModel);
    }

    //clear drag
    this.dragMgr.update();
    this.setDrag(this.dragMgr.getX(), this.dragMgr.getY());

    //update live2d model
    this.live2DModel.update();

};

L2DPckModel.prototype.draw = function() {
    //clear gl
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    //canvas proportions
    var matrix = new L2DMatrix44();
    var smodel = this.gl.canvas.width / this.live2DModel.getCanvasWidth();
    matrix.multScale(smodel, smodel);
    var sw = 2.0 / this.gl.canvas.width;
    var sh = 2.0 / this.gl.canvas.height;
    matrix.multScale(sw, -sh);
    matrix.multTranslate(-1 , 1);

    //scale
    matrix.multScale(modelScale/2, modelScale/2);

    //offset
    matrix.multTranslate(modelX, modelY);

    //apply to model
	this.live2DModel.setMatrix(matrix.getArray());
	this.live2DModel.draw(this.gl);

	//generate image if requested
    if(this.imageCallback) {
        this.imageCallback(this.gl, this.mainMotionManager.isFinished());
    }
};

L2DPckModel.prototype.drawModelPreview = function(canvas, remake, callback) {
    //wait for WebGL
    this.gl.finish();

    //create request url
    let url = '/api/set_model_preview/'+modelId;
    if(remake) {
        url += '/remake';
    }

    //canvas to blob
    canvas.toBlob(function(blob) {
        let formData = new FormData();
        formData.append('preview', blob);

        $.ajax(url, {
          method: "POST",
          data: formData,
          processData: false,
          contentType: false,
          success: function (response) {
              let responseJson = JSON.parse(response);
              callback(responseJson);
          }
        });
    }, 'image/png');
};

L2DPckModel.prototype.getImage = function(callback) {
    this.mainMotionManager.startMotionPrio(this.getIdleMotion(), 0);
    this.imageCallback = callback;
};


function getPath(file) {
    console.log('getting path for ', file)
	return "/characters/"+modelName+"/"+modHash+"/"+file;
}

function getWebGLContext(canvas) {
	//try different WebGl kits
	const kits = ["webgl2", "webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    const param = {alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: true};

    for(var i = 0; i < kits.length; i++){
        try{
            var ctx = canvas.getContext(kits[i], param);
            if(ctx) return ctx;
        }catch(e){}
    }
    return null;
}
