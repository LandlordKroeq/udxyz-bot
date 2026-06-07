# UD.xyz Vouch Bot

A Discord bot for managing vouches with a 1-5 star rating system.

## Features

- ✅ Submit vouches with 1-5 star ratings
- ✅ Add custom text comments
- ✅ Beautiful embed format
- ✅ Role-based permissions
- ✅ Service management
- ✅ Vouch history tracking

## Quick Start - Deploy to Replit (FREE)

### 1. Create a Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application**
3. Go to **Bot** tab → Click **Add Bot**
4. Copy your **TOKEN** (keep it secret!)

### 2. Deploy to Replit

1. Go to [Replit.com](https://replit.com) and sign up
2. Click **Create Repl** → Select **Node.js**
3. In the URL bar, paste: `https://github.com/LandlordKroeq/udxyz-bot`
4. Click **Import from GitHub**
5. Click the **Secrets** button (🔒 icon on left sidebar)
6. Add new secret:
   - **Key**: `DISCORD_TOKEN`
   - **Value**: Your bot token from step 1
7. Click **Run**

The bot will start automatically!

### 3. Add Bot to Your Server

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your bot → Go to **OAuth2** → **URL Generator**
3. Select scopes: `bot` + `applications.commands`
4. Select permissions: `Administrator`
5. Copy the generated URL
6. Paste in browser and select your server

## Commands

### `/vouch`
Submit a vouch for a service
- `service` - Service name (autocomplete)
- `rating` - 1-5 stars
- `text` - Your comment

### `/config` (Owner only)
- `add-service` - Add a service
- `remove-service` - Remove a service  
- `add-role` - Add a role allowed to vouch
- `remove-role` - Remove vouch role
- `set-channel` - Set vouch output channel (default: already set)

### `/ping`
Check if bot is alive

## Setup for Local Development

```bash
git clone https://github.com/LandlordKroeq/udxyz-bot
cd udxyz-bot
npm install
DISCORD_TOKEN=your_token_here npm start
```

## Files

- `config.json` - Service and role settings
- `vouches.json` - Vouch history
- `commands/` - Command files
- `index.js` - Main bot file

## Support

For issues, open an issue on GitHub.
