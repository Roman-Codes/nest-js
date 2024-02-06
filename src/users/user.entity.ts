import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import { Report } from 'src/reports/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted user ' + this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated user ' + this.id);
  }

  @AfterRemove()
  logDelete() {
    console.log('Deleteed user ' + this.id);
  }
}
