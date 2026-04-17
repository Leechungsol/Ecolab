import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("ViewDetailHistory", { schema: "dbo" })
export class ViewDetailHistoryEntity {
  @Column("int", { name: "CompKey", nullable: true })
  compKey!: number;

  @Column("int", { name: "BusiKey", nullable: true })
  busiKey!: number;

  @Column("nvarchar", { name: "BusiName", nullable: true, length: 200 })
  busiName!: string;

  @Column("nvarchar", { name: "CheckYm", nullable: true, length: 40 })
  checkYm!: string;

  @Column("datetime", { name: "CheckDtm", nullable: true })
  checkDtm!: Date;

  @Column("nvarchar", { name: "BaseYear", nullable: true, length: 10 })
  baseYear!: string;

  @Column("nvarchar", { name: "BaseMonth", nullable: true, length: 10 })
  baseMonth!: string;

  @Column("int", { name: "MbusiKey", nullable: true })
  mbusiKey!: number;

  @Column("int", { name: "HistoryKey", nullable: true })
  historyKey!: number;

  @PrimaryColumn("int", { name: "DetailKey" })
  detailKey!: number;

  @Column("int", { name: "ListKey", nullable: true })
  listKey?: number;

  @Column("nvarchar", { name: "No", nullable: true, length: 100 })
  no?: string;

  @Column("nvarchar", { name: "Type", nullable: true, length: 200 })
  type?: string;

  @Column("nvarchar", { name: "Item", nullable: true, length: 1000 })
  item?: string;

  @Column("bit", { name: "isImportant", nullable: true })
  isImportant?: boolean;

  @Column("nvarchar", { name: "Column1", nullable: true, length: 1000 })
  column1?: string;

  @Column("nvarchar", { name: "DetailContents", nullable: true, length: "max" })
  detailContents?: string;

  @Column("nvarchar", { name: "contents", nullable: true, length: "max" })
  contents?: string;

  @Column("varbinary", { name: "DetailImage", nullable: true })
  detailImage?: Buffer;

  @Column("nvarchar", { name: "CorrectiveAction", nullable: true, length: "max" })
  correctiveAction?: string;

  @Column("nvarchar", { name: "ActionContents", nullable: true, length: "max" })
  actionContents?: string;

  @Column("varbinary", { name: "ActionImage", nullable: true })
  actionImage?: Buffer;

  @Column("int", { name: "KeywordKey", nullable: true })
  keywordKey?: number;

  @Column("bit", { name: "isAction", nullable: true })
  isAction?: boolean;

  @Column("nvarchar", { name: "Manager", nullable: true, length: 200 })
  manager?: string;

  @Column("nvarchar", { name: "SameMonth", nullable: true, length: 200 })
  sameMonth?: string;
}