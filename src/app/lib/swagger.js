import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "WriteRight API Documentation",
        description: "A REST API built with Next.js",
        version: "1.0.0"
      },
      components: {
        securitySchemes: {
          session: {
            type: "apiKey",
            in: "cookie",
            name: "next-auth.session-token"
          }
        }
      }
    },
  });

  return spec;
};