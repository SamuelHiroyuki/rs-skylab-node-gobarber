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
