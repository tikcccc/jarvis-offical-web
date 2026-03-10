import { mergeConfig, type UserConfig } from 'vite';

const DEFAULT_ADMIN_VITE_PORT = 5180;

function resolveAdminVitePort() {
  const rawPort = process.env.STRAPI_ADMIN_VITE_PORT;
  const parsedPort = rawPort ? Number.parseInt(rawPort, 10) : NaN;

  return Number.isNaN(parsedPort) ? DEFAULT_ADMIN_VITE_PORT : parsedPort;
}

export default (config: UserConfig) => {
  const port = resolveAdminVitePort();

  return mergeConfig(config, {
    server: {
      port,
    },
    preview: {
      port,
    },
  });
};
