import { OffsetShadowCard } from '../commit/Shared';
import { useState } from 'react';

const Checkbox = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="h-5 w-5 rounded border-2 border-black text-blue-600 focus:ring-blue-500"/>
        <span className="font-medium">{label}</span>
    </label>
);

export const OptionsSection = ({ hook }) => {
    const [tagInput, setTagInput] = useState('');

    const addTag = () => {
        if (tagInput && !hook.tags.includes(tagInput)) {
            hook.setTags([...hook.tags, tagInput]);
        }
        setTagInput('');
    };
    
    const removeTag = (tagToRemove) => {
        hook.setTags(hook.tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <OffsetShadowCard color="blue" className="bg-blue-200">
                <h3 className="text-xl font-bold mb-4">README Sections</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Checkbox label="File Structure" checked={hook.options.includeFileTree} onChange={e => hook.setOptions({...hook.options, includeFileTree: e.target.checked})} />
                    <Checkbox label="Key Features" checked={hook.options.includeFeatures} onChange={e => hook.setOptions({...hook.options, includeFeatures: e.target.checked})} />
                    <Checkbox label="Tech Stack" checked={hook.options.includeTechStack} onChange={e => hook.setOptions({...hook.options, includeTechStack: e.target.checked})} />
                    <Checkbox label="Installation Guide" checked={hook.options.includeInstallation} onChange={e => hook.setOptions({...hook.options, includeInstallation: e.target.checked})} />
                    <Checkbox label="Contributing" checked={hook.options.includeContributing} onChange={e => hook.setOptions({...hook.options, includeContributing: e.target.checked})} />
                </div>
            </OffsetShadowCard>

            <OffsetShadowCard color="yellow" className="bg-yellow-200">
                <h3 className="text-xl font-bold mb-4">Additional Context</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Add context tags (e.g., react, backend)"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addTag()}
                        className="w-full p-2 border-2 border-black rounded-md bg-white"
                    />
                    <button onClick={addTag} className="bg-yellow-500 text-black font-bold text-2xl w-12 h-12 rounded-md border-2 border-black">+</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                    {hook.tags.map(tag => (
                        <div key={tag} className="bg-yellow-600 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                            {tag}
                            <button onClick={() => removeTag(tag)} className="font-bold">&times;</button>
                        </div>
                    ))}
                </div>
            </OffsetShadowCard>
        </div>
    );
};