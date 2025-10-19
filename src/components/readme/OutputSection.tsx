import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { OffsetShadowCard } from '../commit/Shared';

export const OutputSection = ({ hook }) => {
    const [activeTab, setActiveTab] = useState('preview');

    const TabButton = ({ id, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`py-2 px-4 font-semibold transition-colors ${activeTab === id ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}
        >
            {label}
        </button>
    );

    const copyToClipboard = () => {
        navigator.clipboard.writeText(hook.generatedReadme);
        hook.setNotification({ message: 'Copied to clipboard!', type: 'success' });
    };

    return (
        <OffsetShadowCard color="gray" className="bg-gray-100">
            <div className="flex justify-between items-center border-b-2 border-black mb-2">
                <div className="flex">
                    <TabButton id="preview" label="Preview" />
                    <TabButton id="markdown" label="Markdown" />
                </div>
                {hook.generatedReadme && (
                    <button onClick={copyToClipboard} className="bg-gray-200 hover:bg-gray-300 text-sm font-semibold py-1 px-3 rounded-md border-2 border-black">
                        Copy
                    </button>
                )}
            </div>
            <div className="min-h-[400px] max-h-[80vh] overflow-y-auto p-4 bg-white rounded-md border-2 border-gray-300">
                {hook.isLoading ? (
                    <p className="text-gray-500">Generating your README, please wait...</p>
                ) : !hook.generatedReadme ? (
                    <p className="text-gray-500">The generated README will appear here.</p>
                ) : activeTab === 'preview' ? (
                    <article className="prose max-w-none">
                        <ReactMarkdown>{hook.generatedReadme}</ReactMarkdown>
                    </article>
                ) : (
                    <pre className="whitespace-pre-wrap text-sm">{hook.generatedReadme}</pre>
                )}
            </div>
        </OffsetShadowCard>
    );
};