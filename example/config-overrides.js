module.exports = {
  webpack: function(config) {
    config.output.globalObject = 'self';

    const {WebWorkerPlugin} = require('@remote-ui/web-workers/webpack');
    config.plugins.unshift(new WebWorkerPlugin());

    const {rules} = config.module;

    const eslintLoader = require.resolve('eslint-loader');
    const eslintLoaderIndex = rules.findIndex((rule) =>
      Boolean(rule.use && rule.use[0] && rule.use[0].loader === eslintLoader),
    );
    rules.splice(eslintLoaderIndex, 1);

    const oneOfRule = rules.find((rule) => 'oneOf' in rule);
    const babelLoader = require.resolve('babel-loader');
    const babelRules = oneOfRule.oneOf.filter(
      (rule) => rule.loader === babelLoader,
    );

    const customPreset = {
      plugins: [require.resolve('@remote-ui/web-workers/babel')],
    };

    for (const rule of babelRules) {
      rule.options.presets.push(customPreset);
    }

    return config;
  },
};
