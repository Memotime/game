var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}setTimeout(function () {
  var cbrtBoidsCount = 32;
  var boidSize = 1;
  var simulationOptions = {
    neighborhoodRadius: 2,
    sortIterations: 2,
    separationRadius: 60,
    cohesionRadius: 50,
    alignmentRadius: 40,
    speedLimit: 0.5,
    initialPositionScaling: 200,
    alignmentForceFactor: 0.05,
    cohesionForceFactor: 0.024,
    separationForceFactor: 30 };

  var sortVis = new SortVis(cbrtBoidsCount, 0.5, 0.25); // size, pointSize
  var axisHelper = new THREE.AxisHelper(5);
  var boidsApiary = new BoidsApiary(cbrtBoidsCount, boidSize, 4, 0);
  var simulation = new Simulation('js-app', [axisHelper, boidsApiary], [28, 36, -64]); // domNode, entities, [cameraX, cameraY, cameraZ]
  var generateSortingTexture = sortingGenerator(cbrtBoidsCount, simulation.renderer, simulationOptions);
  simulation.addUpdateCallback(function (timeDelta) {
    var boidTextures = generateSortingTexture(timeDelta);
    sortVis.ctValues = boidTextures.position;
    boidsApiary.positionTexture = boidTextures.position;
    boidsApiary.velocityTexture = boidTextures.velocity;
  });
}, 0);

var boidsPositionShader = function boidsPositionShader() {return '\nuniform sampler2D uPositionTexture;\nuniform sampler2D uVelocityTexture;\n\nvoid main () {\n  vec2 uv = gl_FragCoord.xy / resolution.xy;\n  vec3 position = texture2D(uPositionTexture, uv).xyz;\n  vec3 velocity = texture2D(uVelocityTexture, uv).xyz;\n  float type = texture2D(uPositionTexture, uv).w;\n  gl_FragColor = vec4(position + velocity, type);\n}\n';};












