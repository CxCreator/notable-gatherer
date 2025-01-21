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
        const notablesIndex = lines.findIndex((line: string) => line.trim() === 'Notables:');
        const actionsIndex = lines.findIndex((line: string) => line.trim() === 'Actions:');
        
        // Collect all lines starting with -> and ->>
        const notableLines = lines
            .filter((line: string) => line.trim().startsWith('->') && !line.trim().startsWith('->>'))
            .filter((line: string, index: number, self: string[]) => self.indexOf(line) === index); // Remove duplicates
            
        const actionLines = lines
            .filter((line: string) => line.trim().startsWith('->>'))
            .filter((line: string, index: number, self: string[]) => self.indexOf(line) === index); // Remove duplicates

        let updatedLines = [...lines];
        let offset = 0; // Track position changes as we modify the document

        // Handle Notables section
        if (notablesIndex === -1) {
            // Create new Notables section at the top
            const newNotablesLines = ['Notables:'];
            if (notableLines.length > 0) {
                newNotablesLines.push(...notableLines);
            }
            newNotablesLines.push('');

            // Remove any leading blank lines
            while (updatedLines.length > 0 && updatedLines[0].trim() === '') {
                updatedLines.shift();
                offset--;
            }

            // Add Notables section at the top
            updatedLines.unshift(...newNotablesLines);
            offset += newNotablesLines.length;
        } else {
            // Update existing Notables section
            let insertIndex = notablesIndex + 1;
            // Remove existing notables
            while (insertIndex < updatedLines.length && 
                   (updatedLines[insertIndex].trim().startsWith('->') || updatedLines[insertIndex].trim() === '')) {
                updatedLines.splice(insertIndex, 1);
                offset--;
            }

            // Insert collected notables
            if (notableLines.length > 0) {
                updatedLines.splice(insertIndex, 0, ...notableLines);
                offset += notableLines.length;

                // Ensure blank line after section
                if (insertIndex + notableLines.length < updatedLines.length && 
                    updatedLines[insertIndex + notableLines.length].trim() !== '') {
                    updatedLines.splice(insertIndex + notableLines.length, 0, '');
                    offset++;
                }
            }
        }

        // Handle Actions section
        const adjustedActionsIndex = actionsIndex === -1 ? -1 : actionsIndex + offset;
        
        if (adjustedActionsIndex === -1) {
            // Create new Actions section after Notables
            const newActionsLines = ['Actions:'];
            if (actionLines.length > 0) {
                newActionsLines.push(...actionLines);
            }
            newActionsLines.push('');

            // Find where to insert Actions section (after Notables section)
            const insertIndex = notablesIndex === -1 ? notableLines.length + 2 : 0;
            updatedLines.splice(insertIndex, 0, ...newActionsLines);
        } else {
            // Update existing Actions section
            let insertIndex = adjustedActionsIndex + 1;
            // Remove existing actions
            while (insertIndex < updatedLines.length && 
                   (updatedLines[insertIndex].trim().startsWith('->>') || updatedLines[insertIndex].trim() === '')) {
                updatedLines.splice(insertIndex, 1);
            }

            // Insert collected actions
            if (actionLines.length > 0) {
                updatedLines.splice(insertIndex, 0, ...actionLines);

                // Ensure blank line after section
                if (insertIndex + actionLines.length < updatedLines.length && 
                    updatedLines[insertIndex + actionLines.length].trim() !== '') {
                    updatedLines.splice(insertIndex + actionLines.length, 0, '');
                }
            }
        }

        // Update the editor content
        editor.setValue(updatedLines.join('\n'));
        
        // Show notification
        const message = `Gathered ${notableLines.length} notables and ${actionLines.length} actions`;
        new Notice(message);
    }
}