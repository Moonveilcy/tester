export const createChangelogPrompt = (commitMessages: string[]): string => {
    const formattedCommits = commitMessages.map(msg => `- ${msg.split('\n')[0]}`).join('\n');

    return `
        You are an expert release manager tasked with writing a professional changelog.
        Based on the following list of raw Git commit messages, generate a clean and well-formatted changelog in Markdown.

        Follow these rules strictly:
        1.  Group the changes into logical categories: '✨ Features', '🐛 Bug Fixes', and '🔨 Maintenance'.
        2.  If a commit doesn't fit a category, you can omit it or place it under '🔨 Maintenance'.
        3.  Rewrite the commit messages to be clear, concise, and user-friendly. Remove prefixes like 'feat:', 'fix:', etc.
        4.  The final output should be ONLY the raw Markdown content for the changelog, starting with the category headings. Do not include any other explanatory text.

        Commit Messages:
        ---
        ${formattedCommits}
        ---
    `.trim();
};