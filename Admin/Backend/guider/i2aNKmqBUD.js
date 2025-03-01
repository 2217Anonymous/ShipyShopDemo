const requestIp = require('request-ip');
// const access    = require('./access');

exports.getIpadderss = (req) => {
  try {
    let clientIp = requestIp.getClientIp(req);
    let ipAddres = req.ip;
        ipAddres = clientIp.replace('::ffff:', '');
    
    if(ipAddres) { return ipAddres; } else {  return false; }
  } catch (e) {
    return false;
  }
}

// exports.getValue = async(req,res,next) => { 

//   let { payload } = req.body;
//   let requestParams = await access.getRevertedRequest(payload);
//   let ipAddress   = await this.getIpadderss(req);
//   req.ipAddress   = ipAddress;
//   req.body        = requestParams;
//   next();

// }