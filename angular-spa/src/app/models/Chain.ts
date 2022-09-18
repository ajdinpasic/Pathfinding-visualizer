export class Chain {
     public chainItems: any;

    constructor() {
        this.chainItems = [];
    }

    addElementToChain(item:any) {
        this.chainItems.push(item);
    }
    removeElementFromChain() {
        if (this.isChainEmpty())
            return;
        return this.chainItems.shift();
    }
    returnFirst() {
        if (this.isChainEmpty())
            return;
        return this.chainItems[0];
    }
    isChainEmpty() {
        return this.chainItems.length == 0;
    }
}