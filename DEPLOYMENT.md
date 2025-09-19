# GitHub Pages Deployment Setup

Этот репозиторий настроен для автоматического деплоя в GitHub Pages.

## Настройка репозитория

### 1. Включение GitHub Pages
1. Перейдите в Settings → Pages вашего репозитория
2. В разделе "Source" выберите "GitHub Actions"
3. Сохраните настройки

### 2. Обновление базового пути (если нужно)
Если имя вашего репозитория отличается от `kb.ts`, обновите:

**В файле `vite.config.ts`:**
```typescript
base: process.env.NODE_ENV === 'production'
  ? '/ВАШ_РЕПОЗИТОРИЙ/' // Замените на имя вашего репозитория
  : '/',
```

**В файле `.github/workflows/deploy-pages.yml`:**
```yaml
env:
  PUBLIC_URL: /ВАШ_РЕПОЗИТОРИЙ
```

## Использование

### Автоматический деплой
- Каждый push в ветку `master` автоматически запускает сборку и деплой

### Ручной деплой
1. Перейдите в Actions → "Deploy to GitHub Pages"
2. Нажмите "Run workflow"
3. Выберите ветку для деплоя
4. Нажмите "Run workflow"

### URL приложения
После успешного деплоя приложение будет доступно по адресу:
`https://ВЛАДЕЛЕЦ.github.io/РЕПОЗИТОРИЙ/`

Например: `https://plugfox.github.io/kb.ts/`

## Структура workflow

Workflow состоит из двух job'ов:
1. **Build** - сборка приложения с помощью Vite
2. **Deploy** - загрузка в GitHub Pages

## Требования
- Node.js 20+
- npm
- Настроенные права доступа для GitHub Actions