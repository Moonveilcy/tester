import { useZipUploader } from '../hooks/useZipUploader';
import { Toast } from '../components/commit/Toast';
import { Card, CardContent, CardHeader, CardTitle } from '../components/readme/Shared';
import { UnapologeticButton } from '../components/readme/Shared';
import { UploadCloud, XCircle, CheckCircle } from 'lucide-react';
import JSZip from 'jszip';

if (typeof window.JSZip === 'undefined') {
  window.JSZip = JSZip;
}


const ConfigSection = ({ uploader }) => (
    <Card className="bg-yellow-100">
        <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
            <div>
                <label className="block text-sm font-bold mb-1">New Repository Name</label>
                <input
                    type="text"
                    placeholder="my-awesome-project"
                    value={uploader.repoName}
                    onChange={(e) => uploader.setRepoName(e.target.value)}
                    className="w-full p-3 border-2 border-black rounded-md bg-white focus:outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-bold mb-1">GitHub Token</label>
                <input
                    type="password"
                    value={uploader.githubToken}
                    onChange={(e) => uploader.setGithubToken(e.target.value)}
                    className="w-full p-3 border-2 border-black rounded-md bg-white focus:outline-none"
                />
            </div>
        </CardContent>
    </Card>
);

const UploadSection = ({ uploader }) => {
    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploader.setZipFile(e.dataTransfer.files[0]);
        }
    };
    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            uploader.setZipFile(e.target.files[0]);
        }
    };

    return (
        <Card className="bg-blue-100">
            <CardHeader><CardTitle>Upload ZIP</CardTitle></CardHeader>
            <CardContent>
                {uploader.zipFile ? (
                    <div className="text-center p-4 bg-white/50 rounded-lg border-2 border-black">
                        <p className="font-bold">{uploader.zipFile.name}</p>
                        <p className="text-sm text-gray-600">({(uploader.zipFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                        <button onClick={() => uploader.setZipFile(null)} className="mt-2 text-red-600 hover:underline text-sm">Remove</button>
                    </div>
                ) : (
                    <div
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        className="border-2 border-dashed border-black rounded-lg p-10 text-center bg-white/50 cursor-pointer"
                        onClick={() => document.getElementById('zip-input')?.click()}
                    >
                        <UploadCloud className="mx-auto w-12 h-12 text-gray-500" />
                        <p className="mt-2 text-gray-600">Drag & drop your .zip file here, or click to select</p>
                        <input id="zip-input" type="file" accept=".zip" onChange={onFileChange} className="hidden" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const ProgressSection = ({ progress }) => {
    const isLoading = progress.status !== 'Idle' && progress.status !== 'Completed' && progress.status !== 'Error';
    const isError = progress.status === 'Error';
    const isCompleted = progress.status === 'Completed';

    const percentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

    return (
        <Card className="bg-pink-100">
            <CardHeader><CardTitle>Progress</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center font-bold">
                    <p>{progress.status}</p>
                    {progress.total > 0 && <p>{progress.current} / {progress.total}</p>}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 border-2 border-black">
                    <div
                        className="bg-pink-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                {isError && <XCircle className="w-8 h-8 text-red-500 mx-auto" />}
                {isCompleted && <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />}
            </CardContent>
        </Card>
    );
};


export default function UploadZipPage() {
    const uploader = useZipUploader();
    const isLoading = uploader.progress.status !== 'Idle' && uploader.progress.status !== 'Completed' && uploader.progress.status !== 'Error';

    return (
        <div className="bg-white text-gray-800 py-12">
            <main className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
                {uploader.notification && (
                    <Toast 
                        message={uploader.notification.message} 
                        type={uploader.notification.type} 
                        onDismiss={() => uploader.setNotification(null)} 
                    />
                )}
                
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">Deploy ZIP to New Repo</h1>
                    <p className="text-lg text-gray-600 mt-2">Create a new GitHub repository and populate it with the contents of a .zip file.</p>
                </div>

                <div className="space-y-8">
                    <ConfigSection uploader={uploader} />
                    <UploadSection uploader={uploader} />
                    <ProgressSection progress={uploader.progress} />
                    <UnapologeticButton
                        onClick={uploader.handleUpload}
                        disabled={isLoading || !uploader.zipFile}
                        variant="secondary"
                    >
                        {isLoading ? 'Deploying...' : 'Create Repo & Deploy'}
                    </UnapologeticButton>
                </div>
            </main>
        </div>
    );
}