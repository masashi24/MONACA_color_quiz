// This is a JavaScript file
var isColorSelected = false;
var currentSelectedId = null;
var answernum = 1;
var gameMode = "easy";

function resetAnswerSelect(){
    isColorSelected = false;
    currentSelectedId = null;
}

function setAnswerNum(){
    var min = 1 ;
    var max = 3 ;
    if(gameMode == "easy"){
        max = 10;
    }
    else if (gameMode == "hard"){
        max = 20;
    }
    else if (gameMode == "godeye"){
        max = 30;
    }
    var ans = Math.floor( Math.random() * (max + 1 - min) ) + min ;
    console.log(`created answer = No.${ans}`)
    answernum = ans
    return max;
}

function startGame(level){
    var myNavigator = document.querySelector('#pageNavi');
    myNavigator.pushPage('02_quiz.html');
    myNavigator.addEventListener('postpush', function(event) {
        console.log("pushPage from title is finished game page started", event);
        console.log(`started game with level=${level}`)
        if (level == "easy"){
            gameMode = "easy";
        }
        else if (level == "hard"){
            gameMode = "hard";
        }
        else if (level == "godeye"){
            gameMode = "godeye";
        }
        initGame();
    });
}
function initGame(){
    resetAnswerSelect();
    var mondaiNum = setAnswerNum();
    ansColor = setAnswerColor();
    setMondaiColors(ansColor, mondaiNum);
}

function re_playGame()
{
    document.getElementById("caution").style.display="block";
    document.getElementById("correctAns").style.display="none";
    document.getElementById("wrongAns").style.display="none";
    document.getElementById("finalAnswer").disabled=false;
    document.getElementById("choseAgain").disabled=false;
    document.getElementById("comment").style.display="none";
    document.getElementById("playAgain").style.display="none";
    hideDialog('my-dialog');
    document.getElementById(currentSelectedId).style.borderColor = `black`;
    initGame();
}

function backTitle (){
    document.querySelector('#pageNavi').popPage();
}

function setAnswerColor(){
    var color = createRandomColor();
    var ansColor = convertColorToStr(color);
    document.getElementById("mondai").style.background = ansColor;
    console.log(`return color = ${color}`);
    return color;
}
function createRandomColor(){
    console.log("creating random color");
    var color = {r:0, g:0, b:0};
    for(var i in color){
        //color[i] = Math.floor(Math.random() * 256); // RGB 0～255の値で設定
        color[i] = Math.floor( Math.random() * (200 + 1 - 40) ) + 40; // RGB 40～200の値で設定
    }
    return color;
}
function convertColorToStr(color){
    var strColor = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
    return strColor
}

function setMondaiColors(ansColor,mondaiNum){
    if(gameMode == "easy"){
        var max = 80;
        var min = 40;
    }    
    if(gameMode == "hard"){
        var max = 50;
        var min = 25;
    }
    else if(gameMode == "godeye"){
        var max = 30;
        var min = 15;
    }
    var table = document.getElementById("mondaiTable");
    if(gameMode == "easy"){
        table.rows[0].style.display = "block";
        table.rows[1].style.display = "block";
        table.rows[2].style.display = "none";
        table.rows[3].style.display = "none";
        table.rows[4].style.display = "none";
        table.rows[5].style.display = "none";
    }
    else if(gameMode == "hard"){
        table.rows[0].style.display = "block";
        table.rows[1].style.display = "block";
        table.rows[2].style.display = "block";
        table.rows[3].style.display = "block";
        table.rows[4].style.display = "none";
        table.rows[5].style.display = "none";
    }
    else if(gameMode == "godeye"){
        table.rows[0].style.display = "block";
        table.rows[1].style.display = "block";
        table.rows[2].style.display = "block";
        table.rows[3].style.display = "block";
        table.rows[4].style.display = "block";
        table.rows[5].style.display = "block";
    }

    for (let i = 1; i <= mondaiNum; i++){
        if(i == answernum){
            console.log(`set correct color for answer_${i}`)
            var answerColor = convertColorToStr(ansColor);
            document.getElementById(`mondai_${i}`).style.background = answerColor;    
        }
        else{
            var addColorsFlag = [];
            var addColorsValue = [];
            for (let i = 0; i <= 2; i++){
                if (Math.floor(Math.random()*2 + 1) == 2){
                    addColorsFlag[i] = true;
                    addColorsValue[i] = Math.floor( Math.random() * (max + 1 - min) ) + min;
                }
                else {
                    addColorsFlag[i] = false;
                    addColorsValue[i] = 0;
                }
            }
            console.log(addColorsFlag);
            console.log(addColorsValue);

            var color = createNearlyColor(ansColor,addColorsFlag,addColorsValue);
            var mondaiColor = convertColorToStr(color);
            document.getElementById(`mondai_${i}`).style.background = mondaiColor;
        }
    }
}

