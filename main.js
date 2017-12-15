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

    // var newArray = oldArray.slice();
    
    constructor(){
        // array of blocks initialized with the genesis block
        this.chain = [this.createGenesisBlock()];

        // we create a new integrity block, initialized with the genesis block
        this.integrityChain = [this.createGenesisBlock().calculateHash()];
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

        // for every new block, we push a new integrityHash to the integrityChain
        this.integrityChain.push(this.createIntegrityHash(newBlock));
      
    }

    // this function is the key assurance to our block integrity.
    // with the newblock or currentblock, we create a new hash,
    // but concatenating its hash and its previousHash.
    // This assure us that, whenever a block has been changed, 
    // all the previous has to be changed as well, if not the blockchain
    // will not be invalid.
    // Or in other words, it makes it impossible to change any content of any block

    createIntegrityHash(newBlock){
        const integrityHash = newBlock.previousHash + newBlock.hash;
        return SHA256(integrityHash).toString();                
    }


    // We need to make sure our chain is valid by comparing the integrityChain with the main chain
    // to proceed: we loop through the main chain
    // then for every iteration we create a new hash into the integrityChain 
    // by using the "createIntegrityHash" function
    // then we compare with the integrityChain to see if the current new hash is present
    // if the hash is not present, the integritycheck (boolean) will be false, then we are 
    // sure that the block has been tampered

    checkBlockIntegrity(){

        // boolean value to check if the chain has been tampered or not
        var integrityCheck = false;

        // we loop through our chain, starting from the second block, 
        // since genesis block is the original one manually created
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];

            // we verify if the integrityChain contains the same hash values,
            // as the integrityHash of the currentBlock in the main chain
            integrityCheck = this.integrityChain.includes(this.createIntegrityHash(currentBlock));
        } 
        return integrityCheck;  
    }

}

// Let's create some marcedemCoin to test our new blockchain
let marcedemCoin = new Blockchain();
marcedemCoin.addBlock(new Block(1, "03/02/2017", {amount: 4, sender: 'john', receiver: 'alphonse'}));
marcedemCoin.addBlock(new Block(2, "04/03/2017", {amount: 12, sender: 'Marcus', receiver: 'Doe Man'}));
marcedemCoin.addBlock(new Block(3, "05/06/2017", {amount: 8, sender: 'John', receiver: 'Mora'}));

// checking integrity of the blockchain
console.log('Is blockchain valid? ' + marcedemCoin.checkBlockIntegrity()+'\n\n');

// Let's try to tamper our block by overriding a block data
console.log('\n::::: We are going to tamper the block and see the outcome');
marcedemCoin.chain[3].data = {amount: 8, sender: 'John', receiver: 'Mora'};
marcedemCoin.chain[3].hash = marcedemCoin.chain[3].calculateHash();

console.log('Is blockchain valid again? ' + marcedemCoin.checkBlockIntegrity());

console.log(JSON.stringify(marcedemCoin, null, 4));



