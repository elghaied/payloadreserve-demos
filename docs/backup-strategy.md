# Backup & Disaster Recovery Strategy

## MongoDB Backups

### Daily Backups
Set up a cron job on the Hetzner VPS (or via Coolify scheduled task):

```bash
# Run daily at 2 AM UTC
0 2 * * * mongodump --uri="mongodb://user:pass@host:27017" --out=/backups/mongo/$(date +\%Y-\%m-\%d)
```

### Retention
- Keep 7 daily backups
- Keep 4 weekly backups (Sunday)
- Delete older backups automatically:

```bash
# Cleanup script (run daily after backup)
find /backups/mongo -maxdepth 1 -mtime +7 -type d -exec rm -rf {} \;
```

### Restore Procedure

```bash
mongorestore --uri="mongodb://user:pass@host:27017" --drop /backups/mongo/YYYY-MM-DD/
```

## S3/MinIO

### Enable Versioning
In MinIO console or via mc:
```bash
mc version enable myminio/bucket-name
```

### Recover Deleted Objects
```bash
mc ls --versions myminio/bucket-name/prefix/
mc cp --version-id=<id> myminio/bucket-name/file.jpg /tmp/recovered.jpg
```

## Application Rollback

### Via Coolify
1. Go to the app service in Coolify
2. Click "Deployments"
3. Select a previous deployment
4. Click "Redeploy"

### Via Docker Image Tags
Each git tag creates a versioned image. To rollback:
1. In Coolify, change the image tag to the previous version
2. Redeploy the service
