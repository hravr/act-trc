const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();
const moment = require('moment');
const cors = require('cors');
app.use(cors());

const activityScheme = new Schema({ date: String, stime: String, ftime: String, distance: Number, act_type: String }, { versionKey: false});
const Activity = mongoose.model("Activity", activityScheme);

app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost:27017/usersdb", { useNewUrlParser: true }, function (err) {
    if (err) return console.log(err);
    app.listen(4000, function () {
        console.log("Сервер ожидает подключения...");
    });
});

app.get("/api/activitys", function (req, res) {

    Activity.find({}, function (err, activitys) {

        if (err) return console.log(err);
        res.send(activitys)
    });
});

app.get("/api/activitys/:id", function (req, res) {

    const id = req.params.id;
    Activity.findOne({ _id: id }, function (err, activity) {

        if (err) return console.log(err);
        res.send(activity);
    });
});

app.post("/api/activitys", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const activityDate = moment().format("MMMM D");
    const activityStime = req.body.stime;
    const activityFtime = req.body.ftime;
    const activityDistance = req.body.distance;
    const activityAct_type = req.body.act_type;
    const activity = new Activity({
        date:activityDate,
        stime: activityStime, ftime: activityFtime,
        distance: activityDistance, act_type: activityAct_type
    });

    activity.save(function (err) {
        if (err) return console.log(err);
        res.send(activity);
    });
});

app.delete("/api/activitys/:id", function (req, res) {

    const id = req.params.id;
    Activity.findByIdAndDelete(id, function (err, activity) {

        if (err) return console.log(err);
        res.send(activity);
    });
});

app.put("/api/activitys", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const activityStime = req.body.stime;
    const activityFtime = req.body.ftime;
    const activityDistance = req.body.distance;
    const activityAct_type = req.body.act_type;
    const activity = new Activity({
        stime: activityStime, ftime: activityFtime,
        distance: activityDistance, act_type: activityAct_type
    });

    Activity.findOneAndUpdate({ _id: id }, newActivity, { new: true }, function (err, activity) {
        if (err) return console.log(err);
        res.send(activity);
    });
});
