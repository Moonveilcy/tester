import { useState, useEffect, useCallback } from 'react';
import { RepoFile, Commit } from '../types/commit';
import * as githubApi from '../lib/githubApi';
import { generateCommitMessageFromDiff } from '../lib/geminiApi';

export type NotificationType = {
  message: string;
  type: 'success' | 'error';
};

interface RepoTreeItem {
  path: string;
  type: 'blob' | 'tree';
}

export const useGitHub = () => {
  const [token, setToken] = useState('');
  const [storeToken, setStoreToken] = useState(true);
  const [repo, setRepo] = useState('');
  const [branch, setBranch] = useState('main');
  const [geminiKey, setGeminiKey] = useState('');
  const [files, setFiles] = useState<RepoFile[]>([]);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [repoTree, setRepoTree] = useState<RepoTreeItem[]>([]);
  const [pathToDelete, setPathToDelete] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [notification, setNotification] = useState<NotificationType | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('githubToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  
  useEffect(() => {
    if (storeToken && token) {
      localStorage.setItem('githubToken', token);
    } else {
      localStorage.removeItem('githubToken');
    }
  }, [token, storeToken]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const processFiles = useCallback((fileList: FileList) => {
    const newFiles: RepoFile[] = Array.from(fileList).map(file => {
      const existingFile = repoTree.find(item => item.path.endsWith(`/${file.name}`) || item.path === file.name);
      return {
        name: file.name,
        path: existingFile ? existingFile.path : file.name,
        content: '',
        status: 'idle',
        commitType: 'feat',
        commitMessage: '',
      }
    });
    setFiles(prev => [...prev, ...newFiles]);

    newFiles.forEach((_, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            setFiles(prev => prev.map((f, i) => i === (prev.length - newFiles.length + index) ? { ...f, content } : f));
        };
        reader.readAsText(fileList[index]);
    });
  }, [repoTree]);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const updateFilePath = (index: number, newPath: string) => {
    setFiles(prev => prev.map((f, i) => i === index ? { ...f, path: newPath } : f));
  };
  
  const updateFileCommitDetails = (index: number, details: { type?: string; message?: string }) => {
    setFiles(prev => prev.map((f, i) => {
      if (i === index) {
        return {
          ...f,
          commitType: details.type ?? f.commitType,
          commitMessage: details.message ?? f.commitMessage,
        };
      }
      return f;
    }));
  };

  const handleScanRepo = useCallback(async () => {
    if (!repo || !branch || !token) {
        showNotification('Please fill in repository, branch, and token.', 'error');
        return;
    }
    setIsScanning(true);
    setRepoTree([]);
    try {
        const data = await githubApi.scanRepoTree(repo, branch, token);
        const fileBlobs = data.tree.filter((item: RepoTreeItem) => item.type === 'blob');
        setRepoTree(fileBlobs);
        showNotification(`Scan complete. Found ${fileBlobs.length} files in the repository.`, 'success');
    } catch (error) {
        showNotification((error as Error).message, 'error');
    } finally {
        setIsScanning(false);
    }
  }, [repo, branch, token]);

  const handleFetchCommits = useCallback(async () => {
    if (!repo || !branch || !token) return;
    setIsLoading(true);
    try {
        const fetchedCommits = await githubApi.fetchCommits(repo, branch, token);
        setCommits(fetchedCommits);
        showNotification('Successfully fetched latest commits.', 'success');
    } catch (error) {
        showNotification((error as Error).message, 'error');
    } finally {
        setIsLoading(false);
    }
  }, [repo, branch, token]);

  const handleGenerateCommitMessage = useCallback(async (index: number) => {
      const file = files[index];
      if (!geminiKey) {
        showNotification('Gemini API key is required to generate messages.', 'error');
        return;
      }
      
      setFiles(prev => prev.map((f, i) => i === index ? { ...f, status: 'generating' } : f));
      
      try {
        const oldContent = await githubApi.getFileContent(repo, file.path, branch, token);
        const { type, message } = await generateCommitMessageFromDiff(geminiKey, oldContent, file.content);
        updateFileCommitDetails(index, { type, message });
      } catch (error) {
        showNotification((error as Error).message, 'error');
      } finally {
        setFiles(prev => prev.map((f, i) => i === index ? { ...f, status: 'idle' } : f));
      }
  }, [files, geminiKey, repo, branch, token]);

  const handleCommitAndPush = useCallback(async () => {
    const filesToCommit = files.filter(f => f.status === 'idle');
    if (filesToCommit.length === 0) return;

    setIsLoading(true);
    try {
        await githubApi.commitMultipleFiles(repo, branch, token, filesToCommit);
        showNotification(`Successfully committed ${filesToCommit.length} file(s).`, 'success');
        setFiles(prev => prev.filter(f => f.status !== 'idle'));
        handleFetchCommits();
    } catch (error) {
        showNotification((error as Error).message, 'error');
    } finally {
        setIsLoading(false);
    }
  }, [files, repo, branch, token, handleFetchCommits]);
  
  const handleDeletePath = useCallback(async () => {
    if (!pathToDelete) return;
    setIsLoading(true);
    try {
      await githubApi.deletePaths(repo, branch, token, pathToDelete, repoTree);
      showNotification(`Successfully deleted path: ${pathToDelete}.`, 'success');
      setPathToDelete('');
      await handleScanRepo();
      await handleFetchCommits();
    } catch (error) {
      showNotification((error as Error).message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [pathToDelete, repo, branch, token, repoTree, handleScanRepo, handleFetchCommits]);

  return {
    token, setToken, storeToken, setStoreToken, repo, setRepo, branch, setBranch,
    geminiKey, setGeminiKey, files, processFiles, removeFile, updateFilePath, updateFileCommitDetails,
    commits, isLoading, isScanning, notification, setNotification,
    pathToDelete, setPathToDelete,
    handleScanRepo, handleFetchCommits, handleGenerateCommitMessage, handleCommitAndPush,
    handleDeletePath
  };
};