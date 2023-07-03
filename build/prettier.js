"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = exports.BracketBuilder = void 0;
class BracketBuilder {
    where(filter) {
        return new BracketFilter([filter]);
    }
}
exports.BracketBuilder = BracketBuilder;
class BracketFilter {
    constructor(filter) {
        this.filter = filter;
    }
    get findWhere() {
        return [...this.filter];
    }
    andWhere(condition) {
        if (this.filter.length === 0)
            return this.orWhere(condition);
        for (let i = 0; i < this.filter.length; i++)
            this.filter[i] = Object.assign(Object.assign({}, this.filter[i]), condition);
        return this;
    }
    orWhere(condition) {
        this.filter.push(condition);
        return this;
    }
}
class Builder {
    take(take) {
        return new BuilderTake(take);
    }
    skip(skip) {
        return new BuilderSkip(skip);
    }
    where(filter) {
        return new BuilderWhere([filter]);
    }
    orderBy(order) {
        return new BuilderOrder(order);
    }
}
exports.Builder = Builder;
class BuilderWhere {
    constructor(filter) {
        this.filter = filter;
    }
    orderBy(order) {
        return new BuilderOrder(order, this.filter);
    }
    take(take) {
        return new BuilderTake(take, this.filter);
    }
    skip(skip) {
        return new BuilderSkip(skip, this.filter);
    }
    build() {
        const findManyOptions = {
            where: this.filter
        };
        return findManyOptions;
    }
    andWhere(filter) {
        if (filter instanceof BracketFilter)
            return this.andBracket(filter);
        if (this.filter.length === 0)
            this.filter.push(filter);
        else
            for (let i = 0; i < this.filter.length; i++)
                this.filter[i] = Object.assign(Object.assign({}, this.filter[i]), filter);
        return this;
    }
    orWhere(filter) {
        if (filter instanceof BracketFilter)
            return this.orBracket(filter);
        this.filter.push(filter);
        return this;
    }
    orBracket(builder) {
        this.filter.push(...builder.findWhere);
        return this;
    }
    andBracket(bracket) {
        const combinedFilter = [];
        this.filter.forEach((filter) => {
            bracket.findWhere.forEach((builderFilter) => {
                combinedFilter.push(Object.assign(Object.assign({}, filter), builderFilter));
            });
        });
        this.filter = combinedFilter;
        return this;
    }
}
class BuilderOrder {
    constructor(order, filter) {
        this.order = order;
        this.filter = filter;
    }
    take(take) {
        return new BuilderTake(take, this.filter, this.order);
    }
    skip(skip) {
        return new BuilderSkip(skip, this.filter, this.order);
    }
    build() {
        const findManyOptions = {
            where: this.filter,
            order: this.order
        };
        return findManyOptions;
    }
    andBy(order) {
        this.order = Object.assign(Object.assign({}, this.order), order);
        return this;
    }
}
class BuilderTake {
    constructor(take, filter, order) {
        this.take = take;
        this.filter = filter;
        this.order = order;
    }
    skip(skip) {
        return new BuilderSkip(skip, this.filter, this.order, this.take);
    }
    build() {
        const findManyOptions = {
            where: this.filter,
            order: this.order,
            take: this.take
        };
        return findManyOptions;
    }
}
class BuilderSkip {
    constructor(skipNumber, filter, order, takeNumber) {
        this.skipNumber = skipNumber;
        this.filter = filter;
        this.order = order;
        this.takeNumber = takeNumber;
    }
    build() {
        const findManyOptions = {
            where: this.filter,
            order: this.order,
            take: this.takeNumber,
            skip: this.skipNumber
        };
        return findManyOptions;
    }
}
