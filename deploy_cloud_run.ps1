$ErrorActionPreference = "Stop"

Write-Host "================================================="
Write-Host "🚀 Deploying KievBriket API to Google Cloud Run 🚀"
Write-Host "================================================="

# 1. Get current project
$PROJECT_ID = gcloud config get-value project
if (-not $PROJECT_ID) {
    Write-Host "❌ Помилка: Не знайдено активного проекту." -ForegroundColor Red
    Write-Host "Спочатку виконайте: gcloud auth login та gcloud config set project [ВАШ_ПРОЕКТ]" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Використовується проект: $PROJECT_ID" -ForegroundColor Green

# 2. Extract ZIP to a temporary directory for Cloud Build
$ZIP_PATH = "c:\Users\Виктор\Desktop\firewood_backend\deploy_cloud_run.zip"
$TEMP_DIR = "c:\Users\Виктор\Desktop\firewood_backend\deploy_temp"

if (Test-Path $TEMP_DIR) {
    Remove-Item -Recurse -Force $TEMP_DIR
}
New-Item -ItemType Directory -Force -Path $TEMP_DIR | Out-Null

Write-Host "📦 Розпакування архуіву для деплою..." -ForegroundColor Cyan
Expand-Archive -Path $ZIP_PATH -DestinationPath $TEMP_DIR -Force

# 3. Deploy to Cloud Run from Source
Write-Host "⏳ Завантаження та розгортання в Google Cloud Run (це може зайняти 3-5 хвилин)..." -ForegroundColor Cyan
Set-Location $TEMP_DIR

gcloud run deploy kievbriket-api `
    --source . `
    --region europe-west4 `
    --allow-unauthenticated `
    --port 8080 `
    --min-instances 0 `
    --max-instances 1 `
    --memory 512Mi

# 4. Cleanup
Set-Location c:\Users\Виктор\Desktop\firewood_backend
Remove-Item -Recurse -Force $TEMP_DIR
Write-Host "✅ Деплой успішно завершено!" -ForegroundColor Green
Write-Host "Google Cloud Run автоматично надасть вам нове URL-посилання в консолі вище ⬆️" -ForegroundColor Yellow
