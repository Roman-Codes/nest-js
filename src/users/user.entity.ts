import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AfterInsert, AfterUpdate, AfterRemove } from 'typeorm';

import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

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
