import { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { createNewRepo, commitZipFilesToNewRepo, checkRepoExists } from '../lib/uploadzip/api';
import { ExtractedFile, UploadProgress } from '../types/uploadzip';
import { NotificationType } from './useGithub';

const isBinaryFile = (filename: string): boolean => {
    const binaryExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.otf', '.mp3', '.wav', '.mp4'];
    return binaryExtensions.some(ext => filename.toLowerCase().endsWith(ext));
};

const parseRepoName = (input: string): string => {
    try {
        if (input.startsWith('http')) {
            const url = new URL(input);
            const pathParts = url.pathname.split('/').filter(part => part);
            if (pathParts.length >= 2) {
                return pathParts[1];
            }
        }
        return input.split('/').pop() || input;
    } catch {
        return input;
    }
};


export const useZipUploader = () => {
    const [githubToken, setGithubToken] = useState('');
    const [repoInput, setRepoInput] = useState('');
    const [branch, setBranch] = useState('main');
    const [zipFile, setZipFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<UploadProgress>({ current: 0, total: 0, status: 'Idle' });
    const [notification, setNotification] = useState<NotificationType | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('githubToken');
        if (storedToken) setGithubToken(storedToken);
    }, []);

    const handleUpload = useCallback(async () => {
        const repoName = parseRepoName(repoInput);

        if (!zipFile || !repoName || !githubToken) {
            setNotification({ message: 'Please provide a ZIP file, repository name, and GitHub token.', type: 'error' });
            return;
        }

        setProgress({ current: 0, total: 0, status: 'Preparing...' });
        setNotification(null);

        try {
            setProgress(p => ({ ...p, status: `Checking if '${repoName}' is available...` }));
            const repoExists = await checkRepoExists(repoName, githubToken);
            if (repoExists) {
                throw new Error(`Repository "${repoName}" already exists on your account.`);
            }

            setProgress(p => ({ ...p, status: 'Creating repository...' }));
            await createNewRepo(repoName, githubToken);

            setProgress(p => ({ ...p, status: 'Extracting ZIP file...' }));
            const zip = await JSZip.loadAsync(zipFile);
            const filesToCommit: ExtractedFile[] = [];
            
            const filePromises = Object.keys(zip.files)
                .filter(filename => !zip.files[filename].dir)
                .map(async (filename) => {
                    const file = zip.files[filename];
                    const isBinary = isBinaryFile(filename);
                    const content = await file.async('base64');
                    filesToCommit.push({ path: filename, content, isBinary });
                });
            await Promise.all(filePromises);
            if (filesToCommit.length === 0) {
                throw new Error("The selected ZIP file is empty or invalid.");
            }

            setProgress({ current: 0, total: filesToCommit.length, status: 'Uploading files...' });
            const repoUrl = await commitZipFilesToNewRepo(
                repoName,
                branch,
                githubToken,
                filesToCommit,
                (p) => setProgress({ current: p.current, total: p.total, status: 'Uploading files...' })
            );

            setProgress({ current: filesToCommit.length, total: filesToCommit.length, status: 'Completed' });
            setNotification({ message: `Successfully created and uploaded to ${repoUrl}`, type: 'success' });
            setRepoInput('');

        } catch (error) {
            setNotification({ message: (error as Error).message, type: 'error' });
            setProgress({ current: 0, total: 0, status: 'Error' });
        } finally {
            setZipFile(null);
        }
    }, [zipFile, repoInput, branch, githubToken]);

    return {
        githubToken, setGithubToken,
        repoInput, setRepoInput,
        branch, setBranch,
        zipFile, setZipFile,
        progress,
        notification, setNotification,
        handleUpload,
    };
};