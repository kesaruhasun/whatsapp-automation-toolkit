const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');

// Messages to send to group members
const FIRST_MESSAGE = `*Free Perplexity Pro Plan for SLIIT Students!* 🎓✨

Hi there! 👋 As a SLIIT student, you can now get a FREE Perplexity Pro plan by signing up with your IT number!

*Benefits include:*
• Access to GPT-4 Omni, Claude 3, Grok 2 & more advanced AI models
• 300+ daily Pro searches 
• File analysis for PDFs, CSVs, and images
• $5 monthly API credit for custom projects
• AI image generation & focus filters
• Perplexity Pages for structured research articles

I'll send the link in my next message 👇`;

const SECOND_MESSAGE = `https://plex.it/referrals/3P5CYPKD`;

const THIRD_MESSAGE = `*Important:* Please copy and paste the URL in your Chrome browser to get the offer.

*Bonus:* Share this with your friends and classmates and you could win gifts from Perplexity! 🎁

To learn how to win prizes, just reply with "win" to this message.

Questions? Just ask! 😊`;

// Delay between messages (in milliseconds)
const DELAY_BETWEEN_MESSAGES = 5000; // 5 seconds
const DELAY_BETWEEN_RECIPIENTS = 10000; // 10 seconds

async function connectToWhatsApp() {
    // Using a different auth folder for the sender account
    const { state, saveCreds } = await useMultiFileAuthState('sender_auth_session');
    
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
            // Once connected, send messages to group members
            sendMessagesToMembers(sock);
        }
    });

    // Save credentials whenever they're updated
    sock.ev.on('creds.update', saveCreds);
}

async function sendMessagesToMembers(sock) {
    try {
        // Check if the group members file exists
        if (!fs.existsSync('group_members.json')) {
            console.error('❌ group_members.json file not found. Please run index.js first to fetch group members.');
            return;
        }

        // Read the saved members file
        const members = JSON.parse(fs.readFileSync('group_members.json', 'utf8'));
        console.log(`Preparing to send messages to ${members.length} members...`);
        
        // Create a log file to track progress
        fs.writeFileSync('message_log.txt', `Started messaging at ${new Date().toISOString()}\n`);
        
        // Send to each member with a delay
        for (let i = 0; i < members.length; i++) {
            const memberJid = members[i].id;
            
            try {
                // Checking if the ID exists on WhatsApp
                const [result] = await sock.onWhatsApp(memberJid);
                
                if (result && result.exists) {
                    console.log(`[${i+1}/${members.length}] Sending messages to ${memberJid}...`);
                    
                    // Send first message
                    await sock.sendMessage(memberJid, { text: FIRST_MESSAGE });
                    console.log(`✅ First message sent to ${memberJid}`);
                    
                    // Wait before sending the second message (with the link)
                    await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_MESSAGES));
                    
                    // Send second message (the link)
                    await sock.sendMessage(memberJid, { text: SECOND_MESSAGE });
                    console.log(`✅ Second message (link) sent to ${memberJid}`);
                    
                    // Wait before sending the third message
                    await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_MESSAGES));
                    
                    // Send third message
                    await sock.sendMessage(memberJid, { text: THIRD_MESSAGE });
                    console.log(`✅ Third message sent to ${memberJid}`);
                    
                    // Log success
                    const logEntry = `✅ [${new Date().toISOString()}] All messages sent to ${memberJid}\n`;
                    fs.appendFileSync('message_log.txt', logEntry);
                } else {
                    // Log that user doesn't exist or has privacy settings
                    const logEntry = `❌ [${new Date().toISOString()}] ${memberJid} is not on WhatsApp or has privacy settings enabled\n`;
                    fs.appendFileSync('message_log.txt', logEntry);
                    console.log(`❌ ${memberJid} is not on WhatsApp or has privacy settings enabled`);
                }
            } catch (error) {
                // Log error for this specific user
                const logEntry = `❌ [${new Date().toISOString()}] Error sending to ${memberJid}: ${error.message}\n`;
                fs.appendFileSync('message_log.txt', logEntry);
                console.error(`❌ Error sending to ${memberJid}:`, error.message);
            }
            
            // Add a delay between recipients to avoid being blocked
            if (i < members.length - 1) {
                console.log(`Waiting ${DELAY_BETWEEN_RECIPIENTS/1000} seconds before messaging next recipient...`);
                await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_RECIPIENTS));
            }
        }
        
        console.log('✅ Finished sending messages to all members');
        fs.appendFileSync('message_log.txt', `Completed messaging at ${new Date().toISOString()}\n`);
        
    } catch (error) {
        console.error('Error in sendMessagesToMembers:', error);
    }
}

// Run the main function
connectToWhatsApp();