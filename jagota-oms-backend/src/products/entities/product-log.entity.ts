import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

export enum ProductLogAction {
    RECEIVE = 'RECEIVE',
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    CANCEL_RETURN = 'CANCEL_RETURN',
    ADJUST = 'ADJUST',
}

@Entity('PRODUCT_LOGS')
export class ProductLog {
    @PrimaryGeneratedColumn({ name: 'LOG_ID' })
    logId: number;

    @Column({ name: 'PRODUCT_ID' })
    productId: number;

    @Column({
        name: 'ACTION',
        type: 'varchar2',
        length: 20,
    })
    action: ProductLogAction;
    @Column({
        name: 'REASON',
        type: 'varchar2',
        length: 20,
    })
    reason?: string;

    @Column({
        name: 'OLD_VALUE',
        type: 'clob',
        nullable: true,
    })
    oldValue?: string;

    @Column({
        name: 'NEW_VALUE',
        type: 'clob',
        nullable: true,
    })
    newValue?: string;

    @Column({
        name: 'CHANGED_BY',
        type: 'varchar2',
        length: 100,
        nullable: true,
    })
    changedBy?: string;

    @CreateDateColumn({
        name: 'CHANGED_AT',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    changedAt: Date;

    @ManyToOne(() => Product, (product) => product.logs, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'PRODUCT_ID' })
    product: Product;
}