# Company Field Visibility Theme for Discourse

A Discourse theme component that displays a custom "company" user field on user profiles and user cards, visible only to members of specified groups.

## Features

- **Group-Based Visibility**: Only users in the configured group can see the company field
- **User Card Display**: Shows company information in user cards (hover cards)
- **User Profile Display**: Shows company information on full user profile pages
- **Configurable Settings**: Customize the allowed group name and field label

## Installation

### Option 1: Install from GitHub (Recommended)

1. Go to your Discourse admin panel
2. Navigate to **Customize > Themes**
3. Click **Install** > **From a git repository**
4. Enter this repository URL
5. Click **Install**

### Option 2: Install from File

1. Download or clone this repository
2. Zip the entire directory
3. Go to **Customize > Themes** in Discourse admin
4. Click **Install** > **From a file**
5. Upload the zip file

## Configuration

After installation, configure the theme settings:

1. Click on the installed theme
2. Go to **Settings**
3. Configure the following:
   - **allowed_group_name**: The group that can see the company field (default: `netwrix_employees`)
   - **field_label**: The label to display (default: `Company`)

## Requirements

- Your Discourse instance must have a custom user field named "company"
- Users must be assigned to the visibility group (e.g., `netwrix_employees`)

## Theme Structure

```
discourse-company-field-theme/
├── about.json                          # Theme metadata and settings
├── common/
│   └── common.scss                      # CSS styling
└── javascripts/discourse/connectors/
    ├── user-card-metadata/              # User card display
    │   ├── company-field.hbs
    │   └── company-field.js
    └── user-profile-primary/            # User profile display
        ├── company-field.hbs
        └── company-field.js
```

## License

MIT
