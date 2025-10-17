# User Manual - AI Tools Hub

Welcome to the AI Tools Hub User Manual! This guide will help you understand and use all features of the application.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Role System and Permissions](#role-system-and-permissions)
4. [AI Tools Management](#ai-tools-management)
5. [AI Tool Types Management](#ai-tool-types-management)
6. [User Management](#user-management)
7. [Common Tasks](#common-tasks)
8. [Tips and Best Practices](#tips-and-best-practices)

---

## Getting Started

### Accessing the Application

1. Open your web browser
2. Navigate to `http://localhost:8200` (or your configured URL)
3. You'll see the AI Tools Hub homepage

### Logging In

1. Click the "Sign In" button or navigate to `/login`
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to your Dashboard

### Logging Out

1. Look for your name in the sidebar (bottom section)
2. Click the "Logout" button
3. You'll be redirected to the login page

### First-Time Login

Default accounts are available for testing:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | password | Owner |
| frontend@example.com | password | Frontend |
| backend@example.com | password | Backend |

**Important:** Change these passwords immediately after first login!

---

## Dashboard Overview

The Dashboard is your home base in AI Tools Hub.

### Dashboard Components

1. **Welcome Header**: Displays your name and welcome message
2. **Profile Card**: Shows your email and assigned roles
3. **Quick Actions**: Cards with shortcuts to main features
4. **Navigation Sidebar**: Access all features from the left sidebar

### Quick Actions (Role-Dependent)

**All Users See:**
- **AI Tools**: Browse and manage AI tools
- **AI Tool Types**: Manage tool categories

**Owner Role Also Sees:**
- **Users & Roles**: Manage users and permissions
- **Roles**: Configure role permissions

### Navigation Sidebar

The sidebar contains:
- **Dashboard**: Return to home
- **AI Tools**: Manage AI tools
- **AI Tool Types**: Manage tool types
- **Users & Roles**: (Owner only) User management
- **Roles**: (Owner only) Role management
- **Profile Section**: Shows your name, email, roles, and logout button

---

## Role System and Permissions

AI Tools Hub uses a role-based access control (RBAC) system to manage user permissions.

### Understanding Roles

Roles determine what features and AI tools each user can access.

#### Available Roles

**1. Owner Role**
- **Full Access**: Complete control over the application
- **User Management**: Create, edit, and manage all users
- **Role Management**: Create and configure roles
- **AI Tools**: Full CRUD (Create, Read, Update, Delete) access
- **AI Tool Types**: Full CRUD access
- **Sees**: All AI tools regardless of assigned roles

**2. Frontend Role**
- **AI Tools**: Read access to frontend-specific tools
- **Can**: View, filter, and search tools assigned to "Frontend" role
- **Cannot**: Create, edit, or delete tools
- **Cannot**: Access user or role management

**3. Backend Role**
- **AI Tools**: Create and edit backend-specific tools
- **Can**: View, create, and edit tools assigned to "Backend" role
- **Can**: Add new AI tools to the system
- **Cannot**: Delete tools
- **Cannot**: Access user or role management

### How Roles Work

#### Role Assignment
- Users can have **multiple roles** simultaneously
- Example: A user can be both "Frontend" and "Backend"
- Multiple roles grant access to tools from all assigned roles

#### AI Tool Access
- Each AI tool is assigned to one or more roles
- Users only see tools assigned to their roles
- Owner sees all tools regardless of assignment

**Example Scenario:**

```
Tool: "GitHub Copilot"
Assigned to: Frontend, Backend

User A (Frontend role):     ✓ Can see and use
User B (Backend role):      ✓ Can see and use
User C (Marketing role):    ✗ Cannot see
Owner:                      ✓ Can see and use
```

### Managing Roles (Owner Only)

#### View All Roles

1. Navigate to **Roles** from the sidebar
2. You'll see a list of all roles with:
   - Role name
   - Description
   - Creation date

#### Create a New Role

Currently, roles are predefined. To add new roles:
1. Access the backend database
2. Use Laravel seeders or manual SQL inserts
3. Restart the application

**Future Enhancement:** A UI for creating custom roles will be added.

### Managing User Roles (Owner Only)

#### Assign Roles to a User

1. Navigate to **Users & Roles** from the sidebar
2. Find the user you want to edit
3. Click the **Edit** button
4. In the "Assign Roles" section:
   - Check the boxes for roles you want to assign
   - Uncheck roles you want to remove
5. Click **Update User**

#### View User Roles

In the Users list, each user card shows:
- Name and email
- Status badge (Active/Inactive)
- Assigned roles as colored tags

### Best Practices for Roles

1. **Principle of Least Privilege**: Only assign roles users actually need
2. **Regular Reviews**: Periodically review user role assignments
3. **Owner Role**: Limit owner access to trusted administrators only
4. **Multiple Roles**: Assign multiple roles when users need cross-functional access
5. **Documentation**: Keep a record of why specific roles were assigned

---

## AI Tools Management

AI Tools is the core feature of the application, allowing you to manage a comprehensive library of AI tools.

### Viewing AI Tools

#### Access the AI Tools Page

1. Click **AI Tools** from the sidebar or dashboard
2. You'll see a list of all AI tools you have access to

#### Understanding the AI Tools List

Each tool card displays:
- **Tool Name**: The name of the AI tool
- **ID Badge**: Unique identifier number
- **Types**: Category tags (e.g., "Code Generation", "Design")
- **Links**:
  - "Visit Website" - Link to the tool's website
  - "Documentation" - Link to the tool's docs (if available)
- **Description**: What the tool does
- **Usage**: How to use the tool
- **Accessible by Roles**: Which roles can access this tool
- **Added Date**: When the tool was added to the system
- **Action Buttons**: Edit and Delete (if permitted)

### Filtering and Searching AI Tools

#### Search by Name

1. Use the **Search by Name** input at the top
2. Type any part of the tool name or description
3. Results update automatically as you type

#### Filter by Role

1. Use the **Filter by Role** dropdown
2. Select a role to see only tools assigned to that role
3. Select "All Roles" to see all tools you have access to

#### Filter by Type

1. Use the **Filter by Type** dropdown
2. Select a type to see only tools in that category
3. Select "All Types" to see all tools

#### Combine Filters

You can use multiple filters simultaneously:
- Search + Role filter
- Search + Type filter
- Role filter + Type filter
- All three together

#### Reset Filters

Click the **Reset Filters** button to clear all active filters.

#### Active Filters Display

Below the filter controls, you'll see badges showing active filters:
- Blue badge: Name search
- Purple badge: Role filter
- Green badge: Type filter

Click the **X** on any badge to remove that specific filter.

### Creating a New AI Tool (Owner/Backend Roles)

#### Step 1: Navigate to Add Tool Page

1. From the AI Tools page, click the **Add New AI Tool** button (green button)
2. Or navigate to `/ai-tools/add`

#### Step 2: Fill in Tool Information

**Required Fields:**

1. **Tool Name**
   - Enter the official name of the AI tool
   - Example: "ChatGPT", "GitHub Copilot", "Midjourney"

2. **Tool URL**
   - Enter the main website URL
   - Must be a valid URL format (https://...)
   - Example: "https://chat.openai.com"

3. **Description**
   - Provide a clear, concise description
   - Explain what the tool does and its main features
   - Example: "ChatGPT is an AI language model that can answer questions, write content, and assist with various tasks."

4. **Usage Instructions**
   - Explain how to use the tool
   - Include tips, best practices, or key features
   - Example: "Visit the website, create an account, and start chatting. Use specific prompts for better results."

5. **AI Tool Types** (Select at least one)
   - Check one or more categories that apply
   - Available types: Code Generation, Design, Content Writing, etc.
   - Multiple types can be selected

6. **Assign to Roles** (Select at least one)
   - Check which roles should have access to this tool
   - At least one role must be selected
   - Consider which teams would benefit from this tool

**Optional Field:**

7. **Documentation URL**
   - Link to the tool's documentation or help pages
   - Leave blank if not available

#### Step 3: Submit

1. Review all information for accuracy
2. Click **Create AI Tool** button
3. You'll be redirected to the AI Tools list
4. Your new tool will appear in the list

#### Common Errors When Creating Tools

- **"The name field is required"**: Enter a tool name
- **"The link field is required"**: Provide the tool's URL
- **"The link must be a valid URL"**: Check URL format (include https://)
- **"The ai_tools_type_ids field is required"**: Select at least one type
- **"The role_ids field is required"**: Select at least one role

### Editing an AI Tool (Owner/Backend Roles)

#### Step 1: Access Edit Page

1. From the AI Tools list, find the tool you want to edit
2. Click the **Edit** button (blue button with pencil icon)
3. You'll be taken to the edit page with current information pre-filled

#### Step 2: Modify Information

1. Update any fields you want to change
2. All fields can be edited following the same rules as creation
3. You must keep at least one type and one role assigned

#### Step 3: Save Changes

1. Click **Update AI Tool** button
2. You'll be redirected back to the AI Tools list
3. Changes are immediately visible

### Deleting an AI Tool (Owner Only)

**Warning:** Deleting a tool is permanent and cannot be undone!

#### Step 1: Locate the Tool

From the AI Tools list, find the tool you want to delete.

#### Step 2: Delete

1. Click the **Delete** button (red button with trash icon)
2. A confirmation dialog will appear: "Are you sure you want to delete [Tool Name]? This action cannot be undone."
3. Click **OK** to confirm deletion
4. Click **Cancel** to abort

#### Step 3: Verify Deletion

The tool is immediately removed from the list and database.

### AI Tools Best Practices

1. **Complete Information**: Always fill in all available fields
2. **Accurate URLs**: Verify links work before submitting
3. **Clear Descriptions**: Write descriptions that help users understand the tool's value
4. **Proper Categorization**: Assign appropriate types for easy discovery
5. **Role Assignment**: Carefully consider which roles need access
6. **Regular Updates**: Keep tool information current
7. **Remove Obsolete Tools**: Delete or update tools that are no longer available

---

## AI Tool Types Management

AI Tool Types are categories that help organize AI tools by their primary function or use case.

### Viewing AI Tool Types

#### Access the AI Tool Types Page

1. Click **AI Tool Types** from the sidebar or dashboard
2. You'll see a list of all available types

#### Understanding the Type Cards

Each type card shows:
- **Type Name**: Category name (e.g., "Code Generation")
- **Description**: What this category includes
- **Tool Count**: Number of AI tools in this category
- **Added Date**: When the type was created

### Creating a New AI Tool Type (Owner Only)

#### Step 1: Navigate to Add Type Modal

1. From the AI Tool Types page
2. Click the **Add New Type** button (green button at top)
3. A modal dialog will appear

#### Step 2: Fill in Type Information

**Required Fields:**

1. **Type Name**
   - Enter a clear, descriptive name
   - Examples: "Code Generation", "Image Creation", "Data Analysis"
   - Use title case
   - Keep it concise (2-4 words ideal)

2. **Description**
   - Explain what types of tools belong in this category
   - Be specific about the category's scope
   - Example: "Tools that help generate, analyze, or debug source code"

#### Step 3: Submit

1. Review the information
2. Click **Create** button in the modal
3. The modal closes and the new type appears in the list
4. Click **Cancel** to abort without saving

### Use Cases for AI Tool Types

**Common Categories:**

1. **Code Generation**
   - Tools that write or complete code
   - Examples: GitHub Copilot, TabNine, Codeium

2. **Content Writing**
   - Tools for creating written content
   - Examples: ChatGPT, Jasper, Copy.ai

3. **Image Generation**
   - Tools for creating or editing images
   - Examples: Midjourney, DALL-E, Stable Diffusion

4. **Data Analysis**
   - Tools for analyzing and visualizing data
   - Examples: Julius AI, Akkio

5. **Design**
   - Tools for UI/UX and graphic design
   - Examples: Uizard, Figma AI, Canva AI

6. **Testing**
   - Tools for automated testing
   - Examples: Testim, Mabl

7. **Documentation**
   - Tools for generating or managing docs
   - Examples: Mintlify, Scribe

### Managing Types Best Practices

1. **Consistent Naming**: Use similar patterns for type names
2. **Clear Boundaries**: Ensure categories don't overlap too much
3. **Not Too Many**: Keep the number of types manageable (10-15 ideal)
4. **Not Too Few**: Provide enough granularity for useful filtering
5. **Review Usage**: Check which types are most used
6. **Add When Needed**: Create new types only when there's a clear need

### Future Type Features

**Coming Soon:**
- Edit existing types
- Delete unused types
- Reorder types
- Assign colors or icons to types

---

## User Management

User Management is available only to users with the **Owner** role.

### Viewing All Users

#### Access Users & Roles Page

1. Click **Users & Roles** from the sidebar
2. You'll see a list of all users in the system

#### Understanding the User Cards

Each user card displays:
- **Name**: Full name of the user
- **Email**: Login email address
- **Status Badge**:
  - Green "Active" badge - User can log in
  - Red "Inactive" badge - User cannot log in
- **Roles**: Colored tags showing assigned roles
- **Actions**: Edit and Toggle Active/Inactive buttons

### Creating a New User

#### Step 1: Navigate to Add User Page

1. From the Users & Roles page
2. Click the **Add New User** button (green button at top)
3. You'll be taken to the create user form

#### Step 2: Fill in User Information

**Required Fields:**

1. **Full Name**
   - Enter the user's full name
   - Example: "John Smith"

2. **Email Address**
   - Must be a valid email format
   - Will be used for login
   - Must be unique (not already in use)
   - Example: "john.smith@company.com"

3. **Password**
   - Choose a strong password
   - Minimum length requirements apply
   - The user can change this after first login

4. **Assign Roles** (Select at least one)
   - Check one or more roles to assign
   - At least one role must be selected
   - Consider the user's job function when assigning roles

**Optional Field:**

5. **Active Status**
   - Checked (default): User can log in immediately
   - Unchecked: User account exists but cannot log in

#### Step 3: Submit

1. Review all information
2. Click **Create User** button
3. You'll be redirected to the Users & Roles list
4. The new user can now log in with their email and password

### Editing a User

#### Step 1: Access Edit Page

1. From the Users & Roles list
2. Find the user you want to edit
3. Click the **Edit** button (blue button)
4. You'll be taken to the edit form with current info pre-filled

#### Step 2: Modify Information

You can update:
- Name
- Email (must remain unique)
- Password (optional - leave blank to keep current password)
- Assigned roles
- Active status

#### Step 3: Save Changes

1. Click **Update User** button
2. You'll be redirected back to the Users & Roles list
3. Changes take effect immediately

**Note:** If you deactivate a user who is currently logged in, they will be logged out on their next action.

### Activating/Deactivating Users

#### Quick Toggle

1. From the Users & Roles list
2. Find the user
3. Click the **Activate** or **Deactivate** button (orange button)
4. Status updates immediately
5. Status badge changes color

#### When to Deactivate

- Employee leaves the company
- User account is compromised
- Temporary suspension needed
- User no longer needs access

#### When to Activate

- New user account created
- Previously deactivated user returns
- Access should be restored

**Important:** Deactivated users:
- Cannot log in
- Retain all their data
- Can be reactivated at any time
- Are not deleted from the system

### User Management Best Practices

1. **Unique Emails**: Each user must have a unique email
2. **Strong Passwords**: Enforce strong password policies
3. **Role Review**: Regularly review user role assignments
4. **Deactivate, Don't Delete**: Deactivate users instead of deleting
5. **Onboarding**: Create accounts in advance for new team members
6. **Offboarding**: Immediately deactivate accounts when users leave
7. **Owner Role**: Limit owner access to 2-3 trusted administrators

---

## Common Tasks

### Task: Adding Your First AI Tool

**Scenario:** You want to add ChatGPT to the system.

1. Log in as a user with Owner or Backend role
2. Navigate to **AI Tools**
3. Click **Add New AI Tool**
4. Fill in:
   - Name: "ChatGPT"
   - URL: "https://chat.openai.com"
   - Documentation: "https://platform.openai.com/docs"
   - Description: "ChatGPT is an AI language model that can answer questions, write content, code, and assist with various tasks."
   - Usage: "Visit the website, sign up for an account, and start chatting. Use clear, specific prompts for best results."
   - Types: Check "Content Writing" and "Code Generation"
   - Roles: Check "Frontend" and "Backend"
5. Click **Create AI Tool**
6. Verify the tool appears in the list

### Task: Finding Tools for Your Role

**Scenario:** You're a Frontend developer looking for relevant tools.

1. Log in with your Frontend role account
2. Navigate to **AI Tools**
3. Use the **Filter by Role** dropdown
4. Select "Frontend"
5. Browse the filtered results
6. Click "Visit Website" links to explore tools
7. Click "Documentation" links to learn more

### Task: Organizing Tools by Category

**Scenario:** You want to separate design tools from code tools.

1. Log in as Owner
2. Navigate to **AI Tool Types**
3. Create types if they don't exist:
   - Click **Add New Type**
   - Name: "Design Tools", Description: "AI tools for UI/UX design and graphics"
   - Click **Create**
   - Repeat for "Code Generation"
4. Navigate to **AI Tools**
5. Edit each tool:
   - Click **Edit**
   - Assign appropriate type(s)
   - Click **Update AI Tool**

### Task: Onboarding a New Team Member

**Scenario:** A new frontend developer joins your team.

1. Log in as Owner
2. Navigate to **Users & Roles**
3. Click **Add New User**
4. Fill in:
   - Name: "Jane Doe"
   - Email: "jane.doe@company.com"
   - Password: (Generate a temporary password)
   - Roles: Check "Frontend"
   - Active: Checked
5. Click **Create User**
6. Share credentials with Jane (ask her to change password on first login)
7. Jane can now log in and see all Frontend tools

### Task: Restricting Access to Sensitive Tools

**Scenario:** Some AI tools should only be accessible to Backend team.

1. Log in as Owner
2. Navigate to **AI Tools**
3. Find the tool you want to restrict
4. Click **Edit**
5. In "Assign to Roles":
   - Uncheck all roles except "Backend" and "Owner"
6. Click **Update AI Tool**
7. Verify: Log in as Frontend user - tool should not be visible
8. Verify: Log in as Backend user - tool should be visible

---

## Tips and Best Practices

### For Owners (Administrators)

1. **Regular Audits**
   - Review user access monthly
   - Remove inactive users
   - Update role assignments as teams change

2. **Tool Organization**
   - Keep tool types logical and distinct
   - Update tool information as tools evolve
   - Remove deprecated or discontinued tools

3. **Security**
   - Enforce strong password policies
   - Limit Owner role to trusted administrators
   - Monitor user activity logs (if available)
   - Immediately deactivate accounts when users leave

4. **Communication**
   - Notify teams when new tools are added
   - Provide training on new tool categories
   - Document your organization's role structure

### For All Users

1. **Search Effectively**
   - Use specific keywords in search
   - Combine multiple filters for precision
   - Explore different tool types to discover new tools

2. **Keep Learning**
   - Visit tool documentation links
   - Try new tools regularly
   - Share useful tools with your team

3. **Provide Feedback**
   - Report broken links to administrators
   - Suggest new tools to add
   - Request access to tools you need

4. **Security**
   - Use a strong, unique password
   - Don't share your account credentials
   - Log out when done, especially on shared computers

### For Frontend/Backend Roles

1. **Tool Discovery**
   - Regularly check for new tools in your category
   - Use filters to find specific types of tools
   - Bookmark frequently used tools

2. **Contributing** (if Backend role)
   - Add new tools you discover
   - Provide detailed descriptions and usage tips
   - Categorize tools accurately

3. **Collaboration**
   - Share your favorite tools with team members
   - Provide feedback on tool descriptions
   - Suggest improvements to administrators

---

## Keyboard Shortcuts

Currently, the application uses standard browser shortcuts. Future versions may include custom keyboard shortcuts for common actions.

---

## Accessibility

AI Tools Hub is designed with accessibility in mind:

- Semantic HTML structure
- Keyboard navigation support
- Clear focus indicators
- Sufficient color contrast
- Responsive design for various screen sizes
- Screen reader friendly

If you encounter accessibility issues, please report them to the administrator.

---

## Getting Help

### Within the Application

- Check this User Manual for guidance
- Review the [Installation Guide](INSTALLATION.md) for setup issues
- Check the main [README](../README.md) for project overview

### Reporting Issues

When reporting issues, include:
- Your role (Owner, Frontend, Backend)
- What you were trying to do
- What happened vs. what you expected
- Any error messages
- Screenshots if applicable

### Feature Requests

To request new features:
1. Check if the feature already exists
2. Describe the feature and its benefits
3. Explain your use case
4. Submit through the appropriate channel

---

## Appendix: Glossary

**AI Tool**: A software application that uses artificial intelligence to perform tasks or assist users.

**Role**: A set of permissions that determines what features and AI tools a user can access.

**Owner**: The highest permission role with full access to all features.

**Frontend/Backend**: Development-focused roles with access to relevant tools.

**AI Tool Type**: A category or classification for organizing AI tools (e.g., "Code Generation", "Design").

**Active User**: A user account that can log in and access the system.

**Inactive User**: A user account that exists but cannot log in.

**CRUD**: Create, Read, Update, Delete - the four basic operations for managing data.

**RBAC**: Role-Based Access Control - a method of restricting system access based on user roles.

**Seeder**: A database script that populates initial data (like default users and roles).

---

**Need more help?** Contact your system administrator or check the project repository for updates and support resources.
