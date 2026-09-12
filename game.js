/* =====================================================
   TOY SHOOTING GAME
   game.js
   ===================================================== */


/* =====================================================
   ゲーム設定
===================================================== */

const GAME_TIME = 30;

let score = 0;
let timeLeft = GAME_TIME;

let playing = false;
let paused = false;

let timer = null;


/* =====================================================
   HTML要素
===================================================== */

const game =
    document.getElementById("game");

const stage =
    document.getElementById("stage");

const targetsArea =
    document.getElementById("targets");

const crosshair =
    document.getElementById("crosshair");

const scoreText =
    document.getElementById("score");

const timeText =
    document.getElementById("time");

const startScreen =
    document.getElementById("startScreen");

const startButton =
    document.getElementById("startButton");

const pauseButton =
    document.getElementById("pauseButton");


/* =====================================================
   初期チェック
===================================================== */

if (!stage) {
    console.error(
        "stage が見つかりません。index.htmlを確認してください。"
    );
}


/* =====================================================
   ゲーム開始
===================================================== */

function startGame() {

    score = 0;

    timeLeft = GAME_TIME;

    playing = true;

    paused = false;


    updateScore();

    updateTime();


    // スタート画面を消す

    if (startScreen) {
        startScreen.style.display = "none";
    }


    // 的を全部消す

    targetsArea.innerHTML = "";


    // 最初の的を作る

    createTargets();


    // タイマー開始

    clearInterval(timer);

    timer = setInterval(() => {

        if (!playing || paused) {
            return;
        }

        timeLeft--;

        updateTime();


        if (timeLeft <= 0) {

            endGame();

        }

    }, 1000);
}


/* =====================================================
   ゲーム終了
===================================================== */

function endGame() {

    playing = false;

    clearInterval(timer);


    // 的を消す

    targetsArea.innerHTML = "";


    // スタート画面を再利用

    if (startScreen) {

        startScreen.style.display = "block";

        startScreen.innerHTML = `

            <h2>TIME UP!</h2>

            <p>
                SCORE
            </p>

            <p style="
                font-size:52px;
                font-weight:900;
                color:#d28b35;
            ">
                ${score}
            </p>

            <button id="startButton">
                もう一度プレイ
            </button>

        `;


        document
            .getElementById("startButton")
            .addEventListener(
                "click",
                startGame
            );
    }
}


/* =====================================================
   スコア更新
===================================================== */

function updateScore() {

    if (scoreText) {

        scoreText.textContent =
            score;
    }
}


/* =====================================================
   時間更新
===================================================== */

function updateTime() {

    if (timeText) {

        timeText.textContent =
            timeLeft;
    }
}


/* =====================================================
   的を作る
===================================================== */

function createTargets() {

    targetsArea.innerHTML = "";


    const targetData = [

        // -------------------------
        // 手前
        // -------------------------

        {
            x: 15,
            y: 77,
            points: 100,
            type: "red",
            size: 1.25
        },

        {
            x: 38,
            y: 75,
            points: 100,
            type: "red",
            size: 1.35
        },

        {
            x: 62,
            y: 77,
            points: 500,
            type: "green",
            size: 1.35
        },

        {
            x: 84,
            y: 75,
            points: 100,
            type: "red",
            size: 1.25
        },


        // -------------------------
        // 中間
        // -------------------------

        {
            x: 25,
            y: 59,
            points: 100,
            type: "red",
            size: 1.0
        },

        {
            x: 48,
            y: 58,
            points: 100,
            type: "red",
            size: 1.0
        },

        {
            x: 70,
            y: 59,
            points: 100,
            type: "red",
            size: 1.0
        },

        {
            x: 90,
            y: 57,
            points: 500,
            type: "green",
            size: .95
        },


        // -------------------------
        // 奥
        // -------------------------

        {
            x: 16,
            y: 40,
            points: 500,
            type: "green",
            size: .75
        },

        {
            x: 34,
            y: 36,
            points: 1000,
            type: "blue",
            size: .72
        },

        {
            x: 52,
            y: 39,
            points: 1000,
            type: "blue",
            size: .72
        },

        {
            x: 70,
            y: 36,
            points: 500,
            type: "green",
            size: .72
        },

        {
            x: 86,
            y: 40,
            points: 1000,
            type: "blue",
            size: .68
        },


        // -------------------------
        // 高得点
        // -------------------------

        {
            x: 48,
            y: 18,
            points: 2000,
            type: "gold",
            size: .65
        },

        {
            x: 66,
            y: 17,
            points: 1000,
            type: "blue",
            size: .60
        }

    ];


    targetData.forEach(data => {

        createTarget(data);

    });
}