var boidsVelocityShader = function boidsVelocityShader(cbrtBoidsCount, simulationOptions, neighborhoodRadius) {return '\nuniform float uTime;\nuniform sampler2D uPositionTexture;\nuniform sampler2D uVelocityTexture;\nconst float SPEED_LIMIT = ' +



  simulationOptions.speedLimit.toFixed(Math.max(1, ('' + simulationOptions.speedLimit).length - 2)) + ';\nconst float COHESION_RADIUS = ' +
  simulationOptions.cohesionRadius.toFixed(Math.max(1, ('' + simulationOptions.cohesionRadius).length - 2)) + ';\nconst float ALIGNMENT_RADIUS = ' +
  simulationOptions.alignmentRadius.toFixed(Math.max(1, ('' + simulationOptions.alignmentRadius).length - 2)) + ';\nconst float SEPARATION_RADIUS = ' +
  simulationOptions.separationRadius.toFixed(Math.max(1, ('' + simulationOptions.separationRadius).length - 2)) + ';\nconst float COHESION_FORCE_FACTOR = ' +
  simulationOptions.cohesionForceFactor.toFixed(Math.max(1, ('' + simulationOptions.cohesionForceFactor).length - 2)) + ';\nconst float ALIGNMENT_FORCE_FACTOR = ' +
  simulationOptions.alignmentForceFactor.toFixed(Math.max(1, ('' + simulationOptions.alignmentForceFactor).length - 2)) + ';\nconst float SEPARATION_FORCE_FACTOR = ' +
  simulationOptions.separationForceFactor.toFixed(Math.max(1, ('' + simulationOptions.separationForceFactor).length - 2)) + ';\nconst int CBRT_BOIDS_COUNT = ' +
  cbrtBoidsCount + ';\nconst int NEIGHBORHOOD_RADIUS = ' +
  neighborhoodRadius + ';\nconst int NEIGHBORHOOD_DIAMETER = ' +
  neighborhoodRadius * 2 + ';\n\n' +

  document.getElementById('js-noise-3d-shader').textContent + '\n\nvec2 getTextureUv (int colIndex, int rowIndex, int pageIndex) {\n  return vec2(float(colIndex) / float(CBRT_BOIDS_COUNT), float(pageIndex * CBRT_BOIDS_COUNT + rowIndex) / float(CBRT_BOIDS_COUNT * CBRT_BOIDS_COUNT));\n}\n\nfloat getBoidType (int colIndex, int rowIndex, int pageIndex) {\n  vec2 coords = getTextureUv(colIndex, rowIndex, pageIndex);\n  return texture2D(uVelocityTexture, coords).w;\n}\n\nvec3 getBoidPosition (int colIndex, int rowIndex, int pageIndex) {\n  vec2 coords = getTextureUv(colIndex, rowIndex, pageIndex);\n  return texture2D(uPositionTexture, coords).xyz;\n}\n\nvec3 getBoidVelocity (int colIndex, int rowIndex, int pageIndex) {\n  vec2 coords = getTextureUv(colIndex, rowIndex, pageIndex);\n  return texture2D(uVelocityTexture, coords).xyz;\n}\n\nvec3 calculateBoidForces (vec3 boidPosition, vec3 boidVelocity, int colIndex, int rowIndex, int pageIndex) {\n  vec3 perceivedCenter = vec3(0.0, 0.0, 0.0);\n  vec3 separationSum = vec3(0.0, 0.0, 0.0);\n  vec3 perceivedDirection = vec3(0.0, 0.0, 0.0);\n  int cohesionNeighborCount = 0;\n  int separationNeighborCount = 0;\n  int alignmentNeighborCount = 0;\n  for (int z = 0; z < NEIGHBORHOOD_DIAMETER; z++) {\n    for (int y = 0; y < NEIGHBORHOOD_DIAMETER; y++) {\n      for (int x = 0; x < NEIGHBORHOOD_DIAMETER; x++) {\n        if (colIndex == x && rowIndex == y && pageIndex == z) {\n          continue;\n        }\n        int xPos = colIndex + (x - NEIGHBORHOOD_RADIUS);\n        int yPos = rowIndex + (y - NEIGHBORHOOD_RADIUS);\n        int zPos = pageIndex + (z - NEIGHBORHOOD_RADIUS);\n        if (xPos < 0 || yPos < 0 || zPos < 0 || xPos >= CBRT_BOIDS_COUNT || yPos >= CBRT_BOIDS_COUNT || zPos >= CBRT_BOIDS_COUNT) {\n          continue;\n        }\n        vec3 otherBoidPosition = getBoidPosition(xPos, yPos, zPos);\n        vec3 otherBoidVelocity = getBoidVelocity(xPos, yPos, zPos);\n        float gap = length(otherBoidPosition - boidPosition);\n        if (gap > 0.0) {\n          if (gap < COHESION_RADIUS) {\n            cohesionNeighborCount += 1;\n            perceivedCenter += otherBoidPosition;\n          }\n          if (gap < ALIGNMENT_RADIUS) {\n            perceivedDirection += otherBoidVelocity;\n            alignmentNeighborCount += 1;\n          }\n          if (gap < SEPARATION_RADIUS) {\n            separationSum += normalize(boidPosition - otherBoidPosition) / gap;\n            separationNeighborCount += 1;\n          }\n        }\n      }\n    }\n  }\n  vec3 cohesion = vec3(0.0, 0.0, 0.0);\n  vec3 separation = vec3(0.0, 0.0, 0.0);\n  vec3 alignment = vec3(0.0, 0.0, 0.0);\n  if (cohesionNeighborCount > 0) {\n    cohesion = ((perceivedCenter / float(cohesionNeighborCount)) - boidPosition) * COHESION_FORCE_FACTOR; // 700, refactor, magic number\n  }\n  if (separationNeighborCount > 0) {\n    separation = ((separationSum / float(separationNeighborCount)) * SEPARATION_FORCE_FACTOR); // 20, refactor, magic number\n  }\n  if (alignmentNeighborCount > 0) {\n    alignment = (((perceivedDirection / float(alignmentNeighborCount)) - boidVelocity) * ALIGNMENT_FORCE_FACTOR); // 30 refactor, magic number\n  }\n  vec3 ret = vec3(0.0, 0.0, 0.0);\n  ret += separation;\n  ret += alignment;\n  ret += cohesion;\n  return ret;\n}\n\nvec3 limitVelocity (vec3 vel, float maxSpeed) {\n  float speed = min(length(vel), maxSpeed);\n  return vel * (speed / length(vel));\n}\n\nvec3 wind (vec3 boidPosition) {\n  float noiseScale = 0.008;\n  vec3 samplePoint = boidPosition * noiseScale;\n  float time = uTime * 0.2;\n  float windStrength = 2.0;\n  float xNoise = snoise(vec4(samplePoint + 300.0, time));\n  float yNoise = snoise(vec4(samplePoint + 500.0, time));\n  float zNoise = snoise(vec4(samplePoint + 700.0, time));\n  return vec3(xNoise, yNoise, zNoise) * windStrength;\n}\n\nvoid main () {\n  int colIndex = int(gl_FragCoord.x);\n  int rowIndex = int(mod(gl_FragCoord.y, resolution.x));\n  int pageIndex = int(floor(gl_FragCoord.y / resolution.x));\n  vec3 boidPosition = getBoidPosition(colIndex, rowIndex, pageIndex);\n  vec3 boidVelocity = getBoidVelocity(colIndex, rowIndex, pageIndex);\n  vec3 newVel = boidVelocity;\n  newVel *= 0.8;\n  newVel += calculateBoidForces(boidPosition, boidVelocity, colIndex, rowIndex, pageIndex);\n  newVel += wind(boidPosition);\n  newVel += vec3((vec3(0.0, 0.0, 0.0) - boidPosition) / 3000.0); // refactor, magic number\n  newVel = limitVelocity(newVel, SPEED_LIMIT);\n  float type = getBoidType(colIndex, rowIndex, pageIndex);\n  gl_FragColor = vec4(newVel, type);\n}\n';};















































































































