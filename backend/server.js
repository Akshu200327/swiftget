const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const I = (name) => `https://img.icons8.com/color/96/${name}.png`;
const IF = (name) => `https://img.icons8.com/fluency/96/${name}.png`;
const IM = (name) => `https://img.icons8.com/color/96/${name}.png`;

const apps = [
  // Browsers
  { id: 'chrome', name: 'Google Chrome', category: 'browsers', winget: 'Google.Chrome', choco: 'googlechrome', brew: 'google-chrome', apt: null, icon: I('chrome'), color: '#4285F4', desc: 'Fast, secure web browser by Google' },
  { id: 'firefox', name: 'Mozilla Firefox', category: 'browsers', winget: 'Mozilla.Firefox', choco: 'firefox', brew: 'firefox', apt: 'firefox', icon: I('firefox'), color: '#FF7139', desc: 'Open-source browser focused on privacy' },
  { id: 'edge', name: 'Microsoft Edge', category: 'browsers', winget: 'Microsoft.Edge', choco: 'microsoft-edge', brew: 'microsoft-edge', apt: null, icon: I('ms-edge-new'), color: '#0078D7', desc: 'Microsoft\'s Chromium-based browser' },
  { id: 'brave', name: 'Brave', category: 'browsers', winget: 'Brave.Brave', choco: 'brave', brew: 'brave-browser', apt: null, icon: 'https://img.icons8.com/color/96/brave-web-browser.png', color: '#FB542B', desc: 'Privacy-focused browser with ad blocking' },
  { id: 'opera', name: 'Opera', category: 'browsers', winget: 'Opera.Opera', choco: 'opera', brew: 'opera', apt: null, icon: I('opera--v2'), color: '#FF1B2D', desc: 'Feature-rich browser with built-in VPN' },
  { id: 'operagx', name: 'Opera GX', category: 'browsers', winget: 'Opera.OperaGX', choco: 'opera-gx', brew: null, apt: null, icon: I('opera--v2'), color: '#EF3E36', desc: 'Gaming browser with resource controls' },
  { id: 'vivaldi', name: 'Vivaldi', category: 'browsers', winget: 'VivaldiTechnologies.Vivaldi', choco: 'vivaldi', brew: 'vivaldi', apt: null, icon: 'https://img.icons8.com/color/96/vivaldi.png', color: '#EF3939', desc: 'Highly customizable browser' },
  { id: 'tor', name: 'Tor Browser', category: 'browsers', winget: 'TorProject.TorBrowser', choco: 'tor-browser', brew: 'tor-browser', apt: null, icon: 'https://img.icons8.com/color/96/tor-browser.png', color: '#7D4698', desc: 'Anonymous browsing via Tor network' },
  { id: 'librewolf', name: 'LibreWolf', category: 'browsers', winget: 'LibreWolf.LibreWolf', choco: 'librewolf', brew: 'librewolf', apt: null, icon: I('firefox'), color: '#00ACFF', desc: 'Privacy-hardened Firefox fork' },

  // Communication
  { id: 'discord', name: 'Discord', category: 'communication', winget: 'Discord.Discord', choco: 'discord', brew: 'discord', apt: null, icon: I('discord'), color: '#5865F2', desc: 'Voice, video and text chat for communities' },
  { id: 'slack', name: 'Slack', category: 'communication', winget: 'SlackTechnologies.Slack', choco: 'slack', brew: 'slack', apt: null, icon: I('slack-new'), color: '#4A154B', desc: 'Team messaging and collaboration' },
  { id: 'telegram', name: 'Telegram Desktop', category: 'communication', winget: 'Telegram.TelegramDesktop', choco: 'telegram', brew: 'telegram', apt: null, icon: I('telegram-app'), color: '#2CA5E0', desc: 'Fast, secure messaging app' },
  { id: 'whatsapp', name: 'WhatsApp Desktop', category: 'communication', winget: 'WhatsApp.WhatsApp', choco: 'whatsapp', brew: 'whatsapp', apt: null, icon: I('whatsapp'), color: '#25D366', desc: 'WhatsApp for desktop' },
  { id: 'signal', name: 'Signal', category: 'communication', winget: 'OpenWhisperSystems.Signal', choco: 'signal', brew: 'signal', apt: null, icon: 'https://img.icons8.com/color/96/signal-app.png', color: '#3A76F0', desc: 'Encrypted private messaging' },
  { id: 'zoom', name: 'Zoom', category: 'communication', winget: 'Zoom.Zoom', choco: 'zoom', brew: 'zoom', apt: null, icon: I('zoom'), color: '#2D8CFF', desc: 'Video conferencing platform' },
  { id: 'teams', name: 'Microsoft Teams', category: 'communication', winget: 'Microsoft.Teams', choco: 'microsoft-teams', brew: 'microsoft-teams', apt: null, icon: IF('microsoft-teams'), color: '#6264A7', desc: 'Microsoft collaboration platform' },
  { id: 'skype', name: 'Skype', category: 'communication', winget: 'Microsoft.Skype', choco: 'skype', brew: 'skype', apt: null, icon: I('skype'), color: '#00AFF0', desc: 'Video calling and messaging' },

  // Media
  { id: 'vlc', name: 'VLC Media Player', category: 'media', winget: 'VideoLAN.VLC', choco: 'vlc', brew: 'vlc', apt: 'vlc', icon: I('vlc'), color: '#FF8800', desc: 'Universal media player' },
  { id: 'potplayer', name: 'PotPlayer', category: 'media', winget: 'Daum.PotPlayer', choco: 'potplayer', brew: null, apt: null, icon: 'https://img.icons8.com/color/96/potplayer.png', color: '#2A6EBB', desc: 'Powerful media player for Windows' },
  { id: 'foobar', name: 'foobar2000', category: 'media', winget: 'PeterPawlowski.foobar2000', choco: 'foobar2000', brew: null, apt: null, icon: 'https://img.icons8.com/color/96/foobar2000.png', color: '#1C6BA0', desc: 'Advanced audio player' },
  { id: 'aimp', name: 'AIMP', category: 'media', winget: 'AIMP.AIMP', choco: 'aimp', brew: null, apt: null, icon: 'https://img.icons8.com/color/96/aimp.png', color: '#1877F2', desc: 'Free music player with great sound' },
  { id: 'obs', name: 'OBS Studio', category: 'media', winget: 'OBSProject.OBSStudio', choco: 'obs-studio', brew: 'obs', apt: 'obs-studio', icon: 'https://img.icons8.com/color/96/obs-studio.png', color: '#302E31', desc: 'Free streaming and recording software' },
  { id: 'spotify', name: 'Spotify', category: 'media', winget: 'Spotify.Spotify', choco: 'spotify', brew: 'spotify', apt: null, icon: I('spotify'), color: '#1DB954', desc: 'Music and podcast streaming' },
  { id: 'itunes', name: 'iTunes', category: 'media', winget: 'Apple.iTunes', choco: 'itunes', brew: null, apt: null, icon: I('itunes'), color: '#FB5BC5', desc: 'Apple media player and library' },
  { id: 'winamp', name: 'Winamp', category: 'media', winget: 'Winamp.Winamp', choco: 'winamp', brew: null, apt: null, icon: 'https://img.icons8.com/color/96/winamp.png', color: '#D2A51A', desc: 'Classic music player, reborn' },

  // Design
  { id: 'gimp', name: 'GIMP', category: 'design', winget: 'GIMP.GIMP', choco: 'gimp', brew: 'gimp', apt: 'gimp', icon: I('gimp'), color: '#655B4B', desc: 'Free professional image editor' },
  { id: 'krita', name: 'Krita', category: 'design', winget: 'KDE.Krita', choco: 'krita', brew: 'krita', apt: 'krita', icon: 'https://img.icons8.com/color/96/krita.png', color: '#3DAEE9', desc: 'Digital painting and illustration' },
  { id: 'inkscape', name: 'Inkscape', category: 'design', winget: 'Inkscape.Inkscape', choco: 'inkscape', brew: 'inkscape', apt: 'inkscape', icon: 'https://img.icons8.com/color/96/inkscape.png', color: '#000000', desc: 'Free vector graphics editor' },
  { id: 'blender', name: 'Blender', category: 'design', winget: 'BlenderFoundation.Blender', choco: 'blender', brew: 'blender', apt: 'blender', icon: I('blender-3d'), color: '#E87D0D', desc: '3D creation suite' },
  { id: 'davinci', name: 'DaVinci Resolve', category: 'design', winget: 'Blackmagic.DaVinciResolve', choco: 'davinci-resolve', brew: 'davinci-resolve', apt: null, icon: 'https://img.icons8.com/color/96/davinci-resolve.png', color: '#233A51', desc: 'Professional video editing' },
  { id: 'paintnet', name: 'Paint.NET', category: 'design', winget: 'dotPDN.PaintDotNet', choco: 'paint.net', brew: null, apt: null, icon: 'https://img.icons8.com/color/96/paint.net.png', color: '#0078D7', desc: 'Simple yet powerful image editor' },
  { id: 'figma', name: 'Figma', category: 'design', winget: 'Figma.Figma', choco: 'figma', brew: 'figma', apt: null, icon: I('figma'), color: '#F24E1E', desc: 'Collaborative design tool' },

  // Development
  { id: 'vscode', name: 'Visual Studio Code', category: 'development', winget: 'Microsoft.VisualStudioCode', choco: 'vscode', brew: 'visual-studio-code', apt: null, icon: IF('visual-studio-code-2019'), color: '#007ACC', desc: 'Lightweight, powerful code editor' },
  { id: 'vs', name: 'Visual Studio', category: 'development', winget: 'Microsoft.VisualStudio.2022.Community', choco: 'visualstudio2022community', brew: null, apt: null, icon: IF('visual-studio'), color: '#5C2D91', desc: 'Full-featured IDE by Microsoft' },
  { id: 'intellij', name: 'IntelliJ IDEA', category: 'development', winget: 'JetBrains.IntelliJIDEA.Community', choco: 'intellijidea-community', brew: 'intellij-idea-ce', apt: null, icon: 'https://img.icons8.com/color/96/intellij-idea.png', color: '#FE315D', desc: 'JVM IDE by JetBrains' },
  { id: 'pycharm', name: 'PyCharm', category: 'development', winget: 'JetBrains.PyCharm.Community', choco: 'pycharm-community', brew: 'pycharm-ce', apt: null, icon: 'https://img.icons8.com/color/96/pycharm.png', color: '#21D789', desc: 'Python IDE by JetBrains' },
  { id: 'webstorm', name: 'WebStorm', category: 'development', winget: 'JetBrains.WebStorm', choco: 'webstorm', brew: 'webstorm', apt: null, icon: 'https://img.icons8.com/color/96/webstorm.png', color: '#00CDD7', desc: 'JavaScript and web IDE by JetBrains' },
  { id: 'androidstudio', name: 'Android Studio', category: 'development', winget: 'Google.AndroidStudio', choco: 'androidstudio', brew: 'android-studio', apt: null, icon: IF('android-studio--v2'), color: '#3DDC84', desc: 'Official Android development IDE' },
  { id: 'sublime', name: 'Sublime Text', category: 'development', winget: 'SublimeHQ.SublimeText.4', choco: 'sublimetext4', brew: 'sublime-text', apt: null, icon: 'https://img.icons8.com/color/96/sublime-text.png', color: '#FF9800', desc: 'Sophisticated text editor' },
  { id: 'notepadpp', name: 'Notepad++', category: 'development', winget: 'Notepad++.Notepad++', choco: 'notepadplusplus', brew: null, apt: null, icon: 'https://img.icons8.com/color/96/notepad-plus-plus.png', color: '#90C540', desc: 'Feature-rich text editor for Windows' },
  { id: 'git', name: 'Git', category: 'development', winget: 'Git.Git', choco: 'git', brew: 'git', apt: 'git', icon: I('git'), color: '#F05032', desc: 'Distributed version control system' },
  { id: 'githubdesktop', name: 'GitHub Desktop', category: 'development', winget: 'GitHub.GitHubDesktop', choco: 'github-desktop', brew: 'github', apt: null, icon: I('github'), color: '#181717', desc: 'Git GUI client by GitHub' },
  { id: 'docker', name: 'Docker Desktop', category: 'development', winget: 'Docker.DockerDesktop', choco: 'docker-desktop', brew: 'docker', apt: null, icon: I('docker'), color: '#2496ED', desc: 'Container platform' },
  { id: 'postman', name: 'Postman', category: 'development', winget: 'Postman.Postman', choco: 'postman', brew: 'postman', apt: null, icon: I('postman-api'), color: '#FF6C37', desc: 'API testing and development' },
  { id: 'nodejs', name: 'Node.js', category: 'development', winget: 'OpenJS.NodeJS', choco: 'nodejs', brew: 'node', apt: 'nodejs', icon: I('nodejs'), color: '#339933', desc: 'JavaScript runtime environment' },
  { id: 'python', name: 'Python', category: 'development', winget: 'Python.Python.3.12', choco: 'python', brew: 'python', apt: 'python3', icon: I('python'), color: '#3776AB', desc: 'Popular programming language' },
  { id: 'filezilla', name: 'FileZilla', category: 'development', winget: 'TimKosse.FileZilla.Client', choco: 'filezilla', brew: 'filezilla', apt: 'filezilla', icon: 'https://img.icons8.com/color/96/filezilla.png', color: '#BF0000', desc: 'Free FTP client' },

  // Utilities
  { id: '7zip', name: '7-Zip', category: 'utilities', winget: '7zip.7zip', choco: '7zip', brew: 'p7zip', apt: 'p7zip-full', icon: 'https://img.icons8.com/color/96/7zip.png', color: '#009926', desc: 'Free file archiver' },
  { id: 'winrar', name: 'WinRAR', category: 'utilities', winget: 'RARLab.WinRAR', choco: 'winrar', brew: null, apt: null, icon: 'https://img.icons8.com/color/96/winrar.png', color: '#8B008B', desc: 'Popular archive manager' },
  { id: 'everything', name: 'Everything', category: 'utilities', winget: 'voidtools.Everything', choco: 'everything', brew: null, apt: null, icon: IF('search'), color: '#0078D7', desc: 'Instant file search for Windows' },
  { id: 'powertoys', name: 'PowerToys', category: 'utilities', winget: 'Microsoft.PowerToys', choco: 'powertoys', brew: null, apt: null, icon: IF('microsoft'), color: '#F25022', desc: 'Power user utilities by Microsoft' },
  { id: 'ccleaner', name: 'CCleaner', category: 'utilities', winget: 'Piriform.CCleaner', choco: 'ccleaner', brew: null, apt: null, icon: 'https://img.icons8.com/color/96/ccleaner.png', color: '#23A84D', desc: 'System cleaning utility' },
  { id: 'rufus', name: 'Rufus', category: 'utilities', winget: 'Rufus.Rufus', choco: 'rufus', brew: null, apt: null, icon: IF('usb-2'), color: '#D43535', desc: 'Create bootable USB drives' },
  { id: 'ventoy', name: 'Ventoy', category: 'utilities', winget: 'Ventoy.Ventoy', choco: 'ventoy', brew: null, apt: null, icon: IF('usb-2'), color: '#1560BD', desc: 'Multiboot USB solution' },
  { id: 'hwinfo', name: 'HWiNFO', category: 'utilities', winget: 'REALiX.HWiNFO', choco: 'hwinfo', brew: null, apt: null, icon: IF('processor'), color: '#CC0000', desc: 'Hardware information and monitoring' },
  { id: 'crystaldisk', name: 'CrystalDiskInfo', category: 'utilities', winget: 'CrystalDewWorld.CrystalDiskInfo', choco: 'crystaldiskinfo', brew: null, apt: null, icon: IF('hard-disk'), color: '#0060C0', desc: 'Disk health monitoring tool' },
  { id: 'treesizefree', name: 'TreeSize Free', category: 'utilities', winget: 'JAMSoftware.TreeSize.Free', choco: 'treesizefree', brew: null, apt: null, icon: IF('folder-tree'), color: '#2E7D32', desc: 'Disk space manager' },

  // Security
  { id: 'malwarebytes', name: 'Malwarebytes', category: 'security', winget: 'Malwarebytes.Malwarebytes', choco: 'malwarebytes', brew: 'malwarebytes', apt: null, icon: I('malwarebytes'), color: '#00A4BD', desc: 'Anti-malware protection' },
  { id: 'bitwarden', name: 'Bitwarden', category: 'security', winget: 'Bitwarden.Bitwarden', choco: 'bitwarden', brew: 'bitwarden', apt: null, icon: I('bitwarden'), color: '#175DDC', desc: 'Open-source password manager' },
  { id: 'keepass', name: 'KeePass', category: 'security', winget: 'DominikReichl.KeePass', choco: 'keepass', brew: 'keepassxc', apt: 'keepassxc', icon: I('keepass'), color: '#6CAC4D', desc: 'Free, open-source password manager' },
  { id: '1password', name: '1Password', category: 'security', winget: 'AgileBits.1Password', choco: '1password', brew: '1password', apt: null, icon: 'https://img.icons8.com/color/96/1password.png', color: '#0094F5', desc: 'Premium password manager' },
  { id: 'avast', name: 'Avast Free Antivirus', category: 'security', winget: 'AVAST.AvastFreeAntivirus', choco: 'avastfreeantivirus', brew: null, apt: null, icon: I('avast-antivirus'), color: '#FF7900', desc: 'Free antivirus protection' },
  { id: 'kaspersky', name: 'Kaspersky', category: 'security', winget: 'Kaspersky.KasperskyFree', choco: 'kaspersky-free', brew: null, apt: null, icon: I('kaspersky-anti-virus'), color: '#006F51', desc: 'Comprehensive security suite' },

  // Productivity
  { id: 'notion', name: 'Notion', category: 'productivity', winget: 'Notion.Notion', choco: 'notion', brew: 'notion', apt: null, icon: I('notion'), color: '#000000', desc: 'All-in-one workspace and notes' },
  { id: 'obsidian', name: 'Obsidian', category: 'productivity', winget: 'Obsidian.Obsidian', choco: 'obsidian', brew: 'obsidian', apt: null, icon: 'https://img.icons8.com/color/96/obsidian.png', color: '#7C3AED', desc: 'Knowledge base and note-taking' },
  { id: 'evernote', name: 'Evernote', category: 'productivity', winget: 'Evernote.Evernote', choco: 'evernote', brew: 'evernote', apt: null, icon: I('evernote'), color: '#00A82D', desc: 'Note-taking and organization app' },
  { id: 'todoist', name: 'Todoist', category: 'productivity', winget: 'Doist.Todoist', choco: 'todoist', brew: 'todoist', apt: null, icon: I('todoist'), color: '#DB4035', desc: 'Task management app' },
  { id: 'libreoffice', name: 'LibreOffice', category: 'productivity', winget: 'TheDocumentFoundation.LibreOffice', choco: 'libreoffice-fresh', brew: 'libreoffice', apt: 'libreoffice', icon: I('libreoffice'), color: '#18A303', desc: 'Free office suite' },
  { id: 'foxitreader', name: 'Foxit PDF Reader', category: 'productivity', winget: 'Foxit.FoxitReader', choco: 'foxitreader', brew: null, apt: null, icon: IF('pdf-2'), color: '#CC0000', desc: 'Fast, lightweight PDF reader' },
  { id: 'adobereader', name: 'Adobe Acrobat Reader', category: 'productivity', winget: 'Adobe.Acrobat.Reader.64-bit', choco: 'adobereader', brew: 'adobe-acrobat-reader', apt: null, icon: 'https://img.icons8.com/color/96/adobe-acrobat--v1.png', color: '#EC1C24', desc: 'Industry-standard PDF reader' },
  { id: 'wpsoffice', name: 'WPS Office', category: 'productivity', winget: 'Kingsoft.WPSOffice', choco: 'wps-office-free', brew: null, apt: null, icon: 'https://img.icons8.com/color/96/wps-office.png', color: '#CC0000', desc: 'Free Office suite compatible with MS Office' },

  // Gaming
  { id: 'steam', name: 'Steam', category: 'gaming', winget: 'Valve.Steam', choco: 'steam', brew: 'steam', apt: null, icon: I('steam'), color: '#1B2838', desc: 'Valve\'s gaming platform' },
  { id: 'epicgames', name: 'Epic Games Launcher', category: 'gaming', winget: 'EpicGames.EpicGamesLauncher', choco: 'epicgameslauncher', brew: null, apt: null, icon: 'https://img.icons8.com/color/96/epic-games.png', color: '#313131', desc: 'Epic Games store and launcher' },
  { id: 'goggalaxy', name: 'GOG Galaxy', category: 'gaming', winget: 'GOG.Galaxy', choco: 'goggalaxy', brew: null, apt: null, icon: 'https://img.icons8.com/color/96/gog-galaxy.png', color: '#86328A', desc: 'DRM-free games platform' },
  { id: 'battlenet', name: 'Battle.net', category: 'gaming', winget: 'Blizzard.BattleNet', choco: 'battle.net', brew: 'battle-net', apt: null, icon: I('battle-net'), color: '#009AE4', desc: 'Blizzard games launcher' },
  { id: 'eaapp', name: 'EA App', category: 'gaming', winget: 'ElectronicArts.EADesktop', choco: 'ea-app', brew: null, apt: null, icon: IF('electronic-arts'), color: '#FF4747', desc: 'EA\'s gaming platform' },
  { id: 'ubisoft', name: 'Ubisoft Connect', category: 'gaming', winget: 'Ubisoft.Connect', choco: 'ubisoft-connect', brew: null, apt: null, icon: 'https://img.icons8.com/color/96/ubisoft.png', color: '#0070FF', desc: 'Ubisoft games launcher' },
  { id: 'msiafterburner', name: 'MSI Afterburner', category: 'gaming', winget: 'Guru3D.Afterburner', choco: 'msiafterburner', brew: null, apt: null, icon: IF('gpu'), color: '#CC0000', desc: 'GPU overclocking and monitoring' },
  { id: 'razercortex', name: 'Razer Cortex', category: 'gaming', winget: 'Razer.RazerCortex', choco: 'razercortex', brew: null, apt: null, icon: IF('razer'), color: '#00FF00', desc: 'Game booster and optimizer' },

  // Cloud Storage
  { id: 'googledrive', name: 'Google Drive', category: 'cloud', winget: 'Google.GoogleDrive', choco: 'googledrive', brew: 'google-drive', apt: null, icon: I('google-drive'), color: '#4285F4', desc: 'Google cloud storage sync' },
  { id: 'dropbox', name: 'Dropbox', category: 'cloud', winget: 'Dropbox.Dropbox', choco: 'dropbox', brew: 'dropbox', apt: null, icon: I('dropbox'), color: '#0061FF', desc: 'Cloud file storage and sync' },
  { id: 'onedrive', name: 'OneDrive', category: 'cloud', winget: 'Microsoft.OneDrive', choco: 'onedrive', brew: null, apt: null, icon: IF('onedrive'), color: '#0078D4', desc: 'Microsoft cloud storage' },
  { id: 'mega', name: 'MEGA', category: 'cloud', winget: 'Mega.MEGASync', choco: 'megasync', brew: 'megasync', apt: null, icon: I('mega'), color: '#D9272E', desc: 'End-to-end encrypted cloud storage' },
  { id: 'pcloud', name: 'pCloud', category: 'cloud', winget: 'pCloud.pCloud', choco: 'pcloud', brew: 'pcloud-drive', apt: null, icon: IF('cloud'), color: '#55C6EF', desc: 'Secure cloud storage service' },
];

