## Docker

#### Creating a container

`$ docker run --name gobarber -e POSTGRES_PASSWORD=123 -p 5432:5432 -d postgres`

## Eslint e Prettier

#### Fixing all .js files in the src folder

`$ yarn eslint --fix src --ext .js`

## Sequelize-cli

#### Creating Users migration

`$ yarn sequelize migration:create --name create-users`

#### Running all migrations

`$ yarn sequelize db:migrate`

#### Undoing a migration

`$ yarn sequelize db:migrate:undo`

#### Undoing all migrations

`$ yarn sequelize db:migrate:undo:all`
