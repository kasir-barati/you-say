# Steps to create a new general decorator

1. Open the VSCode integrated terminal
2. Execute this command in it: `nest g decorator shared/decorators/new-decorator-name`
    - Replace `new-decorator-name` with the name you want to put on the new decorator
3. Open the created file and implement your decorator

# Steps to create a new specific decorator for a specific module

1. Open the VSCode integrated terminal
2. `mkdir packages/package-name/decorators`
    - Replace `package-name` with the specific package name
3. Execute this command in it: `nest g decorator packages/package-name/decorators/new-decorator-name`
    - Replace `package-name` with the specific package name
    - Replace `new-decorator-name` with the name you want to put on the new decorator
4. Open the created file and implement your decorator
