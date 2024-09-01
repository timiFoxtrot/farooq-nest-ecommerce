/* eslint-disable @typescript-eslint/no-use-before-define */
import { Repository, FindManyOptions, SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { Pagination } from './pagination';
import { IPaginationOptions } from './interfaces';

export async function paginate<T extends ObjectLiteral>(
  repository: Repository<T>,
  options: IPaginationOptions,
  searchOptions?: FindManyOptions<T>,
): Promise<Pagination<T>>;

export async function paginate<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions,
): Promise<Pagination<T>>;

export async function paginate<T extends ObjectLiteral>(
  repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
  options: IPaginationOptions,
  searchOptions?: FindManyOptions<T>,
) {
  return repositoryOrQueryBuilder instanceof Repository
    ? paginateRepository<T>(repositoryOrQueryBuilder, options, searchOptions)
    : paginateQueryBuilder(repositoryOrQueryBuilder, options);
}

function createPaginationObject<T>(items: T[], totalItems: number, currentPage: number, limit: number, route?: string) {
  const totalPages = Math.ceil(totalItems / limit);

  return new Pagination(items, {
    total: totalItems,
    per_page: limit,
    total_pages: totalPages,
    current_page: currentPage,
    has_next_page: currentPage < totalPages,
  });
}

function resolveOptions(options: IPaginationOptions): [number, number] {
  const page = options.page < 1 ? 1 : options.page;
  const size = options.size;

  return [page, size];
}

async function paginateRepository<T extends ObjectLiteral>(
  repository: Repository<T>,
  options: IPaginationOptions,
  searchOptions?: FindManyOptions<T>,
): Promise<Pagination<T>> {
  const [page, limit] = resolveOptions(options);

  const [items, total] = await repository.findAndCount({
    skip: limit * (page - 1),
    take: limit,
    ...searchOptions,
  });

  return createPaginationObject<T>(items, total, page, limit);
}

async function paginateQueryBuilder<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions,
): Promise<Pagination<T>> {
  const [page, limit] = resolveOptions(options);

  const [items, total] = await queryBuilder
    .take(limit)
    .skip((page - 1) * limit)
    .getManyAndCount();

  return createPaginationObject<T>(items, total, page, limit);
}
