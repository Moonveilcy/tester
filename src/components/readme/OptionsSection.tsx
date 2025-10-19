import { Language } from '../../types/readme';
import { Card, CardContent, CardHeader, CardTitle } from "./Shared";

interface OptionsSectionProps {
  options: {
    language: Language;
    includeFileTree: boolean;
    includeFeatures: boolean;
    includeTechStack: boolean;
    includeInstallation: boolean;
    includeContributing: boolean;
  };
  setOptions: React.Dispatch<React.SetStateAction<any>>;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const languages: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'id', name: 'Indonesian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
];

export function OptionsSection({ options, setOptions, tags, setTags }: OptionsSectionProps) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setOptions((prev: any) => ({ ...prev, [name]: checked }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOptions((prev: any) => ({ ...prev, language: e.target.value as Language }));
  };
  
  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (!options) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="bg-blue-100">
        <CardHeader>
          <CardTitle>README Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.keys(options).filter(k => k !== 'language').map(key => (
            <div key={key} className="flex items-center">
              <input
                type="checkbox"
                id={key}
                name={key}
                checked={options[key as keyof typeof options]}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={key} className="ml-2 block text-sm text-gray-900 capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace('include ', '')}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card className="bg-yellow-100">
        <CardHeader>
          <CardTitle>Additional Context</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
              Output Language
            </label>
            <select
              id="language"
              value={options.language}
              onChange={handleLanguageChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-2 border-black rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tags-input" className="block text-sm font-medium text-gray-700 mb-1">
              Add context tags (e.g., react, backend)
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="tags-input"
                onKeyDown={addTag}
                className="flex-grow p-2 border-2 border-black rounded-l-md bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Press Enter to add"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400 text-black">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1.5 text-black hover:text-red-700">&times;</button>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}