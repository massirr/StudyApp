# Development Setup

## Prerequisites

- Node.js (LTS version recommended)
- npm or yarn

## Installation

1. Clone the repository.
2. Run `npm install` (or `yarn install`).

## Running the Development Server

Run `npm run dev` (or `yarn dev`).

## Building for Production

Run `npm run build` (or `yarn build`).

## Troubleshooting

### Common Issues and Solutions

1. **Port already in use**: If you see an error about the port being in use, try:
   ```bash
   npm run dev -- --port 3001
   ```

2. **Missing dependencies**: If you encounter errors about missing packages:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript errors**: If TypeScript compilation fails:
   - Check for type errors in your code
   - Make sure all required type definitions are installed
   - Run `npm run type-check` to see detailed errors

4. **Browser not opening automatically**: If the browser doesn't open when running `npm run dev`:
   - Manually open your browser to `http://localhost:3000`
   - Check your default browser settings

5. **HMR (Hot Module Replacement) not working**: If changes aren't reflected in the browser:
   - Check your browser's console for errors
   - Try restarting the development server
   - Clear your browser cache

## Contributing

We welcome contributions to the DP-750 Exam Prep App! Here are some guidelines to help you get started:

### How to Contribute

1. **Fork the repository**: Create your own fork of the project.
2. **Create a branch**: Create a feature branch for your changes.
3. **Make your changes**: Implement your feature or bug fix.
4. **Test your changes**: Make sure your changes work as expected.
5. **Commit your changes**: Write clear, concise commit messages.
6. **Push to your fork**: Push your changes to your fork on GitHub.
7. **Submit a pull request**: Open a pull request to the main repository.

### Code Style

- Follow the existing code style and patterns.
- Use TypeScript for type safety.
- Write clear, concise comments where necessary.
- Keep components small and focused.

### Pull Request Guidelines

- Provide a clear description of the changes in your pull request.
- Include screenshots or GIFs if your changes affect the UI.
- Make sure all tests pass (when we have tests).
- Keep pull requests focused on a single feature or bug fix.

### Reporting Issues

- Use the GitHub issue tracker to report bugs or suggest features.
- Provide as much detail as possible, including steps to reproduce the issue.
- Include screenshots or error messages if applicable.

## Deployment

### Vercel Deployment

This project is configured for easy deployment to Vercel. Here's how to deploy:

1. **Install Vercel CLI** (if you haven't already):
   ```bash
   npm install -g vercel
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   - Follow the prompts to link your project to Vercel
   - Choose the default settings (they should work for this project)

4. **For subsequent deployments**:
   ```bash
   vercel --prod
   ```

### Environment Variables

If your project uses environment variables, make sure to:

1. Create a `.env.local` file in your project root
2. Add the variables to your Vercel project settings

### Custom Domains

After deploying, you can set up a custom domain in the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Domains"
3. Add your custom domain and follow the verification steps

### Other Deployment Options

You can also deploy this project to other hosting services that support static sites or Node.js applications:

- Netlify
- GitHub Pages
- AWS Amplify
- Firebase Hosting
- Any Node.js hosting provider