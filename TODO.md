## New API

- build a aframe version of that to see how it fit
  - when api is stable enougth ?
  - when all the bugs are sorted out
    - currently only something about displaying point cloud in tango - very minor

- Check it works on all cases
  - no special cases incompatibilities
  - changeMatrixMode
  - tango point cloud fails in cameraTransformMatrix

- move three.js/arjs-.js in three.js/src/newApi/
- later rename file/class
  - move all THREEx for ar.js as ARjs.
  - remove artoolkit in the name when it is multi backend
  - require to check/change all code 
  - can i do a compatibility layer for all the classes
  - thus it is only about changing the files

- how to handle trackingMethod
  - area-aruco
  - area-artoolkit
  - aruco
  - artoolkit
  - tango
  - arkit
  - best

- DONE pick real world with all trackingMethod
  - hit tester with plane
- DONE button tangoonly pointcloudtoggle
- DONE full markers area
  - THREEx.ArMultiMarkerUtils
  - button - reset-markers-area
  - button - toggle-marker-helper
  - button - goto-learner
- DONE tango point cloud visible


## New API - no three.js dependancy
- first remove it externally
- then remove it internally
- get ride of three.js dependancy 
  - first arjs session API not to use any three.js specific
  - vector3 as array, same for quaternion
  - some matrix as array too - projection matrix, localMatrix
- as im rewriting the highlevel API, im thinking about removing the three.js 
  dependancy. aka to make AR.js easily usable by other than three.js
  this could be osg.js (sketchfab stuff), this could be babylon.js
  this would clean things up and this isnt too hard to do on my side.
  Just using another math library and to do some THREE.Object3d emulation
- use gl-matrix.js - it is good code - it is from somebody rigurous - it is well maintained
- ARjs.Camera inherit from ARjs.Object3D - projectionMatrix
- ARjs.Object3D : position, quaternion, scale


--- 
- remove the arcode generator + marker generator, now that they are in webxr.io
- move docs/ into its own repository
  - thus no conflict with main repo
  - and it is considered secondery
- have seen stuff about projection matrix in jsartoolkit
  - would need to recompiled
  - would fix the near/far
  - maybe i can understand the camera calibration number
  - a pure-js to read camera calibration file would be good
  - ```ARdouble farPlane = 1000.0;``` in emscripten/ARToolKitJS.cpp
  - what about replacing it directly in artoolkit.min.js ? it should contain it somewhere
    - ```this.setProjectionFarPlane(1000)```
  - what if i set farPlane in js before everything
    - check if the value in the projection matrix change
  - this update the project matrix
  - ```arglCameraFrustum(&((arc->paramLT)->param), arc->nearPlane, arc->farPlane, arc->cameraLens);```
  - this should be called in setNearPlane
  - TRY TO MODIFY THE JS DIRECTLY ?

- do test with a special webrtc emulation layer
  - so i can download video and/or image - better for testing
- handle pwa stuff - useful for phone
  - some work done in webar-playground
  - https://twitter.com/jerome_etienne/status/888008537984708608

# aframe-ar.js new
- there is a resize every 1/60 seconds ??
- test on mobile
- aframe-ar.js new version
  - support smoother 
  - support multi marker - so augmented-website
  - fixed resize
- resize doesnt support portraiting a landscape ? still true?
- how to handle the parameters
  - i need to have the profile
  - still it should be possible to change parameteres to offer flexibility
- support multi trackingBackend
  - do a aruco example

---
- port webvr-arbackend
  - one example to read webvr data and display them in html
  - then a full example of 3d webvr tracking
  - in desktop and in tango 

- rename THREEx.ArToolkitContext.getProjectionMatrix into .getArtoolkitProjectMatrix
- make multi-marker without page reload

---
  
- DONE make multi-markers to support aruco too
  - add arBackend in learner.html input
  - handle arBackend definition in player.html
- DONE add modelViewMatrix and a smoother in AR.js example ?
  - what would be a good example for aruco feature in ar.js
  - yep add that because this is like the default now
- DONE ArMarkerControls.markerId is artoolkit specific
  - to rename artoolkitMarkerId for now
- DONE ArToolkitContext.projectionAxisTransformMatrix is only to correct artoolkit axis
  - it is a kludge to start with
  - make it as contained as possible
  - maybe cached in a ARtoolkit specific function
  - projectionAxisTransformMatrix renamed as artoolkitprojectionAxisTransformMatrix
  - simple, no risk and make it clear it is artoolkit - 
- DONE in trackingbackend-switch put the backend in hash. and offer to switch
  - good for testing
