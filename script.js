const score = document.querySelector(".Score");
const startscreen = document.querySelector(".StartScreen");
const gamearea = document.querySelector(".GameArea");
let player = { speed: 4, score: 0, start: false }; //change karnsa hai
let highest = 0;
startscreen.addEventListener("click", start);

let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
function keyDown(ev) {
  ev.preventDefault();
  keys[ev.key] = true;
}

function keyUp(ev) {
  ev.preventDefault();
  keys[ev.key] = false;
}

function isCollide(a, b) {
  let padding = 10; //buffer crash space
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();

  return !(
    aRect.bottom < bRect.top + padding ||
    aRect.top > bRect.bottom - padding ||
    aRect.right < bRect.left + padding ||
    aRect.left > bRect.right - padding
  );
}

function moveLines() {
  let lines = document.querySelectorAll(".lines");
  lines.forEach(function (item) {
    if (item.y >= 760) {
      item.y -= 800;
    }
    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}

function endGame() {
  player.start = false;
  startscreen.classList.remove("hide");
}

function moveCar(car) {
  let other = document.querySelectorAll(".other");
  other.forEach(function (item) {
    if (isCollide(car, item)) {
      // console.log("HIT");
      endGame();
    }
    if (item.y >= 750) {
      item.y = -300;
      item.style.left = Math.floor(Math.random() * 300) + "px"; //change
    }
    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}
function gamePlay() {
  let car = document.querySelector(".car");
  let road = gamearea.getBoundingClientRect();

  if (player.start) {
    moveLines();
    moveCar(car);
    if (keys.ArrowUp && player.y > road.top + 70) {
      player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < road.bottom - 70) {
      player.y += player.speed;
    }
    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < road.width - 97) {
      player.x += player.speed;
    }

    car.style.top = player.y + "px";
    car.style.left = player.x + "px";

    window.requestAnimationFrame(gamePlay);
    player.score++;
    if (player.score >= highest) {
      highest = player.score;
    }
    score.innerHTML = `<div>
                        Your Score: ${player.score} <br><br>
                        Highest Score: ${highest}
                      </div>`;
    player.speed = 4 + Math.floor(player.score / 1000); //to increase difficulty
  }
}
function Reset() {
  highest = 0;
}
function start() {
  startscreen.classList.add("hide");
  gamearea.innerHTML = "";

  player.start = true;
  player.score = 0;
  window.requestAnimationFrame(gamePlay);

  for (x = 0; x < 5; x++) {
    let roadline = document.createElement("div");
    roadline.setAttribute("class", "lines");
    roadline.y = x * 150;
    roadline.style.top = roadline.y + "px";
    gamearea.appendChild(roadline);
  }

  let car = document.createElement("div");
  car.setAttribute("class", "car");
  gamearea.appendChild(car);

  player.x = car.offsetLeft;
  player.y = car.offsetTop;

  for (x = 0; x < 3; x++) {
    let othercar = document.createElement("div");
    othercar.setAttribute("class", "other");
    othercar.y = (x + 1) * 350 * -1;
    othercar.style.top = othercar.y + "px";

    othercar.style.left = Math.floor(Math.random() * 350) + "px";
    gamearea.appendChild(othercar);
  }
}

window.onload = function () {
  document.getElementById("loading-overlay").style.display = "none";
};
