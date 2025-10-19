const GITHUB_API_BASE = "https://api.github.com";

const apiFetch = async (url: string, token: string, options: RequestInit = {}) => {
    const cleanToken = token.trim();
    if (!cleanToken) {
        throw new Error("GitHub token is missing.");
    }
    const response = await fetch(`${GITHUB_API_BASE}${url}`, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${cleanToken}`,
            'Accept': 'application/vnd.github.v3+json',
        },
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `GitHub API request failed with status: ${response.statusText}` }));
        throw new Error(errorData.message || `An unknown error occurred with status: ${response.status}`);
    }
    return response.json();
};

export const parseGithubUrl = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname !== 'github.com') return null;
        const pathParts = urlObj.pathname.split('/').filter(part => part);
        if (pathParts.length >= 2) {
            return `${pathParts[0]}/${pathParts[1]}`;
        }
        return null;
    } catch (error) {
        return null;
    }
};

export const getRepoDetails = (repoPath: string, token: string) =>
    apiFetch(`/repos/${repoPath}`, token);

export const getRepoTree = async (repoPath: string, token: string) => {
    const repoDetails = await getRepoDetails(repoPath, token);
    const defaultBranch = repoDetails.default_branch;
    if (!defaultBranch) {
        throw new Error("Could not determine the default branch for the repository.");
    }
    const treeData = await apiFetch(`/repos/${repoPath}/git/trees/${defaultBranch}?recursive=1`, token);
    return treeData.tree.map((file: { path: string }) => file.path);
};

export const getTechStackFromPkg = async (repoPath: string, token: string): Promise<string[]> => {
    try {
        const pkgContentResponse = await apiFetch(`/repos/${repoPath}/contents/package.json`, token);
        const pkgContent = atob(pkgContentResponse.content);
        const pkgJson = JSON.parse(pkgContent);
        const dependencies = Object.keys(pkgJson.dependencies || {});
        const devDependencies = Object.keys(pkgJson.devDependencies || {});
        return [...new Set([...dependencies, ...devDependencies])];
    } catch (error) {
        console.warn("Could not fetch or parse package.json. Tech stack detection will be limited.");
        return [];
    }
};


export const generateReadmeContent = async (prompt: string, geminiKey: string): Promise<string> => {
    const cleanGeminiKey = geminiKey.trim();
    if (!cleanGeminiKey) {
        throw new Error("Gemini API Key is missing.");
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${cleanGeminiKey}`;
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Failed to parse Gemini API error response.' }}));
        throw new Error(errorData.error?.message || `Gemini API request failed with status: ${response.statusText}`);
    }
    const result = await response.json();
    const content = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
        throw new Error("Failed to extract content from Gemini API response.");
    }
    return content.replace(/^```markdown\s*|```$/g, "").trim();
};