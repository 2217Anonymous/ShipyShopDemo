var xss = require("xss");
const { sendJson } = require("./sendResponse");

const removeXss = (data) => {
  try {
    var reqData = data.trim();
    var cleanData = xss(reqData);
    return cleanData;
  } catch (e) {
    return false;
  }
}

const CommonDecode = async (req, res, next) => {
  try {
    const { payload } = req.body;
    if (payload) {
      const revertPayload = /* await decryptPayload */(payload)
      const ConvertPayload = await removeXss(JSON.stringify(revertPayload))

      if (ConvertPayload) {
        req.body = await JSON.parse(ConvertPayload)
        next()
      } else {
        return sendJson({ status: false, message: "error is occured convertPayload " }, res)
      }
    } else {
      return sendJson({ status: false, message: "Something went wrong!!!" }, res)
    }
  } catch (error) {
    return sendJson({ status: false, message: "Some error occured" }, res)
  }
}

module.exports = { CommonDecode, removeXss }