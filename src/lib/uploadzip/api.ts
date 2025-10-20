import { ExtractedFile } from '../../types/uploadzip';

const GITHUB_API_BASE = "https://api.github.com";

const apiFetch = async (url: string, token: string, options: RequestInit = {}) => {
    const response = await fetch(`${GITHUB_API_BASE}${url}`, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token.trim()}`,
            'Accept': 'application/vnd.github.v3+json',
        },
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `GitHub API Error: ${response.statusText}` }));
        throw new Error(errorData.message || 'An unknown GitHub API error occurred.');
    }
    if (response.status === 204 || response.status === 201) return response.json().catch(() => null);
    return response.json();
};

export const checkRepoExists = async (repoName: string, token: string) => {
    try {
        const user = await apiFetch('/user', token);
        await apiFetch(`/repos/${user.login}/${repoName}`, token);
        return true; 
    } catch (error) {
        if ((error as Error).message.toLowerCase().includes('not found')) {
            return false;
        }
        throw error;
    }
};

export const createNewRepo = (repoName: string, token: string) =>
    apiFetch('/user/repos', token, {
        method: 'POST',
        body: JSON.stringify({
            name: repoName,
            private: false,
            auto_init: true, 
        }),
    });

const getLatestCommitSha = (repo: string, branch: string, token: string) =>
    apiFetch(`/repos/${repo}/git/ref/heads/${branch}`, token).then(data => data.object.sha);

const getTreeForCommit = (repo: string, commitSha: string, token: string) =>
    apiFetch(`/repos/${repo}/git/commits/${commitSha}`, token).then(data => data.tree.sha);

const createBlob = (repo: string, content: string, token: string) =>
    apiFetch(`/repos/${repo}/git/blobs`, token, {
        method: 'POST',
        body: JSON.stringify({ content, encoding: 'base64' }),
    }).then(data => data.sha);

const createTree = (repo: string, baseTreeSha: string, tree: { path: string; mode: string; type: string; sha: string | null }[], token: string) =>
    apiFetch(`/repos/${repo}/git/trees`, token, {
        method: 'POST',
        body: JSON.stringify({ base_tree: baseTreeSha, tree }),
    }).then(data => data.sha);

const createCommit = (repo: string, message: string, treeSha: string, parentCommitSha: string, token: string) =>
    apiFetch(`/repos/${repo}/git/commits`, token, {
        method: 'POST',
        body: JSON.stringify({ message, tree: treeSha, parents: [parentCommitSha] }),
    }).then(data => data.sha);

const updateBranchRef = (repo: string, branch: string, commitSha: string, token: string) =>
    apiFetch(`/repos/${repo}/git/refs/heads/${branch}`, token, {
        method: 'PATCH',
        body: JSON.stringify({ sha: commitSha }),
    });

export const commitZipFilesToNewRepo = async (
    repoName: string,
    branch: string,
    token: string,
    files: ExtractedFile[],
    onProgress: (progress: { current: number, total: number }) => void
) => {
    const user = await apiFetch('/user', token);
    const repo = `${user.login}/${repoName}`;
    
    const parentCommitSha = await getLatestCommitSha(repo, branch, token);
    const baseTreeSha = await getTreeForCommit(repo, parentCommitSha, token);
    
    const blobPromises = files.map(async (file, index) => {
        const sha = await createBlob(repo, file.content, token);
        onProgress({ current: index + 1, total: files.length });
        return {
            path: file.path,
            mode: '100644' as const,
            type: 'blob' as const,
            sha,
        };
    });

    const tree = await Promise.all(blobPromises);
    const newTreeSha = await createTree(repo, baseTreeSha, tree, token);
    const commitMessage = `feat: Add initial project files from ZIP upload`;
    const newCommitSha = await createCommit(repo, commitMessage, newTreeSha, parentCommitSha, token);
    await updateBranchRef(repo, branch, newCommitSha, token);
    
    return `https://github.com/${repo}`;
};