import { UnapologeticButton } from './Shared';
import { RepoFile } from '../../types/commit';

interface ActionsSectionProps {
    isLoading: boolean;
    isScanning: boolean;
    files: RepoFile[];
    repoFilled: boolean;
    onCommitAndPush: () => void;
    onFetchCommits: () => void;
    onScanRepo: () => void;
}

export const ActionsSection = (props: ActionsSectionProps) => {
    const { isLoading, isScanning, files, repoFilled, onCommitAndPush, onFetchCommits, onScanRepo } = props;
    
    const idleFilesCount = files.filter(f => f.status === 'idle').length;

    return (
        <section className="space-y-4">
            <UnapologeticButton
                onClick={onScanRepo}
                disabled={isLoading || !repoFilled}
                variant="secondary"
            >
                {isScanning ? 'Scanning...' : 'Scan Repository Files'}
            </UnapologeticButton>

            <UnapologeticButton
                onClick={onCommitAndPush}
                disabled={isLoading || idleFilesCount === 0}
                variant="primary"
            >
                {isLoading ? 'Processing...' : `Commit & Push ${idleFilesCount} File(s)`}
            </UnapologeticButton>

            <UnapologeticButton
                onClick={onFetchCommits}
                disabled={isLoading}
                variant="tertiary"
            >
                Fetch Commits
            </UnapologeticButton>
        </section>
    );
}