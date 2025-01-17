function stringToTime(s){
    let r = s.split(" ")[0].split(":").map(x=>parseInt(x));
    let m;
    try{
        m = s.split(" ")[1][0];
    } catch(err){
        console.error(err);
        console.log(s);
    }
    if(m == "P")
        r[0] = r[0] == 12 ? 12 : r[0] + 12;
    if(m == "A" && r[0] == 12)
        r[0] = 0;
    return r;
}

// stringRange format example "9:30 AM - 10:20 AM"
function withinTimeRange(inputString, stringRange){
    let times = stringRange.split(" - ").map(x=>timeToNumber(x));
    let input = timeToNumber(inputString);
    return times[0] <= input && input <= times[1];
}

function timeToNumber(timeString){
    let time = stringToTime(timeString);
    return time[0]*60   + time[1];
}

module.exports = {
    withinTimeRange,
    timeToNumber
};