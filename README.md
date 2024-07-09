<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://static-00.iconduck.com/assets.00/nestjs-icon-2048x2038-6bjnpydw.png" width="200" alt="Nest Logo" /></a>
</p>

<div align="center">

[![Nest][Nest.js]][Nest-url] [![Postgres][Postgres]][PostgresIo] [![Redis][Redis]][RedisIo] [![Docker][Docker]][DockerIo] [![TypeScript][TypeScriptIo]][TypeScriptUrl] [![Eslint][EslintIo]][EslintUrl] [![Prettier][PrettierIo]][PrettierUrl]

</div>

# Test Instance Arcticles v0.0.1

---

## Table of Contents

<ol>
    <li>
        <a href="#file-structure">File structure</a>
    </li>
  <li>
    <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
  </li>
  <li>
    <a href="#usage">Usage</a>
    <ul>
        <li><a href="#start-dev">Start Dev</a></li>
        <li><a href="#start-prod">Start Prod</a></li>
    </ul>
  </li>
  <li><a href="#roadmap">Roadmap</a></li>
  <li><a href="#contact">Contact</a></li>
</ol>

## File structure

This project follows the following file structure:

- Root
    - [Dockerfile](Dockerfile)
    - [docker\-compose.example.yml](docker-compose.example.yml)
    - [jest.config.js](jest.config.js)
    - __k8s__
        - [deployment.yaml](k8s/deployment.yaml)
        - [service.yaml](k8s/service.yaml)
    - [list.md](list.md)
    - [nest\-cli.json](nest-cli.json)
    - [package.json](package.json)
    - __src__
        - __core__
            - __domain__
                - __decorator__
                    - [index.ts](src/core/domain/decorator/index.ts)
                    - [public.decorator.ts](src/core/domain/decorator/public.decorator.ts)
                    - [resource.decorator.ts](src/core/domain/decorator/resource.decorator.ts)
                    - [roles.decorator.ts](src/core/domain/decorator/roles.decorator.ts)
                - __entities__
                    - [category.entity.ts](src/core/domain/entities/category.entity.ts)
                    - [index.ts](src/core/domain/entities/index.ts)
                    - [post.entity.ts](src/core/domain/entities/post.entity.ts)
                    - [token.entity.ts](src/core/domain/entities/token.entity.ts)
                    - [user.entity.ts](src/core/domain/entities/user.entity.ts)
                - __middleware__
                    - [http.middleware.ts](src/core/domain/middleware/http.middleware.ts)
        - __infra__
            - __framework__
                - [app.module.ts](src/infra/framework/app.module.ts)
                - __auth__
                    - _\_tests\_\_
                        - [auth.controller.spec.ts](src/infra/framework/auth/__tests__/auth.controller.spec.ts)
                        - [auth.service.spec.ts](src/infra/framework/auth/__tests__/auth.service.spec.ts)
                        - __mock__
                            - [service.mock.ts](src/infra/framework/auth/__tests__/mock/service.mock.ts)
                    - [auth.api.ts](src/infra/framework/auth/auth.api.ts)
                    - [auth.controller.ts](src/infra/framework/auth/auth.controller.ts)
                    - [auth.module.ts](src/infra/framework/auth/auth.module.ts)
                    - [auth.service.ts](src/infra/framework/auth/auth.service.ts)
                - __cache__
                    - _\_tests\_\_
                    - [cache.module.ts](src/infra/framework/cache/cache.module.ts)
                - __category__
                    - _\_tests\_\_
                        - [category.controller.spec.ts](src/infra/framework/category/__tests__/category.controller.spec.ts)
                        - [category.service.spec.ts](src/infra/framework/category/__tests__/category.service.spec.ts)
                    - [category.api.ts](src/infra/framework/category/category.api.ts)
                    - [category.controller.ts](src/infra/framework/category/category.controller.ts)
                    - [category.module.ts](src/infra/framework/category/category.module.ts)
                    - [category.service.ts](src/infra/framework/category/category.service.ts)
                - [main.ts](src/infra/framework/main.ts)
                - __post__
                    - _\_tests\_\_
                        - __mock__
                            - [service.mock.ts](src/infra/framework/post/__tests__/mock/service.mock.ts)
                        - [post.controller.spec.ts](src/infra/framework/post/__tests__/post.controller.spec.ts)
                        - [post.service.spec.ts](src/infra/framework/post/__tests__/post.service.spec.ts)
                    - [post.api.ts](src/infra/framework/post/post.api.ts)
                    - [post.controller.ts](src/infra/framework/post/post.controller.ts)
                    - [post.module.ts](src/infra/framework/post/post.module.ts)
                    - [post.service.ts](src/infra/framework/post/post.service.ts)
                - __token__
                    - _\_tests\_\_
                        - __mock__
                            - [service.mock.ts](src/infra/framework/token/__tests__/mock/service.mock.ts)
                        - [token.service.spec.ts](src/infra/framework/token/__tests__/token.service.spec.ts)
                    - [token.module.ts](src/infra/framework/token/token.module.ts)
                    - [token.schedule.ts](src/infra/framework/token/token.schedule.ts)
                    - [token.service.ts](src/infra/framework/token/token.service.ts)
                - __user__
                    - _\_tests\_\_
                        - __mocks__
                            - [service.mock.ts](src/infra/framework/user/__tests__/mocks/service.mock.ts)
                        - [user.controller.spec.ts](src/infra/framework/user/__tests__/user.controller.spec.ts)
                        - [user.service.spec.ts](src/infra/framework/user/__tests__/user.service.spec.ts)
                    - [user.api.ts](src/infra/framework/user/user.api.ts)
                    - [user.controller.ts](src/infra/framework/user/user.controller.ts)
                    - [user.module.ts](src/infra/framework/user/user.module.ts)
                    - [user.service.ts](src/infra/framework/user/user.service.ts)
        - __shared__
            - __configs__
                - __db__
                    - [db.config.ts](src/shared/configs/db/db.config.ts)
            - __crud__
                - __auth__
                    - [LoginDto.dto.ts](src/shared/crud/auth/LoginDto.dto.ts)
                - __category__
                    - [create\-category.dto.ts](src/shared/crud/category/create-category.dto.ts)
                    - [update\-category.dto.ts](src/shared/crud/category/update-category.dto.ts)
                - [index.ts](src/shared/crud/index.ts)
                - __post__
                    - [create\-post.dto.ts](src/shared/crud/post/create-post.dto.ts)
                    - [update\-post.dto.ts](src/shared/crud/post/update-post.dto.ts)
                - __tags__
                    - [create\-tag.dto.ts](src/shared/crud/tags/create-tag.dto.ts)
                    - [update\-tag.dto.ts](src/shared/crud/tags/update-tag.dto.ts)
                - __user__
                    - [create\-user.dto.ts](src/shared/crud/user/create-user.dto.ts)
                    - [update\-user.dto.ts](src/shared/crud/user/update-user.dto.ts)
                    - [user.response.ts](src/shared/crud/user/user.response.ts)
            - __env__
                - [index.ts](src/shared/env/index.ts)
            - __guards__
                - [access.guard.ts](src/shared/guards/access.guard.ts)
                - [index.ts](src/shared/guards/index.ts)
                - [refresh.guard.ts](src/shared/guards/refresh.guard.ts)
                - [role.guard.ts](src/shared/guards/role.guard.ts)
            - __helpers__
                - [api.helper.ts](src/shared/helpers/api.helper.ts)
            - __roles__
                - [index.ts](src/shared/roles/index.ts)
                - [roles.enum.ts](src/shared/roles/roles.enum.ts)
                - [roles.service.ts](src/shared/roles/roles.service.ts)
            - __strategy__
                - [access.strategy.ts](src/shared/strategy/access.strategy.ts)
                - [index.ts](src/shared/strategy/index.ts)
                - [refresh.strategy.ts](src/shared/strategy/refresh.strategy.ts)
            - __types__
                - [config.type.ts](src/shared/types/config.type.ts)
                - [index.ts](src/shared/types/index.ts)
        - __test__
    - [tsconfig.build.json](tsconfig.build.json)
    - [tsconfig.json](tsconfig.json)

