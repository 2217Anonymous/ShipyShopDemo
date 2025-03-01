const { getIpadderss } = require("../guider/i2aNKmqBUD");
const { adminActivity } = require("../guider/adminActivity");
const browser = require('browser-detect');
const { sendJson } = require('../guider/sendResponse');
const blogTbl = require('../models/blogtbl');


const createBlog = async (req, res) => {
    try {
        const { tittle, content, image, discription } = req.body;
        const { _id, name } = req.user;
        const ip = await getIpadderss(req)
        const Brower = browser(req.headers['user-agent']).name
        const os = browser(req.headers['user-agent']).os

        const existsVlog = await blogTbl.countDocuments({ 'blogTittle': blogTittle }).exec()

        if (existsVlog == 0) {
            const blogObj = {
                blogTittle: tittle,
                blogContent: content,
                blogImage: image,
                blogdiscription: discription
            }

            const blogcreateData = await blogTbl.create(blogObj).catch(async (err) => {
                return sendJson({ status: false, message: err.message }, res)
            })
            const Activitydiscription = `${tittle} blog create by ${name}`
            await adminActivity(name, 'Blog-create', Activitydiscription, ip, Brower, os, _id)
            return sendJson({ status: true, message: "Blog create successfully" }, res)

        } else {
            return sendJson({ status: false, message: 'blog tittle already used' }, res)
        }

    } catch (error) {
        return sendJson({ status: false, message: error.message }, res)
    }
}


const updateBlog = async (req, res) => {
    try {
        const { tittle, content, image, discription, blogId, status } = req.body;
        const { _id, name } = req.user;
        const ip = await getIpadderss(req)
        const Brower = browser(req.headers['user-agent']).name
        const os = browser(req.headers['user-agent']).os

        const filterData = { blogId: blogId }

        const checkBlog = await blogTbl.countDocuments(filterData).exec()

        if (checkBlog > 0) {
            const blogobj = {
                blogTittle: tittle,
                blogContent: content,
                blogImage: image,
                blogdiscription: discription,
                status: status
            }

            const updateblog = await blogTbl.updateOne(filterData, { '$set': blogobj }).exec()

            if (updateblog.acknowledged == true && updateblog.modifiedCount >= 1) {
                const Activitydiscription = `${tittle} blog create by ${name}`
                await adminActivity(name, 'Blog-create', Activitydiscription, ip, Brower, os, _id)
                return sendJson({ status: true, message: "Blog update successfully" }, res)
            } else {
                sendJson({ status: false, message: 'Blog update failed !!!' }, res)
            }

        } else {
            sendJson({ status: false, message: 'blog not found' }, res)
        }

    } catch (error) {
        return sendJson({ status: false, message: error.message }, res)
    }
}

const viewBlog = async (req, res) => {
    try {
        const { filter, page, limit } = req.body;
        // const { _id, name } = req.user;

        let queryObject = {}

        const pages = +(page || 1);
        const limits = +(limit || 0);
        const skip = (pages - 1) * limits;

        if (filter.length > 0) {
            queryObject = {
                '$or': [
                    { blogContent: { $regex: '.*' + `${filter.trim()}` + '.*', $options: "i" } },
                    { blogTittle: { $regex: '.*' + `${filter.trim()}` + '.*', $options: "i" } },
                ]
            }
        }
        queryObject.deleteStatus = 0
        const [blogDetails, totalcount] = await Promise.all([
            await blogTbl.find(queryObject).sort({ createAt: -1 }).skip(skip).limit(limits).exec(),
            await blogTbl.countDocuments(queryObject).exec()
        ]).catch(async (err) => {
            return sendJson({ status: false, message: err.message }, res)
        })

        return sendJson({ status: true, message: '', details: blogDetails || [], count: totalcount || 0 })

    } catch (error) {
        return sendJson({ status: false, message: error.message }, res)
    }
}

const singleBlog = async (req, res) => {
    try {
        const { BlogId } = req.body;

        const singleBlogDetails = await blogTbl.findOne({ blogId: BlogId }).catch(async (err) => {
            return sendJson({ status: false, message: err.message })
        })

        return sendJson({ status: true, message: '', details: singleBlogDetails || {} }, res)


    } catch (error) {
        return sendJson({ status: false, message: error.message }, res)
    }
}

const deleteBlog = async (req, res) => {
    try {
        const { BlogId } = req.body;
        const { _id, name } = req.user;
        const ip = await getIpadderss(req)
        const Brower = browser(req.headers['user-agent']).name
        const os = browser(req.headers['user-agent']).os

        const checkBlog = await blogTbl.findOne({ blogId: BlogId }).exec()

        if (checkBlog) {
            const singleBlogDetails = await blogTbl.remove({ blogId: BlogId }).catch(async (err) => {
                return sendJson({ status: false, message: err.message })
            })
            const Activitydiscription = `${checkBlog.blogTittle} blog delete by ${name}`
            await adminActivity(name, 'Blog-delete', Activitydiscription, ip, Brower, os, _id)
            return sendJson({ status: true, message: 'Blog deleteed successfully' }, res)
        } else {
            return sendJson({ status: false, message: 'Blog not found!!!' }, res)
        }
    } catch (error) {
        return sendJson({ status: false, message: error.message }, res)
    }
}
module.exports = { createBlog, updateBlog, viewBlog, singleBlog, deleteBlog }