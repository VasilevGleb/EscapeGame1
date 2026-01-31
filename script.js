// Game state && Door state
const DOOR_STATE = {
    LOCKED: "locked",
    UNLOCKED: "unlocked",
    OPENED: "opened",
    CLOSED: "closed"
}
const state = {
    haveKey: false,
    door: DOOR_STATE.LOCKED,
    foundCloset: false,
    foundExit: false,
}

// Player inventory
let inventory = [];



const sceneText = document.querySelector('#scene-text');

const buttons = document.querySelectorAll('button');

const doorBtn = document.querySelector('[data-action="door"]')

// Door as obj
const door = {
    state: DOOR_STATE.LOCKED,

    interact() {
        // If door is closed and dont have a key
        if (this.state === DOOR_STATE.LOCKED && !state.haveKey) return "You need a key"

        // Door unlock and remove key from inventory 
        if (this.state === DOOR_STATE.LOCKED && state.haveKey) {
            this.state = DOOR_STATE.UNLOCKED
            state.haveKey = false
            inventory = inventory.filter(i => i !== "key")
            return "You unlocked door"
        }

        // Open door
        if (this.state === DOOR_STATE.UNLOCKED || this.state === DOOR_STATE.CLOSED) {
            this.state = DOOR_STATE.OPENED
            state.foundExit = true
            return "Is this exit? Can you now leave?"
        }

        // Close door
        if (this.state === DOOR_STATE.OPENED) {
            this.state = DOOR_STATE.CLOSED
            state.foundExit = false
            return "Door is closed!"
        }

    }
}

// Function Update door Button
function doorBtnUpdate() {
    const lables = {
        locked: "Unlock door",
        unlocked: "Open door",
        opened: "Close door",
        closed: "Open door"
    }
    doorBtn.textContent = lables[door.state]
}


// Function to render text in the scene
function renderText(text) {
    sceneText.textContent = text;
}

//func update visibility of buttons based on state
function updateButtonVisibility() {
    document.querySelector('#closet-btn').style.display = state.foundCloset ? 'inline-block' : 'none';
    document.querySelector('#exit-btn').style.display = state.foundExit ? 'inline-block' : 'none'
}


// Game Start

// Update door btn text 
doorBtnUpdate()
renderText("You are in a locked room. There is a door in front of you.");

// In game actions
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;


        // Inventory action
        if (action === "inventory") {
            renderText("Inventory: " + inventory.join(", "));
        }

        //search action
        if (action === "search" && !state.foundCloset) {
            renderText("You see a closet right next to you.")
            state.foundCloset = true;
            updateButtonVisibility();
            console.log("found closet")
        }
        else if (action === "search" && state.foundCloset) {
            renderText("You have already searched the room.");
        }

        // Closet action
        if (action === "closet") {
            if (!state.haveKey && state.door === DOOR_STATE.LOCKED) {
                renderText("You found a key inside the closet!");
                state.haveKey = true;
                inventory.push("key");
                console.log("Got key");
            }
            else {
                renderText("The closet is empty.");
            }
        }

        // Door actions
        if (action === "door") {

            const result = door.interact()
            renderText(result)

            state.foundCloset = false
            doorBtnUpdate()
            updateButtonVisibility()
        }

        // Exit action
        if (action === "exit" && state.foundExit === true) {
            renderText("You leave the room! Congratulations!")

            console.log("You win!")
        }

    })
})

