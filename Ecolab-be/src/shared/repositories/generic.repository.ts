import { DataSource, Repository } from "typeorm";
import { EntityTarget } from "typeorm/common/EntityTarget";

/**
 * A generic repository class that extends the TypeORM `Repository` class.
 * This class provides a base implementation for performing CRUD operations on entities.
 *
 * @template T - The type of the entity that this repository manages.
 */
export class GenericRepository<T> extends Repository<T> {
  constructor(target: EntityTarget<T>, dataSource: DataSource) {
    super(target, dataSource.createEntityManager());
  }
}
