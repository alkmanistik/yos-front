## Content

* [About](#about)
* [Technology](#technology)
* [Quickstart](#quickstart)
* [Project structure](#project-structure)

## About

`Yos` — мультисервис для персональной организации и социального шопинга. Основные функции:

* Создание желаний (вишлистов) с ценой, описанием и ссылкой
* Публикация советов о товарах с возможностью загрузки изображений
* Органайзер платных подписок и чеков
* Подписка на других пользователей и социальное взаимодействие
* Рекламные интеграции для бизнес-партнёров (CPC-модель)

`Yos-front` - является клиентской частью проекта yos. Реализует web-приложение yos.

## Technology

- **Язык**: TypeScript `5.9.3`
- **Система сборки**: Vite `7.1.7`
- **Фреймворки**:
    + React `19.1.16`

## Quickstart

Запуск проекта и отладка:

Сервис требует путь до серверной части Yos, необходимо создать в директории проекта `.env` и заполнить по примеру:

```env
VITE_API_URL=http://localhost:8080
```

Пример конфигурации `Dev.run.xml`
```xml
<component name="ProjectRunConfigurationManager">
    <configuration default="false" name="Dev" type="ShConfigurationType">
        <option name="SCRIPT_TEXT" value="npm run dev" />
        <option name="INDEPENDENT_SCRIPT_PATH" value="true" />
        <option name="SCRIPT_PATH" value="" />
        <option name="SCRIPT_OPTIONS" value="" />
        <option name="INDEPENDENT_SCRIPT_WORKING_DIRECTORY" value="true" />
        <option name="SCRIPT_WORKING_DIRECTORY" value="$PROJECT_DIR$" />
        <option name="INDEPENDENT_INTERPRETER_PATH" value="true" />
        <option name="INTERPRETER_PATH" value="powershell.exe" />
        <option name="INTERPRETER_OPTIONS" value="" />
        <option name="EXECUTE_IN_TERMINAL" value="true" />
        <option name="EXECUTE_SCRIPT_FILE" value="false" />
        <envs />
        <method v="2" />
    </configuration>
</component>
```

## Project structure

```
yos-front/
├── src/                           
│   ├── api                        # Код подключения к серверу
│   ├── contexts                   # Контекст приложения
│   ├── events                     # Отлавливаемые события
│   ├── hooks                      # React хуки
│   ├── types                      # Модели данных
│   ├── ui                         # Интерфейс
│   ├── App.tsx                    # Основные маршруты
│   ├── index.css                  # Основной конфиг стиля
│   └── main.tsx                   # Точка старта приложения
├── README.md                      # Документация проекта
├── index.html                     # Основной файл страницы
├── package.json                   # Файл версий библиотек
└── vite.config.ts                 # Настройки сборки
```

