# GitHub Pages Setup Guide

[← Back to Documentation Hub](README.md)

This guide explains how to enable GitHub Pages for the volunteer-calculator repository.

## Prerequisites

- Repository must be public or you must have GitHub Pro/Enterprise for private repository Pages
- You must have admin access to the repository

## Setup Steps

### 1. Enable GitHub Pages via GitHub Actions

The repository is now configured with a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to GitHub Pages on every push to the `main` branch.

### 2. Configure GitHub Pages Settings

To complete the setup, you need to enable GitHub Pages in the repository settings:

1. Go to your repository on GitHub: `https://github.com/AvinZarlez/volunteer-calculator`
2. Click on **Settings** (top navigation)
3. In the left sidebar, click on **Pages** (under "Code and automation")
4. Under "Build and deployment":
   - **Source**: Select **GitHub Actions**
   - This allows the workflow to deploy the site
5. Click **Save** if prompted

### 3. Trigger the First Deployment

Once the settings are configured:

1. Merge the PR with the GitHub Pages workflow to the `main` branch
2. The workflow will automatically run and deploy the site
3. After a few minutes, your site will be available at: `https://avinzarlez.github.io/volunteer-calculator/`

### 4. Verify Deployment

1. Go to the **Actions** tab in your repository
2. Look for the "Deploy to GitHub Pages" workflow
3. Check that it completed successfully (green checkmark)
4. Visit `https://avinzarlez.github.io/volunteer-calculator/` to see your live site

## Workflow Details

The deployment workflow (`.github/workflows/deploy.yml`) automatically:

- Triggers on every push to `main` branch
- Can also be manually triggered from the Actions tab
- Uses the official GitHub Pages actions for reliable deployment
- Deploys all files in the repository root (HTML, CSS, JS, docs, etc.)

## Manual Deployment

If needed, you can manually trigger a deployment:

1. Go to **Actions** tab
2. Select "Deploy to GitHub Pages" workflow
3. Click **Run workflow**
4. Select the `main` branch
5. Click **Run workflow**

## Troubleshooting

### Site Not Loading After Deployment

- Wait a few minutes for DNS propagation
- Check the Actions tab for any failed workflows
- Verify GitHub Pages is enabled in Settings → Pages
- Ensure the repository is public or you have the required GitHub plan

### Workflow Failing

- Check the workflow logs in the Actions tab
- Verify the `GITHUB_TOKEN` has the required permissions
- Ensure Pages is enabled in repository settings with "GitHub Actions" as the source

### 404 Errors for Assets

- The `.nojekyll` file ensures GitHub Pages doesn't process the site with Jekyll
- Check that file paths in HTML are correct (relative paths work best)

## Files Added for GitHub Pages

- `.github/workflows/deploy.yml` - Deployment workflow
- `.nojekyll` - Prevents Jekyll processing
- `docs/github-pages-setup.md` - This setup guide

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions for Pages](https://github.com/actions/deploy-pages)
- [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
