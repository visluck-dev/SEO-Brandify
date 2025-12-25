# Deploying to GitHub Pages

## Step-by-Step Instructions

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top right → **New repository**
3. Name your repository (e.g., `SEO-Brandify` or `your-site-name`)
4. Choose **Public** (required for free GitHub Pages)
5. **Do NOT** initialize with README, .gitignore, or license (you already have these)
6. Click **Create repository**

### 2. Push Your Code to GitHub

Open your terminal in the project directory and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your files
git commit -m "Initial commit - static site ready for GitHub Pages"

# Add your GitHub repository as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - **Source**: `GitHub Actions`
5. The page will automatically deploy when you push to the main branch

### 4. Access Your Site

Your site will be available at:
- `https://YOUR_USERNAME.github.io/REPO_NAME/`

For example, if your username is `john` and repo is `SEO-Brandify`:
- `https://john.github.io/SEO-Brandify/`

### 5. Custom Domain (Optional)

If you have a custom domain:

1. In your repository **Settings** → **Pages**
2. Under **Custom domain**, enter your domain (e.g., `example.com`)
3. Add a `CNAME` file in the `client/public/` directory with your domain name
4. Update your DNS records as instructed by GitHub

## Automatic Deployment

Every time you push code to the `main` branch, GitHub Actions will:
1. Build your site
2. Deploy it to GitHub Pages
3. Your site will be live in a few minutes

## Manual Deployment

If you want to deploy manually:

1. Build the site locally:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist/` folder

3. You can upload these files manually, but using GitHub Actions (automatic) is recommended

## Troubleshooting

### Site shows 404 or blank page

- Make sure the `BASE_PATH` in the GitHub Actions workflow matches your repository name
- Check that the `.nojekyll` file exists in the root
- Wait a few minutes after pushing - deployment takes time

### Assets not loading

- The base path is automatically set during build
- If you're using a custom domain, you may need to set `BASE_PATH=/` in the workflow

### Build fails

- Check the **Actions** tab in your GitHub repository
- Look at the build logs to see what went wrong
- Common issues: missing dependencies, TypeScript errors, or Node version mismatch