var sortingFragmentShader = function sortingFragmentShader() {return '\nuniform float uIteration;\nuniform sampler2D uPositionTexture;\nuniform sampler2D uInputTexture;\n\nbool applyRules (bool checkPrevious, vec3 current, vec3 reference) {\n  if (checkPrevious) {\n    if (current.x > reference.x) {\n      return true;\n    }\n    if (current.x == reference.x && current.y > reference.y) {\n      return true;\n    }\n    if (current.x == reference.x && current.y < reference.y && current.z > reference.z) {\n      return true;\n    }\n  } else {\n    if (current.x < reference.x) {\n      return true;\n    }\n    if (current.x == reference.x && current.y < reference.y) {\n      return true;\n    }\n    if (current.x == reference.x && current.y > reference.y && current.z < reference.z) {\n      return true;\n    }\n  }\n  return false;\n}\n\nvoid main () {\n  int directionPhase = int(mod(floor(uIteration / 2.0), 3.0));\n  vec2 coord = gl_FragCoord.xy;\n  vec2 uv = coord / resolution.xy;\n  vec4 currentValue = texture2D(uInputTexture, uv);\n  vec4 currentPosition = texture2D(uPositionTexture, uv);\n  float phaseCheck = coord.x;\n  vec2 pixelOffset = vec2(-1.0, 0.0); // left\n  if (directionPhase == 1) {\n    phaseCheck = mod(coord.y, resolution.x);\n    pixelOffset = vec2(0.0, -1.0); // down\n  }\n  if (directionPhase == 2) {\n    phaseCheck = floor(coord.y / resolution.x);\n    pixelOffset = vec2(0.0, -resolution.x); // out\n  }\n  bool checkPrevious = mod(phaseCheck + uIteration, 2.0) < 1.0;\n  vec2 pixel = pixelOffset / resolution.xy;\n  vec2 refUvCoord = checkPrevious ? uv - pixel : uv + pixel;\n  vec4 referencePosition = texture2D(uPositionTexture, refUvCoord);\n  vec4 referenceValue = texture2D(uInputTexture, refUvCoord);\n  vec2 refCoord = checkPrevious ? coord - pixelOffset : coord + pixelOffset;\n  int currentPage = int(floor(coord.y / resolution.x));\n  int referencePage = int(floor(refCoord.y / resolution.x));\n  vec4 outputColor = currentValue;\n  bool keepsCubeIsolated = referencePage >= 0 && referencePage < int(resolution.x);\n  bool keepsPageIsolated = currentPage == referencePage;\n  if ((directionPhase == 2 || keepsPageIsolated) && keepsCubeIsolated) {\n    if (directionPhase == 0 && applyRules(checkPrevious, currentPosition.xyz, referencePosition.xyz)) {\n      outputColor = referenceValue;\n    }\n    if (directionPhase == 1 && applyRules(checkPrevious, currentPosition.yzx, referencePosition.yzx)) {\n      outputColor = referenceValue;\n    }\n    if (directionPhase == 2 && applyRules(checkPrevious, currentPosition.zxy, referencePosition.zxy)) {\n      outputColor = referenceValue;\n    }\n  }\n  gl_FragColor = outputColor;\n}\n';};







































































