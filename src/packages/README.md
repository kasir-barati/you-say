# How to create/update the new packages service layer, and repository layer

1. Extends the `BaseService` class for the newly created service layer
2. Create a class with `nest g class packages/package-name/package-name-repository` add `--no-spec` flag if you think you do not need the unit test file.
3. Extends the `BaseRepository` class for the newly create repository layer
