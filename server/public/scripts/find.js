const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "/static/images/academic_map_1_1.png";
img.onload = () => {
    ctx.drawImage(img, 0, 0, 800, 800);
};

//returns a promise that resolves to the classes
async function getClasses(){
    if(window.classes)
        return new Promise((resolve, _) => resolve(window.classes));
    const response = await fetch(`/api/${location.pathname.split("/").pop()}`);
    window.classes = await response.json();
    return new Promise((resolve, _) => resolve(window.classes));
}

console.log("find.js loaded");

function populateOpenRoomsList(building){
    getClasses().then((rooms) => {
        console.log("Building: " + building);
        let container = document.getElementById("room-container");
        container.innerHTML = "";
        let i = 0;
        let currentRow = document.createElement("div");
        currentRow.className = "row";
        console.log(Object.entries(rooms))
        Object.entries(rooms).forEach(([roomName, room]) => {
            if(!roomName.includes(building))
                return;
            if(i % 2 == 0) {
                container.append(currentRow);
                currentRow = document.createElement("div");
                currentRow.className = "row";
            }
            let roomElement = document.createElement("div");
                roomElement.className = building != "" ? "col-2" : "col-3";
                roomElement.textContent = building != "" ? roomName.split(" ").pop() : roomName; // <- def a better way to do this
                currentRow.append(roomElement);
            if(room.timeDelta > 0){
                let meter = document.createElement("meter");
                    meter.className = "time_remaining mt-1 " + (building != "" ? "col-4" : "col-3");
                    meter.min = 0, meter.max = 300;
                    meter.low = 60, meter.optimum = 120;
                    meter.value = room.timeDelta
                    meter.textContent = meter.title = Math.floor(room.timeDelta/60) + "h " + room.timeDelta%60 + "m remaining";
                    currentRow.append(meter);
            } else {
                let span = document.createElement("span");
                span.className = "text-center " + (building != "" ? "col-4" : "col-3");
                span.textContent = "tomorrow";
                currentRow.append(span);
            }
            i++;
        });
        container.append(currentRow);
    });
}

document.getElementById("building").addEventListener("change", ({target}) => {
    populateOpenRoomsList(target.value);
});