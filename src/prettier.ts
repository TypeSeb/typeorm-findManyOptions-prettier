import { FindManyOptions, FindOptionsOrder, FindOptionsWhere } from 'typeorm'

interface Order<TEntity> {
  orderBy(order: FindOptionsOrder<TEntity>): BuilderOrder<TEntity>
}
interface Where<TEntity> {
  where(filter: FindOptionsWhere<TEntity>): BuilderWhere<TEntity>
}
interface Take<TEntity> {
  take(take: number): Skip<TEntity> & Build<TEntity>
}
interface Skip<TEntity> {
  skip(skip: number): Build<TEntity>
}
interface Build<TEntity> {
  build(): FindManyOptions<TEntity>
}
interface WhereBuilderInterface<TEntity> {
  andWhere(filter: FindOptionsWhere<TEntity>): BuilderWhere<TEntity>
  orWhere(filter: FindOptionsWhere<TEntity>): BuilderWhere<TEntity>
}

export class BracketBuilder<TEntity> {
  where(filter: FindOptionsWhere<TEntity>): BracketFilter<TEntity> {
    return new BracketFilter([filter])
  }
}

class BracketFilter<TEntity> {
  constructor(private filter: FindOptionsWhere<TEntity>[]) {}

  get findWhere() {
    return [...this.filter]
  }

  andWhere(condition: FindOptionsWhere<TEntity>): BracketFilter<TEntity> {
    if (this.filter.length === 0) return this.orWhere(condition)
    for (let i = 0; i < this.filter.length; i++)
      this.filter[i] = {
        ...this.filter[i],
        ...condition
      }
    return this
  }

  orWhere(condition: FindOptionsWhere<TEntity>): BracketFilter<TEntity> {
    this.filter.push(condition)
    return this
  }
}

export class Builder<TEntity> implements Where<TEntity>, Order<TEntity>, Take<TEntity>, Skip<TEntity> {
  take(take: number): BuilderTake<TEntity> {
    return new BuilderTake<TEntity>(take)
  }
  skip(skip: number): Build<TEntity> {
    return new BuilderSkip<TEntity>(skip)
  }

  where(filter: FindOptionsWhere<TEntity>): BuilderWhere<TEntity> {
    return new BuilderWhere<TEntity>([filter])
  }
  orderBy(order: FindOptionsOrder<TEntity>): BuilderOrder<TEntity> {
    return new BuilderOrder<TEntity>(order)
  }
}

class BuilderWhere<TEntity>
  implements WhereBuilderInterface<TEntity>, Order<TEntity>, Take<TEntity>, Skip<TEntity>, Build<TEntity>
{
  constructor(private filter: FindOptionsWhere<TEntity>[]) {}

  orderBy(order: FindOptionsOrder<TEntity>): BuilderOrder<TEntity> {
    return new BuilderOrder<TEntity>(order, this.filter)
  }
  take(take: number): BuilderTake<TEntity> {
    return new BuilderTake<TEntity>(take, this.filter)
  }
  skip(skip: number): Build<TEntity> {
    return new BuilderSkip<TEntity>(skip, this.filter)
  }
  build(): FindManyOptions<TEntity> {
    const findManyOptions: FindManyOptions<TEntity> = {
      where: this.filter
    }
    return findManyOptions
  }

  andWhere(filter: BracketFilter<TEntity>): BuilderWhere<TEntity>
  andWhere(filter: FindOptionsWhere<TEntity>): BuilderWhere<TEntity>
  andWhere(filter: FindOptionsWhere<TEntity> | BracketFilter<TEntity>): BuilderWhere<TEntity> {
    if (filter instanceof BracketFilter) return this.andBracket(filter)

    if (this.filter.length === 0) this.filter.push(filter)
    else
      for (let i = 0; i < this.filter.length; i++)
        this.filter[i] = {
          ...this.filter[i],
          ...filter
        }

    return this
  }

  orWhere(filter: BracketFilter<TEntity>): BuilderWhere<TEntity>
  orWhere(filter: FindOptionsWhere<TEntity>): BuilderWhere<TEntity>
  orWhere(filter: FindOptionsWhere<TEntity> | BracketFilter<TEntity>): BuilderWhere<TEntity> {
    if (filter instanceof BracketFilter) return this.orBracket(filter)
    this.filter.push(filter)
    return this
  }

  private orBracket(builder: BracketFilter<TEntity>): BuilderWhere<TEntity> {
    this.filter.push(...builder.findWhere)
    return this
  }

  private andBracket(bracket: BracketFilter<TEntity>): BuilderWhere<TEntity> {
    const combinedFilter: FindOptionsWhere<TEntity>[] = []

    this.filter.forEach((filter) => {
      bracket.findWhere.forEach((builderFilter) => {
        combinedFilter.push({
          ...filter,
          ...builderFilter
        })
      })
    })

    this.filter = combinedFilter

    return this
  }
}

class BuilderOrder<TEntity> implements Take<TEntity>, Skip<TEntity>, Build<TEntity> {
  constructor(private order: FindOptionsOrder<TEntity>, private filter?: FindOptionsWhere<TEntity>[]) {}

  take(take: number): BuilderTake<TEntity> {
    return new BuilderTake<TEntity>(take, this.filter, this.order)
  }
  skip(skip: number): Build<TEntity> {
    return new BuilderSkip<TEntity>(skip, this.filter, this.order)
  }
  build(): FindManyOptions<TEntity> {
    const findManyOptions: FindManyOptions<TEntity> = {
      where: this.filter,
      order: this.order
    }
    return findManyOptions
  }

  andBy(order: FindOptionsOrder<TEntity>): BuilderOrder<TEntity> {
    this.order = { ...this.order, ...order }
    return this
  }
}

class BuilderTake<TEntity> implements Skip<TEntity>, Build<TEntity> {
  constructor(
    private take: number,
    private filter?: FindOptionsWhere<TEntity>[],
    private order?: FindOptionsOrder<TEntity>
  ) {}

  skip(skip: number): Build<TEntity> {
    return new BuilderSkip<TEntity>(skip, this.filter, this.order, this.take)
  }
  build(): FindManyOptions<TEntity> {
    const findManyOptions: FindManyOptions<TEntity> = {
      where: this.filter,
      order: this.order,
      take: this.take
    }
    return findManyOptions
  }
}

class BuilderSkip<TEntity> implements Build<TEntity> {
  constructor(
    private skipNumber: number,
    private filter?: FindOptionsWhere<TEntity>[],
    private order?: FindOptionsOrder<TEntity>,
    private takeNumber?: number
  ) {}

  build(): FindManyOptions<TEntity> {
    const findManyOptions: FindManyOptions<TEntity> = {
      where: this.filter,
      order: this.order,
      take: this.takeNumber,
      skip: this.skipNumber
    }
    return findManyOptions
  }
}