// GET all apps
app.get('/api/apps', (req, res) => {
  res.json(apps);
});

// GET apps by category
app.get('/api/apps/category/:cat', (req, res) => {
  const filtered = apps.filter(a => a.category === req.params.cat);
  res.json(filtered);
});

// GET single app
app.get('/api/apps/:id', (req, res) => {
  const app_item = apps.find(a => a.id === req.params.id);
  if (!app_item) return res.status(404).json({ error: 'App not found' });
  res.json(app_item);
});

// POST generate installer script
app.post('/api/generate', (req, res) => {
  const { appIds, os, method } = req.body;
  if (!appIds || !appIds.length) return res.status(400).json({ error: 'No apps selected' });

  const selectedApps = apps.filter(a => appIds.includes(a.id));

  if (os === 'windows') {
    const script = generateWindowsScript(selectedApps, method);
    res.json({ script, filename: 'SwiftGet-Installer.bat', contentType: 'application/bat' });
  } else if (os === 'macos') {
    const script = generateMacScript(selectedApps);
    res.json({ script, filename: 'swiftget-install.sh', contentType: 'application/x-sh' });
  } else {
    const script = generateLinuxScript(selectedApps);
    res.json({ script, filename: 'swiftget-install.sh', contentType: 'application/x-sh' });
  }
});

