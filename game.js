const stage = document.getElementById("stage");
const targetsArea = document.getElementById("targets");

const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");

const crosshair =
    document.getElementById("crosshair");

const startScreen =
    document.getElementById("startScreen");

const startButton =
    document.getElementById("startButton");

const pauseButton =
    document.getElementById("pauseButton");


let score = 0;
let time = 30;

let playing = false;
let paused = false;

let timer;


/* =========================
   的を作る
========================= */

function createTargets() {

    targetsArea.innerHTML = "";

    const targets = [

        [15, 78, 100, "red"],
        [28, 65, 100, "red"],
        [40, 75, 500, "green"],
        [50, 60, 100, "red"],
        [61, 73, 500, "green"],
        [72, 59, 100, "red"],
        [82, 74, 500, "green"],
        [92, 62, 100, "red"],

        [18, 43, 500, "green"],
        [34, 37, 1000, "blue"],
        [53, 41, 1000, "blue"],
        [71, 34, 500, "green"],
        [86, 43, 1000, "blue"],

        [47, 22, 2000, "blue"],
        [66, 19, 1000, "blue"]
    ];


    targets.forEach(data => {

        createTarget(
            data[0],
            data[1],
            data[2],
            data[3]
        );

    });

}


/* =========================
   的を1個作る
========================= */

function createTarget(x, y, points, type) {

    const target =
        document.createElement("div");

    target.className =
        `target ${type}`;

    target.style.left =
        x + "%";

    target.style.top =
        y + "%";


    target.innerHTML = `

        <div>

            <span class="points">
                ${points}
            </span>

            <span class="star">
                ★
            </span>

        </div>
    `;


    target.addEventListener(
        "pointerdown",
        event => {

            event.stopPropagation();

            if (!playing || paused)
                return;

            hitTarget(
                target,
                points
            );

        }
    );


    targetsArea.appendChild(target);
}


/* =========================
   命中
========================= */

function hitTarget(target, points) {

    score += points;

    scoreText.textContent =
        score;


    /* HIT! */

    const hit =
        document.createElement("div");

    hit.className = "hit";

    hit.textContent =
        `+${points} HIT!`;

    hit.style.left =
        target.style.left;

    hit.style.top =
        target.style.top;


    targetsArea.appendChild(hit);


    /* 的を消す */

    target.style.transform =
        "translate(-50%, -50%) scale(1.6)";

    target.style.opacity = "0";


    setTimeout(() => {

        target.remove();

        hit.remove();

        createRandomTarget();

    }, 180);
}


/* =========================
   新しい的
========================= */

function createRandomTarget() {

    const types = [

        ["100", "red"],
        ["500", "green"],
        ["1000", "blue"]

    ];


    const data =
        types[
            Math.floor(
                Math.random() *
                types.length
            )
        ];


    createTarget(

        8 + Math.random() * 84,

        25 + Math.random() * 55,

        Number(data[0]),

        data[1]

    );
}


/* =========================
   START
========================= */

function startGame() {

    score = 0;

    time = 30;

    playing = true;

    paused = false;


    scoreText.textContent =
        score;

    timeText.textContent =
        time;


    startScreen.style.display =
        "none";


    createTargets();


    clearInterval(timer);


    timer = setInterval(() => {

        if (paused)
            return;


        time--;

        timeText.textContent =
            time;


        if (time <= 0) {

            endGame();

        }

    }, 1000);
}


/* =========================
   GAME OVER
========================= */

function endGame() {

    playing = false;

    clearInterval(timer);


    startScreen.style.display =
        "block";


    startScreen.innerHTML = `

        <h1>
            🎉 GAME OVER 🎉
        </h1>

        <p>
            YOUR SCORE
        </p>

        <h2 style="
            font-size:60px;
            color:#17427d;
        ">
            ${score}
        </h2>

        <button id="startButton">
            PLAY AGAIN
        </button>

    `;


    document
        .getElementById("startButton")
        .addEventListener(
            "click",
            startGame
        );
}


/* =========================
   PAUSE
========================= */

pauseButton.addEventListener(
    "click",
    () => {

        if (!playing)
            return;

        paused = !paused;

        pauseButton.textContent =
            paused ? "▶" : "Ⅱ";

    }
);


/* =========================
   マウス・タッチ照準
========================= */

stage.addEventListener(
    "pointermove",
    event => {

        if (!playing || paused)
            return;


        const rect =
            stage.getBoundingClientRect();


        const x =
            event.clientX -
            rect.left;


        const y =
            event.clientY -
            rect.top;


        crosshair.style.left =
            x + "px";

        crosshair.style.top =
            y + "px";
    }
);


/* =========================
   START BUTTON
========================= */

startButton.addEventListener(
    "click",
    startGame
);