function sortingGenerator(cbrtCount, renderer, simulationOptions) {
  var width = cbrtCount;
  var height = cbrtCount;
  var depth = cbrtCount;
  var gpuCompute = new GPUComputationRenderer(width, height * depth, renderer);
  var uPositionTexture = gpuCompute.createTexture();
  var uVelocityTexture = gpuCompute.createTexture();
  for (var i = 0; i < width * height * depth; i++) {
    var _index = i * 4;
    var x = i % width;
    var y = Math.floor(i / width) % height;
    var z = Math.floor(i / (height * height));
    var xFactor = ((-width + 1.0) * 3.0 / 2.0 + x * 3.0) / width;
    var yFactor = ((-height + 1.0) * 3.0 / 2.0 + y * 3.0) / height;
    var zFactor = ((-depth + 1.0) * 3.0 / 2.0 + z * 3.0) / depth;
    uPositionTexture.image.data[_index + 0] = xFactor * simulationOptions.initialPositionScaling;
    uPositionTexture.image.data[_index + 1] = yFactor * simulationOptions.initialPositionScaling;
    uPositionTexture.image.data[_index + 2] = zFactor * simulationOptions.initialPositionScaling;
    uPositionTexture.image.data[_index + 3] = x / width;
    uVelocityTexture.image.data[_index + 0] = 0;
    uVelocityTexture.image.data[_index + 1] = 0;
    uVelocityTexture.image.data[_index + 2] = 0;
    uVelocityTexture.image.data[_index + 3] = 1 - z / depth;
  }
  var boidsVelocityFilter = gpuCompute.createShaderMaterial(boidsVelocityShader(cbrtCount, simulationOptions, simulationOptions.neighborhoodRadius), {
    uPositionTexture: { value: null },
    uVelocityTexture: { value: null },
    uTime: { value: 0 } });

  var boidsPositionFilter = gpuCompute.createShaderMaterial(boidsPositionShader(), {
    uPositionTexture: { value: null },
    uVelocityTexture: { value: null } });

  var boidsSortFilter = gpuCompute.createShaderMaterial(sortingFragmentShader(), {
    uPositionTexture: { value: null },
    uInputTexture: { value: null },
    uIteration: { value: 0 } });

  var boidsPositionSortRenderTargets = [
  gpuCompute.createRenderTarget(),
  gpuCompute.createRenderTarget()];

  var boidsVelocitySortRenderTargets = [
  gpuCompute.createRenderTarget(),
  gpuCompute.createRenderTarget()];

  var boidsVelocityRenderTargets = [
  gpuCompute.createRenderTarget(),
  gpuCompute.createRenderTarget()];

  var boidsPositionRenderTargets = [
  gpuCompute.createRenderTarget(),
  gpuCompute.createRenderTarget()];

  gpuCompute.renderTexture(uVelocityTexture, boidsVelocityRenderTargets[0]);
  gpuCompute.renderTexture(uPositionTexture, boidsPositionRenderTargets[0]);
  var index = 0;
  var nextIndex = 1;
  var tmpIndex = void 0;
  var sortIndex = 0;
  var sortNextIndex = 1;
  var sortTmpIndex = void 0;
  return function (timeDelta) {
    boidsVelocityFilter.uniforms.uVelocityTexture.value = boidsVelocityRenderTargets[index].texture;
    boidsVelocityFilter.uniforms.uPositionTexture.value = boidsPositionRenderTargets[index].texture;
    gpuCompute.doRenderTarget(boidsVelocityFilter, boidsVelocityRenderTargets[nextIndex]);
    boidsVelocityFilter.uniforms.uTime.value += timeDelta / 1000;
    boidsPositionFilter.uniforms.uVelocityTexture.value = boidsVelocityRenderTargets[nextIndex].texture;
    boidsPositionFilter.uniforms.uPositionTexture.value = boidsPositionRenderTargets[index].texture;
    gpuCompute.doRenderTarget(boidsPositionFilter, boidsPositionRenderTargets[nextIndex]);
    gpuCompute.renderTexture(boidsPositionRenderTargets[nextIndex].texture, boidsPositionSortRenderTargets[sortIndex]);
    gpuCompute.renderTexture(boidsVelocityRenderTargets[nextIndex].texture, boidsVelocitySortRenderTargets[sortIndex]);
    for (var _i = 0; _i < 6 * simulationOptions.sortIterations; _i++) {
      boidsSortFilter.uniforms.uPositionTexture.value = boidsPositionSortRenderTargets[sortIndex].texture;
      boidsSortFilter.uniforms.uInputTexture.value = boidsPositionSortRenderTargets[sortIndex].texture;
      gpuCompute.doRenderTarget(boidsSortFilter, boidsPositionSortRenderTargets[sortNextIndex]);
      boidsSortFilter.uniforms.uInputTexture.value = boidsVelocitySortRenderTargets[sortIndex].texture;
      gpuCompute.doRenderTarget(boidsSortFilter, boidsVelocitySortRenderTargets[sortNextIndex]);
      boidsSortFilter.uniforms.uIteration.value += 1;
      sortTmpIndex = sortIndex;
      sortIndex = sortNextIndex;
      sortNextIndex = sortTmpIndex;
    }
    gpuCompute.renderTexture(boidsPositionSortRenderTargets[sortIndex].texture, boidsPositionRenderTargets[nextIndex]);
    gpuCompute.renderTexture(boidsVelocitySortRenderTargets[sortIndex].texture, boidsVelocityRenderTargets[nextIndex]);
    tmpIndex = index;
    index = nextIndex;
    nextIndex = tmpIndex;
    return {
      position: boidsPositionRenderTargets[index].texture,
      velocity: boidsVelocityRenderTargets[index].texture };

  };
}var

