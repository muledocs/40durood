# GitHub Pages Deployment Guide

## Automatic Deployment (Recommended)

The repository is set up with GitHub Actions to automatically deploy when you push to the `main` branch.

### Steps:

1. **Enable GitHub Pages in Repository Settings:**
   - Go to your repository: https://github.com/muledocs/40durood
   - Click on **Settings** tab
   - Scroll down to **Pages** in the left sidebar
   - Under **Source**, select:
     - **Source**: `GitHub Actions`
   - Click **Save**

2. **Push the workflow file** (if not already pushed):
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add GitHub Pages deployment workflow"
   git push origin main
   ```

3. **Wait for deployment:**
   - Go to **Actions** tab in your repository
   - You should see the workflow running
   - Once complete, your site will be live at:
     `https://muledocs.github.io/40durood/`

## Manual Deployment (Alternative)

If you prefer to use the traditional GitHub Pages method:

1. **Go to Repository Settings:**
   - Navigate to: https://github.com/muledocs/40durood/settings/pages

2. **Configure Pages:**
   - **Source**: Select `Deploy from a branch`
   - **Branch**: Select `main`
   - **Folder**: Select `/web` (the folder containing your website files)
   - Click **Save**

3. **Your site will be available at:**
   - `https://muledocs.github.io/40durood/`

## Troubleshooting

### If the site doesn't load:

1. **Check Actions tab:**
   - Make sure the deployment workflow completed successfully
   - Look for any error messages

2. **Verify file paths:**
   - All paths in `index.html` should be relative (e.g., `./styles.css` not `/styles.css`)
   - Check that `manifest.json` and `sw.js` use relative paths

3. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

4. **Check GitHub Pages status:**
   - Go to Settings → Pages
   - Look for any error messages or warnings

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add a `CNAME` file in the `web/` folder with your domain name
2. Configure DNS settings with your domain provider
3. Update the domain in GitHub Pages settings

## Notes

- GitHub Pages serves over HTTPS by default
- PWA features will work perfectly on GitHub Pages
- The site will automatically update when you push changes to the `main` branch

