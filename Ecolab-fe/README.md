# seoyeon-fe
seoyeonpnc1.cafe24.com  
root / LEE1602@@

## Project setup

### Install packages

```
npm i
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```
## Structure

| Folder    | Subfolder/File    | Description                                                   |
| --------- | ----------------- | ------------------------------------------------------------- |
| `public/` |                   | Contains the public assets and the main `index.html` file.    |
| `src/`    |                   | The main source code directory.                               |
| `src/`    | `APIs/`           | Contains all the APIs.                                        |
| `src/`    | `assets/`         | Contains image files and icons.                               |
| `src/`    | `components/`     | Reusable Vue components.                                      |
| `src/`    | `configs/`        | Vue Router and query API configurations.                      |
| `src/`    | `constants/`      | Contains global contants.                                     |
| `src/`    | `layouts/`        | Contains Vue components for layout structures.                |
| `src/`    | `plugins/`        | Contains Vue plugins.                                         |
| `src/`    | `stores/`         | Contains the stores where global state is managed.            |
| `src/`    | `themes/`         | Contains all themes.                                          |
| `src/`    | `utils/`          | Utility functions and helpers.                                |
| `src/`    | `views/`          | Vue components that represent entire pages or views.          |
| `src/`    | `dictionary.json` | Contains texts that override the default texts of DevExtreme. |
| `src/`    | `main.js`         | The entry point of the application.                           |

## Environment variables

| File             | Variables               | Description                                                                                             |
| ---------------- | ----------------------- | ------------------------------------------------------------------------------------------------------- |
| .env.development |                         | Used in the development environment.                                                                    |
|                  | VUE_APP_BASE_API_URL    | Base API endpoint.                                                                                      |
|                  | VUE_APP_DURATION_LOGOUT | The duration for system auto-logout since the last session activity (default: `1440`, unit: `minutes`). |
| .env.production  |                         | Used in the production environment.                                                                     |
|                  | VUE_APP_BASE_API_URL    | Base API endpoint.                                                                                      |
|                  | VUE_APP_DURATION_LOGOUT | The duration for system auto-logout since the last session activity (default: `1440`, unit: `minutes`). |

## Customize

### 1. Change the menus in the Sidebar

File: `src/constants/navigation.constant.js`

Example:
```js
{
  text: "사양서조회", // Screen name
  path: "/instruction", // Screen path
  icon: "fas fa-microchip", // Icon
  formId: "FormInstructionView", // Form ID
},
```
> You can choose any icon from: [DevExtreme Icons](https://js.devexpress.com/Vue/Documentation/Guide/Themes_and_Styles/Icons/) or
[Font Awesome v5.15.4](https://fontawesome.com/v5/search?o=r&m=free).

### 2. Add column in Data Grid

Example: Add a column in 사양서조회.

File: `src/views/instruction/InstructionGrid.vue`

- Add a `<dx-column>` tag inside `<template #columns>`.
```js
<template #columns>
  // code ...
  <dx-column
    data-field="explainKey"
    caption="No"
    alignment="center"
    data-type="number"
  />
  // code ...
</template>
```
> Read [docs](https://js.devexpress.com/Vue/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/) to learn more about the column configuration.

### 3.  Add a new screen

3.1 Create a new view

- Create new file in `src/views/` folder.
- Copy template code in `src/templates/Component.vue`.

Example: `src/views/NewScreen.vue`.

3.2 Create a new route

- Add new route in `src/configs/router.config.js`.
- Import the view `const NewScreen = defineAsyncComponent(() => import("@/views/NewScreen.vue"),);`
- Add route config into `routes` array:
```js
routes: [
  // code ...
  {
    path: "/new-screen",
    name: "new-screen",
    meta: {
      requiresAuth: true, // Set true if the route requires authentication.
      layout: privateLayout, // Set private layout if the route requires authentication.
      // or
      layout: publicLayout, // Set public layout if the route doesn't require authentication.
    },
    component: NewScreen,
  },
]
```

### 4. Change title of website

- On tab: Change the value of `pages.index.title` in `vue.config.js`.
- On header: In file `src/components/layout/Header.vue`, change the value of attribute `text`:
```js
<dx-item
  location="before"
  css-class="header-title dx-toolbar-label"
  text="식품위생점검"
/>
```

### 5. Override default texts of DevExtreme

- Access [list default texts](https://github.com/DevExpress/DevExtreme/blob/24_1/packages/devextreme/js/localization/messages/en.json) of DevExtreme.
- Find the text you want to override and add it into `src/dictionary.json`.

Example:
- When you want to override the default text of "Required" in the validation message:
```json
{
  "en": {
    // code ...
    "validation-required": "Required",
    // code ...
  }
}
```
- Copy key `validation-required` into `src/dictionary.json` and define your text:
```json
{
  // code ...
  "validation-required": "이 필드는 필수 항목입니다.",
  // code ...
}
```

### 6. Change the default theme

6.1 `public/index.html`:
- Check the `<link rel="dx-theme" ... />` tags and set the value of the `data-active` attribute to `true` for the theme you want to set as the default.
- At the same time, you also need to set the `data-active` of the previous default theme to `false`.

6.2 `src/stores/theme.store.js`:
- Change the value of `themeStore.current` to the theme you want to set as the default.

### 7. Add a new button on toolbar in Data Grid

Example: Add a new button in 거래처 등록.

File: `src/views/company/CompanyGrid.vue`

- Add an object in funtion `onToolbarPreparing`:
```js
e.toolbarOptions.items.push({
  location: "after",
  widget: "dxButton",
  options: {
    hint: "등록",
    icon: "import",
    onClick: () => {
      fileUploaderRef.value.click();
    },
  },
});
```
> Read [docs](https://js.devexpress.com/Vue/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/toolbar/items/) to learn more about the toolbar configuration.