<details>
    <summary>
	    Root Structure concepts
	</summary>
    <p>

```
├── + core
│   ├── + base
│   │   ├── - entity.ts
│   │   ├── - mapper.ts
│   │   ├── - repository.ts
│   │   └── - use-case.ts
│   │
│   ├── + domain
│   │   ├── + entities
│   │   └── + mappers
│   │
│   └── + repositories
│
├── + infra
│   ├── + data
│   └── + framework
│       ├── app.module.ts
│       └── main.ts
│       
├── + shared
│   └── + dtos
│
└── + use-cases
```

- `core`: contains the business logic of the application, such as entities, use cases, and interfaces.

- `infra`: contains the implementation of the interfaces defined in the core, such as data sources and services.

- `shared`: contains code that can be shared between multiple modules, such as models and DTOs.

- `use-cases`: contains the implementation of the use cases defined in the core, such as controllers and middleware.
    </p>

</details>

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

This is a example for installation project and start in local

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/soorq/Backend-Test.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Enter your enviroments in .env file
   ```sh
      > API_DOCKS=http(or https)//domain:port/docs
      > DOMAIN=DOMAIN
      > PORT=PORT
      > REDIS_PASSWORD=REDIS_PASSWORD
      > REDIS_PORT=REDIS_PORT
      > REDIS_HOST=REDIS_HOST
      > DB_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
      > POSTGRES_USER=POSTGRES_USER
      > POSTGRES_PASSWORD=POSTGRES_PASSWORD
      > POSTGRES_HOST=POSTGRES_HOST
      > POSTGRES_PORT=POSTGRES_PORT
      > POSTGRES_DB=POSTGRES_DB
      > POSTGRES_DATA=POSTGRES_DATA
      > POSTGRES_HOST_AUTH_METHOD=POSTGRES_HOST_AUTH_METHOD
      > PGADMIN_DEFAULT_EMAIL=PGADMIN_DEFAULT_EMAIL
      > PGADMIN_DEFAULT_EMAIL=PGADMIN_DEFAULT_EMAIL
      > PGADMIN_DEFAULT_PASSWORD=PGADMIN_DEFAULT_PASSWORD
      > PGADMIN_CONFIG_SERVER_MODE=False
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Before running the application, you need to generate entities for the database that will be deployed to the
docker-compose group

```bash
    > npm run migration:generate --name=yourname
    > npm run migration:run
