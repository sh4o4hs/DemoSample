//import * as nuts from 'nuts';
import app from 'entity/app';


let isCreate = false;
let scene = null;
export async function play (game, result) {
  let sceneManager = app.nuts.scene.sceneManager;
  let ui = app.nuts.ui;
  let loading = ui.loading;
  const NUM = ui.Number.NUM;

  // 是否需要建立
  if (!isCreate) {
    isCreate = true;

    // 讀取資源檔
    let vendor = await import('src/vendor');
    let res = await vendor.get('sub');

    let config = {
      game,
      loading,
      infoList: [
        { eventName: 'texture', obj: res},
        { eventName: 'spine', obj: res},
        { eventName: 'object',  obj: res},
        { eventName: 'sound',   obj: res}
      ]
    };
    console.log('[讀取資源檔]');
    scene = await sceneManager.createScene(config);
  }
  console.log(scene);
  let obj;
  let btn;

  obj = scene.entity.cash;
  obj.setAlign(NUM.HORI_ALIGN.CENTER, NUM.VERTI_ALIGN.CENTER);
  obj.fixVal = 2;
  obj.setValue(654321);

  // 顯示
  scene.show();

  let textures = scene.textures;
  let layer = game.layer.main;
  let container = new PIXI.Container();
  layer.addChild(container);

  let teCoin = textures.demo.coin;
  for (var i = 0; i < 25; i++) {
    var bunny = new PIXI.Sprite(teCoin['100']);
    bunny.anchor.set(0.5);
    bunny.x = (i % 5) * 50;
    bunny.y = Math.floor(i / 5) * 50;
    container.addChild(bunny);
  }

  // Move container to the center
  container.x = 200 + 512 / 2;
  container.y = 512 / 2;

  // Center bunny sprite in local container coordinates
  container.pivot.x = container.width / 2;
  container.pivot.y = container.height / 2;

  game.addUpdate({
    update (offsetTime) {
      container.rotation -= 0.5 * offsetTime;
    }
  });
  console.log('等待 1 秒');
  await game.idle(1.0);
  console.log('1 秒後');
  let example = new PIXI.Container();
  example.x = 100;
  example.y = 250;
  layer.addChild(example);

  let spines = scene.spines.demo;
  let light01 = new PIXI.spine.Spine(spines.contbo.tom.star[0]);
  light01.state.setAnimation(0, 'demo', false);
  example.addChild(light01);

  await game.idle(1.0);
  console.log('1 秒後');
  let light02 = new PIXI.spine.Spine(spines.contbo.tom.star[1]);
  light02.state.setAnimation(0, 'demo', false);
  example.addChild(light02);
  example.removeChild(light01);

  await game.idle(1.0);
  console.log('1 秒後');
  let star1 = new PIXI.spine.Spine(spines.contbo.tom.loop[0]);
  star1.state.setAnimation(0, 'demo', false);
  example.addChild(star1);
  example.removeChild(light02);

  await game.idle(1.0);
  console.log('1 秒後');
  let star2 = new PIXI.spine.Spine(spines.contbo.tom.loop[1]);
  star2.state.setAnimation(0, 'demo', false);
  example.addChild(star2);


  await game.idle(1.0);
  console.log('1 秒後');
  let text = new PIXI.spine.Spine(spines.contbo.tom.loop[4]);
  text.state.setAnimation(0, 'demo', true);
  example.addChild(text);
  example.removeChild(star1);
  example.removeChild(star2);

  obj = scene.entity.btnSystem;
  btn = obj.clone();
  btn.x = 500;
  btn.y = 50;
  layer.addChild(btn);

  console.log(result);
}


