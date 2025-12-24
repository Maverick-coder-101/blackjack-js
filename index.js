const userName = document.getElementById("username-el")
const noUserName = document.getElementById("error-el")
let check = false

localStorage.clear()

function startGame() {
    const gameMode = document.querySelector('input[name="game_mode"]:checked')
    checkName(userName.value)
    
    if (check === true) {
        localStorage.setItem("username", userName.value)
        localStorage.setItem("credits", 100)
        localStorage.setItem("gameMode", gameMode.value)
        window.location.href = "black_jack.html"
        userName.value = ""
        //clear game mode after
    } else {
        noUserName.textContent = "No username entered, Please enter one!!"
    }
}

function checkName(name) {
    if (name != "") {
        check = true
    }
}