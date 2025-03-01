const { sendJson } = require('../guider/sendResponse')
const templateTbl = require('../models/templete')
const support = require('../models/Support')
const flacksTable    = require('../models/flacks')
const { getIpadderss } = require("../guider/i2aNKmqBUD");
const { adminActivity } = require("../guider/adminActivity");
var ObjectId = require('mongoose').Types.ObjectId

const browser = require('browser-detect');

const addTemplete = async (req, res) => {
    try {
        const { templeteImage, discription, categort, tittle, templetetype, templeteLink } = req.body;
        const { name, _id } = req.user;
        const ip = await getIpadderss(req)
        const Brower = browser(req.headers['user-agent']).name
        const os = browser(req.headers['user-agent']).os

        const existsTemplete = await templateTbl.countDocuments({ tittle: tittle, deleteStatus: 0 }).exec()
        const templateObj = {
            templeteImage, discription, categort, tittle, templetetype, templeteLink
        }
        if (existsTemplete == 0) {
            const createTemplete = await templateTbl.create(templateObj).catch(async (err) => {
            await flacksTable.updateOne({tableName:"Banner"},{$set : {status : 1}})

                return sendJson({ status: false, message: err.message }, res)
            })
            const discriptionData = `new templete ${tittle} added by ${name}`

            await adminActivity(name, 'new Templete add', discriptionData, ip, Brower, os, _id)

            return sendJson({ status: true, message: "templete added successfully" }, res)



        } else {
            return sendJson({ status: false, message: 'templete tittle already used' }, res)
        }
    } catch (error) {
        return sendJson({ status: false, message: error.message }, res)
    }
}


const updateTemplete = async (req, res) => {
    try {
        const { templeteImage, discription, categort, templetetype, deleteStatus, status, templeteId, updatetype: type, tittle, templeteLink } = req.body;
        const { name, _id } = req.user;
        const ip = await getIpadderss(req)
        const Brower = browser(req.headers['user-agent']).name
        const os = browser(req.headers['user-agent']).os

        const filterData = { _id: templeteId }


        const checkTemplete = await templateTbl.countDocuments(filterData).exec()

        if (checkTemplete >= 1) {
            if (type == 'all') {
                const updateTempleteObj = {
                    templeteImage, discription, templetetype, deleteStatus, status, updateAt: Date.now(), categort, templeteLink
                }

                const updateTemplete = await templateTbl.updateOne(filterData, { '$set': updateTempleteObj }).catch(async (err) => {
                    return sendJson({ status: false, message: err.message }, res)
                })
                if (updateTemplete.acknowledged == true && updateTemplete.modifiedCount >= 1) {
                    await flacksTable.updateOne({tableName:"Banner"},{$set : {status : 1}})

                    const discriptionData = ` ${tittle} templete updated by ${name}`

                    await adminActivity(name, 'Templete update', discriptionData, ip, Brower, os, _id)
                    return sendJson({ status: true, message: 'templete update succcessfully !!!' }, res)
                } else {
                    return sendJson({ status: false, message: 'update failed' }, res)
                }
            } else if (type == 'single') {
                const updateTemplete = await templateTbl.updateOne(filterData, { '$set': { status: status } }).exec()
                await flacksTable.updateOne({tableName:"Banner"},{$set : {status : 1}})

                let checkstatus = (status == 'show') ? 'enable' : 'Disable'
                const updateDetails = (updateTemplete.acknowledged == true && updateTemplete.modifiedCount >= 1) ? { status: true, message: `templete ${checkstatus} update succcessfully !!!` }
                    : { status: false, message: `templete ${checkstatus} update failed !!!` }
                const discriptionData = ` ${tittle} templete updated by ${name}`

                await adminActivity(name, 'Templete update', discriptionData, ip, Brower, os, _id)
                return sendJson(updateDetails, res)
            }
            else {
                return sendJson({ status: false, message: 'updatetype is mismatch' }, res)
            }

        }
        else {
            return sendJson({ status: false, message: 'templete not found' }, res)
        }


    } catch (error) {
        return sendJson({ status: false, message: error.message }, res)

    }
}

const viewTempletes = async (req, res) => {
    try {
        const { filter, page, limit } = req.body;

        let queryObject = {};
        if (filter.length > 0) {
            queryObject = {
                '$or': [
                    { tittle: { $regex: '.*' + `${filter.trim()}` + '.*', $options: "i" } },
                    { categort: { $regex: '.*' + `${filter.trim()}` + '.*', $options: "i" } },
                ]
            }
        }
        queryObject.deleteStatus = 0
        const pages = Number(page || 1);
        const limits = Number(limit || 0);
        const skip = (pages - 1) * limits;

        const [templateData, templatecount] = await Promise.all([
            await templateTbl.find(queryObject).sort({ createAt: -1 }).skip(skip).limit(limits).exec(),
            await templateTbl.countDocuments(queryObject).exec()
        ]).catch(async (err) => {
            return sendJson({ status: false, message: err.message }, res)
        })

        return sendJson({ status: true, message: '', details: templateData, count: templatecount }, res)

    } catch (error) {
        return sendJson({ status: false, message: error.message }, res)
    }
}