BoidsApiary = function (_THREE$Mesh) {_inherits(BoidsApiary, _THREE$Mesh);
  function BoidsApiary(cbrtBoidCount, boidSize, rotationDuration, rotationMaxDelay) {_classCallCheck(this, BoidsApiary);
    var geometry = new BoidsApiaryGeometry(cbrtBoidCount, boidSize, rotationDuration, rotationMaxDelay);
    var material = new BoidsApiaryMaterial(rotationDuration, rotationMaxDelay);var _this = _possibleConstructorReturn(this, (BoidsApiary.__proto__ || Object.getPrototypeOf(BoidsApiary)).call(this,
    geometry, material));
    _this.frustumCulled = false;return _this;
  }_createClass(BoidsApiary, [{ key: 'positionTexture', set: function set(

    texture) {
      this.material.uniforms.uPositionTexture.value = texture;
    } }, { key: 'velocityTexture', set: function set(

    texture) {
      this.material.uniforms.uVelocityTexture.value = texture;
    } }, { key: 'time', set: function set(

    newTime) {
      this.material.uniforms.uTime.value = newTime;
    }, get: function get()

    {
      return this.material.uniforms.uTime.value;
    } }]);return BoidsApiary;}(THREE.Mesh);var


BoidsApiaryGeometry = function (_BAS$PrefabBufferGeom) {_inherits(BoidsApiaryGeometry, _BAS$PrefabBufferGeom);
  function BoidsApiaryGeometry(cbrtBoidCount, boidSize, rotationDuration, rotationMaxDelay) {_classCallCheck(this, BoidsApiaryGeometry);
    var geometry = new THREE.BoxGeometry(boidSize, boidSize, boidSize);var _this2 = _possibleConstructorReturn(this, (BoidsApiaryGeometry.__proto__ || Object.getPrototypeOf(BoidsApiaryGeometry)).call(this,
    geometry, cbrtBoidCount * cbrtBoidCount * cbrtBoidCount));
    _this2.computeVertexNormals(); // refactor, is this needed?
    _this2.bufferUvs(); // refactor, is this needed?
    _this2.assignProps(cbrtBoidCount, boidSize, rotationDuration, rotationMaxDelay);return _this2;
  }_createClass(BoidsApiaryGeometry, [{ key: 'assignProps', value: function assignProps(

    cbrtBoidCount, boidSize, rotationDuration, rotationMaxDelay) {
      var aRotation = this.createAttribute('aRotation', 4);
      var aDelayDuration = this.createAttribute('aDelayDuration', 2);
      var aRef = this.createAttribute('aRef', 2);
      var width = cbrtBoidCount;
      var height = cbrtBoidCount;
      var depth = cbrtBoidCount;
      for (var z = 0; z < depth; z++) {
        for (var y = 0; y < height; y++) {
          for (var x = 0; x < width; x++) {
            var index = z * (width * height) + y * width + x;
            this.setPrefabData(aRef, index, [// texture coordinates
            x / width,
            (z * height + y) / (height * depth)]);

            var rotation = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
            rotation.normalize(); // ew, not functional
            this.setPrefabData(aRotation, index, [].concat(_toConsumableArray(rotation.toArray()), [Math.PI * 2]));
            this.setPrefabData(aDelayDuration, index, [Math.random() * rotationMaxDelay, rotationDuration]);
          }
        }
      }
    } }]);return BoidsApiaryGeometry;}(BAS.PrefabBufferGeometry);var


