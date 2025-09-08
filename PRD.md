# Product Requirements Document (PRD): Marola WL Bot

## 1. Introduction

The Marola WL Bot is a Discord bot designed to automate the whitelist application process for the Marola RP server. It provides a structured and efficient way for new users to apply by answering a series of questions. The bot then forwards these applications to the server's staff for review and approval/rejection, streamlining the entire process.

## 2. Product Goal

The primary goal of the Marola WL Bot is to create a fair, transparent, and efficient whitelist application system. This will reduce the manual workload on the staff, provide a better experience for applicants, and ensure that all applicants are evaluated based on a consistent set of criteria.

## 3. Features

### 3.1. Whitelist Application via Slash Command

*   **`/whitelist` command**: Initiates the whitelist application process. The bot sends a series of questions to the user via direct messages (DMs).
*   **`/whitelist_modal` command**: An alternative to the DM-based application. This command opens a Discord modal with all the questions in a single form.

### 3.2. Application Questions

The bot asks the following questions to assess the applicant's suitability for the RP server:

1.  Qual seu nome completo?
2.  Qual sua idade?
3.  Resuma sua experiência em RP.
4.  Explique “Amor à Vida” no RP com suas palavras.
5.  O que é metagaming? Dê um exemplo.
6.  O que é RDM e como evitar?

### 3.3. Staff Review System

*   **Application Submission**: Once an applicant completes the questions, their answers are compiled into an embed and sent to a designated staff review channel.
*   **Review Interface**: The embed includes two buttons for staff members: "Aprovar" (Approve) and "Reprovar" (Reject).
*   **Permissions**: Only staff members with the "Manage Roles" permission can approve or reject applications.

### 3.4. Application Processing

*   **Approval**:
    *   The applicant is granted the `APPROVED_ROLE_ID` role.
    *   The `VISITOR_ROLE_ID` role is removed from the applicant.
    *   The applicant receives a DM notification of their approval.
    *   A notification is sent to the `APPROVED_NOTIFY_CHANNEL_ID` channel (if configured).
*   **Rejection**:
    *   The staff member is prompted to provide a reason for the rejection in a modal.
    *   The applicant receives a DM with the reason for their rejection.
    *   A notification is sent to the `REJECTED_NOTIFY_CHANNEL_ID` channel (if configured).
    *   The original application embed in the staff channel is updated to reflect the rejection and the reason.

### 3.5. Cooldown System

*   To prevent spam and give applicants time to improve, there is a 24-hour cooldown period after submitting an application before they can apply again.

### 3.6. Configuration

The bot is configured using environment variables, allowing for easy setup and management of:

*   Discord bot token (`DISCORD_TOKEN`)
*   Guild (server) ID (`GUILD_ID`)
*   Application ID (`APPLICATION_ID`)
*   Channel IDs for staff review, approved notifications, and rejected notifications.
*   Role IDs for approved users and visitors.

## 4. User Flow

1.  A new user joins the Discord server.
2.  The user runs the `/whitelist` or `/whitelist_modal` command in a designated channel.
3.  The bot either starts a DM conversation with the user or presents a modal with the application questions.
4.  The user answers all the questions.
5.  The bot sends the completed application to the staff review channel.
6.  A staff member reviews the application and clicks either "Aprovar" or "Reprovar".
7.  If rejected, the staff member provides a reason.
8.  The bot takes the appropriate actions (assigns/removes roles, sends notifications).
9.  The user is notified of the outcome.

## 5. Technical Requirements

*   **Platform**: Node.js
*   **Libraries**:
    *   `discord.js`: To interact with the Discord API.
    *   `dotenv`: To manage environment variables.
*   **Environment**: A server or hosting service capable of running a Node.js application 24/7.

## 6. Future Enhancements

*   **Web Dashboard**: A web-based dashboard for staff to view and manage applications, and for users to check their application status.
*   **Question Bank**: The ability to add, remove, and edit questions from a database or configuration file without needing to restart the bot.
*   **Localization**: Support for multiple languages.
*   **Analytics**: Track metrics such as the number of applications, approval/rejection rates, and average review time.
*   **Automated Checks**: Basic automated checks for things like account age or if the user is already in the server for a certain amount of time.
