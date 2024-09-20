module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'npm',
      args: 'start',
      env: {
        VITE_DIRECTUS_URL: 'https://directus.sqlconverter.fr:8055',
        VITE_OPENAI_API_KEY: 'sk-proj-9qyA38ue-Vks81S0B8NEHJK3iLW9FJCA6y_WZUnPS_mKmwBocoWq8DUSaRczGHnO50uN7zmdpLT3BlbkFJ79fMbsB',
        VITE_OPENAI_API_URL: 'https://api.openai.com/v1/engines/davinci-codex/completions',
        VITE_STRIPE_SECRET_KEY: 'sk_test_51P8kwaRpckCWPiEzeeuvTZAeKXQBDF9lJIeeHVsV046pnGuINCEowl2oaPraI4BdFFaal1PLNJso7olESttR9',
        VITE_STRIPE_WEBHOOK_SECRET: 'whsec_f659869d0ae041c2f593914c98f24af9c820e965a95f7432d8c5642fe3dfa2bb'
      }
    }
  ]
};


