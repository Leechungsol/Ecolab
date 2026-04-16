import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { AuthorityWebMappingEntity } from "../../entities/authoritywebmapping.entity";
import { UserDto } from "../user/dto/user.dto";

@Injectable()
export class AuthorityRepository {
  private readonly dataSource: DataSource;
  constructor(
    dataSource: DataSource,
    @InjectRepository(AuthorityWebMappingEntity)
    private readonly authorityWebMappingRepository: Repository<AuthorityWebMappingEntity>
  ) {
    this.dataSource = dataSource;
  }

  /**
   * Retrieves the RankWebMappingEntity for the given user's rank.
   *
   * @param user - The user object containing the rank information.
   * @returns A Promise that resolves to the RankWebMappingEntity for the user's rank.
   */
  async getAuthorityWebMapping(user: UserDto): Promise<AuthorityWebMappingEntity[]> {
    return this.authorityWebMappingRepository.find({
      where: {
        authority: user.authority,
      },
    });
  }
}
