# GrapesJS Admin Website

A professional website with admin-only content editing capabilities using GrapesJS and Netlify Identity.

## Features

- 🎨 **Visual Content Editing**: Edit content directly on the page using GrapesJS
- 🔐 **Admin Authentication**: Secure admin access using Netlify Identity
- 📱 **Responsive Design**: Mobile-first responsive design
- 🚀 **No Backend Required**: Frontend-only solution with Netlify hosting
- 💾 **Auto-save**: Content changes are automatically saved locally
- 🎯 **Professional UI**: Clean, modern design suitable for business websites

## Pages

1. **Home** (`index.html`) - Landing page with hero section and services
2. **About** (`about.html`) - Company information and team section
3. **Contact** (`contact.html`) - Contact information and form

## Setup Instructions

### 1. Deploy to Netlify

1. **Upload Files**: 
   - Zip all the files in this project
   - Go to [Netlify](https://netlify.com) and drag the zip file to deploy
   - Or connect your GitHub repository for automatic deployments

2. **Enable Netlify Identity**:
   - Go to your Netlify site dashboard
   - Navigate to **Identity** tab
   - Click **Enable Identity**
   - Under **Settings & usage**, click **Settings**
   - Set **Registration preferences** to "Invite only" (recommended for admin-only access)

3. **Configure Identity Settings**:
   - In Identity settings, go to **External providers** (optional)
   - You can enable Google, GitHub, etc. for easier login
   - Go to **Emails** and customize the email templates if needed

### 2. Create Admin User

1. **Invite Admin User**:
   - In Netlify Identity dashboard, click **Invite users**
   - Enter the admin email address
   - The user will receive an invitation email

2. **Accept Invitation**:
   - Check email and click the invitation link
   - Set up password for the admin account
   - You're now ready to edit content!

### 3. How to Edit Content

1. **Login as Admin**:
   - Visit your website
   - You'll see admin controls in the top-right corner (only visible to logged-in admins)
   - If not logged in, click "Edit Page" to open the login modal

2. **Edit Content**:
   - Click the **"✏️ Edit Page"** button
   - The GrapesJS editor will open in full-screen mode
   - Click on any element to select and edit it
   - Use the right panel to modify styles, layers, and settings

3. **Save Changes**:
   - Click **"💾 Save"** to apply your changes
   - Changes are saved locally and will persist
   - Press **Escape** to exit without saving

### 4. Customization Options

#### Adding New Pages
1. Copy any existing HTML file (e.g., `about.html`)
2. Rename it and update the content
3. Add navigation links in all pages
4. The admin editing will work automatically

#### Modifying Styles
- Edit the `<style>` section in each HTML file
- Or use the GrapesJS editor to modify styles visually
- Changes made in the editor are saved automatically

#### Adding Components
- Use GrapesJS's built-in components (text, images, buttons, etc.)
- Drag and drop from the left panel in edit mode
- Customize using the style manager

### 5. Security Features

- **Admin-Only Editing**: Edit buttons only appear for authenticated users
- **Invite-Only Registration**: Prevent unauthorized signups
- **Session Management**: Automatic logout and session handling
- **Local Storage**: Content changes are saved locally for persistence

### 6. Troubleshooting

#### Edit Button Not Showing
- Make sure you're logged in to Netlify Identity
- Check that Identity is enabled in your Netlify dashboard
- Clear browser cache and reload the page

#### Changes Not Saving
- Ensure you clicked the "Save" button
- Check browser console for any JavaScript errors
- Try refreshing the page and editing again

#### Login Issues
- Verify the user is invited in Netlify Identity dashboard
- Check spam folder for invitation emails
- Try resetting password if needed

### 7. Advanced Configuration

#### Custom Domain
- Add your custom domain in Netlify dashboard
- Update any hardcoded URLs if necessary

#### Email Templates
- Customize invitation and password reset emails in Identity settings
- Add your branding and custom messaging

#### External Providers
- Enable Google, GitHub, or other OAuth providers
- Configure in Netlify Identity external providers section

## File Structure

\`\`\`
├── index.html          # Home page
├── about.html          # About page  
├── contact.html        # Contact page
├── js/
│   └── admin.js        # Admin functionality and GrapesJS integration
├── netlify.toml        # Netlify configuration
└── README.md           # This file
\`\`\`

## Technologies Used

- **GrapesJS**: Visual web page builder
- **Netlify Identity**: Authentication service
- **Netlify Forms**: Contact form handling
- **Vanilla JavaScript**: No frameworks required
- **CSS Grid & Flexbox**: Modern responsive layouts

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Netlify Identity documentation
3. Check GrapesJS documentation for editor features
4. Contact support through your Netlify dashboard

---

**Note**: This is a frontend-only solution. All content editing is done client-side and saved locally. For multi-user editing or database persistence, you would need to integrate with a backend service.
