import { Commit } from '../../types/commit';
import { OffsetShadowCard } from './Shared';

interface CommitLogSectionProps {
    commits: Commit[];
}

export const CommitLogSection = ({ commits }: CommitLogSectionProps) => (
    <OffsetShadowCard color="pink">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Latest Commits</h2>
        <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
        {commits.length > 0 ? (
            commits.map(c => (
            <div key={c.sha} className="p-3 bg-white/60 rounded-md text-sm border border-gray-400">
                <p className="font-mono truncate font-medium">{c.commit.message}</p>
                <p className="text-xs text-gray-600">by {c.commit.author.name} on {new Date(c.commit.author.date).toLocaleDateString()}</p>
            </div>
            ))
        ) : (
            <p className="text-gray-500 text-center py-8">No commits fetched yet.</p>
        )}
        </div>
    </OffsetShadowCard>
);