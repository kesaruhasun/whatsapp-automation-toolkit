# WhatsApp Automation Toolkit 📱💬

> **IMPORTANT WARNING:** Using this toolkit carries a high risk of having your WhatsApp account permanently banned. Read the entire "Risks & Warnings" section before proceeding.

A Node.js-based toolkit for automating WhatsApp interactions using the Baileys library. This tool lets you extract group members and send personalized messages to WhatsApp contacts without needing to manually message each person.

## 🚨 Risks & Warnings: READ THIS FIRST! 🚨

**I CANNOT STRESS THIS ENOUGH: MY OWN WHATSAPP ACCOUNT WAS PERMANENTLY BANNED FOR USING SIMILAR AUTOMATION.**

WhatsApp's Terms of Service explicitly prohibit automated or bulk messaging. Using this toolkit may result in:

- **Temporary blocks** from sending messages
- **Permanent account suspension**
- Your phone number being **blacklisted** from WhatsApp services
- Loss of access to all your chat history and contacts
- Inability to create a new WhatsApp account with the same phone number

WhatsApp has sophisticated detection systems that can identify:
- Sending too many messages in a short time
- Sending identical messages to multiple contacts
- Unusual connection patterns from non-mobile devices
- Multiple connections from different IPs

### Proceed at your own risk! I take no responsibility for banned accounts.

## ✨ Features

- 📋 **Extract members** from any WhatsApp group you're part of
- 📝 **Format messages** using WhatsApp's markdown (bold, italic, lists)
- 📤 **Send sequential messages** to avoid link detection systems
- 📊 **Track delivery status** with detailed logs
- 🔄 **Multi-account support** for separate fetching and sending

## 🛠️ Installation

```bash
# Clone this repository
git clone https://github.com/yourusername/whatsapp-automation-toolkit.git

# Navigate to the project directory
cd whatsapp-automation-toolkit

# Install dependencies
npm install baileys @hapi/boom qrcode-terminal
```

## 📋 Prerequisites

- Node.js v14 or higher
- At least two different WhatsApp accounts (one for fetching, one for sending)
- Basic understanding of JavaScript
- **Patience** and **restraint** to use this responsibly

## 🚀 How to Use

### Step 1: Find Your Group IDs

```bash
node find_group_id.js
```

This will:
1. Display a QR code to scan with WhatsApp
2. Fetch and display all your groups with their IDs
3. Save this information to `whatsapp_groups.txt`

### Step 2: Extract Group Members

```bash
# First, edit index.js to add your target group ID
node index.js
```

This will:
1. Connect to WhatsApp using a QR code
2. Fetch all members from your specified group
3. Save them to `group_members.json`

### Step 3: Send Messages

```bash
# First, customize your messages in send_messages.js
node send_messages.js
```

This will:
1. Connect to WhatsApp using a DIFFERENT account
2. Send your customized messages to each member
3. Log progress to `message_log.txt`

## 📱 Safer Usage Tips

To reduce (but not eliminate) the risk of getting banned:

1. **Start small** - Test with 5-10 contacts before mass sending
2. **Increase delays** - Modify the delay between messages (minimum 30-60 seconds)
3. **Personalize messages** - Include the recipient's name if possible
4. **Limit volume** - Don't message more than 50 people per day
5. **Use a secondary number** - Never use your primary WhatsApp for this
6. **Be patient** - Rushing increases detection risk

## 📝 Message Formatting Examples

WhatsApp supports various text formatting options:

```
*Bold text* - Use asterisks
_Italic text_ - Use underscores
~Strikethrough~ - Use tildes
```text``` - Use triple backticks for monospace
> Quote - Use > at the start of a line
1. First item - Numbered lists
• First bullet - Bulleted lists with •
```

## 📚 How It Works

This toolkit uses the Baileys library, an unofficial WhatsApp Web API implementation. It:

1. Connects to WhatsApp's WebSocket without using a browser
2. Authenticates using the same QR system as WhatsApp Web
3. Interacts with the WhatsApp protocol directly

## ⚖️ Legal & Ethical Considerations

- **Never** send messages to people who haven't explicitly agreed to receive them
- **Never** use this for spam, scams, harassment, or illegal content
- **Always** identify yourself clearly in messages
- **Always** provide a way for recipients to opt out of future messages
- **Always** respect people's privacy and data protection rights

## ❓ Troubleshooting

**Q: The QR code isn't working**
A: QR codes expire after 20 seconds. If you don't scan it in time, the program will generate a new one.

**Q: I'm getting connection errors**
A: Make sure your internet is stable and try again. If problems persist, delete the auth_session folder and reconnect.

**Q: Messages aren't being delivered**
A: Your account might be temporarily restricted. Wait 24 hours before trying again with longer delays.

## 🤝 Contributing

Contributions to improve safety features and documentation are welcome. Please don't add features that would enable or encourage spam.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Thanks to the developers of the Baileys library
- This project is not affiliated with or endorsed by WhatsApp Inc.

---

**Remember:** The WhatsApp platform is designed for human-to-human communication. Use this toolkit sparingly, responsibly, and ethically. When in doubt, don't use automation.

**Search Keywords:** WhatsApp bulk messaging, WhatsApp group extractor, send WhatsApp message to all group members, WhatsApp automation, personal WhatsApp messages to group members