- DONE all this testing about aruco or jsartoolkit it crappy
  - in artoolkitContext.backend === 'aruco' || 'artoolkit'
  - not very clear + timer to init jsartoolkit
  - so you keep the pointer to context for each. But you test all about the .backend = 'artoolkit'
- DONE arucocontext has the canvas at the moment - but dont respect the original canvasWidth
- DONE all the posit stuff MUST be out of aruco context and in controls
- DONE replace THREEx.ArMarkerControls.notifyFoundModelViewMatrix() by .updateWithModelViewMatrix()
- LATER: remove all the artoolkit mention in the front as is now multiple backends
  - you got classname with 'artoolkit' in it
  - even exposed in a-frame parameters
- NOT NOW: threex-aruco layer is really really thin - YET ANOTHER INDIRECTION
  - seems useless indirection for AR.js
  - why not aruco directly
  - you are using jsartoolkit directly
  - YES use aruco directly
  - threex-aruco is at the same level of jsartoolkit
    - keeping them at the same level will help make ar.js more consistent
  - threex-aruco provide standalone testing which is good
  - UNCLEAR at best - 

- can you make it easy to try all your demo with aruco
  - this means supporting aruco in webar-playground
  - so multi markers
  - may even be an option in the json localstorage learned area
  - thus it is easy to switch from one to another
  - the best way to put aruco as first player

- aruco seems the future
  - there is pure js implementation - readable code
  - there is a cpp implementation too
  - much smaller code
  - well documented code + algo
  - simple algo - easy to understand
  - not too big - i can maintain it myself
  - i got MUCH better controls over the code
  - this lead to ability to tune and experiments with the detection
  - the detection is the core of the business. it MUCH be under controls
  - still issue with homography
  - but can be easily fixed, compared to the huge advantage
  

---
# TODO
- if artoolkit arbackend and marker facing camera, then change the tweening
  - specific fix to artoolkit
- TODO super unclear how to get the backward facing camera...

- currently webvr is able to do location already
  - why wouldnt i code it all in webvr location, without the stereo rendering
  - well it is too early. it is better to make it easier to reuse.
  - webvr tango isnt mature enougth


- release soon and start doing dev/master
  - create a dev branch
  - release AR.js as 1.2
  - what about the communication ?
  - make a post on what is new in AR.js
  - ISSUE: i need to deploy dev on gh-pages it helps with https during dev

- redo parameters-tuning.html
  - all parameters exposed as button - stored as json in url
  - to replace the demo.html in a-frame - which is super broken anyway
  - 3 groups of parameters : source, context, controls. make it 3 group on screen too

---

- do the initial tunning of camera resolution to have the same aspect as the screen resolution
  - better precision for my cpu
  - currently it is doing 640x480 by default
  - as it is supposed to be fullscreen, get the screen resolution, instead of the window resolution
    - thus no resize being late issue

---

- DONE do a pass on THREEx.ArToolkitSource
  - IOS support - https://github.com/jeromeetienne/AR.js/issues/90
  - support for torch - https://www.oberhofer.co/mediastreamtrack-and-its-capabilities/
  - use the new getUserMedia API with envfacing api - see IOS bugs
- DONE update link in README.md
- DONE THREEx.ArToolkitSource.prototype.onResize
  split it in 
  THREEx.ArToolkitSource.prototype.mirrorSizeTo(blabla)
- DONE Race conditions in resize
  - arToolkitSource.onResize([renderer.domElement, arToolkitContext.arController.canvas])
  - fails if arToolkitContext.arController not ready
  - change this code, and port is EVERYWHERE :)
- DONE rename marker generator as marker-training - just because it is what artoolkit said before
  - maybe creator ? 
  - training is the same word as before, and seems to do something smart
- DONE do something to upload marker from image directly instead of .patt
  - this avoid the pain of handling .patt files
  - so get the image encoding it, and then do a dataurl
  - as the data is image
- DONE THREEx.ArSmoothedControls.minVisibleDelay to 0 ?
  - why would it be worst to show the marker, than to hide it ? 
- DONE bug in resize + debug in context
  - API is still crap tho
- DONE do the tweening + disapearance with timeout in threex-armarkersmoother.js
  - this is a controls which read a armarkercontrols and output a new smoothed root
  - make a possible delay in the appearance and disapearance
- DONE put armarkerhelper else where
- DONE do a threex.armarkershelper.js something which display info on the marker
  - which pattern, etc...
  - an axis too
  - like you did in threex.arealearning.js
  - if controls.parameters.helperEnabled: true, then the controls will add the helper automatically


