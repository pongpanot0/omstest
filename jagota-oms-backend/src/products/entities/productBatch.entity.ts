import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('PRODUCT_BATCHES')
export class ProductBatch {
    // ... อื่นๆ
    @PrimaryGeneratedColumn({ name: 'BATCH_ID' })
    BATCH_ID:number

    @Column({ name: 'PRODUCT_ID' }) // ต้องตรงกับ DB
    productId: number;

    @Column({ name: 'PO_ID' })
    poId: string;



    @Column({ name: 'EXPIRY_DATE', type: 'timestamp' })
    expiryDate: Date;

    @Column({ name: 'REMAINING_QTY' })
    remainingQty: number;

      @Column({ name: 'RECEIVE_QTY' })
    RECEIVE_QTY: number;
    

    @Column({ name: 'RECEIVED_AT', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    receivedAt: Date;
}