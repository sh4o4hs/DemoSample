define(['exports'], function (exports) { 'use strict';

  var texasholdem = { "six": { "config": { "limit": { "scrollVisible": false }, "free": { "scrollVisible": true }, "record": { "showRecord": true }, "hide": false }, "position": { "community": { "coin": [{ "x": 980, "y": 639 }, { "x": 832, "y": 565 }, { "x": 1128, "y": 565 }, { "x": 758, "y": 663 }, { "x": 1212, "y": 663 }], "poker": [{ "x": 725, "y": 463 }, { "x": 820, "y": 463 }, { "x": 915, "y": 463 }, { "x": 1010, "y": 463 }, { "x": 1105, "y": 463 }] }, "counter": [{ "x": 843, "y": 728 }, { "x": 531, "y": 687 }, { "x": 529, "y": 353 }, { "x": 936, "y": 343 }, { "x": 1406, "y": 353 }, { "x": 1406, "y": 687 }], "player": [{ "x": 742, "y": 819, "type": "center" }, { "x": 20, "y": 560, "type": "right" }, { "x": 20, "y": 211, "type": "right" }, { "x": 742, "y": 95, "type": "right" }, { "x": 1465, "y": 211, "type": "left" }, { "x": 1465, "y": 560, "type": "left" }] } } };
  var particle = { "bubbles": { "alpha": { "start": 1, "end": 0.22 }, "scale": { "start": 0.25, "end": 0.75, "minimumScaleMultiplier": 0.5 }, "color": { "start": "ffffff", "end": "ffffff" }, "speed": { "start": 200, "end": 50 }, "startRotation": { "min": 0, "max": 360 }, "rotationSpeed": { "min": 0, "max": 10 }, "lifetime": { "min": 4, "max": 4 }, "blendMode": "normal", "frequency": 0.016, "emitterLifetime": 0, "maxParticles": 100, "pos": { "x": 0, "y": 0 }, "addAtBack": false, "spawnType": "point" }, "cartoonSmoke": { "alpha": { "start": 0.74, "end": 0 }, "scale": { "start": 0.1, "end": 1.2 }, "color": { "start": "eb8b58", "end": "575757" }, "speed": { "start": 700, "end": 50 }, "startRotation": { "min": 0, "max": 360 }, "rotationSpeed": { "min": 0, "max": 200 }, "lifetime": { "min": 0.4, "max": 0.7 }, "blendMode": "normal", "frequency": 0.001, "emitterLifetime": 0.2, "maxParticles": 100, "pos": { "x": 0, "y": 0 }, "addAtBack": true, "spawnType": "point" } };
  var data = {
    texasholdem: texasholdem,
    particle: particle
  };

  var spines = { "demo": { "contbo": { "tom": { "star": ["/project/demo/sample/res/sub/spine/contbo/khero_tom_star_03.json", "/project/demo/sample/res/sub/spine/contbo/khero_tom_star_04.json", "/project/demo/sample/res/sub/spine/contbo/khero_tom_star_05.json"], "loop": ["/project/demo/sample/res/sub/spine/contbo/khero_tom_loop_01.json", "/project/demo/sample/res/sub/spine/contbo/khero_tom_loop_02.json", "/project/demo/sample/res/sub/spine/contbo/khero_tom_loop_03.json", "/project/demo/sample/res/sub/spine/contbo/khero_tom_loop_04.json", "/project/demo/sample/res/sub/spine/contbo/khero_tom_loop_05.json"] } } } };
  var spine = {
    spines: spines
  };

  var objects = [{ "objName": "btnSystem", "name": "系統", "type": "button", "isInScene": true, "resource": { "group": "sub.button", "name": "system", "enter": "enter", "press": "press", "leave": "leave", "disable": "disable" }, "pos": { "x": 140, "y": 140 }, "width": 255, "height": 255, "init": "clickSys" }, { "objName": "boy", "name": "動畫 boy", "type": "bone", "isInScene": true, "resource": { "name": "ubbie" }, "pos": { "x": 500, "y": 600 }, "animation": { "name": "turn face", "timeScale": 1 }, "width": 128, "height": 32, "init": null }, { "objName": "aaaa", "name": "粒子", "type": "particle", "isInScene": true, "config": { "name": "cartoonSmoke" }, "resource": { "group": "sub.particle", "name": "test" }, "pos": { "x": 200, "y": 400 }, "width": 255, "height": 255, "init": null }, { "objName": "contboTomStar", "name": "動畫-contbo TOM STAR", "type": "spine", "isInScene": true, "resource": { "spineData": "demo.contbo.tom.star", "texture": null }, "configList": [{ "name": "a0", "dataName": 0, "timeScale": 1, "loop": false, "animationName": "demo" }, { "name": "a1", "dataName": 1, "timeScale": 1, "loop": false, "animationName": "demo" }, { "name": "a2", "dataName": 2, "timeScale": 1, "loop": false, "animationName": "demo" }], "pos": { "x": 250, "y": 300 }, "init": null }, { "objName": "contboTomLoop", "name": "動畫-contbo TOM LOOP", "type": "spine", "isInScene": true, "resource": { "spineData": "demo.contbo.tom.loop", "texture": null }, "configList": [{ "name": "a0", "dataName": 0, "timeScale": 1, "loop": false, "animationName": "demo" }, { "name": "a1", "dataName": 1, "timeScale": 1, "loop": false, "animationName": "demo" }, { "name": "a2", "dataName": 2, "timeScale": 1, "loop": false, "animationName": "demo" }, { "name": "a3", "dataName": 3, "timeScale": 1, "loop": false, "animationName": "demo" }, { "name": "a4", "dataName": 4, "timeScale": 1, "loop": false, "animationName": "demo" }], "pos": { "x": 250, "y": 300 }, "init": null }];
  var object = {
    objects: objects
  };

  var images = { "sub": { "button": { "system": { "enter": "/project/demo/sample/res/sub/image/SYSTEM_256.png", "press": "/project/demo/sample/res/sub/image/SYSTEM_256_on.png", "leave": "/project/demo/sample/res/sub/image/SYSTEM_256_70.png", "disable": "/project/demo/sample/res/sub/image/SYSTEM_256_70.png" } }, "bones": { "demon": { "texture": "/project/demo/sample/res/sub/bones/demon/texture.png" }, "ubbie": { "texture": "/project/demo/sample/res/sub/bones/ubbie/texture.png" } }, "particle": { "cartoonSmoke": "/project/demo/sample/res/sub/image/CartoonSmoke.png", "test": "/project/demo/sample/res/sub/image/SYSTEM_256.png" } } };
  var teEn = {
    images: images
  };

  var images$1 = { "sub": { "button": { "system": { "enter": "/project/demo/sample/res/sub/image/SYSTEM_256.png", "press": "/project/demo/sample/res/sub/image/SYSTEM_256_on.png", "leave": "/project/demo/sample/res/sub/image/SYSTEM_256_70.png", "disable": "/project/demo/sample/res/sub/image/SYSTEM_256_70.png" } }, "bones": { "demon": { "texture": "/project/demo/sample/res/sub/bones/demon/texture.png" }, "ubbie": { "texture": "/project/demo/sample/res/sub/bones/ubbie/texture.png" } }, "particle": { "cartoonSmoke": "/project/demo/sample/res/sub/image/CartoonSmoke.png", "test": "/project/demo/sample/res/sub/image/SYSTEM_256.png" } } };
  var teTw = {
    images: images$1
  };

  var images$2 = { "sub": { "button": { "system": { "enter": "/project/demo/sample/res/sub/image/SYSTEM_256.png", "press": "/project/demo/sample/res/sub/image/SYSTEM_256_on.png", "leave": "/project/demo/sample/res/sub/image/SYSTEM_256_70.png", "disable": "/project/demo/sample/res/sub/image/SYSTEM_256_70.png" } }, "bones": { "demon": { "texture": "/project/demo/sample/res/sub/bones/demon/texture.png" }, "ubbie": { "texture": "/project/demo/sample/res/sub/bones/ubbie/texture.png" } }, "particle": { "cartoonSmoke": "/project/demo/sample/res/sub/image/CartoonSmoke.png", "test": "/project/demo/sample/res/sub/image/SYSTEM_256.png" } } };
  var teCn = {
    images: images$2
  };

  var resource = {
    en: {
      data: data,
      texture: teEn,
      spine: spine,
      object: object
    },
    'zh-tw': {
      data: data,
      texture: teTw,
      spine: spine,
      object: object
    },
    'zh-cn': {
      data: data,
      texture: teCn,
      spine: spine,
      object: object
    }
  };

  exports.default = resource;

  Object.defineProperty(exports, '__esModule', { value: true });

});
