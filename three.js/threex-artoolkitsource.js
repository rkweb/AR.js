var THREEx = THREEx || {}

THREEx.ArToolkitSource = function(parameters){	
	// handle default parameters
	this.parameters = {
		// type of source - ['webcam', 'image', 'video']
		sourceType : parameters.sourceType !== undefined ? parameters.sourceType : 'webcam',
		// url of the source - valid if sourceType = image|video
		sourceUrl : parameters.sourceUrl !== undefined ? parameters.sourceUrl : null,
		
		// resolution of at which we initialize in the source image
		sourceWidth: parameters.sourceWidth !== undefined ? parameters.sourceWidth : 640,
		sourceHeight: parameters.sourceHeight !== undefined ? parameters.sourceHeight : 480,
		// resolution displayed for the source 
		displayWidth: parameters.displayWidth !== undefined ? parameters.displayWidth : 640,
		displayHeight: parameters.displayHeight !== undefined ? parameters.displayHeight : 480,
	}

	this.ready = false
        this.domElement = null
}

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
THREEx.ArToolkitSource.prototype.init = function(onReady){
	var _this = this

        if( this.parameters.sourceType === 'image' ){
                var domElement = this._initSourceImage(onSourceReady)                        
        }else if( this.parameters.sourceType === 'video' ){
                var domElement = this._initSourceVideo(onSourceReady)                        
        }else if( this.parameters.sourceType === 'webcam' ){
                // var domElement = this._initSourceWebcamOld(onSourceReady)                        
                var domElement = this._initSourceWebcam(onSourceReady)                        
        }else{
                console.assert(false)
        }

	// attach
        this.domElement = domElement
        this.domElement.style.position = 'absolute'
        this.domElement.style.top = '0px'
        this.domElement.style.left = '0px'
        this.domElement.style.zIndex = '-2'

	return this
        function onSourceReady(){
		document.body.appendChild(_this.domElement);

		_this.ready = true

		onReady && onReady()
        }
} 

////////////////////////////////////////////////////////////////////////////////
//          init image source
////////////////////////////////////////////////////////////////////////////////


THREEx.ArToolkitSource.prototype._initSourceImage = function(onReady) {
	// TODO make it static
        var domElement = document.createElement('img')
	domElement.src = this.parameters.sourceUrl

	domElement.width = this.parameters.sourceWidth
	domElement.height = this.parameters.sourceHeight
	domElement.style.width = this.parameters.displayWidth+'px'
	domElement.style.height = this.parameters.displayHeight+'px'

	// wait until the video stream is ready
	var interval = setInterval(function() {
		if (!domElement.naturalWidth)	return;
		onReady()
		clearInterval(interval)
	}, 1000/50);

	return domElement                
}

////////////////////////////////////////////////////////////////////////////////
//          init video source
////////////////////////////////////////////////////////////////////////////////


THREEx.ArToolkitSource.prototype._initSourceVideo = function(onReady) {
	// TODO make it static
	var domElement = document.createElement('video');
	domElement.src = this.parameters.sourceUrl

	domElement.style.objectFit = 'initial'

	domElement.autoplay = true;
	domElement.webkitPlaysinline = true;
	domElement.controls = false;
	domElement.loop = true;
	domElement.muted = true

	// trick to trigger the video on android
	document.body.addEventListener('click', function onClick(){
		document.body.removeEventListener('click', onClick);
		domElement.play()
	})

	domElement.width = this.parameters.sourceWidth
	domElement.height = this.parameters.sourceHeight
	domElement.style.width = this.parameters.displayWidth+'px'
	domElement.style.height = this.parameters.displayHeight+'px'
	
	// wait until the video stream is ready
	var interval = setInterval(function() {
		if (!domElement.videoWidth)	return;
		onReady()
		clearInterval(interval)
	}, 1000/50);
	return domElement
}

////////////////////////////////////////////////////////////////////////////////
//          handle webcam source
////////////////////////////////////////////////////////////////////////////////

