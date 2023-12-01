const { OPENAI_API_ORG = 'none', OPENAI_API_KEY = 'none' } = process.env;

const required = { OPENAI_API_ORG, OPENAI_API_KEY } as const;

export namespace Env {
  export const variables = {
    //
    organization: required.OPENAI_API_ORG,
    apiKey: required.OPENAI_API_KEY,
  };

  export const load = () => {
    Object.keys(required).forEach(name => {
      if (!process.env[name]?.length) throw new Error(`Environment ${name} is required`);
    });
  };
}
