/* =================================
   基本設定
================================= */

const GAME_TIME = 30;

let score = 0;
let timeLeft = GAME_TIME;

let playing = false;
let paused = false;

let timer = null;


/* =================================
   HTML
================================= */

const stage =
  document.getElementById("stage");

const targets =
  document.getElementById("targets");

const crosshair =
  document.getElementById("crosshair");

const scoreElement =
  document.getElementById("score");

const timeElement =
  document.getElementById("time");

const startScreen =
  document.getElementById("startScreen");

const startButton =
  document.getElementById("startButton");

const pauseButton =
  document.getElementById("pauseButton");


/* =================================
   HUD更新
================================= */

function updateHUD() {

  scoreElement.textContent =
    score;

  timeElement.textContent =
    timeLeft;

}


/* =================================
   ゲーム開始
================================= */

function startGame() {

  score = 0;

  timeLeft =
    GAME_TIME;

  playing = true;

  paused = false;

  clearInterval(timer);

  updateHUD();

  targets.innerHTML = "";

  pauseButton.textContent =
    "PAUSE";

  startScreen.style.display =
    "none";


  createTargets();


  timer =
    setInterval(() => {

      if (
        !playing ||
        paused
      ) {
        return;
      }


      timeLeft--;

      updateHUD();


      if (
        timeLeft <= 0
      ) {

        endGame();

      }

    }, 1000);

}


/* =================================
   ゲーム終了
================================= */

function endGame() {

  playing = false;

  paused = false;

  clearInterval(timer);

  timer = null;

  targets.innerHTML = "";


  startScreen.innerHTML = `

    <h1>
      TIME UP!
    </h1>

    <p>
      SCORE
    </p>

    <p>
      ${score} POINTS
    </p>

    <button id="startButton">
      AGAIN
    </button>

  `;


  startScreen.style.display =
    "flex";


  document
    .getElementById("startButton")
    .addEventListener(
      "click",
      startGame
    );

}


/* =================================
   最初のターゲット
================================= */

function createTargets() {

  const targetData = [

    ["red",100,13,64,.70],

    ["blue",1000,24,43,.58],

    ["green",500,35,47,.64],

    ["red",100,39,59,.82],

    ["gold",2000,49,19,.48],

    ["blue",1000,63,22,.42],

    ["green",500,75,29,.48],

    ["red",100,84,45,.60],

    ["green",500,93,59,.55],

    ["red",100,18,55,1.02],

    ["red",100,30,61,1.12],

    ["green",500,45,55,.95],

    ["red",100,57,60,1.05],

    ["green",500,70,58,1.02],

    ["red",100,82,61,1.12],

    ["red",100,12,76,1.28],

    ["gold",2000,50,76,1.32],

    ["green",500,71,78,1.30],

    ["green",500,92,84,1.22]

  ];


  targetData.forEach(
    data => {

      createTarget({

        type:
          data[0],

        points:
          data[1],

        x:
          data[2],

        y:
          data[3],

        scale:
          data[4]

      });

    }
  );

}


/* =================================
   ターゲット作成
================================= */

function createTarget({

  type,
  points,
  x,
  y,
  scale

}) {

  const target =
    document.createElement("div");


  target.className =
    `target ${type}`;


  target.dataset.points =
    points;


  target.style.left =
    `${x}%`;


  target.style.top =
    `${y}%`;


  target.style.setProperty(
    "--scale",
    scale
  );


  const pointsElement =
    document.createElement("div");


  pointsElement.className =
    "points";


  pointsElement.textContent =
    points;


  target.appendChild(
    pointsElement
  );


  target.addEventListener(
    "pointerdown",
    event => {

      event.stopPropagation();


      if (
        !playing ||
        paused ||
        target.classList.contains(
          "destroying"
        )
      ) {

        return;

      }


      hitTarget(
        target,
        points
      );

    }
  );


  targets.appendChild(
    target
  );

}


/* =================================
   命中
================================= */

function hitTarget(
  target,
  points
) {

  if (
    target.classList.contains(
      "destroying"
    )
  ) {

    return;

  }


  target.classList.add(
    "destroying"
  );


  /* スコア */

  score += points;

  updateHUD();


  /* ターゲット位置 */

  const stageRect =
    stage.getBoundingClientRect();

  const rect =
    target.getBoundingClientRect();


  const x =
    rect.left -
    stageRect.left +
    rect.width / 2;


  const y =
    rect.top -
    stageRect.top +
    rect.height / 2;


  /* ヒビ */

  createCrack(
    x,
    y
  );


  /* 実際の破片 */

  createShards(
    x,
    y,
    rect.width
  );


  /* 元のターゲット */

  setTimeout(
    () => {

      target.remove();

    },
    120
  );


  /* 新しいターゲット */

  setTimeout(
    () => {

      if (
        playing &&
        !paused
      ) {

        createRandomTarget();

      }

    },
    350
  );

}


/* =================================
   ヒビ
================================= */

function createCrack(
  x,
  y
) {

  const crack =
    document.createElement("div");


  crack.className =
    "crack";


  crack.style.left =
    `${x}px`;


  crack.style.top =
    `${y}px`;


  for (
    let i = 0;
    i < 8;
    i++
  ) {

    const line =
      document.createElement("div");


    line.className =
      "crackLine";


    crack.appendChild(
      line
    );

  }


  targets.appendChild(
    crack
  );


  setTimeout(
    () => {

      crack.remove();

    },
    220
  );

}


/* =================================
   破片を作る
================================= */