function generateWindowsScript(apps, method) {
  const lines = [
    '@echo off',
    'setlocal EnableDelayedExpansion',
    'title SwiftGet Installer',
    'color 0A',
    'echo ================================================',
    'echo   SwiftGet - Automated Software Installer',
    'echo ================================================',
    'echo.',
    '',
    ':: Check for administrator privileges',
    'net session >nul 2>&1',
    'if %ErrorLevel% NEQ 0 (',
    '  echo [ERROR] Please run this script as Administrator.',
    '  echo Right-click the .bat file and select "Run as administrator"',
    '  pause',
    '  exit /b 1',
    ')',
    '',
  ];

  if (method === 'winget') {
    lines.push(':: Check winget availability');
    lines.push('where winget >nul 2>&1');
    lines.push('if %ErrorLevel% NEQ 0 (');
    lines.push('  echo [ERROR] winget not found. Please install App Installer from Microsoft Store.');
    lines.push('  start https://aka.ms/getwinget');
    lines.push('  pause');
    lines.push('  exit /b 1');
    lines.push(')');
    lines.push('');
    lines.push('echo Installing apps with winget...');
    lines.push('echo.');

    for (const app of apps) {
      if (app.winget) {
        lines.push(`echo [Installing] ${app.name}...`);
        lines.push(`winget install --id ${app.winget} --silent --accept-package-agreements --accept-source-agreements`);
        lines.push('if %ErrorLevel% NEQ 0 echo [WARN] Failed or already installed: ' + app.name);
        lines.push('');
      }
    }
  } else {
    lines.push(':: Check for Chocolatey, install if missing');
    lines.push('where choco >nul 2>&1');
    lines.push('if %ErrorLevel% NEQ 0 (');
    lines.push('  echo [INFO] Installing Chocolatey...');
    lines.push('  powershell -NoProfile -ExecutionPolicy Bypass -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString(\'https://community.chocolatey.org/install.ps1\'))"');
    lines.push(')');
    lines.push('');
    lines.push('echo Installing apps with Chocolatey...');
    lines.push('echo.');

    for (const app of apps) {
      if (app.choco) {
        lines.push(`echo [Installing] ${app.name}...`);
        lines.push(`choco install ${app.choco} -y --no-progress`);
        lines.push('');
      }
    }
  }

  lines.push('echo.');
  lines.push('echo ================================================');
  lines.push('echo   All done! Your apps are ready.');
  lines.push('echo ================================================');
  lines.push('pause');

  return lines.join('\r\n');
}

