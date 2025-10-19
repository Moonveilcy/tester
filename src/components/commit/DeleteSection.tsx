import { OffsetShadowCard, UnapologeticButton } from './Shared';

interface DeleteSectionProps {
  pathToDelete: string;
  setPathToDelete: (path: string) => void;
  onDelete: () => void;
  isLoading: boolean;
  repoFilled: boolean;
}

export const DeleteSection = (props: DeleteSectionProps) => {
  const { pathToDelete, setPathToDelete, onDelete, isLoading, repoFilled } = props;

  return (
    <OffsetShadowCard color="pink" className="bg-red-300">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Delete Path</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter file or folder path to delete"
          value={pathToDelete}
          onChange={(e) => setPathToDelete(e.target.value)}
          className="w-full p-2 border-2 border-black rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <UnapologeticButton
          onClick={onDelete}
          disabled={isLoading || !repoFilled || !pathToDelete}
          variant="secondary"
          className="bg-red-500 hover:bg-red-600"
        >
          {isLoading ? 'Deleting...' : 'Delete Path'}
        </UnapologeticButton>
      </div>
    </OffsetShadowCard>
  );
};