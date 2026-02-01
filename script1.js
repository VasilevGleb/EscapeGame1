const sceneText = document.getElementById("scene-text")
const buttons = document.querySelectorAll('button')
const doorBtn = document.querySelector('[data-action = "1"]')
const searchBtn = document.querySelector('[data-action = "2"]')
const inventoryBtn = document.querySelector('[data-action = "3"]')
const openBtn = document.querySelector('[data-action = "4"]')
const goOutBtn = document.querySelector('[data-action = "5"]')



let scene = "room01"

const gameState = {
    door: "locked",
    haveObj: false,
    isRoom01Searched: false,
}

let inventory = []

// text like in old-school console games
function typeText(text, speed = 50) {
    sceneText.textContent = ""
    let i = 0

    const interval = setInterval(() => {
        sceneText.textContent += text[i]
        i++

        if (i >= text.length) {
            clearInterval(interval)
        }
    }, speed)
}

// Update visibility of buttons
function updateButtonVisibility() {
    document.querySelector('[data-action = "1"]').style.display = gameState.isRoom01Searched ? 'inline-block' : 'none'
    document.querySelector('[data-action = "3"]').style.display = gameState.haveObj ? 'inline-block' : 'none'
    document.querySelector('[data-action = "4"]').style.display = gameState.isRoom01Searched ? 'inline-block' : 'none'
    document.querySelector('[data-action = "5"]').style.display = gameState.door === "open" ? 'inline-block' : 'none'
}

typeText("Ты просыпаешься в тёмной комнате. Воздух тяжёлый. Где ты?")

// Actions reader
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action

        if (scene === "room01") {
            if (action === "1" && inventory.includes("key")) {
                typeText("You open the door")
                gameState.door = "open"
                console.log("Door open")
                inventory = inventory.filter(i => i !== "key")
                updateButtonVisibility()

            }
            else if (action === "1" && gameState.door === "open") {
                typeText("Door is already open")
            }
            else if (action === "1" && !inventory.includes("key")) {
                typeText("You need a key to open this door")
                console.log("Need key")
            }

            else if (action === "2" && !gameState.isRoom01Searched) {
                gameState.isRoom01Searched = true
                openBtn.textContent = "Open closet"
                typeText("You found a closed wood door and small closet")
                updateButtonVisibility()
                console.log("Found door and closet")
            }

            else if (action === "4" && !inventory.includes("key") && gameState.door === "locked") {
                typeText("Inside the closet you found a key. Probably it fits the door.")
                inventory.push("key")
                gameState.haveObj = true
                console.log(inventory)
                updateButtonVisibility()
            }

            else if (action === "5" && gameState.door === "open") {
                scene = "hall"
                typeText("You go out in hall. There is nobody.")
                console(scene)
            }
        }

    })
})
