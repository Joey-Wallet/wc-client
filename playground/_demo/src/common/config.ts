export const config = {
  run: process.env['NODE_ENV'],
  defaultLang: 'EN',
  defaultTheme: 'dark',
  projectId: process.env['NEXT_PUBLIC_PROJECT_ID'] || '',
};
