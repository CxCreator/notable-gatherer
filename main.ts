import { Editor, MarkdownView, Notice, Plugin, MarkdownFileInfo } from 'obsidian';

export default class NotableGathererPlugin extends Plugin {
    async onload(): Promise<void> {
        // Add command to gather notables and actions
        this.addCommand({
            id: 'gather-notables-and-actions',
            name: 'Gather Notables and Actions',
            editorCallback: (editor: Editor, ctx: MarkdownView | MarkdownFileInfo) => {
                this.gatherNotablesAndActions(editor);
            }
        });
    }

    gatherNotablesAndActions(editor: Editor): void {
        // Get the current content
        const content = editor.getValue();
        const lines = content.split('\n');

        // Find the sections
        const actionsIndex = lines.findIndex((line: string) => line.trim() === 'Actions:');
        const notablesIndex = lines.findIndex((line: string) => line.trim() === 'Notables:');
        const notesIndex = lines.findIndex((line: string) => line.trim() === 'Notes:');
        
        // Collect all lines starting with -> and ->>
        const actionLines = lines
            .filter((line: string) => line.trim().startsWith('->>'))
            .filter((line: string, index: number, self: string[]) => self.indexOf(line) === index); // Remove duplicates

        const notableLines = lines
            .filter((line: string) => line.trim().startsWith('->') && !line.trim().startsWith('->>'))
            .filter((line: string, index: number, self: string[]) => self.indexOf(line) === index); // Remove duplicates

        // Create the new document structure
        const newDocument: string[] = [];

        // 1. Add Actions section
        newDocument.push('Actions:');
        if (actionLines.length > 0) {
            newDocument.push(...actionLines);
        }
        newDocument.push('');

        // 2. Add Notables section
        newDocument.push('Notables:');
        if (notableLines.length > 0) {
            newDocument.push(...notableLines);
        }
        newDocument.push('');

        // 3. Add Notes section with remaining content
        newDocument.push('Notes:');
        
        // Filter out the existing sections and their content, keep the rest
        let remainingContent = lines.slice();
        
        // Remove existing Actions section
        if (actionsIndex !== -1) {
            let endIndex = actionsIndex + 1;
            while (endIndex < remainingContent.length && 
                   (remainingContent[endIndex].trim().startsWith('->>') || remainingContent[endIndex].trim() === '')) {
                endIndex++;
            }
            remainingContent.splice(actionsIndex, endIndex - actionsIndex);
        }

        // Remove existing Notables section
        if (notablesIndex !== -1) {
            let endIndex = notablesIndex + 1;
            while (endIndex < remainingContent.length && 
                   (remainingContent[endIndex].trim().startsWith('->') || remainingContent[endIndex].trim() === '')) {
                endIndex++;
            }
            remainingContent.splice(notablesIndex, endIndex - notablesIndex);
        }

        // Remove existing Notes section header if it exists
        if (notesIndex !== -1) {
            remainingContent.splice(notesIndex, 1);
        }

        // Remove any leading/trailing blank lines from remaining content
        while (remainingContent.length > 0 && remainingContent[0].trim() === '') {
            remainingContent.shift();
        }
        while (remainingContent.length > 0 && remainingContent[remainingContent.length - 1].trim() === '') {
            remainingContent.pop();
        }

        // Add the remaining content to Notes section if there is any
        if (remainingContent.length > 0) {
            newDocument.push(...remainingContent);
        }
        newDocument.push('');

        // Update the editor content
        editor.setValue(newDocument.join('\n'));
        
        // Show notification
        const message = `Gathered ${actionLines.length} actions and ${notableLines.length} notables`;
        new Notice(message);
    }
}