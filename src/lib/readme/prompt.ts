import { RepoDetails, ReadmeOptions } from '../../types/readme';

const createSection = (include: boolean, title: string, content: string) => 
    include ? `\n${title}\n${content}` : '';

const formatFileTree = (files: string[]): string => {
    let treeString = '```\n';
    const structure: any = {};

    files.forEach(path => {
        let currentLevel = structure;
        const parts = path.split('/');
        parts.forEach(part => {
            if (!currentLevel[part]) {
                currentLevel[part] = {};
            }
            currentLevel = currentLevel[part];
        });
    });

    const buildTree = (level: any, indent = ''): string => {
        let result = '';
        const keys = Object.keys(level);
        keys.forEach((key, index) => {
            const isLast = index === keys.length - 1;
            const connector = isLast ? '└── ' : '├── ';
            result += `${indent}${connector}${key}\n`;
            if (Object.keys(level[key]).length > 0) {
                const newIndent = indent + (isLast ? '    ' : '│   ');
                result += buildTree(level[key], newIndent);
            }
        });
        return result;
    };

    treeString += buildTree(structure);
    return treeString + '```';
};

export const createReadmePrompt = (
    details: RepoDetails,
    files: string[],
    options: ReadmeOptions,
    tags: string[]
): string => {
    const t = options.language === 'id' ? {
        title: "Judul Proyek",
        description: "Deskripsi Proyek 📝",
        fileTree: "Struktur File 🌳",
        features: "Fitur Utama ✨",
        techStack: "Tech Stack & Tools 🛠️",
        installation: "Instalasi & Menjalankan Lokal 🚀",
        contributing: "Cara Berkontribusi 🤝",
        promptIntro: "Sebagai seorang Principal Software Engineer, buatkan file README.md yang sangat detail dan profesional. Gunakan emoji yang relevan.",
        outro: "Pastikan output HANYA berupa konten Markdown mentah, tanpa penjelasan tambahan."
    } : {
        title: "Project Title",
        description: "Project Description 📝",
        fileTree: "File Structure 🌳",
        features: "Key Features ✨",
        techStack: "Tech Stack & Tools 🛠️",
        installation: "Installation & Running Locally 🚀",
        contributing: "How to Contribute 🤝",
        promptIntro: "As a Principal Software Engineer, create a highly detailed and professional README.md file. Use relevant emojis.",
        outro: "Ensure the output is ONLY raw Markdown content, without extra explanations."
    };

    const fileTreeSection = createSection(options.includeFileTree, `### ${t.fileTree}`, formatFileTree(files));
    const featuresSection = createSection(options.includeFeatures, `### ${t.features}`, `- (Jelaskan fitur utama di sini)`);
    const techStackSection = createSection(options.includeTechStack, `### ${t.techStack}`, `- (Sebutkan teknologi yang digunakan)`);
    const installationSection = createSection(options.includeInstallation, `### ${t.installation}`, "```bash\n# Langkah-langkah instalasi\n```");
    const contributingSection = createSection(options.includeContributing, `### ${t.contributing}`, `- (Jelaskan cara berkontribusi)`);

    return `
${t.promptIntro}

**Repository Details:**
- Name: ${details.name}
- Description: ${details.description || "No description provided."}
- Main Language: ${details.language}
- User Tags: ${tags.join(', ')}
- File List (sample): ${files.slice(0, 20).join(', ')}

**Instructions (Follow Strictly):**
Generate a README.md with the following structure. Be detailed and elaborate on each section based on the repository details.

# ${details.name}

(Include relevant badges from Shields.io for language, etc.)

### ${t.description}
(Write a compelling 2-3 paragraph description here.)

${fileTreeSection}
${featuresSection}
${techStackSection}
${installationSection}
${contributingSection}

${t.outro}
    `.trim();
};