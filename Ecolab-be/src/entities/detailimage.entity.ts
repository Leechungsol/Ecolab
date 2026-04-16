import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("DetailImage", { schema: "dbo" })
export class DetailImageEntity {
  @PrimaryGeneratedColumn({ name: "ImageKey", type: "int" })
  imageKey: number;

  @Column("int", { name: "DetailKey" })
  detailKey: number;

  @Column("image", { name: "Image", nullable: true })
  image: Buffer;

  @Column("nvarchar", { name: "ImageType", length: 10 })
  imageType: string;

  @Column("nvarchar", { name: "CreateID", nullable: true, length: 200 })
  createID: string;

  @Column("datetime", { name: "CreateDtm", nullable: true })
  createDtm: Date;

  @Column("nvarchar", { name: "LastUpdateID", nullable: true, length: 200 })
  lastUpdateID: string;

  @Column("datetime", { name: "LastUpdateDtm", nullable: true })
  lastUpdateDtm: Date;
}