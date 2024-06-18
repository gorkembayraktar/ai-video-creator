import Imap from 'imap-simple';



export async function getEmails({
    user,
    password,
    host,
    port
},
filter
) { 
    const config = {
        imap: {
        user: user,
        password: password,
        host: host,
        secure: true,
        secureConnection: false,
        port: port ,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }, 
        authTimeout: 3000
        }
    };

    const response = []
    
  try {
    const connection = await Imap.connect(config);
    await connection.openBox('INBOX');

    const searchCriteria = [
      'ALL',
      ['FROM', filter]
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

    

    for (const email of emails) {
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
    connection.end();
  } catch (err) {
    console.error('Error: ', err);
  }


  return response;

}

