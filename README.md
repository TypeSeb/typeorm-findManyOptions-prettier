# About the project
This package provides a method-oriented concatenation of the filter and sort function of `findManyOptions`. Here it is possible to clearly show which filters and sorts are applied by using expressive notation. Furthermore, the package offers the possibility to write a simple parenthesis condition as in SQL. Through strong typing, only methods that make sense in their order and readability are allowed. The typing of the entity is also transferred to the parameter methods, thus ensuring that only properties of the entity can be filtered and sorted.

# Documentation
## Usage


```typescript
class Entity {
	name: string
	description: string
}

const findManyOptions = new Builder<Entity>()
  .where({ name: 'asd' })
  .andWhere(
    new BracketBuilder<Entity>()
    .where({description: 'A'})
    .orWhere({description: 'B'}))
  .orderBy({name: 'asc'})
  .andBy({description: 'asc'})
  .take(7)
  .skip(5)
  .build()
```


