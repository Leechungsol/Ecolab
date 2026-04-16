import internal = require("stream");
import { Column, Entity, Index } from "typeorm";

@Index("AuthorityWebMapping_PK", ["formId", "authority"], { unique: true })
@Entity("AuthorityWebMapping", { schema: "dbo" })
export class AuthorityWebMappingEntity {
  @Column("nvarchar", { primary: true, name: "FormID", length: 30 })
  formId: string;

  @Column("int", { primary: true, name: "Authority"})
  authority: number;

  @Column("nvarchar", { name: "AuthorityType", nullable: true, length: 1 })
  authorityType: string | null;
}