- about.me in ar - augmented.club - augmented.whoswho - augmented.cat - augmented.fans - ar.codes
  - multiple link
  - twitter, avatar, linkedin, facebook
  - all stored in the url. so all the states is in the network
  - avatar at the center, each link graviting around, with exploding entrance like in https://vimeo.com/6264709
  - minimal: twitter avatar, username, twitter logo
  - twitter logo model - https://sketchfab.com/models/60aedf8d974d481995e196225fb0bd2e
  - logo in voxel ? https://sketchfab.com/models/8da01234347a4193b06f0b2f07113d40
  - sketchfab logo - https://sketchfab.com/models/585ace7e32b44d93bb1cecb456488934
  - gravatar from the email - http://en.gravatar.com/site/implement/hash/

- release ar.js
  - start working in dev branch
  - more frequent release.

- moving three.js/ at the root ?
  - it seems more natural. But there is no emergency
  - webvr and aframe in their own repository now that it is more stable ?

- for refraction, do some deforming mirror effect
  - put dat.gui in it
  - various shape which will act as mirrors
  - cylinder with shrinked middle, dilated middle
  - animated geometry ?

- see about an example of videoinwebgl + vreffect
- work on the stereo thing - make the webvr stuff
  - suddently your demo would work on any webvr device
  - does this work if i port video-in-webvr into aframe ? what if we go in webvr mode ?

- what to do with profile
  - should it be the default ?
  - at least on a-frame it should be the default because it is targeted at easy
  - by default, the setting should be the most common one. 
  - aka the one of a phone

- "Augmented Reality in WebVR" as WebVR experiments... It has a nice twist that 
  i like :)  http://www.blog.google/products/google-vr/come-play-webvr-experiments/

- DONE fix the multimarker and the symlink - it prevents updating ar.js gh-pages
- DONE add show/hide into arcode.html url
  - thus the apps workflow is finished
- DONE do a build file
  threejs/build/ar.js
  threejs/build/ar.min.js

- DONE re-integrate dead reckoning
  - rename motion prediction into deadreckoningcontrols - more precise
- DONE put THREEx.ArToolkitContext.baseURL = '../' in all demo
- DONE add fish in pool hole-in-the-wall
  - https://blog.int3ractive.com/2012/05/fish-boids-threejs-demo.html
- DONE put liquid marker as a single html
  - or a directory, no need to be dirty
- DONE liquid-table.html
  - video texture + animation of sin 
  - center of finger click is the center of the wave
  - it can be water wave
  - it can be fluild real 
  - integrate physics from real finger
  - it can be like the finger in matrix - https://www.youtube.com/watch?v=b2MSF35IxVE&feature=youtu.be&t=98
  - http://mrdoob.com/lab/javascript/webgl/voxels_liquid/index.html

  


# webvr-polyfill
- GOAL: works well using only the positional tracking, not the stereo display
  - thus it works well with all three.js examples
- handle resize - currently the canvas isnt using the css it should
  - canvas is sent to the webvr with .requestPresent(layer)
- webvr polyfill to present in single screen - like smus/webvr-polyfill
  - look at his tuning and do the same
  - just do the call on the webvr-polyfill and see his framedata and all
- issue with the projection matrix being inverse in y and z
- LATER: make it work with a-frame

# Profile
- do a threex-artoolkitprofile.js with various performance profile
  - var arToolKitProfile = new THREEx.ARToolKitProfile(type)
  - may be dynamic - for resolution - 'dynamic'
  - type = 'phoneInHand' || 'desktop'
  - thus the user can go a in profiler.html and try various profiles until he find the one he needs
  - then we store that in a cookie, and other applications all use this profile
  - cookie/localstorage makes it stored on the browser, need one profiler per domain tho
  - but no database and no authentication needed
- DONE artoolkit-profile.html to store the profile in localstorage
  - it allows you to select which profile you like
  - it has a <select> and store it in the storage - desktop-normal - phone-normal - phone-slow - dynamic
  - in ctor, if there is a local storage use this

# TODO
- DONE fix projection camera which inversing y axis, and looking toward positive z
  - this affect webvr polyfill in three.js demo
- currently the source image ratio is always in 640x480 :(
  - the aspect of the webcam should depends on the screens
  - it will improve the accuracy of the marker detection. trackable from further away

# Idea about performance - js profiling
- do it on canary. this is the most advanced tool for that
  - POST: optimising AR.js with chromedevtools
- more than 70% of the time is used to copy the image in the HEAP
  - .drawImage, .getImageData
  - this.dataHeap.set( data ) is 43% of the total
  - if i can send just a pointer on the data... i gain 43% in one shot
- performance remove copy to heap
  - http://kapadia.github.io/emscripten/2013/09/13/emscripten-pointers-and-pointers.html
  - this explains how to pass a pointer from a typearray to c++ 
  - this would avoid the dataHeap.set() - 43%
