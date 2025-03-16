# Plan-Bot-Reloaded
Plan-Bot-Reloaded is a lightweight, versatile Discord bot intended to unite many features from different well-known Discord Bots, while being free of charge and open-source.
Built using Node.js and powered by Discord.js, it is the successor to the original Plan-Bot, incorporating numerous improvements, optimizations, and new features are planned.

This reimagined bot comes with an even more user-friendly Documentation and an expanded set of functionalities, making it ideal for communities looking to ditch their current 
expensive and proprietary bots and add some extra fun to their servers. Whether you're looking to monitor activities or engage your members with interactive features, Plan-Bot-Reloaded has you covered.

As the successor to [Plan-Bot](https://github.com/SJ-Plan-B/Plan-Bot), Plan-Bot-Reloaded takes everything we loved about the original and improves it, 
offering a more polished and efficient experience while maintaining the simplicity and accessibility that made it popular in the first place.

Whether you're a developer looking to contribute or a server owner looking for a reliable bot, Plan-Bot-Reloaded is here to help take your Discord server to the next level.


## Features
- **Self-Duplicating Voice Channels**: This feature allows users to select specific voice channels to be automatically cloned or deleted based on demand. It ensures that there is always one available voice channel, with no more than one active at a time. When the channel reaches its capacity, a new instance is created, and when the demand decreases, the excess channels are removed.
- **Music Bot Capabilities**: Plan-Bot-Reloaded includes built-in music bot features, allowing users to play, pause, skip, and control music directly within voice channels. With support for popular music platforms, users can easily queue songs, create playlists, and enjoy a seamless listening experience while interacting with others in the server.
- **Dice Rolling**: Plan-Bot-Reloaded includes a fun dice rolling feature, allowing users to roll virtual dice with customizable sides. Whether you’re playing tabletop games or just adding some randomness to your server, you can quickly roll a die and get your results right in the chat.
- **Coin Tossing**: With the coin tossing feature, Plan-Bot-Reloaded lets users flip a virtual coin for quick decisions or fun games. Simply toss the coin, and get a random result—heads or tails—right in the chat!
- **Welcome and Goodbye Messages**: Plan-Bot-Reloaded can send personalized welcome and goodbye messages when users join or leave the server. Customize these messages to greet new members, introduce them to the community, and say farewell to those who depart, creating a more engaging and friendly environment.
- **Activity Logging**: Plan-Bot-Reloaded keeps track of important server activities, providing logs for actions like bans, unbans, channel creations, deletions, and updates, as well as message, role changes, and voice state updates. This feature ensures that server administrators have a complete record of significant actions for better management and accountability.

## Setup (exemplary for an Ubuntu 24.10)

### Step 1: Install Node.js
Node.js is required to run the bot, and you'll need a version newer than what's available in the Ubuntu APT repositories. 

1. **Install Node.js**:
   - Visit the official [Node.js website](https://nodejs.org/en) to download the latest version.
   - Follow the installation instructions provided there for Ubuntu, which will ensure you get the newest version.

### Step 2: Clone the Repository and Install Dependencies

1. **Clone the repository**: 
   Use the `git clone` command to download the bot's source code to your server. In the terminal, run:
   ```bash
   git clone https://github.com/AS-Plan-B/Plan-Bot-Reloaded.git
   ```

2. **Navigate into the folder**:
   After cloning, move into the project directory:
   ```bash
   cd Plan-Bot-Reloaded
   ```

3. **Rename the configuration file**:
   The configuration file is named `config.json.example` by default. Rename it to `config.json`:
   ```bash
   mv config.json.example config.json
   ```

4. **Install the required dependencies**:
   Run the following command to install all the Node.js dependencies:
   ```bash
   npm install
   ```

5. **Install PM2 globally**:
   PM2 is used to manage and keep your bot running in the background:
   ```bash
   npm install pm2 -g
   ```

### Step 3: Configure Your Discord Bot

1. **Create a new Discord Application**:
   - Open the [Discord Developer Portal](https://discord.com/developers/applications) and log in with your Discord account.
   - Click on "New Application", enter a name for the bot, and click "Create".

2. **Configure OAuth2**:
   - Go to the **OAuth2** tab of the application.
   - Copy the `Client ID` and paste it into the `config.json` file, replacing the placeholder value:  
     ```json
     "clientId": "<--here-->"
     ```

3. **Get the Bot Token**:
   - Navigate to the **Bot** tab.
   - Copy the `Token` and paste it into the `config.json` file:
     ```json
     "token": "<--here-->"
     ```

4. **Enable Privileged Gateway Intents**:
   - Still in the **Bot** tab, enable the following intents:
     - **Presence Intent**
     - **Server Members Intent**
     - **Message Content Intent**
   - Save your changes.

5. **Set up OAuth2 Permissions**:
   - Go to the **OAuth2** tab and then click on **URL Generator**.
   - Under **Scopes**, check the `Bot` and `applications.commands` options.
   - Under **Bot Permissions**, select `Administrator` to grant the bot full permissions to manage the server.
   - Save the changes and open the provided URL in your browser.
   - Log in to your Discord account, select your server, and authorize the bot.

6. **Get the Guild ID**:
   - In Discord, go to **Settings > Advanced** and enable **Developer Mode**.
   - Right-click your server and select **Copy Server ID**.
   - Paste it into the `config.json` file:
     ```json
     "guildID": "<--here-->"
     ```

7. **Set Channel IDs for Messages**:
   - Similarly, set the channel IDs for various messages in the `config.json` file:
     - **Welcome Channel**: `welcomeChannelId`
     - **Goodbye Channel**: `goodbyeChannelId`
     - **Log Channel**: `logChannelId`

8. **Set Welcome/Goodbye Messages**:
   - Customize the titles and content for the welcome and goodbye messages in the `config.json`. Use `$(member)` to dynamically insert the member's name.

   Example:
   ```json
   "welcomeMessageTitle": "Welcome to the Server!",
   "welcomeMessage": "Hello $(member), welcome to our community!"
   ```

9. **Optional: Disable Logs**:
   If you want to disable the logs, set the `logs` option to `false` in the `config.json` file.

10. **Deploy command**:
   - Deploy the existing comamnds to the Discord-API
   ```bash
   node deploy-commands.js
   ```
---

### Step 4: Set Up MariaDB for Channel Duplication (Optional)

If you wish to enable channel duplication, you'll need to set up MariaDB.

1. **Install Docker**:
   First, install Docker if it's not already installed on your server:
   ```bash
   sudo apt update
   sudo apt install docker.io
   ```

2. **Add yourself to the Docker group**:
   This allows you to run Docker commands without `sudo`:
   ```bash
   sudo usermod -aG docker $(whoami)
   ```

3. **Check if you're in the Docker group**:
   Verify your group membership:
   ```bash
   groups $(whoami)
   ```

4. **Pull the MariaDB Docker image**:
   Run the following command to pull the MariaDB image from Docker Hub:
   ```bash
   docker pull mariadb
   ```

5. **Run the MariaDB container**:
   Start a new MariaDB container with the following command, replacing `your_password` with a strong password:
   ```bash
   docker run --name mariadbtest -e MYSQL_ROOT_PASSWORD=your_password -p 3306:3306 -d docker.io/library/mariadb
   ```

6. **Set Docker to restart MariaDB on boot**:
   Ensure the MariaDB container automatically restarts if the system reboots:
   ```bash
   docker update --restart unless-stopped $(docker ps -q)
   ```

7. **Connect to the MariaDB database**:
   Access the MariaDB database:
   ```bash
   mariadb -u root -p -P 3306 sys
   ```

8. **Create the channel duplication table**:
   Run the following SQL commands to create the table:
   ```sql
   CREATE TABLE channelDupe (
     channelID varchar(255) NOT NULL,
     name VARCHAR(255) NOT NULL,
     groupID varchar(255) NOT NULL,
     CONSTRAINT channelDupe_pk PRIMARY KEY (channelID)
   );
   ```

9. **Update MariaDB configuration**:
   - Rename the `mariadb.json.example` file to `mariadb.json`.
   - Change the password in the `mariadb.json` file to match the one you set for MariaDB.

---

### Step 5: Run the Bot with PM2

1. **Start the bot using PM2**:
   Run the bot in the background with PM2 so it stays running even if the server is restarted:
   ```bash
   pm2 start index.js --name Plan-Bot-Reloaded --watch
   ```

2. **Save the PM2 process list**:
   Ensure PM2 automatically starts the bot on system reboot:
   ```bash
   pm2 save
   ```

---

## Credit:

### https://github.com/TannerGabriel/discord-bot for the music commands
