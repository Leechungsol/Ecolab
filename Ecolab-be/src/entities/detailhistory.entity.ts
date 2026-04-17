import { Column, Entity, Index } from "typeorm"

@Index("DetailHistory_PK", ["detailKey"], { unique: true })
@Entity("DetailHistory", { schema: "dbo" })
export class DetailHistoryEntity { 
  @Column("int", { name: "HistoryKey", nullable: true })
  historyKey!: number

  @Column("int", { primary: true, name: "DetailKey", nullable: true })
  detailKey!: number

  @Column("nvarchar", { name: "DetailContents", nullable: false, length: 4000 })
  detailContents?: string

  @Column("nvarchar", { name: "CorrectiveAction", nullable: false, length: 4000 })
  correctiveAction?: string

  @Column("nvarchar", { name: "ActionContents", nullable: false, length: 4000 })
  actionContents?: string

  @Column("bit", { name: "isDeleted", nullable: false })
  isDeleted!: boolean

  @Column("int", { name: "KeywordKey", nullable: true })
  keywordKey?: number

  @Column("int", { name: "ListKey", nullable: true })
  listKey?: number

}