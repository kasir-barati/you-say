// /libs/lib1/project.json
{
  // ...
  "test": {
    "executor": "@nx/jest:jest",
    "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
    "options": {
      "jestConfig": "libs/server/ai/jest.config.ts"
    }
  }
  // ...
}

// nx.json
{
  // ...
  "targetDefaults": {
    "@nx/jest:jest": {
      "cache": true,
      "inputs": ["default", "^production", "{workspaceRoot}/jest.preset.cjs"],
      "options": {
        "passWithNoTests": true
      },
      "configurations": {
        "ci": {
          "ci": true,
          "codeCoverage": true
        }
      }
    }
  }
  // ...
}