function deleteTableLastRow(tableId) {
    var table = document.getElementById(tableId);  //表のオブジェクトを取得
    var row_num = table.rows.length;    //表の行数を取得
    if (row_num>1) {
        table.deleteRow(row_num - 1);   //末尾行を削除
    }
}

function createNearlyColor(color,flags,values){
    var changedColor = Object.assign({},color);
    for (let i = 0; i <= 2; i++){
        if(flags[i]==true){
            changedColor.r += values[i];
        }
    }
    return changedColor;
}

function judgeAns(){
    var judgeStr = "mondai_" + answernum;
    if(currentSelectedId == judgeStr){
        console.log("correct answer!");
        document.getElementById("caution").style.display="none";
        document.getElementById("correctAns").style.display="block";
        document.getElementById("finalAnswer").disabled=true;
        document.getElementById("choseAgain").disabled=true;
        document.getElementById("playAgain").style.display="block";
        comment("correctAns");
    }
    else if(!isColorSelected){
        ons.notification.toast('見本と同じと思う色を選択して下さい', {
            timeout: 2000
        });
    }
    else{
        console.log("wrong answer");
        document.getElementById("caution").style.display="none";
        document.getElementById("wrongAns").style.display="block";
        document.getElementById("finalAnswer").disabled=true;
        document.getElementById("choseAgain").disabled=true;
        document.getElementById("playAgain").style.display="block";
        comment("wrongAns");
    }
}

function comment(ans){
    document.getElementById("comment").style.display="block";
    if(ans == "correctAns"){
        if(gameMode == "easy"){
            document.getElementById("commentText").innerText = "まぁ、このくらいはね";
        }
        else if(gameMode == "hard"){
            document.getElementById("commentText").innerText = "すっご！デザイナー？";
        }
        else{
            document.getElementById("commentText").innerText = "アンミカさん！？";
        }
    }
    else{
        if(gameMode == "easy"){
            document.getElementById("commentText").innerText = "え？え？どしたん？";
        }
        else if(gameMode == "hard"){
            document.getElementById("commentText").innerText = "ドンマイ、みんなそんなもんよ";
        }
        else{
            document.getElementById("commentText").innerText = "白って２００色あんねんな。。。";
        }
    }
}

function selectAns(img){
    var id = img.id;
    if(!isColorSelected){
        document.getElementById(id).style.borderColor = `pink`;
        isColorSelected = true;
        currentSelectedId = id;
    }
    else{
        if(currentSelectedId != img.id){
            document.getElementById(id).style.borderColor = `pink`;
            document.getElementById(currentSelectedId).style.borderColor = `black`;
            currentSelectedId = id;
        }
        else{
            document.getElementById(currentSelectedId).style.borderColor = `black`;
            resetAnswerSelect();
        }
    }
    console.log(`isColorSelected,currentSelectedId = [${isColorSelected}, ${currentSelectedId}]`)
}

var showTemplateDialog = function() {
    if(isColorSelected){
        var dialog = document.getElementById('my-dialog');
        if (dialog) {
            dialog.show();
        } else {
            ons.createElement('dialog.html', { append: true })
            .then(function(dialog) {
                dialog.show();
            });
        }
    }
    else if(!isColorSelected){
        ons.notification.toast('見本と同じと思う色を選択して下さい', {
            timeout: 2000
        });
    }
};

var hideDialog = function(id) {
  document
    .getElementById(id)
    .hide();
};