THREEx.ArToolkitSource.prototype._initSourceWebcam = function(onReady) {
	var _this = this

	var domElement = document.createElement('video');
	domElement.setAttribute('autoplay', '');
	domElement.setAttribute('muted', '');
	domElement.setAttribute('playsinline', '');
	domElement.style.width = this.parameters.displayWidth+'px'
	domElement.style.height = this.parameters.displayHeight+'px'

	if (navigator.mediaDevices === undefined 
			|| navigator.mediaDevices.enumerateDevices === undefined 
			|| navigator.mediaDevices.getUserMedia === undefined  ){
		alert("WebRTC issue! navigator.mediaDevices.enumerateDevices not present in your browser");		
	}

	navigator.mediaDevices.enumerateDevices().then(function(devices) {
                var userMediaConstraints = {
			audio: false,
			video: {
				facingMode: 'environment',
				width: {
					ideal: _this.parameters.sourceWidth,
					// min: 1024,
					// max: 1920
				},
				height: {
					ideal: _this.parameters.sourceHeight,
					// min: 776,
					// max: 1080
				}
		  	}
                }
		navigator.mediaDevices.getUserMedia(userMediaConstraints).then(function success(stream) {
			// set the .src of the domElement
			domElement.srcObject = stream;
			// to start the video, when it is possible to start it only on userevent. like in android
			document.body.addEventListener('click', function(){
				domElement.play();
			})
			// domElement.play();
// TODO listen to loadedmetadata instead
			// wait until the video stream is ready
			var interval = setInterval(function() {
				if (!domElement.videoWidth)	return;
				onReady()
				clearInterval(interval)
			}, 1000/50);
		}).catch(function(error) {
			console.log("Can't access user media", error);
			alert("Can't access user media :()");
		});
	}).catch(function(err) {
		console.log(err.name + ": " + err.message);
	});

	return domElement
}

//////////////////////////////////////////////////////////////////////////////
//		Handle Mobile Torch
//////////////////////////////////////////////////////////////////////////////
THREEx.ArToolkitSource.prototype.hasMobileTorch = function(){
	var stream = arToolkitSource.domElement.srcObject
	if( stream instanceof MediaStream === false )	return false

	if( this._currentTorchStatus === undefined ){
		this._currentTorchStatus = false
	}

	var videoTrack = stream.getVideoTracks()[0];

	// if videoTrack.getCapabilities() doesnt exist, return false now
	if( videoTrack.getCapabilities === undefined )	return false

	var capabilities = videoTrack.getCapabilities()
	
	return capabilities.torch ? true : false
}

/**
 * toggle the flash/torch of the mobile fun if applicable.
 * Great post about it https://www.oberhofer.co/mediastreamtrack-and-its-capabilities/
 */
THREEx.ArToolkitSource.prototype.toggleMobileTorch = function(){
	// sanity check
	console.assert(this.hasMobileTorch() === true)
		
	var stream = arToolkitSource.domElement.srcObject
	if( stream instanceof MediaStream === false ){
		alert('enabling mobile torch is available only on webcam')
		return
	}

	if( this._currentTorchStatus === undefined ){
		this._currentTorchStatus = false
	}

	var videoTrack = stream.getVideoTracks()[0];
	var capabilities = videoTrack.getCapabilities()
	
	if( !capabilities.torch ){
		alert('no mobile torch is available on your camera')
		return
	}

	this._currentTorchStatus = this._currentTorchStatus === false ? true : false
	videoTrack.applyConstraints({
		advanced: [{
			torch: this._currentTorchStatus
		}]
	}).catch(function(error){
		console.log(error)
	});
}

////////////////////////////////////////////////////////////////////////////////
//          handle resize
////////////////////////////////////////////////////////////////////////////////

