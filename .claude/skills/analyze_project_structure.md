---
name: analyze_project_structure
description: Analyzes the complete project structure to identify tech stack, modules, and architecture
---

# Skill: Analyze Project Structure

## Description
Performs comprehensive scanning of the codebase to identify:
- Frontend tech stack (frameworks, libraries, routing)
- Backend tech stack (framework, database, authentication)
- Application modules (Auth, Chat, Dashboard, Marketplace, etc.)
- API endpoints and controllers
- Component hierarchy and routing
- Configuration files and environment variables

## Input
- Project root directory path

## Output
```json
{
  "techStack": {
    "frontend": {
      "framework": "Next.js 16.2.2",
      "language": "TypeScript 5",
      "uiLibraries": ["Material UI", "Lucide Icons"],
      "http": "Axios 1.14.0"
    },
    "backend": {
      "framework": "NestJS 11.0.1",
      "language": "TypeScript 5.7.3",
      "database": "MongoDB via Mongoose",
      "auth": "JWT with Passport",
      "validation": "class-validator",
      "apiDocs": "Swagger/OpenAPI"
    }
  },
  "modules": [
    {
      "name": "Authentication",
      "endpoints": ["POST /api/auth/login", "POST /api/auth/signup", "GET /api/auth/me"],
      "components": ["/auth/login", "/auth/signup"]
    }
  ],
  "apiControllers": [
    {
      "name": "AuthController",
      "path": "backend/src/auth/auth.controller.ts",
      "endpoints": [...]
    }
  ]
}
```

## Execution Logic
1. Parse package.json files to identify dependencies
2. Scan backend/src/ for controller files
3. Scan frontend/src/app/ for page routes
4. Extract configuration from tsconfig, next.config
5. Map module relationships and dependencies
