const CryptoJs = require('crypto-js');
const { hashSync, compareSync, compare } = require('bcryptjs');

var key, iv, payloadKey, payloadIv, salt;

async function secureKey() {
    // key         = CryptoJs.enc.Base64.parse(global.encryptKey)
    // iv          = CryptoJs.enc.Base64.parse(global.encryptIv)
    // userKey     = CryptoJs.enc.Base64.parse(global.userEncryptKey)
    // userIv      = CryptoJs.enc.Base64.parse(global.userEncryptIv)
    // payloadKey  = CryptoJs.enc.Base64.parse(global.payEncryptKey)
    // payloadIv   = CryptoJs.enc.Base64.parse(global.payEncryptIv)
    // salt = 'ygadhjevhjdbnh'

    key  = CryptoJs.enc.Base64.parse(process.env.key)
    iv   = CryptoJs.enc.Base64.parse(process.env.iv)
    userKey  = CryptoJs.enc.Base64.parse(process.env.KEY)
    payloadKey   = CryptoJs.enc.Base64.parse(process.env.IV)
    salt = process.env.salt
}
secureKey()

exports.encrypt = async (txt) => {
    try {
        if (txt !== null) {
            let encrypted = await CryptoJs.AES.encrypt(txt,key,{iv:iv}).toString();
            if(encrypted) { return encrypted; }  else { return false; }
        } else {
            return false
        }
    } catch (error) {
        return false
    }

}
    ,
    exports.decrypt = async (txt) => {
        try {
            if (txt !== null) {
                let text = txt.toString()
                let decrypted = await CryptoJs.AES.decrypt(text,key,{iv:iv})
                return decrypted.toString(CryptoJs.enc.Utf8)
            } else {
                return false
            }
        } catch (error) {
            return false
        }

    },
exports.userEncrypt = async (txt) => {
    try {
        if (txt !== null) {
            let encrypted = await CryptoJs.AES.encrypt(txt,userKey,{iv:userKey}).toString();
            if(encrypted) { return encrypted; }  else { return false; }
        } else {
            return false
        }
    } catch (error) {
        return false
    }

}
    ,
    exports.userDecrypt = async (txt) => {
        try {
            if (txt !== null) {
                let text = txt.toString()
                let decrypted = await CryptoJs.AES.decrypt(text,userKey,{iv:userKey})
                return decrypted.toString(CryptoJs.enc.Utf8)
            } else {
                return false
            }
        } catch (error) {
            return false
        }

    },
    exports.encryptPayload = async (txt) => {
        try {
            if (txt) {
                let encrypted = await CryptoJs.AES.encrypt(JSON.stringify(txt), payloadKey, { iv: payloadIv }).toString();
                if (encrypted) {
                    return encrypted;
                } else {
                    return false
                }
            } else {
                return false
            }
        } catch (error) {
            return false
        }


    },
    exports.decryptPayload = async (txt) => {
        try {
            if (txt) {  
                let decrypted = await CryptoJs.AES.decrypt(txt.toString(), payloadKey, { iv: payloadIv })
                if (decrypted) {
                    return JSON.parse(decrypted.toString(CryptoJs.enc.Utf8))
                } else {
                    return false
                }

            } else {
                return false;
            }
        } catch (error) {
            return false
        }

    }

exports.bEncrypt = async (text) => {
    try {
        if (text) {
            let bEncodeData = await hashSync(text, salt)
            if (bEncodeData) {
                return bEncodeData
            } else {
                return false;
            }
           
        } else {
            return false;
        }

    } catch (error) {
        return false;
    }
}

exports.bDecrypt = async (text,hash) => {
    try {
        if (text) {
                const retrunbDecryptData = await compareSync(text,hash)
                 if(retrunbDecryptData){
                    return retrunbDecryptData;
                 }
                 else {
                    return false;
                 }
                
        } else {
           return false 
        }
    } catch (error) {
        return false
    }
}
