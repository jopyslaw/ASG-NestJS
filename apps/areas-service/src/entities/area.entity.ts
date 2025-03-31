import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AreaInfo } from './area-info.entity';
import { FieldInfo } from './field-info.entity';

@Entity()
export class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @CreateDateColumn()
  created_date: Date;

  @Column({
    nullable: true,
  })
  last_update_date: Date;

  @Column({
    nullable: true,
  })
  updated_by: number;

  @Column()
  number_of_fields: number;

  @Column()
  owner_id: number;

  @Column({
    nullable: false,
  })
  coordinates_of_place: string;

  @OneToOne(() => AreaInfo, (area_info) => area_info.area, {
    cascade: true,
  })
  area_info: AreaInfo;

  @OneToMany(() => FieldInfo, (field_info) => field_info.area)
  field_info: FieldInfo[];
}