BoidsApiaryMaterial = function (_BAS$StandardAnimatio) {_inherits(BoidsApiaryMaterial, _BAS$StandardAnimatio);
  function BoidsApiaryMaterial(rotationDuration, rotationMaxDelay) {_classCallCheck(this, BoidsApiaryMaterial);return _possibleConstructorReturn(this, (BoidsApiaryMaterial.__proto__ || Object.getPrototypeOf(BoidsApiaryMaterial)).call(this,
    {
      shading: THREE.StandardShading,
      side: THREE.FrontSide,
      uniforms: {
        uPositionTexture: { value: null },
        uVelocityTexture: { value: null },
        uSeed: { value: 5625463739 },
        uTime: { value: 0 },
        uDuration: { value: rotationDuration + rotationMaxDelay } },

      uniformValues: {},
      varyingParameters: [
      'varying vec3 vColor;'],

      vertexFunctions: [
      BAS.ShaderChunk['quaternion_rotation']],

      vertexParameters: ['\n          uniform sampler2D uPositionTexture;\n          uniform sampler2D uVelocityTexture;\n          uniform float uTime;\n          uniform float uDuration;\n          attribute vec2 aRef;\n          attribute vec4 aRotation;\n          attribute vec2 aDelayDuration;\n        '],










      vertexInit: ['\n          float time = mod(uTime, uDuration);\n          float tProgress = clamp(time - aDelayDuration.x, 0.0, aDelayDuration.y) / aDelayDuration.y;\n          vec4 tQuatOrient = quatFromAxisAngle(aRotation.xyz, aRotation.w * tProgress);\n        '],






      vertexNormal: ['\n          objectNormal = rotateVector(tQuatOrient, objectNormal);\n        '],




      vertexPosition: ['\n          transformed = rotateVector(tQuatOrient, transformed);\n          transformed += texture2D(uPositionTexture, aRef).xyz;\n        '],





      vertexColor: ['\n          vColor = vec3(texture2D(uPositionTexture, aRef).w, texture2D(uVelocityTexture, aRef).w, 1.0);\n        '],




      fragmentFunctions: [],
      fragmentParameters: [],
      fragmentInit: [],
      fragmentMap: [],
      fragmentDiffuse: ['\n        diffuseColor.xyz = vColor;\n        gl_FragColor = vec4(vColor, 1.0);\n        return;\n      '] }));





  }return BoidsApiaryMaterial;}(BAS.StandardAnimationMaterial);var


