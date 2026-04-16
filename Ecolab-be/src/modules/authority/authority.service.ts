import { Injectable } from "@nestjs/common";
import { AuthorityWebMappingEntity } from "../../entities/authoritywebmapping.entity";
import { UserDto } from "../user/dto/user.dto";
import { AuthorityRepository } from "./authority.repository";
@Injectable()
export class AuthorityService {
  constructor(private readonly authorityRepository: AuthorityRepository) {}

  /**
   * Retrieves the Authority web mapping for the given user.
   *
   * @param user - The user for which to retrieve the Authority web mapping.
   * @returns The Authority web mapping entity for the given user.
   */
  async getAuthorityWebMapping(user: UserDto): Promise<AuthorityWebMappingEntity[]> {
    return this.authorityRepository.getAuthorityWebMapping(user);
  }
}
