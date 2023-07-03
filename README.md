# About the project
This package can be used to simplify the handling of `findManyOptions` and to be able to write more beautifully.

# Documentation
## Usage


```typescript
class Entity {
	name: string
	description: string
}

const builder = new Builder<Entity>()
	.where({ name: 'foo' })
	.andWhere(
		new BracketBuilder<Entity>()
		.where({description: 'desc 1'})
		.orWhere({description: 'desc 2'}))
	.take(7)
	.skip(5)
	.build()
```


