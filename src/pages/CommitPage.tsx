import { useGitHub } from '../hooks/useGithub';
import { Toast } from '../components/commit/Toast';
import { ConfigSection } from '../components/commit/ConfigSection';
import { FileUploadSection } from '../components/commit/FileUploadSection';
import { ActionsSection } from '../components/commit/ActionsSection';
import { CommitLogSection } from '../components/commit/CommitLogSection';

export default function CommitPage() {
  const github = useGitHub();

  return (
    <div className="bg-white text-gray-800 py-12">
      <main className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {github.notification && (
          <Toast 
            message={github.notification.message} 
            type={github.notification.type} 
            onDismiss={() => github.setNotification(null)} 
          />
        )}
        
        <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">Commit & Push</h1>
            <p className="text-lg text-gray-600 mt-2">Manage your GitHub repositories directly from your browser.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
          <div className="space-y-8">
            <ConfigSection
              token={github.token} setToken={github.setToken}
              storeToken={github.storeToken} setStoreToken={github.setStoreToken}
              repo={github.repo} setRepo={github.setRepo}
              branch={github.branch} setBranch={github.setBranch}
              geminiKey={github.geminiKey} setGeminiKey={github.setGeminiKey}
            />
            <FileUploadSection 
              files={github.files} 
              processFiles={github.processFiles} 
              removeFile={github.removeFile}
              updateFilePath={github.updateFilePath} 
              updateFileCommitDetails={github.updateFileCommitDetails}
              onGenerateMessage={github.handleGenerateCommitMessage}
            />
          </div>
          {/* Kolom Kanan */}
          <div className="space-y-8 mt-8 lg:mt-0">
             <ActionsSection 
              isLoading={github.isLoading}
              isScanning={github.isScanning}
              files={github.files}
              repoFilled={!!github.token && !!github.repo}
              onCommitAndPush={github.handleCommitAndPush}
              onFetchCommits={github.handleFetchCommits}
              onScanRepo={github.handleScanRepo}
            />
            <CommitLogSection commits={github.commits} />
          </div>
        </div>
      </main>
    </div>
  );
}