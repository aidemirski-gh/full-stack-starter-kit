# Database Seeders

This directory contains all database seeders for the AI Tools Hub application. The seeders automatically populate the database with initial data on first run.

## Overview

The application uses a comprehensive seeding system that populates:
- **Roles**: owner, frontend, backend
- **Users**: 15 users with various role assignments
- **AI Tools**: 5 popular AI tools with detailed information
- **AI Tool Types**: 5 categories for organizing tools
- **Relationships**: All necessary many-to-many relationships

## Automatic Seeding

### On First Run

When you run `./start.sh` followed by `./laravel-setup.sh`, the database will be **automatically seeded** if it's empty. No manual intervention required!

The seeding happens in this order:
1. **Roles** → Required for users
2. **Users** → 15 test users with default credentials
3. **User-Role relationships** → Many-to-many pivot table
4. **AI Tool Types** → Categories for organizing tools
5. **AI Tools** → Actual tools with descriptions and links
6. **AI Tool-Role relationships** → Which roles can access which tools
7. **AI Tool-Type relationships** → Which tools belong to which categories

## Seeder Files

### Core Seeders

| Seeder | Purpose | Run Order |
|--------|---------|-----------|
| `DatabaseSeeder.php` | **Main orchestrator** - Calls all other seeders | 1 |
| `RoleSeeder.php` | Seeds 3 roles (owner, frontend, backend) | 2 |
| `AiToolsTypeSeeder.php` | Seeds 5 AI tool categories | 3 |
| `AiToolSeeder.php` | Seeds 5 popular AI tools | 4 |
| `RoleUserSeeder.php` | Links users to roles (many-to-many) | 5 |
| `AiToolRoleSeeder.php` | Links AI tools to roles | 6 |
| `AiToolAiToolsTypeSeeder.php` | Links AI tools to types | 7 |

### Migration Seeders (Legacy)

These are kept for backward compatibility:
- `MigrateAiToolTypesToPivotSeeder.php`
- `UpdateAiToolsWithTypeSeeder.php`

## Default Seeded Data

### Roles (3)
1. **owner** - Full system access
2. **frontend** - Frontend development tools
3. **backend** - Backend development tools

### Users (15)
| Email | Password | Role | Notes |
|-------|----------|------|-------|
| test@example.com | password | owner | Main test account |
| admin@example.com | password | owner | Admin account |
| john.doe@example.com | password | frontend | Frontend developer |
| jane.smith@example.com | password | backend | Backend developer |
| demo@example.com | password | frontend | Demo account |
| *(10 more users)* | password | *various* | Generated with Faker |

### AI Tools (5)
1. **ChatGPT** - AI conversational assistant (Text Generation, Code Assistant)
2. **Claude** - AI assistant by Anthropic (Text Generation, Code Assistant)
3. **Midjourney** - AI image generation (Image Generation)
4. **GitHub Copilot** - AI pair programmer (Code Assistant, Text Generation)
5. **Perplexity AI** - AI search engine (Text Generation)

### AI Tool Types (5)
1. **Text Generation** - Content and text creation tools
2. **Image Generation** - Visual content creation
3. **Code Assistant** - Developer tools
4. **Voice & Audio** - Speech and audio tools
5. **Video Creation** - Video generation and editing

## Manual Seeding

### Seed Everything
```bash
docker compose exec php_fpm php artisan db:seed --force
```

### Seed Specific Seeder
```bash
# Seed only AI tools
docker compose exec php_fpm php artisan db:seed --class=AiToolSeeder --force

# Seed only roles
docker compose exec php_fpm php artisan db:seed --class=RoleSeeder --force

# Seed only users
docker compose exec php_fpm php artisan db:seed --class=RoleUserSeeder --force
```

### Fresh Migration + Seed
```bash
# ⚠️ WARNING: This will drop all tables and data!
docker compose exec php_fpm php artisan migrate:fresh --seed --force
```

## Checking Seeded Data

### Via Tinker
```bash
docker compose exec php_fpm php artisan tinker --execute="
echo 'Roles: ' . \App\Models\Role::count() . PHP_EOL;
echo 'Users: ' . \App\Models\User::count() . PHP_EOL;
echo 'AI Tools: ' . \App\Models\AiTool::count() . PHP_EOL;
echo 'AI Tool Types: ' . \App\Models\AiToolsType::count() . PHP_EOL;
"
```

