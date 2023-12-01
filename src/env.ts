const { OPENAI_API_ORG, OPENAI_API_KEY } = process.env;

export namespace Env {
  export const variables = { organization: OPENAI_API_ORG, apiKey: OPENAI_API_KEY };

  export const load = () => {
    Object.keys({ OPENAI_API_ORG, OPENAI_API_KEY }).forEach(name => {
      if (!process.env[name]?.length) throw new Error(`Environment ${name} is required`);
    });
  };
}
