// ws://というプロトコルを状況で分ける
var url = "ws://" + window.location.host + "/ws";
var ws = new WebSocket(url);
var myid = "";
var score = 0;
var time = 10;
var gameDuration = 10000; // 10秒
var id = "";
var gameStarted = false; // ゲームが開始したかどうかのフラグ

// 20秒ごとにping/pongを送信
setInterval(function() {
  ws.send("ping");
}, 20000);


ws.onopen = function() {
  showModal(); // モーダルを表示
  // alert("Ready? Start!");
  // startGame(); // ゲーム開始
};

ws.onmessage = function (msg) {
  var cmds = {"iam": iam, "set": set, "dis": dis};
  if (msg.data) {
    var parts = msg.data.split(" ")
    var cmd = cmds[parts[0]];
    if (cmd) {
      cmd.apply(null, parts.slice(1));
    }
  }
};

// モーダル表示
function showModal() {
  document.getElementById("myModal").style.display = "block";
}

function closeModal() {
  document.getElementById("myModal").style.display = "none";
}
// Game End Modal関連の関数
function showEndModal() {
  document.getElementById("endModal").style.display = "block";
  document.getElementById("finalScore").innerText = "Your final score: " + score;
}
function closeEndModal() {
  document.getElementById("endModal").style.display = "none";
}

function startGame() {
  gameStarted = true; // ゲーム開始フラグを立てる
  closeModal(); // モーダルを非表示
  setTimeout(endGame, gameDuration); // 10秒後にendGameを呼び出す

  // time をカウントダウンする
  setInterval(function() {
    time -= 1;
    if (time < 1) {
      time = "Time's up!";
    }
    // 残り時間を表示
    document.getElementById("time").innerText = "Time: " + time;
  }, 1000);
}

function endGame() {
  ws.send("end " + id + " " + score);
  gameStarted = false; // ゲーム終了
  showEndModal(); // ゲーム終了時にモーダルを表示
}

// ゲームをリスタート
function restartGame() {
  closeEndModal();
  window.open(window.location.href, "_blank");
}

// ゲームを終了
function quitGame() {
  closeEndModal();
  window.location.href = "/score";
}
function iam(id) {
  myid = id;
}

function set(id, x, y, score) {
  var node = document.getElementById("gopher-" + id);
  if (!node) {
    node = document.createElement("div");
    document.body.appendChild(node);
    node.className = "gopher";
    node.style.zIndex = id + 1;
    node.id = "gopher-" + id;

    // スコアを表示するための子要素を作成
    var scoreNode = document.createElement("span");
    scoreNode.className = "gopher-text";
    node.appendChild(scoreNode);
  }

  if (x === "end") {
    node.style.display = "flex";
    node.style.position = "relative";
  } 
  node.style.left = x + "px";
  node.style.top = y + "px";
  // スコアを更新（子要素にスコアを設定）
  var scoreNode = node.querySelector(".gopher-text");
  scoreNode.textContent = score;
}

function dis(id) {
  var node = document.getElementById("gopher-" + id);
  if (node) {
    document.body.removeChild(node);
  }
}

function updateScore(increment) {
  score += increment; // スコアを引数incrementだけ増やす
  document.getElementById("id").innerText = "ID: " + myid;
}

window.onmousemove = function (e) {
  if (!gameStarted) return; // ゲームが開始していない場合は何もしない
  if (myid !== "") {
    updateScore(1);
    set(myid, e.pageX, e.pageY, score);
    ws.send([e.pageX, e.pageY, score].join(" "));
  }
}

window.ontouchmove = function (e) {
  if (!gameStarted) return; // ゲームが開始していない場合は何もしない
  if (myid !== "") {
    updateScore(1);
    set(myid, e.touches[0].pageX, e.touches[0].pageY, score);
    ws.send([e.touches[0].pageX, e.touches[0].pageY, score].join(" "));
  }
}
