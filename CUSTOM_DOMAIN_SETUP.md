# Setting Up Custom Domain (visluck.com) with GitHub Pages

## Overview

This guide will help you connect your custom domain `visluck.com` (hosted on Hostinger) to GitHub Pages.

## Step 1: Configure GitHub Pages Custom Domain

1. **Push your code to GitHub** (if not already done)
2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
3. **Add Custom Domain**:
   - In the same **Pages** settings
   - Under **Custom domain**, enter: `visluck.com`
   - Check **Enforce HTTPS** (recommended)
   - Click **Save**

GitHub will show you the DNS records you need to configure.

## Step 2: Configure DNS on Hostinger

### Option A: Using A Records (Recommended for root domain)

1. **Log in to Hostinger**:
   - Go to [hpanel.hostinger.com](https://hpanel.hostinger.com)
   - Log in to your account

2. **Access DNS Management**:
   - Go to **Domains** → Select `visluck.com`
   - Click **DNS / Name Servers** or **Manage DNS**

3. **Add A Records**:
   Add these 4 A records (GitHub Pages IP addresses):
   
   | Type | Name | Value | TTL |
   |------|------|-------|-----|
   | A | @ | 185.199.108.153 | 3600 |
   | A | @ | 185.199.109.153 | 3600 |
   | A | @ | 185.199.110.153 | 3600 |
   | A | @ | 185.199.111.153 | 3600 |

   **Note**: `@` means the root domain (visluck.com)

4. **Add CNAME for www** (optional, for www.visluck.com):
   
   | Type | Name | Value | TTL |
   |------|------|-------|-----|
   | CNAME | www | YOUR_USERNAME.github.io | 3600 |

   Replace `YOUR_USERNAME` with your GitHub username.

### Option B: Using CNAME (Alternative)

If A records don't work, you can use CNAME:

1. **Remove existing A records** for `@` (if any)
2. **Add CNAME record**:
   
   | Type | Name | Value | TTL |
   |------|------|-------|-----|
   | CNAME | @ | YOUR_USERNAME.github.io | 3600 |

   **Note**: Some DNS providers don't support CNAME for root domain. If Hostinger doesn't allow this, use Option A.

## Step 3: Wait for DNS Propagation

- DNS changes can take **15 minutes to 48 hours** to propagate
- You can check propagation status at: [whatsmydns.net](https://www.whatsmydns.net)
- Enter `visluck.com` and check if it points to GitHub's IPs

## Step 4: Verify SSL Certificate

1. After DNS propagates, GitHub will automatically issue an SSL certificate
2. This usually takes **a few minutes to a few hours**
3. Check in GitHub repository **Settings** → **Pages** → **Custom domain**
4. You should see a green checkmark when SSL is active

## Step 5: Test Your Site

Once DNS has propagated and SSL is active:

1. Visit `https://visluck.com` (with HTTPS)
2. Visit `https://www.visluck.com` (if you set up www)
3. Both should show your GitHub Pages site

## Important Notes

### Base Path Configuration

The GitHub Actions workflow is configured to use root path (`/`) for your custom domain. This means:
- ✅ `https://visluck.com` will work
- ✅ All assets will load correctly
- ✅ No subdirectory needed

### CNAME File

The `client/public/CNAME` file contains:
```
visluck.com
www.visluck.com
```

This file is automatically included in your build and tells GitHub Pages which domains to serve.

## Troubleshooting

### Domain not resolving

1. **Check DNS records**:
   - Verify A records are correct in Hostinger
   - Use [DNS Checker](https://dnschecker.org) to verify globally

2. **Wait longer**:
   - DNS can take up to 48 hours
   - Clear your browser cache
   - Try incognito/private browsing

### SSL Certificate not issued

1. **Verify DNS is correct**:
   - Make sure A records point to GitHub's IPs
   - Wait for full DNS propagation

2. **Check GitHub Settings**:
   - Go to repository **Settings** → **Pages**
   - Make sure custom domain is saved
   - Uncheck and recheck **Enforce HTTPS**

3. **Wait**:
   - SSL certificate generation can take a few hours

### Site shows GitHub 404

1. **Check deployment**:
   - Go to repository **Actions** tab
   - Make sure latest deployment succeeded

2. **Verify base path**:
   - The workflow uses `/` for root domain
   - Make sure you're accessing `https://visluck.com` (not a subdirectory)

### Mixed content warnings

- Make sure you're accessing via `https://` not `http://`
- GitHub Pages automatically redirects HTTP to HTTPS

## Hostinger-Specific Tips

1. **DNS Zone Editor**:
   - In Hostinger, look for **DNS Zone Editor** or **DNS Management**
   - You may need to switch from "Hostinger DNS" to "Custom DNS" if using external DNS

2. **TTL Settings**:
   - Set TTL to 3600 (1 hour) for faster updates during setup
   - You can increase it later for better performance

3. **Contact Support**:
   - If you have issues, Hostinger support can help with DNS configuration
   - They can verify your DNS records are set correctly

## After Setup

Once everything is working:

1. **Test all pages** on your site
2. **Check mobile responsiveness**
3. **Verify HTTPS is working** (green lock in browser)
4. **Set up redirects** (if needed):
   - Redirect `www.visluck.com` → `visluck.com` (or vice versa)
   - This can be done in Hostinger DNS or GitHub Pages settings

## Need Help?

- **GitHub Pages Docs**: [docs.github.com/pages](https://docs.github.com/pages)
- **Hostinger Support**: [hpanel.hostinger.com/support](https://hpanel.hostinger.com/support)
- **DNS Checker**: [dnschecker.org](https://dnschecker.org)