/* =====================================================
   1個の的を作る
===================================================== */

function createTarget(data) {

    const target =
        document.createElement("div");


    target.className =
        `target ${data.type}`;


    target.style.left =
        `${data.x}%`;

    target.style.top =
        `${data.y}%`;


    target.dataset.points =
        data.points;


    target.dataset.size =
        data.size;


    target.innerHTML = `

        <div>

            <span class="points">
                ${data.points}
            </span>

            <span class="star">
                ★
            </span>

        </div>

    `;


    // 初期サイズ

    target.style.transform =
        `translate(-50%, -50%)
         scale(${data.size})`;


    /* -----------------------------------------
       的をクリック
    ----------------------------------------- */

    target.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            if (!playing || paused) {
                return;
            }


            hitTarget(
                target,
                data.points
            );

        }
    );


    targetsArea.appendChild(target);
}


/* =====================================================
   的に命中
===================================================== */

function hitTarget(target, points) {

    if (!target) {
        return;
    }


    // 二重クリック防止

    if (target.dataset.hit === "true") {
        return;
    }

    target.dataset.hit = "true";


    /* -----------------------------------------
       スコア加算
    ----------------------------------------- */

    score += points;

    updateScore();


    /* -----------------------------------------
       的の中心位置
    ----------------------------------------- */

    const targetRect =
        target.getBoundingClientRect();

    const stageRect =
        stage.getBoundingClientRect();


    const centerX =
        targetRect.left -
        stageRect.left +
        targetRect.width / 2;


    const centerY =
        targetRect.top -
        stageRect.top +
        targetRect.height / 2;


    /* -----------------------------------------
       パリーン文字
    ----------------------------------------- */

    createShatterText(
        centerX,
        centerY,
        points
    );


    /* -----------------------------------------
       破片
    ----------------------------------------- */

    createShards(
        centerX,
        centerY
    );


    /* -----------------------------------------
       的を消す
    ----------------------------------------- */

    target.classList.add("hit");


    setTimeout(() => {

        target.remove();


        // 新しい的を追加

        if (playing && !paused) {

            createRandomTarget();

        }

    }, 250);
}


/* =====================================================
   パリーン！文字
===================================================== */

function createShatterText(
    x,
    y,
    points
) {

    const text =
        document.createElement("div");


    text.className =
        "shatterText";


    text.textContent =
        `パリーン！ +${points}`;


    text.style.left =
        `${x}px`;

    text.style.top =
        `${y}px`;


    targetsArea.appendChild(text);


    setTimeout(() => {

        text.remove();

    }, 700);
}


/* =====================================================
   ガラスの破片
===================================================== */

function createShards(
    x,
    y
) {

    const SHARD_COUNT = 18;


    for (
        let i = 0;
        i < SHARD_COUNT;
        i++
    ) {

        const shard =
            document.createElement("div");


        shard.className =
            "shard";


        shard.style.left =
            `${x}px`;

        shard.style.top =
            `${y}px`;


        /* -----------------------------------------
           飛んでいく方向
        ----------------------------------------- */

        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            60 +
            Math.random() *
            150;


        const dx =
            Math.cos(angle) *
            distance;


        const dy =
            Math.sin(angle) *
            distance;


        shard.style.setProperty(
            "--dx",
            `${dx}px`
        );


        shard.style.setProperty(
            "--dy",
            `${dy}px`
        );


        /* -----------------------------------------
           回転
        ----------------------------------------- */

        const rotation =
            Math.random() *
            720 -
            360;


        shard.style.setProperty(
            "--rotate",
            `${rotation}deg`
        );


        /* -----------------------------------------
           大きさ
        ----------------------------------------- */

        const size =
            7 +
            Math.random() *
            15;


        shard.style.width =
            `${size}px`;

        shard.style.height =
            `${size}px`;


        targetsArea.appendChild(
            shard
        );


        setTimeout(() => {

            shard.remove();

        }, 650);
    }
}


/* =====================================================
   新しい的をランダムに出す
===================================================== */

function createRandomTarget() {

    const types = [

        {
            points: 100,
            type: "red"
        },

        {
            points: 500,
            type: "green"
        },

        {
            points: 1000,
            type: "blue"
        }

    ];


    const data =
        types[
            Math.floor(
                Math.random() *
                types.length
            )
        ];


    /* -----------------------------------------
       高さ
    ----------------------------------------- */

    const y =
        30 +
        Math.random() *
        52;


    /* -----------------------------------------
       遠近感
       下にあるほど大きくする
    ----------------------------------------- */

    const size =
        .65 +
        ((y - 30) / 52) *
        .65;


    const x =
        8 +
        Math.random() *
        84;


    createTarget({

        x: x,

        y: y,

        points: data.points,

        type: data.type,

        size: size

    });
}