THREEx.ArToolkitSource.prototype.onResizeElement = function(mirrorDomElements){
	var _this = this
	var screenWidth = window.innerWidth
	var screenHeight = window.innerHeight

	// compute sourceWidth, sourceHeight
	if( this.domElement.nodeName === "IMG" ){
		var sourceWidth = this.domElement.naturalWidth
		var sourceHeight = this.domElement.naturalHeight
	}else if( this.domElement.nodeName === "VIDEO" ){
		var sourceWidth = this.domElement.videoWidth
		var sourceHeight = this.domElement.videoHeight
	}else{
		console.assert(false)
	}
	
	// compute sourceAspect
	var sourceAspect = sourceWidth / sourceHeight
	// compute screenAspect
	var screenAspect = screenWidth / screenHeight

	// if screenAspect < sourceAspect, then change the width, else change the height
	if( screenAspect < sourceAspect ){
		// compute newWidth and set .width/.marginLeft
		var newWidth = sourceAspect * screenHeight
		this.domElement.style.width = newWidth+'px'
		this.domElement.style.marginLeft = -(newWidth-screenWidth)/2+'px'
		
		// init style.height/.marginTop to normal value
		this.domElement.style.height = screenHeight+'px'
		this.domElement.style.marginTop = '0px'
	}else{
		// compute newHeight and set .height/.marginTop
		var newHeight = 1 / (sourceAspect / screenWidth)
		this.domElement.style.height = newHeight+'px'
		this.domElement.style.marginTop = -(newHeight-screenHeight)/2+'px'
		
		// init style.width/.marginLeft to normal value
		this.domElement.style.width = screenWidth+'px'
		this.domElement.style.marginLeft = '0px'
	}
	
	
	if( arguments.length !== 0 ){
		debugger
		console.warn('use bad signature for arToolkitSource.copyElementSizeTo')
	}
	// honor default parameters
	// if( mirrorDomElements !== undefined )	console.warn('still use the old resize. fix it')
	if( mirrorDomElements === undefined )	mirrorDomElements = []
	if( mirrorDomElements instanceof Array === false )	mirrorDomElements = [mirrorDomElements]	

	// Mirror _this.domElement.style to mirrorDomElements
	mirrorDomElements.forEach(function(domElement){
		_this.copyElementSizeTo(domElement)
	})
}

THREEx.ArToolkitSource.prototype.copyElementSizeTo = function(otherElement){
	otherElement.style.width = this.domElement.style.width
	otherElement.style.height = this.domElement.style.height	
	otherElement.style.marginLeft = this.domElement.style.marginLeft
	otherElement.style.marginTop = this.domElement.style.marginTop
}

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////

THREEx.ArToolkitSource.prototype.copySizeTo = function(){
	console.warn('obsolete function arToolkitSource.copySizeTo. Use arToolkitSource.copyElementSizeTo' )
	this.copyElementSizeTo.apply(this, arguments)
}

THREEx.ArToolkitSource.prototype.onResize = function(){
	console.warn('obsolete function arToolkitSource.onResize. Use arToolkitSource.onResizeElement' )
	this.onResizeElement.apply(this, arguments)
}

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////

THREEx.ArToolkitSource.prototype.onResize2	= function(arToolkitContext, renderer, camera){
	var trackingBackend = arToolkitContext.parameters.trackingBackend

	// RESIZE DOMELEMENT
	if( trackingBackend === 'artoolkit' ){

		this.onResizeElement()
		
		var isAframe = renderer.domElement.dataset.aframeCanvas ? true : false
		if( isAframe === false ){
			this.copyElementSizeTo(renderer.domElement)	
		}else{
			
		}

		if( arToolkitContext.arController !== null ){
			this.copyElementSizeTo(arToolkitContext.arController.canvas)	
		}
	}else if( trackingBackend === 'aruco' ){
		this.onResizeElement()
		this.copyElementSizeTo(renderer.domElement)	

		this.copyElementSizeTo(arToolkitContext.arucoContext.canvas)	
	}else if( trackingBackend === 'tango' ){
		renderer.setSize( window.innerWidth, window.innerHeight )
	}else console.assert(false, 'unhandled trackingBackend '+trackingBackend)


	// UPDATE CAMERA
	if( trackingBackend === 'artoolkit' ){
		if( arToolkitContext.arController !== null ){
			camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );			
		}
	}else if( trackingBackend === 'aruco' ){	
		camera.aspect = renderer.domElement.width / renderer.domElement.height;
		camera.updateProjectionMatrix();			
	}else if( trackingBackend === 'tango' ){
		var vrDisplay = arToolkitContext._tangoContext.vrDisplay
		// make camera fit vrDisplay
		if( vrDisplay && vrDisplay.displayName === "Tango VR Device" ) THREE.WebAR.resizeVRSeeThroughCamera(vrDisplay, camera)
	}else console.assert(false, 'unhandled trackingBackend '+trackingBackend)	
}
