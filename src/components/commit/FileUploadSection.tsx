import { RepoFile } from "../../types/commit";
import { OffsetShadowCard } from './Shared';
import { Sparkles, X } from 'lucide-react';

const commitTypes = ["feat", "fix", "chore", "refactor", "docs", "style", "test", "perf", "build", "ci", "revert"];

interface FileUploadSectionProps {
  files: RepoFile[];
  processFiles: (fileList: FileList) => void;
  removeFile: (index: number) => void;
  updateFilePath: (index: number, newPath: string) => void;
  updateFileCommitDetails: (index: number, details: { type?: string; message?: string }) => void;
  onGenerateMessage: (index: number) => void;
}

export const FileUploadSection = (props: FileUploadSectionProps) => {
  const { files, processFiles, removeFile, updateFilePath, updateFileCommitDetails, onGenerateMessage } = props;
  return (
    <OffsetShadowCard color="sky">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Files to Commit</h2>
      <div className="border-2 border-dashed border-black rounded-lg p-6 text-center bg-white/50">
        <p className="text-gray-600">Drag & drop files here, or</p>
        <label className="mt-2 text-sm font-semibold text-purple-600 hover:underline cursor-pointer">
            Select Files
            <input type="file" multiple onChange={(e) => e.target.files && processFiles(e.target.files)} className="sr-only" />
        </label>
      </div>
      <div className="mt-4 space-y-4 max-h-[24rem] overflow-y-auto pr-2">
        {files.map((file, index) => (
          <div key={index} className="p-3 bg-white/70 rounded-lg border border-gray-400">
            <div className="flex items-center justify-between">
              <span className="truncate font-mono text-sm font-semibold">{file.name}</span>
              <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700"><X size={20}/></button>
            </div>
            <input type="text" placeholder="Path/to/file.js" value={file.path} onChange={(e) => updateFilePath(index, e.target.value)} className="w-full p-2 mt-2 border-2 border-black rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"/>
            <div className="flex gap-2 mt-2 items-center">
              <select value={file.commitType} onChange={(e) => updateFileCommitDetails(index, { type: e.target.value })} className="p-2 border-2 border-black rounded-md bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500">
                {commitTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
              <input type="text" placeholder="Commit message..." value={file.commitMessage} onChange={(e) => updateFileCommitDetails(index, { message: e.target.value })} className="w-full p-2 border-2 border-black rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"/>
              <button onClick={() => onGenerateMessage(index)} disabled={file.status === 'generating'} className="p-2 bg-purple-500 text-white rounded-md border-2 border-black text-xs font-bold disabled:bg-gray-400">
                {file.status === 'generating' ? '...' : <Sparkles size={16}/>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </OffsetShadowCard>
  );
};