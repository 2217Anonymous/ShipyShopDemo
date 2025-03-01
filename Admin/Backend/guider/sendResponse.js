
const sendJson = (data,res) => {
  try {
    return res.status(200).send({ payload : data})
  } catch (e) {
    return false;
  }
}

const errorJSON = (data,res) => {
  try {
    return res.status(500).send({ payload : data})
  } catch (e) {
    return false;
  }
}

module.exports ={sendJson,errorJSON}

