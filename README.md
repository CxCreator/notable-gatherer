# Notable Gatherer Plugin for Obsidian

This plugin helps you gather and organize notable points in your notes. It looks for lines starting with "->", collects them, and places them under a "Notables:" section at the top of your note.

## How It Works

1. Any text that starts with "->" anywhere in your note will be considered a notable point
2. When you run the command, it copies these lines to the "Notables:" section
3. The original lines stay in place
4. Duplicate notables are automatically removed

## Example

Your note:
```
Notables:

Meeting Notes:
-> Need to follow up with Sarah
Today was a productive meeting overall.
We discussed Q4 plans and budgets.
-> Schedule next sprint planning
Had good engagement from the team.

Random thoughts:
Feeling tired today, need more sleep.
-> Need to follow up with Sarah
The weather is nice outside.
Office temperature is too cold.
-> Buy more coffee
Remember to call mom later.
```

After running the command becomes:
```
Notables:
-> Need to follow up with Sarah
-> Schedule next sprint planning
-> Buy more coffee

Meeting Notes:
-> Need to follow up with Sarah
Today was a productive meeting overall.
We discussed Q4 plans and budgets.
-> Schedule next sprint planning
Had good engagement from the team.

Random thoughts:
Feeling tired today, need more sleep.
-> Need to follow up with Sarah
The weather is nice outside.
Office temperature is too cold.
-> Buy more coffee
Remember to call mom later.
```

## Installation

1. Open your Obsidian vault folder
2. Enable hidden files (On Mac: Press `Cmd + Shift + .` in Finder)
3. Navigate to `.obsidian/plugins/`
4. Create a new folder called `notable-gatherer`
5. Inside this folder, create these files:
   - `main.ts`
   - `manifest.json`
   - `package.json`
   - `rollup.config.js`
   - `tsconfig.json`

## Setup Development Environment

1. Open the plugin folder in VSCode
2. Open terminal in VSCode
3. Run these commands:
```bash
pnpm init
pnpm add obsidian typescript
pnpm add -D rollup @rollup/plugin-typescript @rollup/plugin-node-resolve @rollup/plugin-commonjs
pnpm run build
```

## Enable the Plugin

1. Open Obsidian Settings
2. Go to Community Plugins
3. Turn off Safe Mode if it's on
4. Enable "Notable Gatherer"

## Usage

1. Make sure your note has a "Notables:" section
2. Press `Cmd + P` (Mac) or `Ctrl + P` (Windows) to open command palette
3. Type "gather" to find the "Gather Notables" command
4. Press Enter to run it

## Requirements

- Note must have a "Notables:" section
- Notables must start with "->"

## Support

If you find any issues or have suggestions, please open an issue on GitHub.