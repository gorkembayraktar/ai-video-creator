import Imap from 'imap-simple';


import dotenv from 'dotenv';
dotenv.config()

const config = {
  imap: {
    user: process.env.EMAIL,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    secure: true,
    secureConnection: false,
    port: process.env.PORT ,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }, 
    authTimeout: 3000
  }
};

console.log(config)

async function getEmails() {
  try {
    const connection = await Imap.connect(config);
    await connection.openBox('INBOX');

    const searchCriteria = [
      'ALL',
      ['FROM', 'platform@stability.ai']
    ];

    // ['FROM', 'platform@stability.ai']

    const fetchOptions = {
      bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
      struct: true,
      markSeen: false,
      envelope: true
    };

    const results = await connection.search(searchCriteria, fetchOptions);

    const emails = results.slice(-3).reverse(); // Son üç e-postayı al ve ters çevir
    console.log(results.length);
    
    const response = []
    for (const email of emails) {
        console.log(email)
      const parts = Imap.getParts(email.attributes.struct);
      const part = parts.find(part => part.subtype === 'html');
      if (!part) {
        console.log(parts)
        console.log('Text part not found in the email');
        continue; // veya başka bir işlem yapabilirsiniz
      }

      const rawEmail = await connection.getPartData(email, part);

      response.push({
        detail:email.attributes.envelope,
        html: rawEmail
      })

  
    }
    console.log('leng',response);


    connection.end();
  } catch (err) {
    console.error('Error: ', err);
  }
}

getEmails();
