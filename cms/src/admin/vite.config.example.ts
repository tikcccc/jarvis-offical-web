import type { UserConfig } from 'vite';

export default (config: UserConfig) => {
  // Important: always return the modified config
  return {
    ...config,
    resolve: {
      ...(config.resolve ?? {}),
      alias: {
        ...((config.resolve?.alias as Record<string, string>) ?? {}),
        '@': '/src',
      },
    },
  };
};
