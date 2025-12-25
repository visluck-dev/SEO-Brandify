# Quick Setup: visluck.com on GitHub Pages

## 🚀 Quick Steps

### 1. GitHub Setup (5 minutes)

1. Push code to GitHub (if not done)
2. Go to repository **Settings** → **Pages**
3. Set **Source** to: `GitHub Actions`
4. Under **Custom domain**, enter: `visluck.com`
5. Check **Enforce HTTPS**
6. Click **Save**

### 2. Hostinger DNS Setup (5 minutes)

1. Log in to [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Go to **Domains** → Select `visluck.com`
3. Click **DNS / Name Servers** or **Manage DNS**
4. Add these 4 A records:

```
Type: A | Name: @ | Value: 185.199.108.153 | TTL: 3600
Type: A | Name: @ | Value: 185.199.109.153 | TTL: 3600
Type: A | Name: @ | Value: 185.199.110.153 | TTL: 3600
Type: A | Name: @ | Value: 185.199.111.153 | TTL: 3600
```

5. (Optional) Add CNAME for www:
```
Type: CNAME | Name: www | Value: YOUR_USERNAME.github.io | TTL: 3600
```

### 3. Wait & Verify

- ⏱️ Wait 15 minutes to 48 hours for DNS propagation
- ✅ Check DNS: [whatsmydns.net](https://www.whatsmydns.net) - enter `visluck.com`
- ✅ Check SSL: GitHub will issue certificate automatically (check in Pages settings)
- ✅ Test: Visit `https://visluck.com`

## ✅ What's Already Configured

- ✅ CNAME file created (`client/public/CNAME`)
- ✅ GitHub Actions workflow set to use root path (`/`)
- ✅ Base path configured for custom domain
- ✅ Build process includes CNAME file

## 📋 Files Created

- `client/public/CNAME` - Tells GitHub Pages your domain
- `.github/workflows/deploy.yml` - Auto-deploys with correct base path
- `CUSTOM_DOMAIN_SETUP.md` - Detailed instructions

## 🔍 Troubleshooting

**Domain not working?**
- Check DNS records are correct
- Wait longer (up to 48 hours)
- Verify in GitHub Settings → Pages → Custom domain shows green checkmark

**SSL not working?**
- Wait for DNS to fully propagate
- Check GitHub Pages settings show SSL is active
- Make sure you're using `https://` not `http://`

## 📞 Need Help?

See [CUSTOM_DOMAIN_SETUP.md](./CUSTOM_DOMAIN_SETUP.md) for detailed troubleshooting.

