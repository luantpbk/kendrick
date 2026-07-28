export abstract class BaseEntity {
    public deleteFlg?: number;
    public createdAt?: Date;
    public createdBy?: string;
    public updatedAt?: Date;
    public updatedBy?: string;
    public displayOrder?: number;

    /**
     * Sets createdAt before insert (conceptually, for ORM)
     */
    public setCreationDate(): void {
        this.createdAt = new Date();
    }

    /**
     * Sets updatedAt before update (conceptually, for ORM)
     */
    public setChangeDate(): void {
        this.updatedAt = new Date();
    }
}
