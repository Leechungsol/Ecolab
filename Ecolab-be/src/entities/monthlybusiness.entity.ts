import { Column, Entity, Index } from "typeorm"

@Index("MonthlyBusiness_PK", ["mbusiKey"], { unique: true })
@Entity("MonthlyBusiness", { schema: "dbo" })
export class MonthlyBusinessEntity { 
  @Column("int", { primary: true, name: "MbusiKey", nullable: true })
  mbusiKey!: number

  @Column("int", { name: "BusiKey", nullable: true })
  busiKey!: number

  @Column("nvarchar", { name: "CheckYm", nullable: false, length: 40 })
  checkYm!: string

  @Column("bit", { name: "isCheck", nullable: false })
  isCheck!: boolean

  @Column("bit", { name: "isScore", nullable: false })
  isScore!: boolean

  @Column("nvarchar", { name: "Manager", nullable: false, length: 200 })
  manager?: string

  @Column("nvarchar", { name: "Descr", nullable: false, length: 1000 })
  descr?: string

  @Column("nvarchar", { name: "CreateID", nullable: false, length: 200 })
  createID!: string

  @Column("datetime", { name: "CreateDtm", nullable: false })
  createDtm!: Date

  @Column("nvarchar", { name: "LastUpdateID", nullable: false, length: 200 })
  lastUpdateID!: string

  @Column("datetime", { name: "LastUpdateDtm", nullable: false })
  lastUpdateDtm!: Date

  @Column("datetime", { name: "CheckPlanDtm", nullable: false })
  checkPlanDtm?: Date

}