export default ({ env }) => ({
  'content-type-builder': {
    enabled: env('NODE_ENV') !== 'production',
  },
});