```

### Start dev

```bash
> npm run start:dev
```

```bash
> yarn start:dev
```

```bash
> pnpm start:dev
```

### Start prod

```bash
> npm run build
> npm run start:prod
```

```bash
> yarn build
> yarn start:prod
```

```bash
> pnpm build
> pnpm start:prod
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [X] Создание API для аутентификации:
    - [X] Реализуйте регистрацию и аутентификацию пользователей.
    - [X] Используйте JWT (JSON Web Tokens) для обработки аутентификации.
- [X] Интеграция с базой данных PostgreSQL с использованием TypeORM:
    - [X] Настройте соединение с базой данных.
    - [X] Используйте миграции для управления структурой базы данных.
- [X] Разработка CRUD API для сущности "Статья":
    - [X] Структура "Статьи" должна включать: название, описание, дату публикации, автора.
    - [X] Реализуйте операции создания, чтения, обновления и удаления статей.
    - [X] Обеспечьте валидацию входных данных.
    - [X] Реализуйте пагинацию для запросов списка статей.
    - [X] Добавьте возможность фильтрации статей по различным критериям (например, по дате публикации, автору).
    - [X] Создание и обновление статей, должны быть закрыты авторизацией
- [X] Реализация кэширования с использованием Redis:
    - [X] Кэшируйте результаты запросов на чтение статей.
    - [X] Обеспечьте инвалидацию кэша при обновлении или удалении статей.
- [ ] Тестирование *(30%/100%):
    - [ ] Напишите unit-тесты для проверки бизнес-логики.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Soorq - [@asoorq](https://t.me/asoorq) - karpuhinlox12@gmail.com

Project Link: [Ссылка на проект](https://github.com/soorq/Front-TestTask)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[Nest.js]: https://img.shields.io/badge/nest.js-ffffff?style=for-the-badge&logo=nestjs&logoColor=red

[Nest-url]: https://nestjs.com/

[Redis]: https://img.shields.io/badge/redis-20232A?style=for-the-badge&logo=redis&logoColor=61DAFB

[RedisIo]: https://redis.com/

[Docker]: https://img.shields.io/badge/docker-white?style=for-the-badge&logo=docker

[DockerIo]: https://docker.com/

[Postgres]: https://img.shields.io/badge/postgres-3392d6?style=for-the-badge&logo=postgresql&logoColor=33d6cc

[PostgresIo]: https://docker.org/

[TypeScriptIo]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white

[TypeScriptUrl]: https://www.typescriptlang.org

[EslintIo]: https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white

[EslintUrl]: https://eslint.org/

[PrettierIo]: https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E

[PrettierUrl]: https://prettier.io/