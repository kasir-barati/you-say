# Testing strategy for frontend application

1. Test props in Jest
2. Test UI and functionalities via storybook
3. Test once, following DRY principle

# Mocking

- NextJS's font optimization has built-in automatic self-hosting for any font file. The optimization automatically downloads any Google font and places Google and local fonts into an app's static assets all at **BUILD** time. When running tests it's important to mock the module import `next/font/google` and/or `next/font/local` depending on which font optimization you're using.
