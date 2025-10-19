import { useReadmeGenerator } from '../hooks/useReadmeGenerator';
import { Toast } from '../components/commit/Toast';
import { ConfigSection } from '../components/readme/ConfigSection';
import { OptionsSection } from '../components/readme/OptionsSection';
import { OutputSection } from '../components/readme/OutputSection';

export default function ReadmePage() {
    const readme = useReadmeGenerator();

    return (
        <div className="bg-white text-gray-800 py-12">
            <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
                {readme.notification && (
                    <Toast 
                        message={readme.notification.message} 
                        type={readme.notification.type} 
                        onDismiss={() => readme.setNotification(null)} 
                    />
                )}
                
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">README Generator</h1>
                    <p className="text-lg text-gray-600 mt-2">Generate a professional README.md for your repository with AI.</p>
                </div>

                <ConfigSection 
                    repoUrl={readme.repoUrl}
                    setRepoUrl={readme.setRepoUrl}
                    githubToken={readme.githubToken}
                    setGithubToken={readme.setGithubToken}
                    geminiKey={readme.geminiKey}
                    setGeminiKey={readme.setGeminiKey}
                    isLoading={readme.isLoading}
                    handleGenerate={readme.handleGenerate}
                />
                <OptionsSection 
                    options={readme.options}
                    setOptions={readme.setOptions}
                    tags={readme.tags}
                    setTags={readme.setTags}
                />
                <OutputSection 
                    isLoading={readme.isLoading}
                    generatedReadme={readme.generatedReadme}
                    setNotification={readme.setNotification}
                />
            </main>
        </div>
    );
}