import { OffsetShadowCard, UnapologeticButton } from '../commit/Shared';

export const ConfigSection = ({ hook }) => (
    <OffsetShadowCard color="green" className="bg-green-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-1">GitHub Repository URL</label>
                <input
                    type="text"
                    placeholder="https://github.com/username/repo-name"
                    value={hook.repoUrl}
                    onChange={(e) => hook.setRepoUrl(e.target.value)}
                    className="w-full p-3 border-2 border-black rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>
            <UnapologeticButton
                onClick={hook.handleGenerate}
                disabled={hook.isLoading}
                className="w-full h-12 bg-green-500 hover:bg-green-600"
            >
                {hook.isLoading ? 'Generating...' : 'Generate README'}
            </UnapologeticButton>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
                <label className="block text-sm font-bold mb-1">GitHub Token</label>
                <input
                    type="password"
                    value={hook.githubToken}
                    onChange={(e) => hook.setGithubToken(e.target.value)}
                    className="w-full p-3 border-2 border-black rounded-md bg-white focus:outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-bold mb-1">Gemini API Key</label>
                <input
                    type="password"
                    value={hook.geminiKey}
                    onChange={(e) => hook.setGeminiKey(e.target.value)}
                    className="w-full p-3 border-2 border-black rounded-md bg-white focus:outline-none"
                />
            </div>
        </div>
    </OffsetShadowCard>
);