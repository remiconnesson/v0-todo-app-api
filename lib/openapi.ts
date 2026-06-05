// OpenAPI 3.1 spec for the Todos API.
// Kept in one place so it can be served as JSON and rendered in the docs page.

export const openapiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Todos API",
    version: "1.0.0",
    description:
      "A simple, shared todo list. All responses use a consistent envelope: success returns `{ data }`, errors return `{ error }`. CORS is enabled for all origins.",
  },
  servers: [{ url: "/", description: "Same origin" }],
  tags: [{ name: "Todos", description: "Create, read, update, and delete todos" }],
  paths: {
    "/api/todos": {
      get: {
        tags: ["Todos"],
        summary: "List todos",
        description: "Returns all todos ordered by newest first.",
        operationId: "listTodos",
        responses: {
          "200": {
            description: "A list of todos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { type: "array", items: { $ref: "#/components/schemas/Todo" } } },
                  required: ["data"],
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Todos"],
        summary: "Create a todo",
        operationId: "createTodo",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTodo" },
              example: { title: "Buy milk", completed: false },
            },
          },
        },
        responses: {
          "201": {
            description: "The created todo",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Todo" } },
                  required: ["data"],
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/Error" },
          "422": { $ref: "#/components/responses/Error" },
        },
      },
      options: {
        tags: ["Todos"],
        summary: "CORS preflight",
        operationId: "todosPreflight",
        responses: { "204": { description: "No content" } },
      },
    },
    "/api/todos/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Numeric todo id",
          schema: { type: "integer", minimum: 1 },
        },
      ],
      get: {
        tags: ["Todos"],
        summary: "Get a todo",
        operationId: "getTodo",
        responses: {
          "200": {
            description: "A single todo",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Todo" } },
                  required: ["data"],
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/Error" },
          "404": { $ref: "#/components/responses/Error" },
        },
      },
      patch: {
        tags: ["Todos"],
        summary: "Update a todo",
        description: "Partial update. Provide at least one of `title` or `completed`.",
        operationId: "updateTodo",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTodo" },
              example: { completed: true },
            },
          },
        },
        responses: {
          "200": {
            description: "The updated todo",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Todo" } },
                  required: ["data"],
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/Error" },
          "404": { $ref: "#/components/responses/Error" },
          "422": { $ref: "#/components/responses/Error" },
        },
      },
      delete: {
        tags: ["Todos"],
        summary: "Delete a todo",
        operationId: "deleteTodo",
        responses: {
          "200": {
            description: "The deleted todo",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Todo" } },
                  required: ["data"],
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/Error" },
          "404": { $ref: "#/components/responses/Error" },
        },
      },
    },
  },
  components: {
    schemas: {
      Todo: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Buy milk" },
          completed: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["id", "title", "completed", "createdAt", "updatedAt"],
      },
      CreateTodo: {
        type: "object",
        properties: {
          title: { type: "string", minLength: 1, description: "Required, non-empty" },
          completed: { type: "boolean", default: false },
        },
        required: ["title"],
      },
      UpdateTodo: {
        type: "object",
        minProperties: 1,
        properties: {
          title: { type: "string", minLength: 1 },
          completed: { type: "boolean" },
        },
      },
      Error: {
        type: "object",
        properties: { error: { type: "string", example: "Todo not found" } },
        required: ["error"],
      },
    },
    responses: {
      Error: {
        description: "Error response",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
      },
    },
  },
} as const
