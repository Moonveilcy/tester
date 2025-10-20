import { Card, CardContent, CardHeader, CardTitle } from "../readme/Shared";

export const GuideSection = () => (
    <Card className="bg-gray-100">
        <CardHeader>
            <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
            <div>
                <h4 className="font-bold">1. Enter Repository Name</h4>
                <p className="text-sm">
                    You can either type just the new repository name (e.g., `my-new-project`) or paste a full new GitHub URL (e.g., `https://github.com/your-username/my-new-project`). The app will automatically extract the name.
                </p>
            </div>
            <div>
                <h4 className="font-bold">2. Provide GitHub Token</h4>
                <p className="text-sm">
                    A GitHub token with `repo` scope is required. This allows the app to create a new repository under your account. Your token is secure and only used in your browser.
                </p>
            </div>
            <div>
                <h4 className="font-bold">3. Upload Your .zip File</h4>
                <p className="text-sm">
                    Drag and drop or select the `.zip` file containing your project.
                </p>
            </div>
            <div>
                <h4 className="font-bold">4. Create & Deploy</h4>
                <p className="text-sm">
                    Click the button! The app will:
                    <ul className="list-disc list-inside ml-4 mt-1">
                        <li>Check if the repository name is available.</li>
                        <li>Create a new public repository on your GitHub.</li>
                        <li>Extract the .zip file in your browser.</li>
                        <li>Commit and push all the files to the new repository.</li>
                    </ul>
                </p>
            </div>
        </CardContent>
    </Card>
);