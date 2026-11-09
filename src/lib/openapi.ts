import { auth } from "./auth";

let schema: ReturnType<typeof auth.api.generateOpenAPISchema>;

const getSchema = async () => (schema ??= auth.api.generateOpenAPISchema());

export const OpenAPI = {
  getPaths: (prefix = "/api/auth") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const source = paths[path];
        if (!source) continue;

        const key = prefix + path;
        reference[key] = source;

        for (const method of Object.keys(source)) {
          const operation = (reference[key] as Record<string, { tags?: string[] }>)[
            method
          ];
          if (operation) operation.tags = ["Better Auth"];
        }
      }

      return reference;
    }) as Promise<Record<string, unknown>>,
  components: getSchema().then(({ components }) => components) as Promise<
    Record<string, unknown>
  >,
} as const;
