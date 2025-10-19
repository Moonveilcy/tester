import { RepoDetails, ReadmeOptions, Language } from '../../types/readme';

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

const getLanguageContent = (lang: Language) => {
    const content = {
        en: { description: "Project Description 📝", fileTree: "File Structure 🌳", features: "Key Features ✨", techStack: "Tech Stack & Tools 🛠️", installation: "Installation & Running Locally 🚀", contributing: "How to Contribute 🤝", promptIntro: "As a Principal Software Engineer, create a highly detailed and professional README.md file in English.", outro: "Ensure the output is ONLY raw Markdown content." },
        id: { description: "Deskripsi Proyek 📝", fileTree: "Struktur File 🌳", features: "Fitur Utama ✨", techStack: "Tech Stack & Tools 🛠️", installation: "Instalasi & Menjalankan Lokal 🚀", contributing: "Cara Berkontribusi 🤝", promptIntro: "Sebagai seorang Principal Software Engineer, buatkan file README.md dalam Bahasa Indonesia yang sangat detail dan profesional.", outro: "Pastikan output HANYA berupa konten Markdown mentah." },
        zh: { description: "Project Description 📝", fileTree: "File Structure 🌳", features: "Key Features ✨", techStack: "Tech Stack & Tools 🛠️", installation: "Installation & Running Locally 🚀", contributing: "How to Contribute 🤝", promptIntro: "As a Principal Software Engineer, create a highly detailed and professional README.md file in Chinese.", outro: "Ensure the output is ONLY raw Markdown content." },
        ja: { description: "Project Description 📝", fileTree: "File Structure 🌳", features: "Key Features ✨", techStack: "Tech Stack & Tools 🛠️", installation: "Installation & Running Locally 🚀", contributing: "How to Contribute 🤝", promptIntro: "As a Principal Software Engineer, create a highly detailed and professional README.md file in Japanese.", outro: "Ensure the output is ONLY raw Markdown content." },
        ko: { description: "Project Description 📝", fileTree: "File Structure 🌳", features: "Key Features ✨", techStack: "Tech Stack & Tools 🛠️", installation: "Installation & Running Locally 🚀", contributing: "How to Contribute 🤝", promptIntro: "As a Principal Software Engineer, create a highly detailed and professional README.md file in Korean.", outro: "Ensure the output is ONLY raw Markdown content." }
    };
    return content[lang] || content['en'];
};


export const createReadmePrompt = (
    details: RepoDetails,
    files: string[],
    options: ReadmeOptions,
    tags: string[],
    pkgTech: string[]
): string => {
    const t = getLanguageContent(options.language);

    const allTech = [...new Set([details.language, ...tags, ...pkgTech].filter(Boolean).map(t => t.toLowerCase()))];
    
    const techBadgesInstruction = `Based on the CRITICAL list of technologies provided, generate a list of Markdown badges from shields.io using the 'for-the-badge' style. Do not omit any. Example: [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)`;

    const installationContent = `Provide a step-by-step guide. CRITICAL: Each terminal command (like git clone, npm install, npm start) MUST be in its own separate 'bash' code block for clarity.`;

    const fileTreeSection = createSection(options.includeFileTree, `### ${t.fileTree}`, formatFileTree(files));
    const featuresSection = createSection(options.includeFeatures, `### ${t.features}`, `- (Explain key features here based on repo description, file names, and tech stack)`);
    const techStackSection = createSection(options.includeTechStack, `### ${t.techStack}`, techBadgesInstruction);
    const installationSection = createSection(options.includeInstallation, `### ${t.installation}`, installationContent);
    const contributingSection = createSection(options.includeContributing, `### ${t.contributing}`, `- (Explain how to contribute here)`);

    return `
${t.promptIntro}

**Repository Details (Context for Generation):**
- Name: ${details.name}
- Description: ${details.description || "No description provided."}
- CRITICAL LIST OF ALL TECHNOLOGIES TO INCLUDE: ${allTech.join(', ')}
- File List (sample for context): ${files.slice(0, 30).join(', ')}

**Instructions (Follow Strictly):**
Generate a README.md in the requested language with the following structure.

# ${details.name}

${options.includeTechStack ? '' : techBadgesInstruction}

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