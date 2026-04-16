import { ApiProperty } from "@nestjs/swagger";

export class Pagination<T> {
  @ApiProperty({ isArray: true, type: "object" })
  data: T[];

  @ApiProperty({
    type: "object",
    properties: {
      total: { type: "number" },
      page: { type: "number" },
      limit: { type: "number" },
      totalPages: { type: "number" },
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const makePaginationMeta = (
  page: number,
  pageSize: number,
  totalItem: number
) => {
  return {
    total: totalItem,
    page: page,
    limit: pageSize,
    totalPages: Math.ceil(totalItem / pageSize),
  };
};
