import { Column, Entity, Index } from "typeorm"

@Index("UserInfo_PK", ["userID"], { unique: true })
@Entity("UserInfo", { schema: "dbo" })
export class UserInfoEntity { 
  @Column("nvarchar", { primary: true, name: "UserID", nullable: true, length: 400 })
  userID: string

  @Column("nvarchar", { name: "Password", nullable: false, length: 400 })
  password: string

  @Column("nvarchar", { name: "Name", nullable: false, length: 400 })
  userName: string

  @Column("nvarchar", { name: "Phone", nullable: false, length: 100 })
  phone: string

  @Column("nvarchar", { name: "Email", nullable: false, length: 200 })
  email: string

  @Column("nvarchar", { name: "Descr", nullable: false, length: 1000 })
  descr: string

  @Column("int", { name: "Company", nullable: false })
  company: number

  @Column("int", { name: "Authority", nullable: false })
  authority: number

  @Column("bit", { name: "isDeleted", nullable: false })
  isDeleted: boolean

  @Column("nvarchar", { name: "CreateID", nullable: false, length: 200 })
  createID: string

  @Column("datetime", { name: "CreateDtm", nullable: false })
  createDtm: Date

  @Column("nvarchar", { name: "LastUpdateID", nullable: false, length: 200 })
  lastUpdateID: string

  @Column("datetime", { name: "LastUpdateDtm", nullable: false })
  lastUpdateDtm: Date

}