SortVis = function (_THREE$Points) {_inherits(SortVis, _THREE$Points);
  function SortVis(count, size, sizeScaling) {_classCallCheck(this, SortVis);
    var geometry = new SortVisGeometry(count);
    var material = new SortVisMaterial(count, size, sizeScaling);var _this4 = _possibleConstructorReturn(this, (SortVis.__proto__ || Object.getPrototypeOf(SortVis)).call(this,
    geometry, material));
    _this4.frustumCulled = false;return _this4;
  }_createClass(SortVis, [{ key: 'time', get: function get()

    {
      return this.material.uniforms.uTime.value;
    }, set: function set(

    newTime) {
      this.material.uniforms.uTime.value = newTime;
    } }, { key: 'ctValues', set: function set(

    texture) {
      this.material.uniforms.ctValues.value = texture;
    } }]);return SortVis;}(THREE.Points);var


SortVisGeometry = function (_BAS$PointBufferGeome) {_inherits(SortVisGeometry, _BAS$PointBufferGeome);
  function SortVisGeometry(count) {_classCallCheck(this, SortVisGeometry);var _this5 = _possibleConstructorReturn(this, (SortVisGeometry.__proto__ || Object.getPrototypeOf(SortVisGeometry)).call(this,
    count * count * count));
    _this5.computeVertexNormals();
    _this5.assignProps(count);return _this5;
  }_createClass(SortVisGeometry, [{ key: 'assignProps', value: function assignProps()

    {var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
      var aRef = this.createAttribute('aRef', 2);
      var width = count;
      var height = count;
      var depth = count;
      for (var z = 0; z < depth; z++) {
        var pageOffset = z * height * width;
        for (var y = 0; y < height; y++) {
          for (var x = 0; x < width; x++) {
            var index = pageOffset + y * width + x;
            this.setPointData(aRef, index, [
            x / width,
            (z * height + y) / height]);

          }
        }
      }
    } }]);return SortVisGeometry;}(BAS.PointBufferGeometry);var