function generateMacScript(apps) {
  const brewApps = apps.filter(a => a.brew);
  const lines = [
    '#!/bin/bash',
    '# SwiftGet Installer - macOS',
    'set -e',
    '',
    'echo "================================================"',
    'echo "  SwiftGet - Automated Software Installer"',
    'echo "================================================"',
    'echo',
    '',
    '# Install Homebrew if not present',
    'if ! command -v brew &>/dev/null; then',
    '  echo "[INFO] Installing Homebrew..."',
    '  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
    'fi',
    '',
    'echo "Installing apps..."',
    'echo',
  ];

  for (const app of brewApps) {
    lines.push(`echo "[Installing] ${app.name}..."`);
    lines.push(`brew install --cask ${app.brew} 2>/dev/null || brew install ${app.brew} 2>/dev/null || echo "[WARN] Could not install ${app.name}"`);
    lines.push('');
  }

  lines.push('echo');
  lines.push('echo "================================================"');
  lines.push('echo "  All done! Your apps are ready."');
  lines.push('echo "================================================"');

  return lines.join('\n');
}

function generateLinuxScript(apps) {
  const aptApps = apps.filter(a => a.apt);
  const lines = [
    '#!/bin/bash',
    '# SwiftGet Installer - Linux',
    'set -e',
    '',
    'echo "================================================"',
    'echo "  SwiftGet - Automated Software Installer"',
    'echo "================================================"',
    'echo',
    '',
    'if [ "$EUID" -ne 0 ]; then',
    '  echo "[ERROR] Please run as root (sudo ./swiftget-install.sh)"',
    '  exit 1',
    'fi',
    '',
    'apt-get update -qq',
    'echo "Installing apps..."',
    'echo',
  ];

  for (const app of aptApps) {
    lines.push(`echo "[Installing] ${app.name}..."`);
    lines.push(`apt-get install -y ${app.apt} 2>/dev/null || echo "[WARN] Could not install ${app.name}"`);
    lines.push('');
  }

  lines.push('echo');
  lines.push('echo "================================================"');
  lines.push('echo "  All done! Your apps are ready."');
  lines.push('echo "================================================"');

  return lines.join('\n');
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`SwiftGet API running on port ${PORT}`));
