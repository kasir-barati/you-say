// libs/lib1/project.json
{
  "targets": {
    "test": {
      "cache": true
    }
  }
}
{
  "targetDefaults": {
    "build": {
      "inputs": ["{projectRoot}/**/*", "!{projectRoot}/**/*.md"],
      "outputs": ["{workspaceRoot}/dist/{projectName}"]
    }
  }
}

// nx.json
{
  "targetDefaults": {
    "build": {
      "cache": true
    }
  }
}
{
  "targetDefaults": {
    "build": {
      "inputs": ["{projectRoot}/**/*", "!{projectRoot}/**/*.md"],
      "outputs": ["{workspaceRoot}/dist/{projectName}"]
    }
  }
}