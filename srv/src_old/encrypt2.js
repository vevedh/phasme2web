const crypto = require('crypto');


//const secretKey =  "UkXn2r5u8x/A?D(G+KbPeShVmYq3s6v9";//process.env.SECRET;//https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx


const encrypt = (secretKey,text) => {

  const algorithm = 'aes-256-ctr';

  const iv = require('crypto').randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  /*return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };*/
  return iv.toString('hex')+'|'+encrypted.toString('hex');
};

const decrypt = (secretKey,text) => {


  const algorithm = 'aes-256-ctr';

  let hash = { iv:text.split('|')[0],content: text.split('|')[1] };
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

  return decrpyted.toString();
};

module.exports = {
  encrypt,
  decrypt
};
