export const config = {
  run: import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || 'development',
  defaultLang: 'EN',
  defaultTheme: 'dark',
  projectId: import.meta.env.VITE_PROJECT_ID || '',
};
