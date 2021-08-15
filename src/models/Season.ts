import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Episode } from "./Episode";

@Entity("season")
export class Season extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "numeric",
  })
  season!: number;

  @Column({
    type: "numeric",
  })
  total_episodes!: number;

  @OneToMany(() => Episode, (episode) => episode.season_id)
  episodes!: Episode[];
}
