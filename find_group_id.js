const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('baileys');
const { Boom } = require('@hapi/boom');

async function connectToWhatsApp() {
    // Using auth state to save session
    const { state, saveCreds } = await useMultiFileAuthState('auth_session');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    // Handle connection updates
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed due to ', lastDisconnect.error, ', reconnecting: ', shouldReconnect);
            
            if(shouldReconnect) {
                connectToWhatsApp();
            }
        } else if(connection === 'open') {
            console.log('WhatsApp connection established!');
            
            // List all participating groups
            try {
                const groups = await sock.groupFetchAllParticipating();
                console.log('=== YOUR WHATSAPP GROUPS ===');
                console.log('Total groups:', Object.keys(groups).length);
                
                // Display each group with its ID
                Object.keys(groups).forEach((key, index) => {
                    const group = groups[key];
                    console.log(`\n[${index + 1}] Group Name: ${group.subject}`);
                    console.log(`   Group ID: ${key}`);
                    console.log(`   Members: ${group.participants.length}`);
                });
                
                console.log('\n=== INSTRUCTIONS ===');
                console.log('1. Copy the Group ID of the group you want to target');
                console.log('2. Use this ID in your main script by replacing TARGET_GROUP_ID');
                console.log('Example: const TARGET_GROUP_ID = \'123456789-123456789@g.us\';');
                
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        }
    });

    // Save credentials whenever they're updated
    sock.ev.on('creds.update', saveCreds);
}

// Run the main function
connectToWhatsApp();