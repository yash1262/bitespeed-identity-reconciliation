import pool, { Contact } from './db';

export interface IdentifyRequest {
  email?: string;
  phoneNumber?: string;
}

export interface IdentifyResponse {
  contact: {
    primaryContatctId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  };
}

export const identifyContact = async (req: IdentifyRequest): Promise<IdentifyResponse> => {
  const { email, phoneNumber } = req;

  if (!email && !phoneNumber) {
    throw new Error('Either email or phoneNumber must be provided');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let contacts: Contact[] = [];
    
    if (email && phoneNumber) {
      const result = await client.query(
        `SELECT * FROM Contact 
         WHERE (email = $1 OR phoneNumber = $2) AND deletedAt IS NULL
         ORDER BY createdAt ASC`,
        [email, phoneNumber]
      );
      contacts = result.rows;
    } else if (email) {
      const result = await client.query(
        `SELECT * FROM Contact WHERE email = $1 AND deletedAt IS NULL ORDER BY createdAt ASC`,
        [email]
      );
      contacts = result.rows;
    } else if (phoneNumber) {
      const result = await client.query(
        `SELECT * FROM Contact WHERE phoneNumber = $1 AND deletedAt IS NULL ORDER BY createdAt ASC`,
        [phoneNumber]
      );
      contacts = result.rows;
    }

    if (contacts.length === 0) {
      const result = await client.query(
        `INSERT INTO Contact (phoneNumber, email, linkedId, linkPrecedence, createdAt, updatedAt)
         VALUES ($1, $2, NULL, 'primary', NOW(), NOW())
         RETURNING *`,
        [phoneNumber || null, email || null]
      );
      
      await client.query('COMMIT');
      
      const newContact = result.rows[0];
      return {
        contact: {
          primaryContatctId: newContact.id,
          emails: newContact.email ? [newContact.email] : [],
          phoneNumbers: newContact.phoneNumber ? [newContact.phoneNumber] : [],
          secondaryContactIds: []
        }
      };
    }

    const allLinkedContacts = await getAllLinkedContacts(client, contacts);
    
    const primaryContact = allLinkedContacts.find(c => c.linkPrecedence === 'primary') || allLinkedContacts[0];
    
    const emailMatch = allLinkedContacts.some(c => c.email === email);
    const phoneMatch = allLinkedContacts.some(c => c.phoneNumber === phoneNumber);
    
    const exactMatch = allLinkedContacts.some(c => 
      (email ? c.email === email : true) && (phoneNumber ? c.phoneNumber === phoneNumber : true)
    );

    if (!exactMatch && (email || phoneNumber)) {
      const hasNewInfo = (email && !emailMatch) || (phoneNumber && !phoneMatch);
      
      if (hasNewInfo) {
        const result = await client.query(
          `INSERT INTO Contact (phoneNumber, email, linkedId, linkPrecedence, createdAt, updatedAt)
           VALUES ($1, $2, $3, 'secondary', NOW(), NOW())
           RETURNING *`,
          [phoneNumber || null, email || null, primaryContact.id]
        );
        allLinkedContacts.push(result.rows[0]);
      }
    }

    const primaryContactsToConvert = allLinkedContacts.filter(
      c => c.linkPrecedence === 'primary' && c.id !== primaryContact.id
    );

    for (const contact of primaryContactsToConvert) {
      await client.query(
        `UPDATE Contact SET linkedId = $1, linkPrecedence = 'secondary', updatedAt = NOW()
         WHERE id = $2`,
        [primaryContact.id, contact.id]
      );
      
      await client.query(
        `UPDATE Contact SET linkedId = $1, updatedAt = NOW()
         WHERE linkedId = $2`,
        [primaryContact.id, contact.id]
      );
      
      contact.linkedId = primaryContact.id;
      contact.linkPrecedence = 'secondary';
    }

    await client.query('COMMIT');

    const finalContacts = await getAllLinkedContacts(client, [primaryContact]);
    
    return buildResponse(finalContacts);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getAllLinkedContacts = async (client: any, contacts: Contact[]): Promise<Contact[]> => {
  const contactIds = new Set<number>();
  const allContacts: Contact[] = [];

  for (const contact of contacts) {
    contactIds.add(contact.id);
    allContacts.push(contact);
  }

  const primaryIds = new Set<number>();
  for (const contact of contacts) {
    if (contact.linkPrecedence === 'primary') {
      primaryIds.add(contact.id);
    }
    if (contact.linkedId !== null) {
      primaryIds.add(contact.linkedId);
    }
  }

  for (const primaryId of primaryIds) {
    const result = await client.query(
      `SELECT * FROM Contact WHERE (id = $1 OR linkedId = $1) AND deletedAt IS NULL ORDER BY createdAt ASC`,
      [primaryId]
    );
    
    for (const contact of result.rows) {
      if (!contactIds.has(contact.id)) {
        contactIds.add(contact.id);
        allContacts.push(contact);
      }
    }
  }

  return allContacts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
};

const buildResponse = (contacts: Contact[]): IdentifyResponse => {
  const primaryContact = contacts.find(c => c.linkPrecedence === 'primary') || contacts[0];
  
  const emails = Array.from(new Set(contacts.map(c => c.email).filter(e => e !== null))) as string[];
  const phoneNumbers = Array.from(new Set(contacts.map(c => c.phoneNumber).filter(p => p !== null))) as string[];
  
  const primaryEmail = primaryContact.email;
  const primaryPhone = primaryContact.phoneNumber;
  
  const sortedEmails = [
    ...(primaryEmail ? [primaryEmail] : []),
    ...emails.filter(e => e !== primaryEmail)
  ];
  
  const sortedPhones = [
    ...(primaryPhone ? [primaryPhone] : []),
    ...phoneNumbers.filter(p => p !== primaryPhone)
  ];
  
  const secondaryContactIds = contacts
    .filter(c => c.linkPrecedence === 'secondary')
    .map(c => c.id);

  return {
    contact: {
      primaryContatctId: primaryContact.id,
      emails: sortedEmails,
      phoneNumbers: sortedPhones,
      secondaryContactIds
    }
  };
};