### Via Database
```bash
# Connect to MySQL
./db-manage.sh connect

# Then run queries
SELECT COUNT(*) FROM roles;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM ai_tools;
SELECT COUNT(*) FROM ai_tools_types;
```

## Customizing Seeded Data

### Adding More Users

Edit `DatabaseSeeder.php`:
```php
// Change the number from 15 to your desired count
if ($currentCount < 20) {  // Changed from 15 to 20
    User::factory(20 - $currentCount)->create()->each(function ($user) use ($roles) {
        $user->role_id = $roles[array_rand($roles)];
        $user->save();
    });
}
```

### Adding More AI Tools

Edit `AiToolSeeder.php` and add new tools:
```php
AiTool::create([
    'name' => 'New AI Tool',
    'link' => 'https://example.com',
    'documentation' => 'https://docs.example.com',
    'description' => 'Description here',
    'usage' => 'Usage instructions here',
]);
```

### Adding More AI Tool Types

Edit `AiToolsTypeSeeder.php`:
```php
AiToolsType::create([
    'name' => 'New Category',
    'description' => 'Category description',
]);
```

## Idempotent Seeding

All seeders use `firstOrCreate()` or check for existing data, making them **idempotent**. This means:
- ✅ Safe to run multiple times
- ✅ Won't create duplicates
- ✅ Only adds missing data

Example from `DatabaseSeeder.php`:
```php
User::firstOrCreate(
    ['email' => 'test@example.com'],  // Search by email
    [
        'name' => 'Test User',         // Only create if not found
        'password' => $defaultPassword,
        'role_id' => $ownerRole->id,
    ]
);
```

## Troubleshooting

### Seeders Not Running
```bash
# Clear cache and re-run
docker compose exec php_fpm php artisan config:clear
docker compose exec php_fpm php artisan cache:clear
docker compose exec php_fpm php artisan db:seed --force
```

### Permission Errors
```bash
# Fix storage permissions
docker compose exec -u root php_fpm chmod -R 777 storage bootstrap/cache
```

### Duplicate Entry Errors
```bash
# Fresh start (⚠️ destroys all data)
docker compose exec php_fpm php artisan migrate:fresh --seed --force
```

### Missing Relationships
```bash
# Re-run relationship seeders
docker compose exec php_fpm php artisan db:seed --class=RoleUserSeeder --force
docker compose exec php_fpm php artisan db:seed --class=AiToolRoleSeeder --force
docker compose exec php_fpm php artisan db:seed --class=AiToolAiToolsTypeSeeder --force
```

## Testing Seeded Data

After seeding, verify the data works:

1. **Login Test**:
   - Go to http://localhost:8200/login
   - Use: test@example.com / password
   - Check if 2FA code is generated

2. **API Test**:
   ```bash
   # Get AI tools (requires auth token)
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8201/api/ai-tools

   # Get AI tool types (public)
   curl http://localhost:8201/api/ai-tools-types
   ```

3. **Database Test**:
   ```bash
   ./db-manage.sh connect
   # Check tables
   SHOW TABLES;
   SELECT * FROM roles;
   SELECT * FROM users LIMIT 5;
   SELECT * FROM ai_tools;
   ```

## Backup Seeded Data

To backup your seeded data:
```bash
# Create backup
./db-manage.sh backup

# Backup file will be in: backups/backup_YYYY-MM-DD_HH-MM-SS.sql
```

## Production Considerations

For production deployments:

1. **Change Default Passwords**: Never use 'password' in production!
2. **Remove Test Users**: Delete or deactivate test accounts
3. **Customize AI Tools**: Add only relevant tools for your use case
4. **Limit Seeding**: Consider seeding only roles and minimal data
5. **Use Environment Variables**: Store sensitive data in `.env`

## Related Documentation

- [Installation Guide](../../../docs/INSTALLATION.md)
- [User Manual](../../../docs/USER_MANUAL.md)
- [API Documentation](../../../docs/API.md)

## Support

If you encounter issues with seeding:
1. Check logs: `docker compose logs php_fpm`
2. Review migrations: `docker compose exec php_fpm php artisan migrate:status`
3. Check database connection: `./db-manage.sh connect`
4. Create an issue in the repository

---

**Last Updated**: 2025-10-27
