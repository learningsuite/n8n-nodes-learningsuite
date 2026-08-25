# n8n-nodes-learningsuite

![n8n](https://img.shields.io/badge/n8n-2.17.2+-brightgreen)

![Version](https://img.shields.io/badge/version-1.5.0-blue)

![License](https://img.shields.io/badge/license-MIT-green)

### Official n8n Integration for **LearningSuite – The Premium Learning Platform for Businesses & Coaches**

Automate member onboarding, course access, and community activity, react to real-time events, and keep your learners moving — **without manual work**.

## 🧭 Overview

This official community node connects **LearningSuite** seamlessly with your n8n workflows.
From member creation to course access, community interaction, and real-time triggers — automate every key process end-to-end.

The integration was developed for LearningSuite and is maintained by Jörg Sebening together with the LearningSuite team.

## What is n8n?

n8n is an easy-to-use tool that allows you to automate actions between different web apps, such as LearningSuite. Creating so-called "workflows" between apps automates many of the manual tasks. This can save you or your employees a tremendous amount of time.

## 🚀 Features

- **16 resources** fully supported (Member, Course, Group, Bundle, Hub, Module, Community, Calendar Event, Custom Fields, Popup, Webhook, Role, User, Team Member, AI, API Call)
- **100 action endpoints** for maximum flexibility
- **Instant trigger (webhook-based)** with 19 event types for real-time automation
- **Polling trigger** with 11 event types for scheduled polling
- **Flexible API call** resource for custom endpoints

## 📋 Supported Operations

### 👤 **Member** (20 operations)

- Get member by email, get member by ID, get many members, create a member, update a member, delete a member, find or create member
- Activate deactivate member, add member to courses, remove member from courses, add member to bundles, remove member from bundles
- Get member courses, get member course info, get member bundles
- Get course progress, get module progress, get lesson progress, set course progress, reset course progress

### 📚 **Course** (9 operations)

- Get published courses, publish course, get course modules, get course modules for member
- Get course members, get course access requests, get course submissions
- Create lesson, update lesson

### 👥 **Group** (13 operations)

- Create a group, delete a group, find groups by name, find or create group, get group by ID, get many groups
- Add members to groups, add members to groups summary, remove members from groups
- Add courses to group, remove courses from group, get group courses, add bundles to group

### 📦 **Bundle** (2 operations)

- Get bundles, get bundle members

### 🏠 **Hub** (6 operations)

- Get many hubs, get hub templates, get hub template variables, create a hub, add hub access, remove hub access

### 📖 **Module** (3 operations)

- Get module lessons, get module sections, change module access

### 💬 **Community** (8 operations)

- Get community areas, get community forums, get community posts, get community badges
- Create community post, add comment to post
- Assign badges to member, remove badges from member

### 🗓️ **Calendar Event** (4 operations)

- Get many calendar events, create a calendar event, update a calendar event, delete a calendar event
- Reminders (push/email), per-phase link stages (before/during/after), access via members/groups/bundles
- Update maps fields from incoming items automatically

### 🔧 **Custom Fields** (14 operations)

- Retrieve all custom field cards, retrieve custom field cards including their definitions and categories
- Retrieve custom field categories, retrieve custom field definitions
- Retrieve the values of a custom field for a user, get all custom field values of a user for a given profile
- Retrieve custom field profiles of a user, retrieve custom field profiles including their values, retrieve the values of a custom field card profile for a user
- Retrieve the complete custom field store of a user
- Set the value of a single custom field for a user, set multiple custom field values for a user in one request, update a custom field value within a profile of a custom field card
- Upload a file from a public URL and append it to a custom field

### 🎯 **Popup** (4 operations)

- Get many popups, get a popup, trigger popup for member, remove popup trigger for member

### 🔗 **Webhook** (6 operations)

- Get webhook subscription, get webhook subscriptions, create webhook subscription, update webhook subscription, delete webhook subscription
- Get webhook sample data

### 👤 **Team Member** (3 operations)

- Get team members, get team member by email, get team member by ID

### 📢 **User** (2 operations)

- Send push notification, send login email

### 🤖 **AI** (4 operations)

- Send message to AI agent, send message to AI concierge, list AI agents, list agent actions

### 🛡️ **Role** (1 operation)

- Get many roles

### 🛠️ **API Call** (1 operation)

- Custom API call (for any endpoint)

## 🎣 Trigger Events

The LearningSuite trigger supports the following events:

### ⚡ Instant Trigger Events (Webhook)

- ✅ Agent Action Executed
- ✅ AI Agent Limit for Inaccessible Course Content Exceeded
- ✅ Community Post Commented
- ✅ Community Post Created
- ✅ Community Post Moderated
- ✅ Course Member Added
- ✅ Course Progress Changed
- ✅ Course Updated
- ✅ Custom Field Value Changed Events
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

3. Install: `@learningsuite/n8n-nodes-learningsuite`

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

### Calendar Events

The Calendar Event resource works on event **series**, never on single dates — a weekly series is one entry, no matter how often it takes place.

- **Get Many** filters by series lifetime: `From Date`/`To Date` select series whose lifetime overlaps the range, widened by one day for timezone tolerance. A series can therefore be returned although none of its dates falls inside the exact range. Calculate the individual dates from `startDate`, `startTime`, `timeZone`, `duration`, `repetitionInterval`, and `endDate`.
- **Dates and times** use `YYYY-MM-DD` and `HH:mm` and are interpreted in the event's IANA time zone (e.g. `Europe/Berlin`).
- **Update** maps its fields from the incoming item automatically, so a Get Many result can be piped straight into it. Only mapped fields are sent, everything else keeps its current value.
- **Clearing a value**: set the field to the expression `{{ null }}`. The API allows this for Description, Duration, and End Date only.
- **Link Stages** replace the single link with before/during/after phases. As soon as any phase is set, the During phase is required.
- **Access** (members, groups, bundles) can only be set when creating an event; the update endpoint does not accept it.

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

All notable changes are documented in [CHANGELOG.md](CHANGELOG.md).

## 🛠️ Compatibility

- **n8n Version**: 2.17.2+ (tested with latest)

- **Node Version**: 20+

- **TypeScript**: 5.0+

## ❓ Support

### Report Issues

For bugs or feature requests **in this node**, please create a [GitHub Issue](https://github.com/learningsuite/n8n-nodes-learningsuite/issues).

For questions about the LearningSuite API itself or your LearningSuite account, contact LearningSuite support.

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

## 📬 Maintained for LearningSuite

This integration was built for **LearningSuite** and is maintained by **[Jörg Sebening](https://github.com/rjsebening)** in collaboration with the LearningSuite team.

👉 [LearningSuite](https://learningsuite.io) · [GitHub](https://github.com/learningsuite/n8n-nodes-learningsuite) · [Support](https://learningsuite.io)

## 🙌 Huge Thanks to the Maintainer

A huge thank-you to **[Jörg Sebening](https://github.com/rjsebening)**, who built this integration for LearningSuite, laid the foundation for everything it supports today, and continues to maintain it. His work, care, and ongoing support make this official LearningSuite integration possible.

## ⚖️ Legal

* Official LearningSuite integration, developed and maintained for use with the LearningSuite Public API
* For API-related issues → contact **[LearningSuite Support](https://learningsuite.io)**
* All trademarks & logos belong to their respective owners

## 📄 License

**MIT License**
Contributions and pull requests are welcome!
