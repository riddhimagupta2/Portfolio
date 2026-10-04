import { portfolioData as templateData } from './portfolioData.example';

// Dynamically load private local data if present (portfolioData.local.js is excluded from git)
const localModules = import.meta.glob('./portfolioData.local.js', { eager: true });
const localData = localModules['./portfolioData.local.js']?.portfolioData;

export const portfolioData = localData || templateData;
