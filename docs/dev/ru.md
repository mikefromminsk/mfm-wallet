# codestyle

Пиши чётко и конкретно, без двусмысленностей.
ВСЕГДА возвращай полный исходный код изменённых файлов (сохраняй структуру).
Сохраняй единый стиль кодирования по всему проекту (отступы, кавычки, форматирование).
Имена переменных и функций — короткие и информативные (например: userList, configPath, errorMsg).
Не удаляй и не изменяй код без явного указания.
ВСЕГДА удаляй символы точка с запятой в js файлах.
НИКОГДА не добавляй новых комментариев, но не удаляй уже существующие комментарии.
Группируй код для удобства чтения:
    - CSS — по блокам классов.
    - JS — функции сверху, выполнение кода снизу.
Не придумывай и не описывай того, чего нет в проекте, если это не указано в запросе.
ВСЕГДА используй только двойные кавычки для строк в js файлах.
В js объектах которые пишутся в несколько строчек там обязательно должна быть в конце запятая.

# Навигация и структура

Для одного окна всегда создавай один controller.js и index.html
В файле navigation.js указывай упрощенный доступ к открытию окон
Встраивай внутри окон инструкции к использованию в папке окна новую папку faq с названиями языков en.html и ru.html и тд. текст только с тегами <p>
Под окна с всеми действиями этого окна должны находиться внутри папки окна из которого оно открывается
Переводы должны находиться в папке strings внутри папки окна

**Подключи контроллер в главный index.html**
```html
<script async onload="loaded()" src="/mfm-wallet/withdrawal/controller.js?v=15"></script>
```

**Добавь в navigator.js отрытие окна**
```javascript
function addNavigator($scope) {
	// все открытия которые уже существуют

	$scope.openNewWindow = function (success) {
		openNewWindow(success)
	}
}
```

# Создание и изменение окон

Для верстки используй только mfm-shorts.

## 3. Выбор типа окна

Есть два варианта реализации:

### **A. Стандартный диалог (`md-dialog`)**

Используется для автономных окон.
**Контроллер:**

```javascript
function openNewWindow(success) {
   showDialog("wallet/window_name", success, function ($scope) {
       $scope.inputValue = ''

       $scope.submit = function () {
           success($scope.inputValue)
           $scope.close()
       }

       function loadInfo() {
           postContract("mfm-token", "accounts", function (response) {
               $scope.accounts = response.accounts
               $scope.$apply()
           })
       }

       $scope.refresh = function () {
           loadInfo()
       }

       $scope.refresh()
   })
}
```

**Вёрстка:**

```html
<md-dialog class="fill col">
   <div class="row header align-start-center">
       <div class="flex row align-center">{{str.window_name}}</div>
       <div class="row align-center-center img32 back-gray radius-default ripple" ng-click="close()">
           <img class="img16 img-gray400" src="/mfm-wallet/img/close.svg">
       </div>
   </div>

   <div class="flex col scroll align-start-center">
       <div class="flex col block input-content">
           <div class="col" ng-repeat="account in accounts">
               <p>{{account.domain}}</p>
               <p>{{account.balance}}</p>
           </div>
           <div class="row input-wrapper">
               <input type="text" ng-model="inputValue" placeholder="Введите значение">
           </div>
           <div class="primary-button" ng-click="submit()">{{str.send}}</div>
       </div>
   </div>
</md-dialog>
```

---

### **B. Встраиваемый экран (div вместо md-dialog)**

Используется для модулей внутри других диалогов (**исключения**: `store`, `wallet`, `search`, `login`).
Главная функция начинается с **`add`**.

**Контроллер:**

```javascript
function openNewWindow(success) {
    trackCall(arguments)
    showDialog("wallet/login", success, function ($scope) {
        addNewWindow($scope)
    })
}

function addNewWindow($scope) {
    // Логика страницы
}
```

**Структура вёрстки:**

* `injection.html` — **контент блока**

```html
<div class="flex col">
    Content
</div>
```

* `index.html` — **оболочка**

```html
<md-dialog class="fill col">
    <ng-include src="'/new_window.html'"></ng-include>
</md-dialog>
```

# Команды для создания `readme.md`

Напиши в первой строке название проекта (если нет — придумай).
Сделай один подзаголовок с целью проекта.
Если есть код — добавь короткий пример использования.
В конце блоком укажи весь список файлов с локальными путями и простыми комментариями (одна строка на файл).
Укажи зависимости если они указаны.

# Инструкция по работе с переводами

## Переводы однострочные для использования в верстке
### 1. Добавить ключ перевода
В папке strings в default.js нужно добавить (английский язык)
```javascript
str.new_translation_key = "New translation key"
```

Для другого языка например strings/lang/ru.js нужно добавить
```javascript
str.new_translation_key = "Новый ключ для перевода"
```

### 2. Использовать перевод в HTML
Чтобы вывести строку перевода, вставь в HTML:
```html
{{str.new_translation_key}}
```

## Переводы многострочные
### 1. Создать html файл в локальной папке faq
Создать файл en.html только строки тегами <p>
```html
<p>1. <strong>Your seed phrase is stored only on your device.</strong> Neither the service nor the developers have access to it.</p>
<p>2. If you lose your seed phrase, <strong>you will permanently lose access to your wallet.</strong> Keep it in a secure place!</p>
<p>3. To restore or migrate your wallet, <strong>you only need this phrase.</strong> No passwords or emails will help.</p>
```

Создать файлы для других языков например ru.html
```html
<p>1. <strong>Секретная фраза хранится только на вашем устройстве.</strong> Ни сервис, ни разработчики не имеют к ней доступа.</p>
<p>2. Если вы потеряете секретную фразу, <strong>восстановить доступ к кошельку будет невозможно.</strong> Сохраните её в надежном месте!</p>
<p>3. Для восстановления или переноса кошелька вам понадобится <strong>только эта фраза.</strong> Никакие пароли или почта не помогут.</p>
```

### 2. Внедрить в верстку с подстановкой языка
```html
<div class="nowrap-disabled m16"
     ng-include="[PATH_TO_DIALOG]/faq/' + getLanguage() + '.html'"></div>
```