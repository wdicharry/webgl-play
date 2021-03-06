
function RenderManager() {
    var container,
        renderer,
        scene,
        camera,
        mesh,
        shaderContent = {},
        start = Date.now(),
        fov = 30;

    function loadShader(type, url) {
        return $.ajax({
            url: url,
            dataType: "text",
        });
    }

    function init() {
        $.when(
            loadShader("vertex", "vertex.glsl"),
            loadShader("fragment", "fragment.glsl")
        ).then(function (vertexShader, fragmentShader) {
            shaderContent["vertex"] = vertexShader[0];
            shaderContent["fragment"] = fragmentShader[0];
            enterRenderLoop();
        });
    }

    function enterRenderLoop() {
        container = document.getElementById("container");

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
            fov,
            window.innerWidth / window.innerHeight,
            1,
            10000
        );
        camera.position.z = 100;
        camera.target = new THREE.Vector3(0, 0, 0);

        scene.add(camera);

        material = new THREE.ShaderMaterial({
            vertexShader: shaderContent["vertex"],
            fragmentShader: shaderContent["fragment"]
        });

        mesh = new THREE.Mesh(
            new THREE.IcosahedronGeometry(20, 4),
            material
        );
        scene.add(mesh);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        render();
    }

    function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    return {
        init: init
    }
}
