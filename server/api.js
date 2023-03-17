const { withinTimeRange, timeToNumber } = require("./time.js")

const sql = require("sqlite3").verbose()
function getOpenRoomsByCampus(campus="North"){
    return new Promise((resolve, _) => {
        let d = new Date();
        let timeString = d.toLocaleTimeString('en-US', {hour: "numeric", minute: "numeric"});
        const db = new sql.Database('./ub_classes.sqlite');
        db.serialize(() => {
            db.all(`SELECT * FROM classes WHERE location = '${campus} Campus'`, (err, courses) => {
                if(err)
                    throw err;
                let distinct_least_until = {};
                courses.filter(course=>{
                    let isTime = !/[^APM\-0-9:\s]+/g.test(course.Time) ? withinTimeRange(timeString, course.Time) : false;
                    let isDay = course.Days.split(" ").includes(["", "M", "T", "W", "R", "F", "S"][d.getDay()]);
                    return !(isTime && isDay);
                }).forEach(course=>{
                    let obj = {'Until': course.Time.split(" - ")[0], "timeDelta":  timeToNumber(course.Time.split(" - ")[0]) - timeToNumber(timeString)};
                    if(distinct_least_until.hasOwnProperty(course.Room)){ // neq -1
                        if(obj.timeDelta < distinct_least_until[course.Room].timeDelta)
                            distinct_least_until[course.Room] = obj;
                    } else {
                        distinct_least_until[course.Room] = obj; // add obj if room has no entry
                    }
                });
                resolve(distinct_least_until);
                // .sort((a,b)=>a.Room.localeCompare(b.Room))
            });
        });
        db.close();
    });
}

const express = require("express");
const verifyToken = require("./verifyToken.js");
const api = new express.Router();

api.use(express.urlencoded({extended:true}));
api.use(express.json());

api.get("/favorites", verifyToken, (req, res) => {
    if(req.anonymous) // bad practice
        return res.status(401).json({error: "You must be logged in to use this feature."});
    const db = new sql.Database('./users.sqlite');
    db.serialize(() => {
        db.get(`SELECT favorites FROM users WHERE username='${req.JWTBody.username}'`, (err, {favorites}) => {
            if(err)
                throw err;
            res.json(favorites.split(","));
        });
    });
    db.close();
});

api.get("/:campus", (req,res)=>{
    let campus = req.params.campus;
    if(!["North", "South", "Downtown"].includes(campus))
        return res.status(400).json({sucess: false, error: "Invalid campus."});
    getOpenRoomsByCampus(campus).then(courses=>{
        res.json(courses);
    });
});

module.exports = {
    api,
    getOpenRoomsByCampus
}