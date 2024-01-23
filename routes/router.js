module.exports = function (app) {
    app.use("/waapi", require("./waapi/index.js"))
}