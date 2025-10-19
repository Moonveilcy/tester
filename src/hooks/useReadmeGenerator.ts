import { useState, useCallback, useEffect } from 'react';
import * as readmeApi from '../lib/readme/api';
import { createReadmePrompt } from '../lib/readme/prompt';
import { ReadmeOptions, RepoDetails, Language } from '../types/readme';
import { NotificationType } from './useGithub';

export const useReadmeGenerator = () => {
    const [githubToken, setGithubToken] = useState('');
    const [geminiKey, setGeminiKey] = useState('');
    const [repoUrl, setRepoUrl] = useState('');

    const [options, setOptions] = useState<ReadmeOptions>({
        language: 'en',
        includeFileTree: true,
        includeFeatures: true,
        includeTechStack: true,
        includeInstallation: true,
        includeContributing: true,
    });

    const [tags, setTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedReadme, setGeneratedReadme] = useState('');
    const [notification, setNotification] = useState<NotificationType | null>(null);

    useEffect(() => {
        const storedGithubToken = localStorage.getItem('githubToken');
        const storedGeminiKey = localStorage.getItem('geminiApiKey');
        if (storedGithubToken) setGithubToken(storedGithubToken);
        if (storedGeminiKey) setGeminiKey(storedGeminiKey);
    }, []);

    const handleGenerate = useCallback(async () => {
        const repoPath = readmeApi.parseGithubUrl(repoUrl);
        if (!repoPath) {
            setNotification({ message: 'Invalid GitHub URL format.', type: 'error' });
            return;
        }
        if (!githubToken || !geminiKey) {
            setNotification({ message: 'GitHub and Gemini keys are required.', type: 'error' });
            return;
        }

        setIsLoading(true);
        setGeneratedReadme('');
        setNotification(null);

        try {
            const details: RepoDetails = await readmeApi.getRepoDetails(repoPath, githubToken);
            const files = await readmeApi.getRepoTree(repoPath, githubToken);
            const prompt = createReadmePrompt(details, files, options, tags);
            const readmeContent = await readmeApi.generateReadmeContent(prompt, geminiKey);
            setGeneratedReadme(readmeContent);
            setNotification({ message: 'README generated successfully!', type: 'success' });
        } catch (error) {
            setNotification({ message: (error as Error).message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [repoUrl, githubToken, geminiKey, options, tags]);

    return {
        githubToken, setGithubToken,
        geminiKey, setGeminiKey,
        repoUrl, setRepoUrl,
        options, setOptions,
        tags, setTags,
        isLoading,
        generatedReadme,
        notification, setNotification,
        handleGenerate,
    };
};