# n8n-nodes-learningsuite

![n8n](https://img.shields.io/badge/n8n-2.17.2+-brightgreen)

![Version](https://img.shields.io/badge/version-1.2.3-blue)

![License](https://img.shields.io/badge/license-MIT-green)

An n8n Community Node for the **LearningSuite API**, which allows you to seamlessly integrate your LearningSuite instance into n8n workflows.

## What is n8n?

n8n is an easy-to-use tool that allows you to automate actions between different web apps, such as LearningSuite. Creating so-called "workflows" between apps automates many of the manual tasks. This can save you or your employees a tremendous amount of time.

## ⚖️ Legal Notice

This community node uses the public LearningSuite API and is not affiliated with or sponsored by LearningSuite. All trademarks belong to their respective owners.

**Note**: This is a community-developed node for the LearningSuite API. For official support, please contact LearningSuite directly.

## 🚀 Features

- **15 resources** fully supported (Member, Course, Group, Bundle, Hub, Module, Community, Custom Fields, Popup, Webhook, Role, User, Team Member, AI, API Call)
- **90 action endpoints** for maximum flexibility
- **Instant trigger (webhook-based)** with 18 event types for real-time automation
- **Polling trigger** with 11 event types for scheduled polling
- **Flexible API call** resource for custom endpoints

## 📋 Supported Operations

### 👤 **Member** (20 operations)

- Get by email, get by ID, get all, create, update, delete, find or create
- Activate/deactivate, add/remove courses, add/remove bundles
- Get courses, get course information, get member bundles
- Get course progress, get module progress, get lesson progress, set course progress, reset course progress

### 📚 **Course** (7 operations)

- Get published courses, get course modules, get course modules for member
- Get course members, get course access requests, get course submissions, create lesson

### 👥 **Group** (12 operations)

- Add bundles to group, add courses to group, add members to groups, add members to groups (summary)
- Create group, delete group, find group by name, find or create group
- Get group courses, get many, remove courses from group, remove members from groups

### 📦 **Bundle** (2 operations)

- Get all, get bundle members

### 🏠 **Hub** (6 operations)

- Get all, get templates, create, give hub access, remove hub access, get hub template variables

### 📖 **Module** (3 operations)

- Get module lessons, get module sections, change module access for member

### 💬 **Community** (7 operations)

- Assign badges to member, remove community badges from member
- Get community areas, get community badges, get community forums, get community posts
- Create community post comment

### 🔧 **Custom Fields** (14 operations)

- Get cards, get cards (expanded), get categories, get definitions
- Get field values, get store, get store values
- Get profile by card, get profiles, get profiles (expanded)
- Set field value, set multiple field values, update profile field
- Upload file from URL

### 🎯 **Popup** (4 operations)

- Get all, get popup, trigger popup for member, delete popup trigger

### 🔗 **Webhook** (5 operations)

- Get/create/update/delete subscriptions, get sample data

### 👤 **Team Member** (3 operations)

- Get many, get by email, get by ID

### 📢 **User** (1 operation)

- Send push notification

### 🤖 **AI** (3 operations)

- Get agent actions, get AI agents, RAG Chat

### 🛡️ **Role** (1 operation)

- Get all

### 🛠️ **API Call** (1 operation)

- Make a request (for any API calls)

## 🎣 Trigger Events

The LearningSuite trigger supports the following events:

### ⚡ Instant Trigger Events (Webhook)

- ✅ Community Post Commented
- ✅ Agent Action Executed
- ✅ Community Post Created
- ✅ Community Post Moderated
- ✅ Course Member Added
- ✅ Course Progress Changed
- ✅ Course Updated
- ✅ Custom Field Value Changed
- ✅ Custom Popup Interaction
- ✅ Exam Completed
- ✅ Exam Graded
- ✅ Group User Access Changed
- ✅ Lesson Completed
- ✅ New Access Request
- ✅ New Feedback Created
- ✅ New Login
- ✅ Submission Created
- ✅ User Activation Status Changed

### ⏱️ Polling Trigger Events

- ✅ Bundle Created
- ✅ Community Area Created
- ✅ Community Badge Created
- ✅ Community Forum Created
- ✅ Custom Field Card Created
- ✅ Custom Popup Created
- ✅ Group Created
- ✅ Member Created
- ✅ Member Not Logged In for More Than X Days
- ✅ Team Member Created
- ✅ Team Member Updated

## 💡 Use case examples

### Automated member management

Automatically create new members from a list like in Google Sheets, saving you the step of manually creating users in LearningSuite.

### E-Commerce Integration

Connect other tools like Copecart via webhook using n8n and sell your LearningSuite courses in your own online store.

### Lead Generation

Link forms from your website and give users who complete the form automated access to information products in LearningSuite.

### Progress Monitoring

Automatically monitor your participants' progress and send personalized reminders or congratulations.

## 🛠️ Installation

### Option 1: n8n Community Nodes (Recommended)

1. Open your n8n instance

2. Go to **Settings** → **Community Nodes**

3. Install: `n8n-nodes-learningsuite` or `@learningsuite/n8n-nodes-learningsuite`

4. Restart n8n

### Option 2: Manual Installation

#### A)

```bash
# In your n8n project directory
npm i @learningsuite/n8n-nodes-learningsuite

# Restart n8n
npm start

```

#### B) Unscoped (Default)

```bash

# In your n8n project directory
npm install n8n-nodes-learningsuite

# Restart n8n
npm start

```

### Option 3: Docker

```bash

# With Docker Environment Variable

docker run -it --rm \

--name n8n \

-p 5678:5678 \

-e N8N_CUSTOM_EXTENSIONS="/data/custom" \

-v ~/.n8n:/data \

docker.n8n.io/n8nio/n8n

```

## 🔐 Set up authentication

### Generate API key

1. Log in to your **LearningSuite instance**

2. Go to **Settings** → **Integrations**

3. Click **"Generate API key"**

4. Copy the generated API key

### Configure credentials in n8n

1. Open n8n and Go to **Credentials**

2. Click **"New Credential"**

3. Search for **"LearningSuite API"**

4. Fill in the following fields:

- **API Key**: Your generated API key

- **Base URL**: `https://api.learningsuite.io/api/v1` (default)

5. Test the connection and save

## 📖 Usage

### Basic Member Operation

```

1. Add a "LearningSuite" node

2. Select Resource: "Member"

3. Select Operation: "Get by Email"

4. Enter the email address

5. Execute the workflow

```

### Custom Field File Uploads

The Custom Fields resource supports file, image, video, and audio custom fields.

- Use **Set Field Value**, **Set Multiple Field Values**, or **Update Profile Field** when the file is available as n8n binary data.
- Use **Upload File From URL** when LearningSuite should download a public file URL and append the returned file value to the selected custom field.
- File fields support **File Value Mode**:
  - **Add**: append new file values and fail if the custom field limit would be exceeded
  - **Replace**: replace existing file values with the uploaded file values
  - **Replace if Limit Reached**: append while possible, otherwise replace existing file values
- The node respects the LearningSuite file limits defined on the custom field, such as `maxFiles`, `maxImages`, `maxVideos`, and `maxAudios`.
- For custom field cards with multiple profiles, use Profile ID, Profile Index, or Profile Name to target a specific profile. If the card does not allow multiple profiles, profile parameters are ignored and the default profile is used.

### ⚡ Instant Webhook Trigger Setup

```

1. Add a "LearningSuite Trigger" node

2. Select the desired event (e.g., "Lesson Completed")

3. Configure optional filters

4. Activate the workflow

5. The webhook is automatically registered with LearningSuite

```

### ⏱️ Polling Trigger Setup

```

1. Add a "LearningSuite Polling Trigger" node

2. Select the desired event (e.g., "New Member")

3. Configure optional filters

4. Activate the workflow

5. The polling trigger is automatically registered with LearningSuite

```

## 🔧 API Reference

The node is based on the **LearningSuite API** and supports all publicly available endpoints.

**Base URL**: `https://api.learningsuite.io/api/v1`

**Authentication**: API key via `x-api-key` header

Complete API documentation available at: [LearningSuite API Docs](https://api.learningsuite.io/api/v1/docs/)

## 🤝 Contributing

We welcome contributions! Please note the following guidelines:

### Development Setup

```bash

# Clone Repository

git clone https://github.com/learningsuite/n8n-nodes-learningsuite.git

cd n8n-nodes-learningsuite

# Install Dependencies

npm install

# Compile TypeScript

npm run build

# Run Tests

npm test

```

### Pull Request Guidelines

1. **Fork** the repository

2. Create a **feature branch** (`git checkout -b feature/amazing-feature`)

3. **Commit** your changes (`git commit -m 'Add amazing feature'`)

4. **Push** to the branch (`git push origin feature/amazing-feature`)

5. Open a **Pull Request**

### Code Style

- TypeScript for all new Features

- Follow ESLint configuration

- Add tests for new functionality

- Update documentation

## 📝 Changelog

### Version 1.2.3 (current)

#### Custom Fields File Uploads

- ✅ Upload file from public URL

- ✅ Binary uploads for file, image, video, and audio custom fields

- ✅ File Value Mode: add, replace, and replace when the field limit is reached

- ✅ Respect custom field file limits (`maxFiles`, `maxImages`, `maxVideos`, `maxAudios`)

- ✅ Improved handling for custom field profile cards and default profiles

### Version 0.1.0 (2025-09-23)

#### Initial Release

- ✅ Full LearningSuite API integration

- ✅ 15 resources with 90 action endpoints

- ✅ Webhook triggers with 18 event types for real-time automation

- ✅ Polling triggers with 11 event types

- ✅ "Find-or-Create" logic for members and groups

- ✅ Custom Fields resource with full CRUD support

- ✅ Course progress management (get/set/reset)

- ✅ Flexible parameter configuration

- ✅ API call resource for custom endpoints

## 🛠️ Compatibility

- **n8n Version**: 2.17.2+ (tested with latest)

- **Node Version**: 20+

- **TypeScript**: 5.0+

## 📄 License

This project is licensed under the [MIT License].

## ❓ Support

### Report Issues

For bugs or feature requests, please create a [GitHub Issue](https://github.com/learningsuite/n8n-nodes-learningsuite/issues).

### FAQ

**Q: Can I use multiple LearningSuite instances?**

A: Yes, simply create multiple credentials with different API keys and base URLs.

**Q: Are all API endpoints supported?**

A: The node covers all public API endpoints. For specific endpoints, use the "API Call" resource.

**Q: How do I find my LearningSuite API base URL?**

A: The default URL is `https://api.learningsuite.io/api/v1`. For custom domains, contact your LearningSuite administrator.

---

⭐ **Like this node?** Give us a star on GitHub!

💡 **Feature request?** Open an issue - we're always open to improvements!

## 📋 Disclaimer

This unofficial community node is not affiliated with, endorsed by, or sponsored by LearningSuite. It exclusively uses the publicly available LearningSuite API in accordance with its Terms of Use.

**Important Notes:**

- This node is developed and maintained by the community.

- For issues with the LearningSuite API, contact official LearningSuite Support.

- All LearningSuite trademarks and logos belong to LearningSuite.

- This node merely provides an interface to the public API.
