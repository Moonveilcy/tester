import { Card, CardContent, CardHeader, CardTitle, UnapologeticButton } from './Shared';

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
    <Card className="bg-red-200">
      <CardHeader>
        <CardTitle>Delete Path</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          className="w-full bg-red-500 hover:bg-red-600"
        >
          {isLoading ? 'Deleting...' : 'Delete Path'}
        </UnapologeticButton>
      </CardContent>
    </Card>
  );
};