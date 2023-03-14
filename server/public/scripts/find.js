const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "/static/images/academic_map_1_1.png";
img.onload = () => {
    ctx.drawImage(img, 0, 0, 800, 800);
};

console.log("find.js loaded");

function populateOpenRoomsList(building){
    const url = `/api/${location.pathname.split("/").pop()}`;
    // TODO: Add building API
    fetch(url).then((response) => response.json()).then((rooms) => {
        console.log("Building: " + building);
        console.log(rooms.filter(room=>room.Room.includes(building)));
        let container = document.getElementById("room-container");
        container.innerHTML = "";
        let i = 0;
        let currentRow = document.createElement("div");
        currentRow.className = "row";
        rooms.forEach((room) => {
            if(!room.Room.includes(building))
                return;
            if(i % 2 == 0) {
                container.append(currentRow);
                currentRow = document.createElement("div");
                currentRow.className = "row";
            }
            let roomElement = document.createElement("div");
                roomElement.className = "col-md-3";
                roomElement.textContent = room.Room.split(" ").pop(); // <- def a better way to do this
                currentRow.append(roomElement);
            let meter = document.createElement("meter")
                meter.className = "time_remaining my-1";
                meter.min = 0, meter.max = 300;
                meter.low = 60, meter.optimum = 120;
                meter.value = room.timeDelta
                meter.textContent = meter.title = Math.floor(room.timeDelta/60) + "h " + room.timeDelta%60 + "m remaining";
                currentRow.append(meter);
            i++;
        });
        container.append(currentRow);
    });
}

document.getElementById("building").addEventListener("change", ({target}) => {
    populateOpenRoomsList(target.value);
});