const sceneText = document.getElementById("scene-text")
const buttons = document.querySelectorAll('button')
// Actions
const doorBtn = document.querySelector('[data-action = "1"]')
const searchBtn = document.querySelector('[data-action = "2"]')
const inventoryBtn = document.querySelector('[data-action = "3"]')
const openBtn = document.querySelector('[data-action = "4"]')
const goOutBtn = document.querySelector('[data-action = "5"]')
// Terminal
const terminal = document.getElementById("terminal")
const terminalInput = document.getElementById("terminal-input")

// Starter game state
const gameState = {
    storageDoor: "locked",
    seurityDoor: "locked",
    exitDoor: "locked",
    door02: "open",
    door01: "locked",
    isR01Searched: false,
    closetR01: "closed",
    hallSearched: false,
}

// Inventory as massive
let inventory = []


// Function to type text
function typeText(text, speed = 40) {
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

// Starter terminal state
const terminalState = {
    active: false,
    context: null,
}

// Function to activate the terminal
function activateTerminal(context, message) {
    terminalState.active = true
    terminalState.context = context
    terminal.classList.remove("hidden")
    terminalInput.focus()
    typeText(message)
}

// Terminal Event Listener
terminalInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return
    if (!terminalState.active) return

    const value = terminalInput.value.trim()
    terminalInput.value = ""

    switch (terminalState.context) {
        case "storageDoor":
            handleStorageDoor(value)
            break
        case "exitDoor":
            handleExitDoor(value)
            break
    }
})

function handleStorageDoor(code) {
    if (code === "152407") {
        typeText("Storage Door: ACCESS GRANTED")
        terminal.classList.add("hidden")
        terminalState.active = false
        terminalState.context = null
        gameState.storageDoor = "open"
    }
    else {
        typeText("ACCESS DENIED")
    }
}

function handleExitDoor(code) {
    if (code === "192103") {
        typeText("Exit Door: ACCESS GRANTED")
        terminal.classList.add("hidden")
        terminalState.active = false
        terminalState.context = null
        gameState.exitDoor = "open"
    }
    else {
        typeText("ACCESS DENIED")
    }
}

// Buttons Event Listener
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const action = button.dataset.action
        handleAction(action)
    })
})

// Starter scene
let scene = "room01"

const sceens = {
    room01: handleRoom01,
    //room02: handleRoom02,
    //storage: handleStorageRoom,
    //security: handleSecurityRoom,
    hall: handleHall,
}

function handleAction(action) {
    if (action === "3") {
        typeText("Inventory:", inventory.join(","))
        return
    }
    const sceenHandler = sceens[scene]
    if (sceenHandler) {
        sceenHandler(action)
    }
    else {
        console.warn("No sceen handler for scene:", scene)
    }
}

// Starter hidden display styles
terminal.style.display = 'none'
doorBtn.style.display = 'none'
openBtn.style.display = 'none'
inventoryBtn.style.display = 'none'
goOutBtn.style.display = 'none'

console.log("start")
typeText("You wake up in dark room. The air is hard to breath. Where are you?")
function handleRoom01(action) {
    switch (action) {
        case "1": //Door
            if (inventory.includes("keyR01")) {
                inventory = inventory.filter(i => i !== "keyR01")
                gameState.door01 = "open"
                typeText("You open the door R01")
                console.log("Door R01 is open")
                goOutBtn.style.display = 'inline-block'
            }
            else if (gameState.door01 === "locked" && !inventory.includes("keyR01")) {
                typeText("Door is locked. You need a key R01")
                console.log("You need a key")
            }
            break

        case "2": // Search    
            if (!gameState.isR01Searched) {
                typeText("In the room found you a closet and locked door. What now?")
                gameState.isR01Searched = true
                doorBtn.style.display = 'inline-block'
                openBtn.textContent = "Open closet"
                openBtn.style.display = 'inline-block'
                console.log("Found door and closet")
            }
            else if (gameState.closetR01 === "open" && !inventory.includes("keyR01")) {
                typeText("In one of a coats you found a key with tag 'R01'")
                inventory.push("keyR01")
                console.log("Found key R01")
            }
            else {
                typeText("You found all you needed!")
                console.log("Nothing more")
            }
            break

        case "4": // Open Button
            if (openBtn.textContent === "Open closet") {
                typeText("You open the closet. Inside you see old clothes.")
                gameState.closetR01 = "open"
                console.log("Closet is open")
                openBtn.textContent = "Close closet"
            }
            else if (openBtn.textContent === "Close closet") {
                typeText("You close the closet")
                gameState.closetR01 = "closed"
                console.log("Closet is closed")
                openBtn.textContent = "Open closet"
            }
            else {

            }
            break

        case "5": // Go out button
            if (gameState.door01 === "open") {
                typeText("You step into the hall. Nobody is there. You can`t understand your feelings, but you know that you are not alone there.")
                scene = "hall"
                console.log("You go to", scene)
                doorBtn.textContent = "Go to R01"
                openBtn.style.display = 'none'
                goOutBtn.style.display = 'none'
            }
    }

}
function handleHall(action) {
    switch (action) {
        case "1":
            if (!gameState.hallSearched) {
                typeText("You step into the R01")
                scene = "room01"
                console.log("You are in", scene)
                goOutBtn.style.display = 'inline-block'
            }
            else if (gameState.hallSearched) {
                typeText("Wounder, but door R02 was open. You step inside the room")
                scene = "room02"
                goOutBtn.style.color = 'yellow'
                goOutBtn.textContent = "Go out"
            }
            break

        case "2":
            if (!gameState.hallSearched && gameState.exitDoor === "locked") {
                gameState.hallSearched = true
                typeText("In the hall you see four more doors: R02, Exit, Storage and Security")
                console.log("Hall is searched")
                doorBtn.textContent = "To R02" // action 1
                searchBtn.textContent = "To storage" // action 2
                openBtn.textContent = "To Security" // action 4
                goOutBtn.style.color = '#00ff66'
                goOutBtn.textContent = "To Exit" // action 5
            }
            else if (gameState.hallSearched && gameState.storageDoor === "locked") {
                typeText("Storage door is locked. But is nowhere keyholl")
                console.log("Storage door:", gameState.storageDoor)
            }
            else if (gameState.storageDoor === "open") {
                typeText("You step into the storage.")
                scene = "storage"
                console.log("You are in", scene)
                goOutBtn.style.color = 'yellow'
                goOutBtn.textContent = "Go out"
            }
            break

        case "4":
            if (gameState.seurityDoor === "locked" && !inventory.includes("key-cardSEC")) {
                typeText("Security door is locked. You need a key-card")
                console.log("Security door is", gameState.seurityDoor)
            }
            else if (inventory.includes("key-cardSEC")) {
                typeText("You open security door and stept inside")
                inventory = inventory.filter(i => i !== "key-cardSEC")
                gameState.seurityDoor = "open"
                console.log("Security door is", gameState.seurityDoor)
                scene = "security"
                goOutBtn.style.color = 'yellow'
                goOutBtn.style.display = 'inline-block'
                goOutBtn.textContent = "Go out"
            }
            else { }
            break

        case "5":

    }
}