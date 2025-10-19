import { Card, CardContent, UnapologeticButton } from "./Shared";

interface ConfigSectionProps {
    repoUrl: string;
    setRepoUrl: (url: string) => void;
    githubToken: string;
    setGithubToken: (token: string) => void;
    geminiKey: string;
    setGeminiKey: (key: string) => void;
    isLoading: boolean;
    handleGenerate: () => void;
}

export function ConfigSection({
    repoUrl,
    setRepoUrl,
    githubToken,
    setGithubToken,
    geminiKey,
    setGeminiKey,
    isLoading,
    handleGenerate,
}: ConfigSectionProps) {
    return (
        <Card className="bg-green-100">
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold mb-1">GitHub Repository URL</label>
                        <input
                            type="text"
                            placeholder="https://github.com/username/repo-name"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            className="w-full p-3 border-2 border-black rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <UnapologeticButton
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full h-[50px]"
                        variant="primary"
                    >
                        {isLoading ? 'Generating...' : 'Generate README'}
                    </UnapologeticButton>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">GitHub Token</label>
                        <input
                            type="password"
                            value={githubToken}
                            onChange={(e) => setGithubToken(e.target.value)}
                            className="w-full p-3 border-2 border-black rounded-md bg-white focus:outline-none"
                            placeholder="ghp_..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Gemini API Key</label>
                        <input
                            type="password"
                            value={geminiKey}
                            onChange={(e) => setGeminiKey(e.target.value)}
                            className="w-full p-3 border-2 border-black rounded-md bg-white focus:outline-none"
                            placeholder="AIza..."
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}