Task List (P10 Pick App)
Epic: Core Gameplay — Make Picks

 Create Picks Submission UI (Frontend)

User Story: As a casual fan, I want to make three picks (P10 finisher, first retirement, fastest lap) so I can participate in each race easily.

Acceptance Criteria

Users can select all 3 predictions.

UI prevents duplicate or invalid picks.

Picks lock after race cutoff.

Submission stored to database.

 Create POST /picks and PUT /picks/:race_id API Endpoints

Acceptance Criteria

POST saves picks with user, race ID, timestamp.

PUT updates picks only before cutoff.

Returns 200 on success, 403 after cutoff.

 Implement Edit-Picks Before Cutoff (Frontend + API)

User Story: As a user, I want to edit my picks before the race cutoff so I can adjust to last-minute news.

Acceptance Criteria

UI shows countdown to lock.

API validates cutoff.

Updated picks displayed immediately.

Epic: Scoring Automation

 Automated Race Results Ingestion Service

User Story: As a league organizer, I want race results to auto-score so everyone's points update fairly and on time.

Acceptance Criteria

Pulls finishing order, fastest lap, first retirement, bonus data.

Computes scores for each user.

Writes scoring results to database.

 Create POST /scoring/apply Admin Endpoint

Acceptance Criteria

Accepts race ID.

Triggers scoring engine.

Returns scoring breakdown.

 Scoring Breakdown UI (Frontend)

User Story: As a user, I want to see a scoring breakdown so I understand how my points were earned.

Acceptance Criteria

Shows pick accuracy and bonus points.

Lists each category and points earned.

Available after every race.

Epic: Leagues & Social Play

 League Management UI (Frontend)

User Story: As a competitive player, I want to create a private league to track season standings with friends.

Acceptance Criteria

Create league with name and optional password.

Join via code or invite link.

Shows members and standings.

 Create League API Endpoints

Endpoints

POST /leagues

POST /leagues/join

GET /leagues/:id

Acceptance Criteria

Auth required.

Leagues linked to creator.

Join via slug-based invite link.

 Shareable Invite Link

User Story: As a league organizer, I want to invite friends with a shareable link.

Acceptance Criteria

One-tap share button.

Deep link opens league join flow.

Epic: Leaderboards & Performance

 Season Leaderboard Page (Frontend)

User Story: As a player, I want to view a leaderboard after each race.

Acceptance Criteria

Displays rank, username, points.

Updates after scoring.

Sortable by race or season totals.

 Create GET /leaderboard?league_id=X API

Acceptance Criteria

Returns standings in order.

Includes total points and race-by-race deltas.

 Historical Performance Page

User Story: As a user, I want to view past race results and my historical performance.

Acceptance Criteria

Shows user's points per race.

Displays archived race results.

Optional graph/timeline.

Epic: Race Info & Schedules

 Upcoming Race Schedule Page

User Story: As a fan, I want to view upcoming race schedules.

Acceptance Criteria

Shows race names, countries, times.

Highlights whether picks window is open.

Integrates with races table.

 Create GET /races/upcoming API

Acceptance Criteria

Returns list of next races.

Includes lock-time metadata.

Epic: Bonuses & Dynamic Gameplay

 Bonus Rules Engine

User Story: As a user, I want to receive small bonus points for categories like fastest pit stop or most overtakes.

Acceptance Criteria

Configurable bonus rules.

Automatically applied in scoring engine.

Shows in scoring breakdown.

Epic: Authentication & Accounts

 Email OTP Authentication (Frontend + Backend)

Acceptance Criteria

Sign-in via email one-time code.

JWT stored securely.

Required for picks, leagues, and scoring.

 Create Auth Endpoints

Endpoints

POST /auth/otp/start

POST /auth/otp/verify

Acceptance Criteria

start sends code.

verify returns session token.

Protect all write routes.

Epic: Data & History

 Race Results Database Schema

Acceptance Criteria

Stores finishing order, retirements, fastest lap.

Links to scoring system.

Supports historical views.

 Past Race Results Page

Acceptance Criteria

Shows official finishing order.

Includes times, retirements, and relevant stats.

Epic: Onboarding (Optional — Not MVP)

 Lightweight Onboarding Guide

User Story: As a new player, I want a short guide that explains how the game works.

Acceptance Criteria

Modal or short carousel.

Explains three-pick concept + bonuses.

Dismissible and optional.