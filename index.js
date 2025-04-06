const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const qrcode = require('qrcode-terminal');

// Replace this with your target group ID
const TARGET_GROUP_ID = '120363262621534879@g.us';

async function connectToWhatsApp() {
    // Using auth state to save session
    const { state, saveCreds } = await useMultiFileAuthState('fetcher_auth_session');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    // Handle connection updates
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed due to ', lastDisconnect.error, ', reconnecting: ', shouldReconnect);
            
            if(shouldReconnect) {
                connectToWhatsApp();
            }
        } else if(connection === 'open') {
            console.log('WhatsApp connection established!');
            // Once connected, fetch group members
            fetchGroupMembers(sock);
        }
    });

    // Save credentials whenever they're updated
    sock.ev.on('creds.update', saveCreds);
}

async function fetchGroupMembers(sock) {
    try {
        console.log('Fetching group metadata...');
        const metadata = await sock.groupMetadata(TARGET_GROUP_ID);
        
        console.log(`Group name: ${metadata.subject}`);
        console.log(`Total participants: ${metadata.participants.length}`);
        
        // Extract participant IDs
        const participants = metadata.participants.map(p => ({
            id: p.id,
            isAdmin: p.admin ? true : false
        }));
        
        // Save to file
        fs.writeFileSync(
            'group_members.json', 
            JSON.stringify(participants, null, 2)
        );
        
        console.log('✅ Successfully saved group members to group_members.json');
        
        // Print sample of participant IDs
        console.log('Sample of participant IDs:');
        participants.slice(0, 5).forEach(p => {
            console.log(`- ${p.id} ${p.isAdmin ? '(admin)' : ''}`);
        });
        
    } catch (error) {
        console.error('Error fetching group members:', error);
    }
}

// Run the main function
connectToWhatsApp();