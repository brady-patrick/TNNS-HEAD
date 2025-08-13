# User Profile Settings Implementation

## Overview
This implementation adds editable user profile settings to the tennis app, including profile picture, cover image, and birthday fields. The settings are connected to a user context that persists data across the application.

## Features Implemented

### 1. User Context (`src/contexts/UserContext.tsx`)
- **UserProfile Interface**: Defines the structure for user data including name, email, avatar, cover image, location, birthday, age, and tennis ratings
- **Age Calculation**: Automatically calculates age from birthday input
- **Local Storage**: Persists user data in browser localStorage
- **Update Functions**: Provides methods to update user profile, avatar, and cover image

### 2. Image Upload Component (`src/components/ImageUpload.tsx`)
- **Drag & Drop**: Supports drag and drop for image uploads
- **File Selection**: Click to choose files from file system
- **Image Preview**: Shows current image with remove option
- **Type Support**: Handles both avatar (square) and cover image (wide) formats
- **File Validation**: Accepts PNG, JPG images

### 3. Enhanced Settings Page (`src/pages/Settings.tsx`)
- **Profile Images Section**: Upload profile picture and cover image
- **Editable Fields**: Name, email, location, and birthday
- **Edit Mode**: Toggle between view and edit modes
- **Form Validation**: Proper form handling with save/cancel actions
- **Real-time Updates**: Changes reflect immediately across the app

### 4. Updated Landing Page (`src/pages/Landing.tsx`)
- **Dynamic Content**: Uses user context instead of hardcoded data
- **Cover Image Display**: Shows user's cover image in header banner
- **Profile Integration**: All user data is now dynamic and editable

### 5. Navigation Updates (`src/components/Navigation.tsx`)
- **User Context Integration**: Removed hardcoded user prop dependency
- **Dynamic Avatar**: Shows current user's profile picture

## Key Changes Made

### App.tsx
- Wrapped application with `UserProvider`
- Removed hardcoded user data
- Restructured component hierarchy

### User Context
- Created centralized user state management
- Implemented localStorage persistence
- Added age calculation from birthday

### Settings Page
- Added profile image uploads
- Replaced age field with birthday field
- Implemented edit/save functionality
- Added image upload components

### Landing Page
- Integrated with user context
- Added cover image support
- Removed hardcoded user data

## Usage

### Editing Profile
1. Navigate to Settings page
2. Click "Edit Profile" button
3. Upload new profile picture or cover image
4. Modify text fields (name, email, location, birthday)
5. Click "Save changes" to apply updates

### Image Upload
- **Profile Picture**: Square format, recommended 256x256px
- **Cover Image**: Wide format, recommended 1200x400px
- Drag and drop images or click to browse
- Images are stored as base64 data URLs

### Birthday and Age
- Birthday is stored as ISO date string (YYYY-MM-DD)
- Age is automatically calculated and updated
- Age displays in format "Age: X years old"

## Technical Details

### State Management
- React Context API for global user state
- Local state for form editing
- localStorage for data persistence

### Image Handling
- FileReader API for image processing
- Base64 encoding for storage
- Drag and drop event handling

### Data Flow
1. User makes changes in Settings
2. Settings component calls context update functions
3. User context updates state and localStorage
4. All components using user context re-render
5. Changes appear immediately across the app

## Future Enhancements
- Image compression and optimization
- Cloud storage integration
- Profile privacy settings
- Social media integration
- Profile sharing capabilities

## Dependencies
- React 18+
- TypeScript
- Tailwind CSS
- Lucide React icons
- Local browser APIs (FileReader, localStorage)
