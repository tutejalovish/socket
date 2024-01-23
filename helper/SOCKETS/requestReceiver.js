const jwt = require("jsonwebtoken");
const moment = require("moment");
const helper = require("./../helper");

const { hrmsDB } = require("../../config/pgdatabase");

exports.request = function (io, socket) {

	// START CONNECTION WITH CHAT
	socket.on('joinTrack', async (data) => {
		socket.join(data.trackid);
	});
  //INSERTION OF CHAT IN MESSAGES(DATABASE)
  socket.on("chat", async (data) => {
    try {
      socket.join(data.trackid);
      //token_res = await verifyToken(`${socket.handshake.auth.token}`);
      token_res = await verifyToken(`${data.header}`);
      let user_id = token_res.data.employee;
      await hrmsDB.query("INSERT INTO tbl_chat (incoming_msg_id, outgoing_msg_id, msg,insert_dt, trxn_id) values(:from_user, :to_user, :message, :insert_dt, :request)", {
        replacements: {
          request: data.trackid,
          from_user: user_id,
          to_user: data.empcode,
          message: data.msg,
          insert_dt: moment(new Date()).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
        },
        type: hrmsDB.QueryTypes.INSERT,
      });

      io.to(data.trackid).emit("chat", { msg: data.msg, outgoing:user_id, incoming: data.empcode });
    } catch (error) {
      console.log("error", error);
      socket.emit({
        status: "error",
        message: { msg: "something happend wrong, please try again later" },
        code: "500",
        debug: error.stack,
      });
    }
  });

  function verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
		console.log("ERRORSS",err)
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }
};
