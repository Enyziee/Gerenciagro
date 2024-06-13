import { PrimaryGeneratedColumn } from "typeorm";

class RefreshToken {
    @PrimaryGeneratedColumn()
    id!: string;
    
    issuedAt!: Date;
    
    expiresAtAt!: Date;
    
    
    
}
