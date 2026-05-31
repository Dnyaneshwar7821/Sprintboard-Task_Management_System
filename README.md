# SprintBoard - Task & Team Management Dashboard

SprintBoard is a responsive Task and Team Management Dashboard built using Next.js, TypeScript, Tailwind CSS, and Context API.

This project was created for a Frontend Developer Internship Assignment. It includes authentication UI, role-based access, task management, team member management, pagination, dark mode, responsive layout, and localStorage persistence.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Context API
- React Hooks
- localStorage for mock persistence

## Features

### Authentication

- Login page
- Register page
- Forgot password page
- Form validation
- Strong password rules
- Passwords stored as hashes in localStorage for registered users
- Registered users are redirected to login after registration

### Password Requirements

Password must include:

- At least 10 characters
- One uppercase letter
- One lowercase letter
- One number
- One special character

### Role-Based Access

#### Admin

Admin can:

- View dashboard statistics
- View all tasks
- Create tasks
- Edit tasks
- Delete tasks
- View team members
- Add team members
- Edit team members
- Delete team members

#### User / Team Member

User can:

- View dashboard
- View only assigned tasks
- Update assigned task status
- View team members
- Add team members
- View member role and email
- View profile
- Delete own registered account

Demo accounts cannot be deleted.

## Test Accounts

### Admin Account

Email:

```txt
admin@sprintboard.com
```

Password:

```txt
Admin@12345
```

### User Account

Email:

```txt
user@sprintboard.com
```

Password:

```txt
User@12345
```

## Main Pages

- `/login` - Login page
- `/register` - Register page
- `/forgot-password` - Forgot password page
- `/dashboard` - Dashboard statistics and charts
- `/tasks` - Task management
- `/members` - Team member management
- `/profile` - User profile and account actions

## Task Management

Admin can:

- Add new task
- Edit existing task
- Delete task
- Assign task to team member
- Search tasks
- Filter by status
- Filter by priority
- Use pagination

User can:

- View assigned tasks
- Update task status

## Team Member Management

All users can:

- View team members
- Add new members
- See member email and role

Only admin can:

- Edit members
- Delete members

## Dashboard

Dashboard includes:

- Total tasks / My tasks
- Completed tasks
- Pending tasks
- Team size
- Task progress chart
- Priority split chart
- Recent work section

Dashboard cards are clickable:

- Tasks card opens `/tasks`
- Team size card opens `/members`

## Important Flow

Example role-based flow:

1. Login as admin.
2. Add a new team member.
3. Create a task and assign it to that member.
4. Logout.
5. Register using the same full name as the member.
6. Login with the registered user account.
7. The assigned task appears on the user's dashboard and tasks page.

## Installation

Clone the repository:

```bash
git clone <your-repository-link>
```

Go to the project folder:

```bash
cd sprintboard
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open in browser:

```txt
http://localhost:3000
```

## Build

Create a production build:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

## Project Structure

```txt
src/
  app/
    dashboard/
    forgot-password/
    login/
    members/
    profile/
    register/
    tasks/
  components/
    dashboard/
    layout/
    members/
    tasks/
    ui/
  context/
  data/
  hooks/
  providers/
  services/
  types/
  utils/
```

## Notes

This is a frontend assignment project, so authentication and data persistence are handled using mock data and localStorage.

In a real production application, authentication should be handled using a backend, secure password hashing with salt, database storage, protected APIs, sessions or JWT, and secure cookies.
