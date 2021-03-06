var container;
var camera, controls, scene, projector, renderer;
var objects = [], plane;
var pointLight;////

var mouse = new THREE.Vector2(), 
            offset = new THREE.Vector3(), 
            INTERSECTED, 
            SELECTED, 
            light_offset = new THREE.Vector3(),////
            LIGHT_INTERSECTED,////
            LIGHT_SELECTED;////

init();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(25, window.innerWidth/window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 1000); //camera.position.z = 1000;

    controls = new THREE.TrackballControls(camera);    
    ////////////////////////////////////////////////
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    ////////////////////////////////////////////////

    scene = new THREE.Scene();
    
    // Lights

    var ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(100, 100, 100);
    //scene.add(directionalLight);

    //var pointLight = new THREE.PointLight(0xffffff);
    pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(100, 100, 100);
    scene.add(pointLight);
    
    ////////////////////////////////////
    //objects.push(pointLight);
    ////////////////////////////////////

    // Sphere

    var geometry = new THREE.SphereGeometry(100, 100, 100);
    var material = new THREE.MeshLambertMaterial({color: 0x660000, 
                                              shading: THREE.FlatShading, 
                                              overdraw: true});        

    var sphere = new THREE.Mesh(geometry, material);

    scene.add(sphere);
    
    // Little cube pointing to the light
    var pointGeometry = new THREE.CubeGeometry(10, 10, 10);    
    
    var pointMaterial = new THREE.MeshLambertMaterial({color: 0xDAA520, 
                                              shading: THREE.FlatShading, 
                                              overdraw: true});                                              

    var point = new THREE.Mesh(pointGeometry, pointMaterial);    
    point.position.set(pointLight.position.x, pointLight.position.y, pointLight.position.z);
    //////////////////////////////////////////
    point.material.ambient = point.material.color;
    point.castShadow = true;
    point.receiveShadow = true;
    //////////////////////////////////////////
    scene.add(point);
       
    ////////////////////////////////////////////   
    objects.push(point);
    ////////////////////////////////////////////
       
    ////////////////////////////////////////////////
    plane = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000, 20, 20), 
                           new THREE.MeshBasicMaterial({color: 0x000000, 
                                                        opacity: 0.5, 
                                                        transparent: false, 
                                                        wireframe: false}));
    plane.visible = true;
    scene.add(plane);

    projector = new THREE.Projector();
    ///////////////////////////////////////////////    
    
    // Renderer
    renderer = new THREE.CanvasRenderer();
    //renderer = new THREE.WebGLRenderer({antialias: true});
    ///////////////////////////////////////////////
    renderer.sortObjects = false;
    ///////////////////////////////////////////////
    renderer.setSize(window.innerWidth*0.9, window.innerHeight*0.9);
    
    //////////////////////////////////////////////
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFShadowMap;
    //////////////////////////////////////////////

    container.appendChild(renderer.domElement);
    
    /////////////////////////////////////////////
    renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
    renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
    /////////////////////////////////////////////
    
    //
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth*0.9, window.innerHeight*0.9);
}

//////////////////////////////////////////////////////
function onDocumentMouseDown(event) {
    event.preventDefault();

    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    projector.unprojectVector(vector, camera);

    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {
        controls.enabled = false;

        SELECTED = intersects[0].object;
        
        LIGHT_SELECTED = pointLight;////

        var intersects = raycaster.intersectObject(plane);
        offset.copy(intersects[0].point).sub(plane.position);

        container.style.cursor = 'move';
    }
}

function onDocumentMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX/(window.innerWidth*0.9))*2-1;
    mouse.y = -(event.clientY/(window.innerHeight*0.9))*2+1;

    //
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    projector.unprojectVector(vector, camera);

    var raycaster = new THREE.Raycaster(camera.position, 
                                        vector.sub(camera.position).normalize());

    if (SELECTED) {
        var intersects = raycaster.intersectObject(plane);
        SELECTED.position.copy(intersects[0].point.sub(offset));
        LIGHT_SELECTED.position.copy(intersects[0].point.sub(offset));////
        return;
    }

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0){
        if (INTERSECTED != intersects[0].object){
            if (INTERSECTED){ 
                INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
                LIGHT_INTERSECTED.material.color.setHex(LIGHT_INTERSECTED.currentHex);////
            }
            INTERSECTED = intersects[0].object;
            LIGHT_INTERSECTED = pointLight;////
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();            
            LIGHT_INTERSECTED.currentHex = LIGHT_INTERSECTED.material.color.getHex();////
            plane.position.copy(INTERSECTED.position);
            //plane.position.copy(LIGHT_INTERSECTED.position);
            plane.lookAt(camera.position);
        }
        container.style.cursor = 'pointer';
    } else {
        if (INTERSECTED){
            INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
            LIGHT_INTERSECTED.material.color.setHex(LIGHT_INTERSECTED.currentHex);////
        }
        INTERSECTED = null;
        LIGHT_INTERSECTED = null;////
        container.style.cursor = 'auto';
    }
}

function onDocumentMouseUp(event){
    event.preventDefault();

    controls.enabled = true;

    if (INTERSECTED){
        //plane.position.copy(INTERSECTED.position);
        //plane.position.copy(LIGHT_INTERSECTED.position);
        SELECTED = null;
        LIGHT_SELECTED = null;////
    }
    container.style.cursor = 'auto';
}

//////////////////////////////////////////////////////

//
function animate() {
    requestAnimationFrame(animate);
    render();
}

//
function render() {
    controls.update();
    renderer.render(scene, camera);
}