function createShards(
  x,
  y,
  targetSize
) {

  const shardCount =
    20;


  for (
    let i = 0;
    i < shardCount;
    i++
  ) {

    const shard =
      document.createElement("div");


    shard.className =
      "shard";


    /* 円状に飛ばす */

    const angle =
      (Math.PI * 2 / shardCount) *
      i
      +
      (Math.random() - .5) *
      .5;


    const distance =
      90 +
      Math.random() *
      170;


    const dx =
      Math.cos(angle) *
      distance;


    const dy =
      Math.sin(angle) *
      distance;


    /* 大きさ */

    const size =
      targetSize *
      (
        .16 +
        Math.random() * .20
      );


    shard.style.width =
      `${size}px`;


    shard.style.height =
      `${size}px`;


    shard.style.left =
      `${x}px`;


    shard.style.top =
      `${y}px`;


    shard.style.setProperty(
      "--dx",
      `${dx}px`
    );


    shard.style.setProperty(
      "--dy",
      `${dy}px`
    );


    shard.style.setProperty(
      "--rotation",
      `${Math.random() * 900 - 450}deg`
    );


    shard.style.setProperty(
      "--duration",
      `${.45 + Math.random() * .35}s`
    );


    targets.appendChild(
      shard
    );


    setTimeout(
      () => {

        shard.remove();

      },
      900
    );

  }

}


/* =================================
   新しいターゲット
================================= */

function createRandomTarget() {

  const types = [

    ["red",100],

    ["green",500],

    ["blue",1000]

  ];


  const selected =
    types[
      Math.floor(
        Math.random() *
        types.length
      )
    ];


  const y =
    40 +
    Math.random() *
    45;


  const scale =
    .65 +
    ((y - 40) / 45)
    * .7;


  createTarget({

    type:
      selected[0],

    points:
      selected[1],

    x:
      8 +
      Math.random() *
      84,

    y:
      y,

    scale:
      scale

  });

}


/* =================================
   照準移動
================================= */

function moveCrosshair(
  clientX,
  clientY
) {

  const rect =
    stage.getBoundingClientRect();


  let x =
    clientX -
    rect.left;


  let y =
    clientY -
    rect.top;


  x =
    Math.max(
      0,
      Math.min(
        rect.width,
        x
      )
    );


  y =
    Math.max(
      0,
      Math.min(
        rect.height,
        y
      )
    );


  crosshair.style.left =
    `${x}px`;


  crosshair.style.top =
    `${y}px`;

}


/* =================================
   マウス・タッチ
================================= */

stage.addEventListener(
  "pointermove",
  event => {

    moveCrosshair(
      event.clientX,
      event.clientY
    );

  }
);


/* =================================
   発射
================================= */

stage.addEventListener(
  "pointerdown",
  event => {

    if (
      !playing ||
      paused
    ) {

      return;

    }


    if (
      event.target.closest(
        ".target"
      )
    ) {

      return;

    }


    shoot();

  }
);


/* =================================
   照準の場所を判定
================================= */

function shoot() {

  if (
    !playing ||
    paused
  ) {

    return;

  }


  const crossRect =
    crosshair.getBoundingClientRect();


  const centerX =
    crossRect.left +
    crossRect.width / 2;


  const centerY =
    crossRect.top +
    crossRect.height / 2;


  const targetList =
    document.querySelectorAll(
      ".target:not(.destroying)"
    );


  for (
    const target of targetList
  ) {

    const rect =
      target.getBoundingClientRect();


    if (

      centerX >= rect.left &&

      centerX <= rect.right &&

      centerY >= rect.top &&

      centerY <= rect.bottom

    ) {

      hitTarget(

        target,

        Number(
          target.dataset.points
        )

      );

      return;

    }

  }


  /* 外した */

  const stageRect =
    stage.getBoundingClientRect();


  showMiss(

    centerX -
    stageRect.left,

    centerY -
    stageRect.top

  );

}


/* =================================
   MISS
================================= */

function showMiss(
  x,
  y
) {

  const miss =
    document.createElement("div");


  miss.className =
    "missText";


  miss.textContent =
    "MISS!";


  miss.style.left =
    `${x}px`;


  miss.style.top =
    `${y}px`;


  targets.appendChild(
    miss
  );


  setTimeout(
    () => {

      miss.remove();

    },
    550
  );

}


/* =================================
   START
================================= */

startButton.addEventListener(
  "click",
  startGame
);


/* =================================
   PAUSE
================================= */

pauseButton.addEventListener(
  "click",
  () => {

    if (!playing) {
      return;
    }


    paused =
      !paused;


    pauseButton.textContent =
      paused
        ? "RESUME"
        : "PAUSE";

  }
);


/* =================================
   キーボード
================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.code === "Space"
    ) {

      event.preventDefault();

      shoot();

    }


    if (
      event.key.toLowerCase()
      === "p"
    ) {

      if (playing) {

        paused =
          !paused;


        pauseButton.textContent =
          paused
            ? "RESUME"
            : "PAUSE";

      }

    }

  }
);


/* =================================
   Joy-Con連携用
================================= */

window.joyconAim =
function(x, y) {

  if (
    !playing ||
    paused
  ) {

    return;

  }


  x =
    Math.max(
      0,
      Math.min(
        1,
        Number(x)
      )
    );


  y =
    Math.max(
      0,
      Math.min(
        1,
        Number(y)
      )
    );


  const rect =
    stage.getBoundingClientRect();


  moveCrosshair(

    rect.left +
    rect.width * x,

    rect.top +
    rect.height * y

  );

};


window.joyconShoot =
function() {

  shoot();

};


/* =================================
   初期状態
================================= */

updateHUD();