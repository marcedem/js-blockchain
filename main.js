// Importing SHA256 for creating the hash function of each block
const SHA256 = require('crypto-js/sha256');

// The block class 
class Block{

    /**
     *  Each block will have the following parameters
     * @param {*index} index shows where the block seats on the chain
     * @param {*timestamp} timestamp when the block was created
     * @param {*data} data include any type of data that we want to include in the block
     *        : In case of a currency, we might want to include informations like, the sender, the receiver, the amount that is transfered
     * @param {*previousHash} previousHash a string that contains the hash of the block before the current one
     */
    constructor(index, timestamp, data, previousHash=''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;

        // we add the hash property
        this.hash = this.calculateHash();
    }

    /**
     *  This method is responsible to calculate the hash of the block
     *  It takes the property of the block and run them trough a hash to generate a result
     *  We will use SHA256 for this, by importing it via crypto-js library, since it is not natively present in Javascript
     */
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

// The blockchain class
class Blockchain{

    // responsible of initializing our chain
    constructor(){
        // array of blocks 
        this.chain = [this.createGenesisBlock()];
    }

    // first block is added manually, which is called genesis block
    createGenesisBlock(){
        return new Block(0, "01/01/2017", "Genesis block", "0");
    }

    // Helps methods
    // return the latest block
    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    // add a new block
    addBlock(newBlock){
        // Set the previousHash to be the latest block on our chain
        newBlock.previousHash = this.getLatestBlock().hash;

        // generate a new hash for our new block
        newBlock.hash = newBlock.calculateHash();

        // Now we add the newblock to the chain
        this.chain.push(newBlock);
    }

    // We need to add some strategy to make sure our chain is valid
    isChainValid(){
        // we loop through our chain, starting from the second block, since genesis block is the original one manually created
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            const tempBlock = currentBlock.calculateHash();
            
            // check is the blocks are properly linked and if the hash is still correct
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            // check if the block point to the correct previous block
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }

            if(currentBlock === this.getLatestBlock() && currentBlock.calculateHash() === this.getLatestBlock().hash){
                console.log("LAST BLOCKW");
            }

            console.log('>>>Block'+i +': ' +this.chain[i].hash);
            console.log(JSON.stringify(this.chain[i], null, 4));
        }

        // We return true if everything is correct
        return true;
    }

}

// Let's create some marcedemCoin to test our new blockchain
let marcedemCoin = new Blockchain();
marcedemCoin.addBlock(new Block(1, "03/02/2017", {amount: 4, sender: 'john', receiver: 'alphonse'}));
marcedemCoin.addBlock(new Block(2, "04/03/2017", {amount: 12, sender: 'Marcus', receiver: 'Doe Man'}));
marcedemCoin.addBlock(new Block(3, "05/06/2017", {amount: 8, sender: 'John', receiver: 'Mora'}));

// checking integrity of the blockchain
console.log('Is blockchain valid? ' + marcedemCoin.isChainValid()+'\n\n');

// Let's try to tamper our block by overriding a block data
console.log('\n::::: We are going to tamper the block and see the outcome');
marcedemCoin.chain[3].data = {amount: 14, sender: 'john', receiver: 'alphonse', location: 'Vienn'};
marcedemCoin.chain[3].hash = marcedemCoin.chain[3].calculateHash();

console.log('Is blockchain valid? ' + marcedemCoin.isChainValid());

// console.log(JSON.stringify(marcedemCoin, null, 4));



