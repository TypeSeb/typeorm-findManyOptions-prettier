# About the project
This package can be used to simplify the handling of `findManyOptions` and to be able to write more beautifully.

# Documentation
## Usage


```typescript
class Entity {
	name: string
	description: string
}

const builder = new Builder<ResourceEntity>()
  .where({ name: 'asd' })
  .andWhere(
    new BracketBuilder<ResourceEntity>()
    .where({description: 'A'})
    .orWhere({description: 'B'}))
  .orderBy({name: 'asc'})
  .andBy({description: 'asc'})
  .take(7)
  .skip(5)
  .build()
```


