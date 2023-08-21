module.exports = {
  apps: [
    {
      script: "build/index.cjs",
      name: "othello",
    },
    {
      script: "build/deploy.cjs",
      name: "othello-deploy",
    },
  ],
};
