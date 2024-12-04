import { Editor, MarkdownView, Notice, Plugin, MarkdownFileInfo } from 'obsidian';

export default class NotableGathererPlugin extends Plugin {
    async onload() {
        // Add command to gather notables
        this.addCommand({
            id: 'gather-notables',
            name: 'Gather Notables',
            editorCallback: (editor: Editor, ctx: MarkdownView | MarkdownFileInfo) => {
                this.gatherNotables(editor);
            }
        });
    }

    gatherNotables(editor: Editor) {
        // Get the current content
        const content = editor.getValue();
        const lines = content.split('\n');

        // Find the Notables section
        const notablesIndex = lines.findIndex(line => line.trim() === 'Notables:');
        
        if (notablesIndex === -1) {
            new Notice('No "Notables:" section found!');
            return;
        }

        // Collect all lines starting with "->"
        const notableLines = lines
            .filter(line => line.trim().startsWith('->'))
            .filter((line, index, self) => self.indexOf(line) === index); // Remove duplicates

        // Insert collected notables after the "Notables:" line
        // First, remove any existing notables in that section
        let insertIndex = notablesIndex + 1;
        while (insertIndex < lines.length && 
               (lines[insertIndex].trim().startsWith('->') || lines[insertIndex].trim() === '')) {
            lines.splice(insertIndex, 1);
        }

        // Insert the collected notables
        lines.splice(insertIndex, 0, ...notableLines);

        // If there wasn't a blank line after the notables section, add one
        if (insertIndex + notableLines.length < lines.length && 
            lines[insertIndex + notableLines.length].trim() !== '') {
            lines.splice(insertIndex + notableLines.length, 0, '');
        }

        // Update the editor content
        editor.setValue(lines.join('\n'));
        
        new Notice(`Gathered ${notableLines.length} notables`);
    }
}