import { Column, Entity, Index } from "typeorm"

@Index("Business_PK", ["busiKey"], { unique: true })
@Entity("Business", { schema: "dbo" })
export class BusinessEntity { 
  @Column("int", { name: "CompKey", nullable: true })
  compKey!: number

  @Column("int", { primary: true, name: "BusiKey", nullable: true })
  busiKey!: number

  @Column("nvarchar", { name: "BusiName", nullable: false, length: 200 })
  busiName?: string

  @Column("nvarchar", { name: "Address", nullable: false, length: 200 })
  address?: string

  @Column("nvarchar", { name: "ReportNumber", nullable: false, length: 1000 })
  reportNumber!: string

  @Column("nvarchar", { name: "CorporateName", nullable: false, length: 1000 })
  corporateName?: string

  @Column("nvarchar", { name: "FullName", nullable: false, length: 1000 })
  fullName?: string

  @Column("nvarchar", { name: "Representative", nullable: false, length: 200 })
  representative?: string

  @Column("nvarchar", { name: "Area", nullable: false, length: 400 })
  area?: string

  @Column("nvarchar", { name: "BusinessType", nullable: false, length: 400 })
  businessType?: string

  @Column("nvarchar", { name: "Class", nullable: false, length: 200 })
  class?: string

  @Column("nvarchar", { name: "Delivery", nullable: false, length: 200 })
  delivery?: string

  @Column("nvarchar", { name: "Manager", nullable: false, length: 200 })
  manager?: string

  @Column("nvarchar", { name: "Email", nullable: false, length: 1000 })
  email?: string

  @Column("int", { name: "Status", nullable: false })
  status?: number

  @Column("bit", { name: "isDeleted", nullable: false })
  isDeleted!: boolean

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

  @Column("nvarchar", { name: "TrainComplete", nullable: false, length: 200 })
  trainComplete?: string

  @Column("datetime", { name: "TrainCompleteDtm", nullable: false })
  trainCompleteDtm?: Date

  @Column("datetime", { name: "InDtm", nullable: false })
  inDtm?: Date

  @Column("datetime", { name: "OutDtm", nullable: false })
  outDtm?: Date

  @Column("nvarchar", { name: "PetAllow", nullable: false, length: 200 })
  petAllow?: string

  @Column("nvarchar", { name: "Complete", nullable: false, length: 200 })
  complete?: string

  @Column("nvarchar", { name: "TrainTime", nullable: false, length: 200 })
  trainTime?: string

  @Column("nvarchar", { name: "TrainLocation", nullable: false, length: 200 })
  trainLocation?: string

  @Column("datetime", { name: "SafeFoodStartDtm", nullable: false })
  safeFoodStartDtm?: Date

  @Column("datetime", { name: "SafeFoodEndDtm", nullable: false })
  safeFoodEndDtm?: Date

}