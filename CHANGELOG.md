# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2026-08-25

### Added

- **Calendar Event resource** covering the `/calendar-events` endpoints of LearningSuite API 1.25.0 — get many, create, update, and delete event series
- Reminder settings per channel (push/email) with configurable lead minutes
- Per-phase link stages (before/during/after) including button label, icon, color, status badge, and availability windows relative to the event
- Access assignment on create via members, groups, and bundles
- Automatic mapping for the update operation through a resource mapper, so a Get Many result can be piped straight into it
- Clearing of nullable fields (description, duration, end date) with the expression `{{ null }}`

### Changed

- README and German README list the actual action names of all 16 resources and 100 operations, plus a usage section for calendar events
- README states the maintainership correctly: the node is maintained by its original author and has been published by LearningSuite; the outdated "unofficial" disclaimers were removed
- The changelog moved out of the README into this file
- Code comments and the team member fallback label are English throughout, matching the LearningSuite distribution of this integration
- Node descriptions credit `agentur-systeme.de` again, as they did before 1.3.6

### Removed

- The `requestDefaults` block of the main node. It was never consulted — the node is programmatic and every request builds its own base URL from the credentials in `shared/request.ts`.

## [1.4.1] - 2026-08-11

### Fixed

- n8n cloud community verification

## [1.4.0] - 2026-07-23

### Added

- AI concierge endpoint

## [1.3.6] - 2026-06-17

### Added

- New group endpoint

## [1.3.5] - 2026-05-27

### Added

- Support for LearningSuite API 1.21.0 updates

## [1.3.4] - 2026-05-13

### Added

- Create community post operation

## [1.3.3] - 2026-05-05

### Added

- AI agent chat operation for `/ai-agents/{agentId}/chat`

## [1.3.2] - 2026-04-28

### Added

- Agent action webhook filters for tool key and agent ID

## [1.3.1] - 2026-04-27

### Fixed

- Custom field load options now load all available fields

## [1.3.0] - 2026-04-17

### Added

- Custom field file uploads from a public URL

## [1.2.3] - 2026-04-09

### Added

- AI agent endpoints and the `agentAction.executed` webhook event

Versions 1.2.1 and 1.2.2 (both 2026-04-09) were republishes of the same change.

## [1.2.0] - 2026-04-09

### Added

- File upload support for file, image, video, and audio custom fields, including file value modes (add, replace, replace when the field limit is reached) and the LearningSuite file limits (`maxFiles`, `maxImages`, `maxVideos`, `maxAudios`)
- Improved handling for custom field profile cards and default profiles

## [1.1.0] - 2026-04-08

### Fixed

- Empty optional parameters are stripped before the API request
- `moduleResolution` switched to node16

## [1.0.4] - 2026-03-29

### Fixed

- Preparation for the n8n cloud release

## [1.0.3] - 2026-03-19

### Added

- Course progress handlers for members, including course ID to course instance ID mapping
- Custom field operations and their properties
- Webhook filters, trigger filters, and sample data for `user.activationStatusChanged`
- `course_getLessonsInCourse` load options method

## [1.0.2] - 2026-02-08

### Added

- Shared custom fields logic, helper utilities, and a resource mapper

### Changed

- Unified API error handling and centralized shared exports
- Custom fields handlers stabilized and made production-ready against the new API endpoints

### Fixed

- Find-or-create member logic

## [1.0.1] - 2026-02-05

### Added

- More polling trigger events and pagination settings

### Changed

- Polling trigger stability, deduplication, and reset logic

### Fixed

- Default value of the webhook sample data property

## [1.0.0] - 2026-01-28

### Changed

- First stable release

## [0.1.16] - 2026-01-12

### Changed

- Updated webhook, course, and instant trigger properties, handlers, and load options

## [0.1.15] - 2025-12-29

### Fixed

- Missing limit/offset handling and the `includeGroups` boolean check

## [0.1.14] - 2025-12-11

### Changed

- Removed the old credential test and updated the node definitions to meet the new n8n security and linting requirements

## [0.1.13] - 2025-11-27

### Added

- Push notification support

## [0.1.12] - 2025-11-25

### Added

- `course.updated` instant trigger event and its webhook handling

### Changed

- Clearer descriptions for webhook, member, and community parameters

## [0.1.11] - 2025-11-21

### Added

- Hub resource mapper that builds the template variable schema dynamically, with caching
- Query parameters (limit, offset, includeProgress) for course member and submission queries

### Fixed

- Community badge load options now send the proper query parameters

## [0.1.10] - 2025-11-18

### Changed

- `communityPost.commented` load options use team member IDs

## [0.1.9] - 2025-11-05

### Fixed

- Commenting on a post

## [0.1.8] - 2025-11-05

### Added

- Community features

## [0.1.7] - 2025-10-31

### Added

- Team-related features and the `getScopedParam` utility

### Changed

- Request layer, handlers, and load options refactored; icons moved to a dedicated folder

## [0.1.6] - 2025-10-24

### Fixed

- Popup name not showing in the dropdown

## [0.1.5] - 2025-10-16

### Changed

- Updated trigger, community, member, module, and webhook handlers

## [0.1.4] - 2025-09-25

### Fixed

- Webhook handler

## [0.1.3] - 2025-09-23

### Fixed

- Corrected descriptions and packaging details, released as 0.1.1, 0.1.2, and 0.1.3 on the same day

## [0.1.0] - 2025-09-23

### Added

- Initial release with full LearningSuite API integration
- Webhook triggers for real-time automation and polling triggers
- Find-or-create logic for members and groups
- Custom fields resource with full CRUD support
- Course progress management (get/set/reset)
- API call resource for custom endpoints
