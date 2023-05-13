const products = [];

/**
 * - 제품 단일 Model
 */
module.exports = class Product {
    /** 모든 제품 반환 */
    static fetchAll(){
        return products;
    }

    title;

    constructor( title ) {
        this.title = title;
    }

    save(){
        products.push( this );
    }


}