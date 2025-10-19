const GITHUB_API_BASE = "https://api.github.com";

export const parseGithubUrl = (url: string): string | null => {
    const match = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
    return match ? match[1].replace(".git", "") : null;
};

const githubFetch = async (url: string, token?: string) => {
    const headers: HeadersInit = { 'Accept': 'application/vnd.github.v3+json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${GITHUB_API_BASE}${url}`, { headers });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `GitHub API Error: ${response.status}`);
    }
    return response.json();
};

export const getRepoDetails = (repoPath: string, token: string) => 
    githubFetch(`/repos/${repoPath}`, token);

export const getRepoTree = async (repoPath: string, token: string, defaultBranch: string) => {
    const data = await githubFetch(`/repos/${repoPath}/git/trees/${defaultBranch}?recursive=1`, token);
    return data.tree.map((file: { path: string }) => file.path);
};

export const generateReadmeContent = async (prompt: string, apiKey: string): Promise<string> => {
    if (!apiKey) throw new Error("Gemini API Key is required.");
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
        throw new Error("Failed to extract content from Gemini response.");
    }
    return text.replace(/^```markdown\s*/, "").replace(/```$/, "").trim();
};