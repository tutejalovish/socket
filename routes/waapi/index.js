const express = require("express");
const router = express.Router();
const axios = require('axios');

const apiToken = 'Q7ibf7mXumQypFaybXFIAty1KdcLh5fbMCTsUXaD70380fdb';

const config = {
    headers: {
        'Authorization': 'Bearer ' + apiToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};

const isRegisteredUser = async (number) => {

    const res = await axios.post('https://waapi.app/api/v1/instances/4224/client/action/is-registered-user', { contactId: number + "@c.us" }, config)
    return res.data.data.data.isRegisteredUser
}

router.get('/instances', async (req, res) => {
    try {
        const response = await axios.get('https://waapi.app/api/v1/instances', config);

        const instances = response.data.instances; // array of all instances of the authenticated user

        const data = [];


        instances.forEach(instance => {
            data.push({
                Instance_ID: id,
                Owner_Email: ownerEmail,
                Webhook_URL: webhookUrl,
                Webhook_Events: webhookEvents.join(', ')
            })
        });

        return res.json({ code: 200, status: "success", data: data })

    }
    catch (err) {
        return res.json({ code: 500, message: { msg: "Internal Error!!! If this condition persists, contact your system administrator" }, status: "error", err: err.stack });
    }
});

router.post("/sendSms", async (req, res) => {
    try {

        const payload = {
            chatId: req.body.number + '@c.us',
            message: req.body.sms
        }

        let isReg = await isRegisteredUser(req.body.number);
        if (!isReg) {
            return res.json({ code: 500, status: "error", message: { msg: "Please check mobile number!!!" } })
        }

        const response = await axios.post('https://waapi.app/api/v1/instances/4224/client/action/send-message', payload, config)

        if (response.data.data.status == "success") {
            return res.json({ code: 200, status: "success" })
        } else {
            return res.json({ code: 500, status: "error", message: { msg: "something went wrong!!!" } })
        }


    }
    catch (err) {
        return res.json({ code: 500, message: { msg: "Internal Error!!! If this condition persists, contact your system administrator" }, status: "error", err: err.stack });
    }
})

router.post("/sendMedia", async (req, res) => {
    try {

        const payload = {
            "chatId": req.body.number + "@c.us",
            "mediaUrl": "https://waapi.app/android-chrome-192x192.png",
            "mediaCaption": req.body.mediaCaption ?? NA,
            "mediaName": "imageName.png"
        }


        let isReg = await isRegisteredUser(req.body.number);
        if (!isReg) {
            return res.json({ code: 500, status: "error", message: { msg: "Please check mobile number!!!" } })
        }

        const response = await axios.post('https://waapi.app/api/v1/instances/4224/client/action/send-media', payload, config)

        if (response.data.data.status == "success") {
            return res.json({ code: 200, status: "success" })
        } else {
            return res.json({ code: 500, status: "error", message: { msg: "something went wrong!!!" } })
        }
    }
    catch (err) {
        return res.json({ code: 500, message: { msg: "Internal Error!!! If this condition persists, contact your system administrator" }, status: "error", err: err.stack });
    }
});

router.post("/is-registered-user", async (req, res) => {
    try {

        const payload = {
            contactId: req.body.number + "@c.us"
        }

        const response = await axios.post('https://waapi.app/api/v1/instances/4224/client/action/is-registered-user', payload, config)

        if (response.data.data.status == "success") {
            return res.json({ code: 200, status: "success" , data : response.data.data.data.isRegisteredUser })
        } else {
            return res.json({ code: 500, status: "error", message: { msg: "something went wrong!!!" } })
        }
    }
    catch (err) {
        return res.json({ code: 500, message: { msg: "Internal Error!!! If this condition persists, contact your system administrator" }, status: "error", err: err.stack });
    }
})

router.post("/clientInfo", async (req, res) => {
    try {

        const response = await axios.get('https://waapi.app/api/v1/instances/4224/client/me', config)

        if (response.data.status == "success") {
            return res.json({ code: 200, status: "success" , data : response.data.me.data })
        } else {
            return res.json({ code: 500, status: "error", message: { msg: "something went wrong!!!" } })
        }   
    }
    catch (err) {
        return res.json({ code: 500, message: { msg: "Internal Error!!! If this condition persists, contact your system administrator" }, status: "error", err: err.stack });
    }
})


module.exports = router