const singleviewTemplete = async (req, res) => {
    try {
        const { templeteId } = req.body;

        const singleviewTemplete = await templateTbl.findOne({ templeteId: templeteId }).catch(async (error) => {
            return sendJson({ status: false, message: error.message }, res)
        })
        return sendJson({ status: true, message: '', details: singleviewTemplete || {} }, res)


    } catch (error) {
        return sendJson({ status: false, message: error.message }, res)
    }
}

const deleteTemplete = async (req, res) => {
    try {
        const { deleteTemplete: templeteId } = req.body;
        const { name, _id } = req.user;
        const ip = await getIpadderss(req)
        const Brower = browser(req.headers['user-agent']).name
        const os = browser(req.headers['user-agent']).os
        const checkTemplete = await templateTbl.findOne({ templeteId: templeteId }).exec()

        if (checkTemplete) {
            const deleteTemplete = await templateTbl.remove({ templeteId: templeteId }).catch(async (error) => {
                return sendJson({ status: false, message: error.message }, res)
            })
            await flacksTable.updateOne({tableName:"Banner"},{$set : {status : 1}})

            const discriptionData = `new templete ${checkTemplete.tittle} delete by ${name}`

            await adminActivity(name, 'templete delete', discriptionData, ip, Brower, os, _id)
            return sendJson({ status: true, message: 'Templete delete successfully' }, res)
        } else {
            return sendJson({ status: false, message: 'Templete not found!!!' }, res)
        }


    } catch (error) {
        return sendJson({ status: false, message: error.message }, res)
    }
}

const viewAllSupport = async (req, res) => {
    try {
        const { filter, page, limit } = req.body;
        let queryObject = {}
        if (filter?.length > 0) {
            queryObject = {
                '$or': [
                    { name: { $regex: '.*' + `${filter.trim()}` + '.*', $options: "i" } },
                ]
            }
        }
        const pages = Number(page || 1);
        const limits = Number(limit || 0);
        const skip = (pages - 1) * limits;

        let ticket = await support.find(queryObject).sort({ createAt: -1 }).skip(skip).limit(limits).exec()
        let count = await support.countDocuments().exec()

        if (ticket) {
            return sendJson({ status: true, details: ticket ,limits,pages,totalDoc: count}, res)
        } else {
            return sendJson({ status: false, message: "No data found" }, res)
        }

    } catch (error) {
        return sendJson({ status: false, message: error.message }, res)
    }
}

const viewSingleSupport = async (req, res) => {
    try {
        const { id } = req.body
        let singleTicket = await support.findOne({ _id: id })
        if (singleTicket) {
            return sendJson({ status: true, details: singleTicket }, res)
        } else {
            return sendJson({ status: false, message: "No data found" }, res)
        }

    } catch (error) {
        return sendJson({ status: false, message: error.message }, res)
    }
}

const replySupport = async (req, res) => {
    try {
        const { id, ticketStatus, replyMsg } = req.body

        let Ticket = await support.findOne({ _id: id })
        let replies = Ticket.reply;
        if (Ticket.ticketStatus == 0) {

            let obj = { "replyId": replies.length, "from": "adminToUser", "message": replyMsg, "repliedAt": Date.now() };

            replies.push(obj);

            let updateData = (ticketStatus == 0) ? { ticketStatus: 0, reply: replies, readStatus: 1 } : { ticketStatus: 1, reply: replies }

            await support.updateOne({ _id: id }, { $set: updateData }).then(async (tiketResult) => {

                if (tiketResult.modifiedCount == 1) {
                    let Msg = (ticketStatus == 0) ? "Ticket replied successfully" : "Ticket closed successfully"
                    return sendJson({ status: true, message: Msg }, res)
                } else {
                    let returnData = { status: true, text: 'Please try again later.', };
                    return sendJson({ status: true, message: returnData }, res)
                }
            })
        } else {
            return sendJson({ status: false, message: 'Ticket was already closed' }, res)
        }

    } catch (error) {
        return sendJson({ status: false, message: error.message }, res)
    }
}

module.exports = { addTemplete, updateTemplete, viewTempletes, singleviewTemplete, deleteTemplete, viewAllSupport, viewSingleSupport, replySupport }