/* =====================================================
   照準
===================================================== */

function moveCrosshair(
    clientX,
    clientY
) {

    if (!crosshair || !stage) {
        return;
    }


    const rect =
        stage.getBoundingClientRect();


    let x =
        clientX -
        rect.left;


    let y =
        clientY -
        rect.top;


    /* -----------------------------------------
       ステージ外に出ないようにする
    ----------------------------------------- */

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


/* =====================================================
   マウス操作
===================================================== */

stage.addEventListener(
    "pointermove",
    event => {

        moveCrosshair(
            event.clientX,
            event.clientY
        );

    }
);


/* =====================================================
   ステージをクリックして射撃
===================================================== */

stage.addEventListener(
    "pointerdown",
    event => {

        if (!playing || paused) {
            return;
        }


        // 的そのものをクリックした場合は
        // 的側の処理に任せる

        if (
            event.target.classList.contains(
                "target"
            )
        ) {
            return;
        }


        shoot();
    }
);


/* =====================================================
   射撃
===================================================== */

function shoot() {

    if (!playing || paused) {
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


    const targets =
        document.querySelectorAll(
            ".target"
        );


    let hit = false;


    /* -----------------------------------------
       照準の位置にある的を探す
    ----------------------------------------- */

    targets.forEach(target => {

        if (hit) {
            return;
        }


        const rect =
            target.getBoundingClientRect();


        const targetCenterX =
            rect.left +
            rect.width / 2;


        const targetCenterY =
            rect.top +
            rect.height / 2;


        const dx =
            centerX -
            targetCenterX;


        const dy =
            centerY -
            targetCenterY;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        const hitRadius =
            Math.min(
                rect.width,
                rect.height
            ) / 2;


        if (
            distance <=
            hitRadius
        ) {

            hit = true;


            hitTarget(
                target,
                Number(
                    target.dataset.points
                )
            );
        }

    });


    /* -----------------------------------------
       ミス
    ----------------------------------------- */

    if (!hit) {

        showMiss(
            centerX,
            centerY
        );

    }
}


/* =====================================================
   MISS表示
===================================================== */

function showMiss(
    x,
    y
) {

    const miss =
        document.createElement("div");


    miss.className =
        "shatterText";


    miss.textContent =
        "MISS!";


    miss.style.left =
        `${x -
        stage.getBoundingClientRect().left}px`;


    miss.style.top =
        `${y -
        stage.getBoundingClientRect().top}px`;


    miss.style.color =
        "#ffffff";


    targetsArea.appendChild(
        miss
    );


    setTimeout(() => {

        miss.remove();

    }, 500);
}


/* =====================================================
   スタートボタン
===================================================== */

if (startButton) {

    startButton.addEventListener(
        "click",
        startGame
    );
}


/* =====================================================
   一時停止
===================================================== */

if (pauseButton) {

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
                    ? "▶"
                    : "Ⅱ";

        }
    );
}


/* =====================================================
   キーボード操作
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        /* -----------------------------
           スペース = 射撃
        ----------------------------- */

        if (
            event.code ===
            "Space"
        ) {

            event.preventDefault();

            shoot();

        }


        /* -----------------------------
           P = 一時停止
        ----------------------------- */

        if (
            event.key.toLowerCase()
            === "p"
        ) {

            if (
                pauseButton
            ) {

                pauseButton.click();

            }

        }

    }
);


/* =====================================================
   Joy-Con対応用
   外部のJoy-Conプログラムから
   window.joyconAim() を呼べるようにする
===================================================== */

window.joyconAim =
    function(
        x,
        y
    ) {

        /*
         * x = 0 ～ 1
         * y = 0 ～ 1
         */

        if (!stage) {
            return;
        }


        const rect =
            stage.getBoundingClientRect();


        const clientX =
            rect.left +
            x * rect.width;


        const clientY =
            rect.top +
            y * rect.height;


        moveCrosshair(
            clientX,
            clientY
        );
    };


/* =====================================================
   Joy-Con射撃用
===================================================== */

window.joyconShoot =
    function() {

        shoot();

    };


/* =====================================================
   ゲーム初期状態
===================================================== */

updateScore();

updateTime();


/* =====================================================
   開発用
===================================================== */

console.log(
    "Toy Shooting Game loaded!"
);

console.log(
    "Joy-Con Aim:",
    "window.joyconAim(x, y)"
);

console.log(
    "Joy-Con Shoot:",
    "window.joyconShoot()"
);