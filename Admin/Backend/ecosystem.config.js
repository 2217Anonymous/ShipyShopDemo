module.exports = {
  apps: [{
    name: "E_comm_AdminBackend",
    script: 'api/index.js',
    watch: '.',
    ignore_watch: ["log/*"],
    log: './log/combained.outerr.log',
    err_file: "./log/error.log",
    env_production: {
      NODE_ENV: "production",
      PORT: 7000,
      RATE: 1500,
      ORGINS: ['http://localhost:3000']
    },
    env_development: {
      NODE_ENV: "development",
      PORT: 7000,
      RATE: 1500,
      MONGO_URI: 'mongodb://localhost:27017/Et-cart',
      //  MONGO_URI : 'mongodb://34.214.248.222:27017/ref_ecomm',
      JWT_EXPIRE: '1d',
      JWT_SECRET: 'alamsfdfsdsdfsdfsdfsdfsdfsdrafdar!@#$0fddlfjdfdfdssfds',
      JWT_SECRET_FOR_VERIFY: 'lfjfjasjfsdfsfr09ri09wfsdfsdfrilfdjdj',
      // REQUESTKEY : "REQUESTKEY", // payload encryption decryption key
      // gnirtStcennoCbd : "Ek/5COkv3BgxoTYQkWXPwdUHWvzIWG5LZXlrhxGE89AnNoL9rIMJ9FI+yobKl30s", // encrypted db string
      eulaVyektpyrcne: "sysyNjOT8ZSw1N64", // key value encryption and decryption
      eulaVvitpyrcne: "gkqP9gvY02HZCZr1", // iv value encryption and decryption
      eulaVyektpyrcnEresu: "kXlIWLAhxmfQVBAR", // key value encryption and decryption in user end
      eulaVvitpyrcnEresu: "QvQmgxutQyDRdiHS", // iv value encryption and decryption in user end
      eulaVyektpyrcnEyap: "sysyVjOT8ZSwtN74", // key value encryption and decryption
      eulaVvitpyrcnEyap: "vkqP9gvY07HZVZr7", // iv value encryption and decryption
      // ORGINS     : ['http://localhost:3000']
      SERVICE: "smtp.gmail.com",
      EMAIL_USER: "biovussmtp@gmail.com",
      EMAIL_PASS: "umzvwgnijapujoqx",
      HOST: "smtp.gmail.com",
      EMAIL_PORT: 465
    },
    env_staging: {
      NODE_ENV: "staging",
      PORT: 7000,
      RATE: 1500,
      // MONGO_URI : 'mongodb://localhost:27017/ref_ecomm',
      MONGO_URI: 'mongodb://localhost:27017/Et-cart',
      JWT_EXPIRE: '1d',
      JWT_SECRET: 'alamsfdfsdsdfsdfsdfsdfsdfsdrafdar!@#$0fddlfjdfdfdssfds',
      JWT_SECRET_FOR_VERIFY: 'lfjfjasjfsdfsfr09ri09wfsdfsdfrilfdjdj',
      // REQUESTKEY : "REQUESTKEY", // payload encryption decryption key
      // gnirtStcennoCbd : "Ek/5COkv3BgxoTYQkWXPwdUHWvzIWG5LZXlrhxGE89AnNoL9rIMJ9FI+yobKl30s", // encrypted db string
      eulaVyektpyrcne: "sysyNjOT8ZSw1N64", // key value encryption and decryption
      eulaVvitpyrcne: "gkqP9gvY02HZCZr1", // iv value encryption and decryption
      eulaVyektpyrcnEresu: "kXlIWLAhxmfQVBAR", // key value encryption and decryption in user end
      eulaVvitpyrcnEresu: "QvQmgxutQyDRdiHS", // iv value encryption and decryption in user end
      eulaVyektpyrcnEyap: "sysyVjOT8ZSwtN74", // key value encryption and decryption in payload
      eulaVvitpyrcnEyap: "vkqP9gvY07HZVZr7", // iv value encryption and decryption in payload
      // ORGINS     : ['http://localhost:3000'],
      SERVICE: "smtp.gmail.com",
      EMAIL_USER: "biovussmtp@gmail.com",
      EMAIL_PASS: "umzvwgnijapujoqx",
      HOST: "smtp.gmail.com",
      EMAIL_PORT: 465

    }
  }],
};
