export interface RepoDetails {
  name: string;
  description: string | null;
  language: string;
  html_url: string;
}

export interface ReadmeOptions {
  language: 'en' | 'id';
  includeFileTree: boolean;
  includeFeatures: boolean;
  includeTechStack: boolean;
  includeInstallation: boolean;
  includeContributing: boolean;
}