# Ha.js Frontend Weekend Angular + Firebase App

## Описание

Приложение собрано при помощи BaaS подхода, когда бекенд выступает как услуга.
В качестве бекенда использовался [Google Firebase](https://firebase.google.com),
фронт собран на Angular 6. Собраны два SPA для фронта:
- [Aдмин-панель](https://ha-js-7b0a9.firebaseapp.com/admin/)
- [Приложение Ha.js](https://ha-js-7b0a9.firebaseapp.com/)

Оба этих приложения используют общую библиотеку Angular `@it-quasar/ha-js-core`,
которая обеспечивает звимодействе приложений с БД 
[Cloud Firesotre](https://firebase.google.com/docs/firestore/) и файлохранилищем 
[Cloud Storage](https://firebase.google.com/docs/storage/).

Для хранения данных использована NoSQL БД реального времени 
[Cloud Firestore](https://firebase.google.com/docs/firestore/), которая позволяет
взаимодействовать с данными в реальном времени из нескольких мест одновременно. Для того
чтоб поддерживать работу с Cloud Firestore приложения реализованы по реактивной технологии, 
используя для связи с Cloud Firestore библиотеку 
[@angular/fire](https://github.com/angular/angularfire2). В приложении включена
поддержка работы в офлайн режиме.

В качестве хранилища файлов для приложений (картинок, документов) использован
[Cloud Storage](https://firebase.google.com/docs/storage/).

Сами файлы SPA храняться в CDN Google и разворчиваются там при помощи
[Firebase Hosting](https://firebase.google.com/docs/hosting/).

Проект сделан в виде моно-репозитория со следующими проектами:
- `projects/ha-js-core` - общая библиотека для взаимодействия с 
[Cloud Firesotre](https://firebase.google.com/docs/firestore/) и
[Cloud Storage](https://firebase.google.com/docs/storage/);
- `projects/ha-js-admin` - SPA админ-панели
- `projects/ha-js-app` - SPA Ha.js

В SPA приложения Ha.js подключенны ServiceWorker's от Angular, которые
занимаются загрузкой приложения и при необходимости обновлением его частей.

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) на SPA Ha.js 
показывает все метрики в зеленой зоне=^_^=

К проекту прикручена фреймворк для модульного тестирования [Jest](https://jestjs.io/), но тесты написать
пока не успел=(

## Адреса

- Приложение Ha.js: https://ha-js-7b0a9.firebaseapp.com/
- Админ-панель: https://ha-js-7b0a9.firebaseapp.com/admin/