SortVisMaterial = function (_BAS$PointsAnimationM) {_inherits(SortVisMaterial, _BAS$PointsAnimationM);
  function SortVisMaterial(count, size, sizeScaling) {_classCallCheck(this, SortVisMaterial);return _possibleConstructorReturn(this, (SortVisMaterial.__proto__ || Object.getPrototypeOf(SortVisMaterial)).call(this,
    {
      transparent: true,
      blending: THREE.NormalBlending,
      vertexColors: THREE.VertexColors,
      depthWrite: true,
      uniforms: {
        uTime: { value: 0 },
        ctValues: { value: null },
        uCount: { value: count },
        uSizeScaling: { value: sizeScaling } },

      uniformValues: {
        size: size,
        sizeAttenuation: true },

      vertexFunctions: [],
      vertexParameters: ['\n          uniform float uSizeScaling;\n          uniform float uTime;\n          uniform sampler2D ctValues;\n          uniform float uCount;\n          attribute vec2 aRef;\n        '],








      vertexInit: [
      'float seed = 5625463739.0;'],

      vertexPosition: ['\n          float x = aRef.x * uCount;\n          float y = fract(aRef.y) * uCount;\n          float z = floor(aRef.y);\n          float xPos = (-uCount + 1.0) * 3.0 / 2.0 + x * 3.0;\n          float yPos = (-uCount + 1.0) * 3.0 / 2.0 + y * 3.0;\n          float zPos = (-uCount + 1.0) * 3.0 / 2.0 + z * 3.0;\n          transformed += vec3(xPos, yPos, zPos) * uSizeScaling;\n        '],










      vertexColor: ['\n          vColor = texture2D(ctValues, vec2(aRef.x, aRef.y / uCount)).rgb;\n        '],




      fragmentParameters: [],
      fragmentShape: [] }));

  }return SortVisMaterial;}(BAS.PointsAnimationMaterial);var


Simulation = function () {
  function Simulation(domId, entities, _ref) {var _ref2 = _slicedToArray(_ref, 3),cameraX = _ref2[0],cameraY = _ref2[1],cameraZ = _ref2[2];_classCallCheck(this, Simulation);
    this.updateCallbacks = [];
    var camera = this.createCamera(55, cameraX, cameraY, cameraZ, window.innerWidth, window.innerHeight);
    camera.target = new THREE.Vector3(0, 0, 0);
    camera.lookAt(camera.target);
    var scene = new THREE.Scene();
    this.createLights(scene);
    var renderer = this.createRenderer(0x000000);
    document.getElementById(domId).appendChild(renderer.domElement);
    var handleWindowResize = this.onWindowResize(camera, renderer);
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize, false);
    entities.map(function (e, i) {
      scene.add(e);
    });
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    this.animate(renderer, scene, camera, controls, entities, +new Date());
    this.renderer = renderer;
  }_createClass(Simulation, [{ key: 'addUpdateCallback', value: function addUpdateCallback(

    callback) {
      this.updateCallbacks.push(callback);
    } }, { key: 'onWindowResize', value: function onWindowResize(

    camera, renderer) {
      return function (event) {
        var width = window.innerWidth;
        var height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
    } }, { key: 'animate', value: function animate(

    renderer, scene, camera, controls, entities, lastTime) {var _this7 = this;
      var currentTime = +new Date();
      var timeDelta = currentTime - lastTime;
      entities.forEach(function (e) {return e.time += timeDelta / 1000;});
      requestAnimationFrame(function () {
        _this7.animate(renderer, scene, camera, controls, entities, currentTime);
      });
      controls.update();
      this.updateCallbacks.forEach(function (callback) {return callback(timeDelta);});
      renderer.render(scene, camera);
    } }, { key: 'createCamera', value: function createCamera(

    fov) {var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;var z = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;var width = arguments[4];var height = arguments[5];
      var camera = new THREE.PerspectiveCamera(fov, width / height, 0.5, 30000);
      camera.position.x = x;
      camera.position.y = y;
      camera.position.z = z;
      return camera;
    } }, { key: 'createLights', value: function createLights(

    scene) {
      scene.add(new THREE.AmbientLight(0xcccccc));
      // scene.add(new THREE.DirectionalLight(0xffffff))
      scene.add(new THREE.PointLight(0xffffff));
    } }, { key: 'createRenderer', value: function createRenderer()

    {var clearColor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0x000000;
      var renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true });

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.autoClear = true;
      renderer.setClearColor(clearColor, 0);
      return renderer;
    } }]);return Simulation;}();