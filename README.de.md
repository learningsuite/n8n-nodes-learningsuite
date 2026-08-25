
# n8n-nodes-learningsuite

  

![n8n](https://img.shields.io/badge/n8n-2.17.2+-brightgreen)

![Version](https://img.shields.io/badge/version-1.5.0-blue)

![License](https://img.shields.io/badge/license-MIT-green)

  

Die offizielle n8n Integration für **LearningSuite**, die deine LearningSuite Instanz mit n8n Workflows verbindet. Entwickelt und gepflegt von [Jörg Sebening](https://github.com/rjsebening) für LearningSuite.

  

## Was ist n8n?

  

n8n ist ein einfach zu bedienendes Tool, mit dem du Aktionen zwischen verschiedenen Web-Apps, wie LearningSuite, automatisieren kannst. Das Erstellen von sogenannten "Workflows" zwischen Apps automatisiert viele der manuellen Aufgaben. So kannst du dir oder deinen Mitarbeitern enorm viel Zeit sparen.

  

## 🚀 Features

- **16 Ressourcen** vollständig unterstützt (Member, Course, Group, Bundle, Hub, Module, Community, Calendar Event, Custom Fields, Popup, Webhook, Role, User, Team Member, AI, API Call)
- **100 Action-Endpunkte** für maximale Flexibilität
- **Instant Trigger (Webhook-basierend)** mit 19 Event-Types für Echtzeit-Automatisierung
- **Polling Trigger** mit 11 Event-Types für zeitgesteuerte Abfragen
- **Flexible API Call** Resource für custom Endpunkte

## 📋 Unterstützte Operationen

### 👤 **Member** (20 Operationen)

- Get Member by Email, Get Member by ID, Get Many Members, Create a Member, Update a Member, Delete a Member, Find or Create Member
- Activate Deactivate Member, Add Member to Courses, Remove Member From Courses, Add Member to Bundles, Remove Member From Bundles
- Get Member Courses, Get Member Course Info, Get Member Bundles
- Get Course Progress, Get Module Progress, Get Lesson Progress, Set Course Progress, Reset Course Progress

### 📚 **Course** (9 Operationen)

- Get Published Courses, Publish Course, Get Course Modules, Get Course Modules for Member
- Get Course Members, Get Course Access Requests, Get Course Submissions
- Create Lesson, Update Lesson

### 👥 **Group** (13 Operationen)

- Create a Group, Delete a Group, Find Groups by Name, Find or Create Group, Get Group by ID, Get Many Groups
- Add Members to Groups, Add Members to Groups Summary, Remove Members From Groups
- Add Courses to Group, Remove Courses From Group, Get Group Courses, Add Bundles to Group

### 📦 **Bundle** (2 Operationen)

- Get Bundles, Get Bundle Members

### 🏠 **Hub** (6 Operationen)

- Get Many Hubs, Get Hub Templates, Get Hub Template Variables, Create a Hub, Add Hub Access, Remove Hub Access

### 📖 **Module** (3 Operationen)

- Get Module Lessons, Get Module Sections, Change Module Access

### 💬 **Community** (8 Operationen)

- Get Community Areas, Get Community Forums, Get Community Posts, Get Community Badges
- Create Community Post, Add Comment to Post
- Assign Badges to Member, Remove Badges From Member

### 🗓️ **Calendar Event** (4 Operationen)

- Get Many Calendar Events, Create a Calendar Event, Update a Calendar Event, Delete a Calendar Event
- Erinnerungen (Push/E-Mail), Link-Phasen (Before/During/After), Zugriff über Member/Gruppen/Bundles
- Update übernimmt Felder aus eingehenden Items automatisch

### 🔧 **Custom Fields** (14 Operationen)

- Retrieve All Custom Field Cards, Retrieve Custom Field Cards Including Their Definitions and Categories
- Retrieve Custom Field Categories, Retrieve Custom Field Definitions
- Retrieve the Values of a Custom Field for a User, Get All Custom Field Values of a User for a Given Profile
- Retrieve Custom Field Profiles of a User, Retrieve Custom Field Profiles Including Their Values, Retrieve the Values of a Custom Field Card Profile for a User
- Retrieve the Complete Custom Field Store of a User
- Set the Value of a Single Custom Field for a User, Set Multiple Custom Field Values for a User in One Request, Update a Custom Field Value Within a Profile of a Custom Field Card
- Upload a File From a Public URL and Append It to a Custom Field

### 🎯 **Popup** (4 Operationen)

- Get Many Popups, Get a Popup, Trigger Popup for Member, Remove Popup Trigger for Member

### 🔗 **Webhook** (6 Operationen)

- Get Webhook Subscription, Get Webhook Subscriptions, Create Webhook Subscription, Update Webhook Subscription, Delete Webhook Subscription
- Get Webhook Sample Data

### 👤 **Team Member** (3 Operationen)

- Get Team Members, Get Team Member by Email, Get Team Member by ID

### 📢 **User** (2 Operationen)

- Send Push Notification, Send Login Email

### 🤖 **AI** (4 Operationen)

- Send Message to AI Agent, Send Message to AI Concierge, List AI Agents, List Agent Actions

### 🛡️ **Role** (1 Operation)

- Get Many Roles

### 🛠️ **API Call** (1 Operation)

- Custom API Call (für beliebige Endpunkte)

## 🎣 Trigger Events

Der LearningSuite Trigger unterstützt folgende Events:

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
  

## 💡 Beispiele für Anwendungsfälle

  

### Automatisierte Mitgliederverwaltung

Lege automatisiert von einer Liste wie in Google Sheets neue Mitglieder an und erspare dir so den Schritt, in LearningSuite manuell Nutzer anzulegen.

  

### E-Commerce Integration

Verbinde andere Tools wie Copecart per Webhook mittels n8n und verkaufe deine LearningSuite Kurse in deinem eigenen Online-Shop.

  

### Lead-Generierung

Verknüpfe Formulare von deiner Website und gib Nutzern, welche das Formular ausfüllen, automatisiert Zugang zu Info-Produkten in LearningSuite.

  

### Fortschritts-Monitoring

Überwache automatisch den Lernfortschritt deiner Teilnehmer und sende personalisierte Erinnerungen oder Glückwünsche.

  

## 🛠️ Installation

  

### Option 1: n8n Community Nodes (Empfohlen)

  

1. Öffne deine n8n Instanz

2. Gehe zu **Settings** → **Community Nodes**

3. Installiere: `@learningsuite/n8n-nodes-learningsuite`

4. Starte n8n neu
  

### Option 2: Manuelle Installation

#### A)

```bash
# In deinem n8n Projekt-Verzeichnis
npm  i  @learningsuite/n8n-nodes-learningsuite

# n8n neu starten
npm  start

```

#### B) Unscoped (Standard)

```bash

# In deinem n8n Projekt-Verzeichnis
npm  install  n8n-nodes-learningsuite

# n8n neu starten
npm  start

```

  

### Option 3: Docker

  

```bash

# Mit Docker Environment Variable

docker  run  -it  --rm  \

--name n8n \

-p  5678:5678  \

-e N8N_CUSTOM_EXTENSIONS="/data/custom" \

-v  ~/.n8n:/data  \

docker.n8n.io/n8nio/n8n

```

  

## 🔐 Authentifizierung einrichten

  

### API Key generieren

  

1. Melde dich in deiner **LearningSuite Instanz** an

2. Gehe zu **Einstellungen** → **Integrationen**

3. Klicke auf **"API-Key generieren"**

4. Kopiere den generierten API-Key

  

### Credentials in n8n konfigurieren

  

1. Öffne n8n und gehe zu **Credentials**

2. Klicke **"New Credential"**

3. Suche nach **"LearningSuite API"**

4. Fülle folgende Felder aus:

-  **API Key**: Dein generierter API-Key

-  **Base URL**: `https://api.learningsuite.io/api/v1` (Standard)

5. Teste die Verbindung und speichere

  

## 📖 Verwendung

  

### Basic Member Operation

  

```

1. Füge einen "LearningSuite" Node hinzu

2. Wähle Resource: "Member"

3. Wähle Operation: "Get by Email"

4. Gib die E-Mail Adresse ein

5. Führe den Workflow aus

```

### Custom-Field-Datei-Uploads

Die Custom Fields Resource unterstützt Datei-, Bild-, Video- und Audio-Felder.

- Nutze **Set Field Value**, **Set Multiple Field Values** oder **Update Profile Field**, wenn die Datei als n8n Binary Data im Workflow vorliegt.
- Nutze **Upload File From URL**, wenn LearningSuite eine öffentliche Datei-URL selbst herunterladen und den zurückgegebenen Datei-Wert an das gewählte Custom Field anhängen soll.
- Datei-Felder unterstützen den Modus **File Value Mode**:
  - **Add**: neue Dateiwerte anhängen und abbrechen, wenn das Feldlimit überschritten würde
  - **Replace**: bestehende Dateiwerte durch die hochgeladenen Dateiwerte ersetzen
  - **Replace if Limit Reached**: anhängen, solange Platz ist, sonst bestehende Dateiwerte ersetzen
- Die Node berücksichtigt die in LearningSuite definierten Limits des Custom Fields, z.B. `maxFiles`, `maxImages`, `maxVideos` und `maxAudios`.
- Bei Custom-Field-Cards mit mehreren Profilen kannst du über Profile ID, Profile Index oder Profile Name ein bestimmtes Profil ansprechen. Wenn die Card keine mehreren Profile erlaubt, werden Profilparameter ignoriert und das Default-Profil verwendet.

  

### Kalender-Events

Die Ressource Calendar Event arbeitet auf Event-**Serien**, nie auf einzelnen Terminen — eine wöchentliche Serie ist ein Eintrag, unabhängig davon, wie oft sie stattfindet.

- **Get Many** filtert über die Laufzeit der Serie: `From Date`/`To Date` wählen Serien aus, deren Laufzeit sich mit dem Zeitraum überschneidet, jeweils um einen Tag erweitert für Zeitzonen-Toleranz. Eine Serie kann deshalb zurückkommen, obwohl kein einziger ihrer Termine im exakten Zeitraum liegt. Die einzelnen Termine berechnest du aus `startDate`, `startTime`, `timeZone`, `duration`, `repetitionInterval` und `endDate`.
- **Datum und Uhrzeit** im Format `YYYY-MM-DD` bzw. `HH:mm`, interpretiert in der IANA-Zeitzone des Events (z.B. `Europe/Berlin`).
- **Update** übernimmt seine Felder automatisch aus dem eingehenden Item, ein Get-Many-Ergebnis lässt sich also direkt weiterreichen. Gesendet wird nur, was gemappt ist — alles andere behält seinen Wert.
- **Wert leeren**: das Feld auf den Ausdruck `{{ null }}` setzen. Die API erlaubt das nur für Description, Duration und End Date.
- **Link Stages** ersetzen den einzelnen Link durch die Phasen Before/During/After. Sobald eine Phase gesetzt ist, ist die During-Phase Pflicht.
- **Zugriff** (Member, Gruppen, Bundles) lässt sich nur beim Anlegen setzen; der Update-Endpunkt nimmt ihn nicht entgegen.

### ⚡ Instant Webhook Trigger Setup

  

```

1. Füge einen "LearningSuite Trigger" Node hinzu

2. Wähle das gewünschte Event (z.B. "Lesson Completed")

3. Konfiguriere optionale Filter

4. Aktiviere den Workflow

5. Der Webhook wird automatisch bei LearningSuite registriert

```

### ⏱️ Polling Trigger Setup

  

```

1. Füge einen "LearningSuite Polling Trigger" Node hinzu

2. Wähle das gewünschte Event (z.B. "New Member")

3. Konfiguriere optionale Filter

4. Aktiviere den Workflow

5. Der Polling Trigger wird automatisch bei LearningSuite registriert

```
  

## 🔧 API Referenz

  

Die Node basiert auf der **LearningSuite API** und unterstützt alle öffentlich verfügbaren Endpunkte.

  

**Base URL**: `https://api.learningsuite.io/api/v1`

  

**Authentifizierung**: API Key über `x-api-key` Header

  

Vollständige API Dokumentation verfügbar unter: [LearningSuite API Docs](https://api.learningsuite.io/api/v1/docs/)

  

## 🤝 Contributing

  

Wir freuen uns über Beiträge! Bitte beachte folgende Guidelines:

  

### Development Setup

  

```bash

# Repository klonen

git  clone  https://github.com/learningsuite/n8n-nodes-learningsuite.git

cd  n8n-nodes-learningsuite

  

# Dependencies installieren

npm  install

  

# TypeScript kompilieren

npm  run  build

  

# Tests ausführen

npm  test

```

  

### Pull Request Guidelines

  

1.  **Fork** das Repository

2. Erstelle einen **Feature Branch** (`git checkout -b feature/amazing-feature`)

3.  **Committe** deine Änderungen (`git commit -m 'Add amazing feature'`)

4.  **Push** zum Branch (`git push origin feature/amazing-feature`)

5. Öffne einen **Pull Request**

  

### Code Style

  

- TypeScript für alle neuen Features

- ESLint Konfiguration befolgen

- Tests für neue Funktionalität hinzufügen

- Dokumentation aktualisieren

  

## 📝 Changelog

Alle nennenswerten Änderungen stehen in [CHANGELOG.md](CHANGELOG.md).

## 🛠️ Kompatibilität

  

-  **n8n Version**: 2.17.2+ (getestet mit latest)

-  **Node Version**: 20+

-  **TypeScript**: 5.0+

  

## ❓ Support

  

### Probleme melden

Für Fehler oder Feature-Wünsche **in dieser Node** erstelle bitte ein [GitHub Issue](https://github.com/learningsuite/n8n-nodes-learningsuite/issues).

  

Bei Fragen zur LearningSuite API selbst oder zu deinem LearningSuite Account wende dich an den LearningSuite Support.

  

### FAQ

  

**Q: Kann ich mehrere LearningSuite Instanzen verwenden?**

A: Ja, erstelle einfach mehrere Credentials mit unterschiedlichen API Keys und Base URLs.

  

**Q: Werden alle API Endpoints unterstützt?**

A: Die Node deckt alle öffentlichen API Endpunkte ab. Für spezielle Endpunkte nutze die "API Call" Resource.

  

**Q: Wie finde ich meine LearningSuite API Base URL?**

A: Die Standard URL ist `https://api.learningsuite.io/api/v1`. Bei Custom Domains kontaktiere deinen LearningSuite Administrator.

  

---

  

⭐ **Gefällt dir diese Node?** Gib uns einen Stern auf GitHub!

  

💡 **Feature Request?** Öffne ein Issue - wir sind immer offen für Verbesserungen!

## 📬 Betreut für LearningSuite

Diese Integration wurde für **LearningSuite** entwickelt und wird von **[Jörg Sebening](https://github.com/rjsebening)** in Zusammenarbeit mit dem LearningSuite Team gepflegt.

👉 [LearningSuite](https://learningsuite.io) · [GitHub](https://github.com/learningsuite/n8n-nodes-learningsuite) · [Support](https://learningsuite.io)

## 🙌 Großer Dank an den Maintainer

Ein großes Dankeschön an **[Jörg Sebening](https://github.com/rjsebening)**, der diese Integration für LearningSuite gebaut, das Fundament für alles gelegt hat, was sie heute kann, und sie weiterhin pflegt. Seine Arbeit, Sorgfalt und fortlaufende Unterstützung machen diese offizielle LearningSuite Integration möglich.

## ⚖️ Rechtliches

* Offizielle LearningSuite Integration, entwickelt und gepflegt für die Nutzung mit der öffentlichen LearningSuite API
* Bei Fragen zur API → **[LearningSuite Support](https://learningsuite.io)** kontaktieren
* Alle Markenzeichen und Logos gehören ihren jeweiligen Eigentümern

## 📄 Lizenz

**MIT Lizenz**
Beiträge und Pull Requests sind willkommen!
