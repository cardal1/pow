//block.js
class Block {
    constructor(index, timeStamp, data, hash, preHash, nonce, difficulty) {
        this.index = index// 区块高度
        this.timeStamp = timeStamp;
        this.data = data;//交易记录
        this.hash = hash;
        this.preHash = preHash;
        this.nonce = nonce;
        this.difficulty = difficulty//难度系数
    }
};
module.exports = Block;