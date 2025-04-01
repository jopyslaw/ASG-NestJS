import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  surname: string;

  @Column({
    unique: true,
    nullable: false,
  })
  user_id: number;
}
