import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Season } from "./Season";

@Entity("episode")
export class Episode extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({})
  title!: string;

  @Column()
  location!: string;

  @Column()
  file!: string;

  @ManyToOne(() => Season, (season) => season.episodes)
  @JoinColumn({
    name: "season_id",
  })
  season_id!: Season;
}
