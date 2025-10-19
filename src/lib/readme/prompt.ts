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

const getLanguageContent = (lang: string) => {
    switch (lang) {
        case 'id': return {
            description: "Deskripsi Proyek 📝", fileTree: "Struktur File 🌳", features: "Fitur Utama ✨", techStack: "Tech Stack & Tools 🛠️", installation: "Instalasi & Menjalankan Lokal 🚀", contributing: "Cara Berkontribusi 🤝", promptIntro: "Sebagai seorang Principal Software Engineer, buatkan file README.md dalam Bahasa Indonesia yang sangat detail dan profesional.", outro: "Pastikan output HANYA berupa konten Markdown mentah."
        };
        case 'zh': return {
            description: "项目描述 📝", fileTree: "文件结构 🌳", features: "主要特点 ✨", techStack: "技术栈与工具 🛠️", installation: "安装与本地运行 🚀", contributing: "如何贡献 🤝", promptIntro: "作为一名首席软件工程师，请用中文撰写一份非常详细和专业的README.md文件。", outro: "请确保输出仅为纯Markdown内容。"
        };
        case 'ja': return {
            description: "プロジェクト概要 📝", fileTree: "ファイル構造 🌳", features: "主な特徴 ✨", techStack: "技術スタックとツール 🛠️", installation: "インストールとローカル実行 🚀", contributing: "貢献方法 🤝", promptIntro: "プリンシパルソフトウェアエンジニアとして、非常に詳細で専門的なREADME.mdファイルを日本語で作成してください。", outro: "出力は生のMarkdownコンテンツのみにしてください。"
        };
        case 'ko': return {
            description: "프로젝트 설명 📝", fileTree: "파일 구조 🌳", features: "주요 기능 ✨", techStack: "기술 스택 및 도구 🛠️", installation: "설치 및 로컬 실행 🚀", contributing: "기여 방법 🤝", promptIntro: "수석 소프트웨어 엔지니어로서, 매우 상세하고 전문적인 README.md 파일을 한국어로 작성해주세요.", outro: "출력물은 순수 Markdown 콘텐츠여야 합니다."
        };
        default: return { // English
            description: "Project Description 📝", fileTree: "File Structure 🌳", features: "Key Features ✨", techStack: "Tech Stack & Tools 🛠️", installation: "Installation & Running Locally 🚀", contributing: "How to Contribute 🤝", promptIntro: "As a Principal Software Engineer, create a highly detailed and professional README.md file in English.", outro: "Ensure the output is ONLY raw Markdown content."
        };
    }
};

export const createReadmePrompt = (
    details: RepoDetails,
    files: string[],
    options: ReadmeOptions,
    tags: string[]
): string => {
    const t = getLanguageContent(options.language);

    const allTech = [...new Set([details.language, ...tags].filter(Boolean))];
    const techBadgesInstruction = `Based on the *entire list* of technologies provided below, generate a list of Markdown badges from shields.io using the 'for-the-badge' style. Do not omit any. Technologies: ${allTech.join(', ')}. Example: [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)`;

    const installationContent = `Provide a step-by-step guide. CRITICAL: Each terminal command (like git clone, npm install, npm start) MUST be in its own separate 'bash' code block for clarity.`;

    const fileTreeSection = createSection(options.includeFileTree, `### ${t.fileTree}`, formatFileTree(files));
    const featuresSection = createSection(options.includeFeatures, `### ${t.features}`, `- (Explain key features here based on repo description and file names)`);
    const techStackSection = createSection(options.includeTechStack, `### ${t.techStack}`, techBadgesInstruction);
    const installationSection = createSection(options.includeInstallation, `### ${t.installation}`, installationContent);
    const contributingSection = createSection(options.includeContributing, `### ${t.contributing}`, `- (Explain how to contribute here)`);

    return `
${t.promptIntro}

**Repository Details (Context for Generation):**
- Name: ${details.name}
- Description: ${details.description || "No description provided."}
- CRITICAL LIST OF ALL TECHNOLOGIES TO INCLUDE: ${allTech.join(', ')}
- File List (sample for context): ${files.slice(0, 20).join(', ')}

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