var Block = require('./Block');
const crypto = require('crypto');
var fs = require("fs");

const difficulty = 5;
var blockchain = [];
function genesisBlock() {
    var geneBlock = new Block(0, new Date().toLocaleString(), "", "", "", 0, difficulty);
    geneBlock.hash = String(BlockHash(geneBlock));
    return geneBlock;
}
function BlockHash(block) {
    var re = String(block.index) + String(block.TimeStamp) + block.Data + block.Prehash +
        String(block.nonce) + String(block.difficulty);

    var sha256 = crypto.createHash('sha256');
    sha256.update(re);
    hashed = sha256.digest('hex');
    return hashed;
}

function isBlockValid(block) {
    var prefix = "";
    for (var i = 0; i < block.difficulty; i++) {
        prefix += '0';
    }
    return block.hash.slice(0, block.difficulty) == prefix;
}

//创建新区块 pow挖矿
function createNewBlock(lastBlock, data) {
    var newBlock = new Block(lastBlock.index + 1, new Date().toLocaleString(), data, "", lastBlock.hash, 0, difficulty);
    //开挖-当前区块的hash值的前面的0的个数与难度系数值相同
    while (1) {
        //计算hash
        var cuhash = BlockHash(newBlock);
        if (newBlock.nonce % 10000 == 0) {
            console.log("挖矿中", newBlock.nonce);
        }
        newBlock.hash = cuhash;
        if (isBlockValid(newBlock)) {
            //校验区块
            if (verifyBlock(newBlock, lastBlock)) {
                console.log("挖矿成功");
                return newBlock;
            }
        }
        newBlock.nonce++;
    }
}


//校验新的区块是否合法
function verifyBlock(newBlock, lastBlock) {
    if (lastBlock.index + 1 != newBlock.index) {
        return false;
    }
    if (newBlock.preHash != lastBlock.hash) {
        return false;
    }
    return true;

}
function create(){
    var genBlock = genesisBlock();
    blockchain.push(genBlock);
    fs.writeFile("blocks.txt",JSON.stringify(blockchain,"","\t"),function(err){
        if(err) console.log(err);
    });
}
function showAll(){
    return blockchain;
}
function add(data){
    var newBlock=createNewBlock(blockchain[blockchain.length-1], data);
    blockchain.push(newBlock);
    fs.writeFile("blocks.txt",JSON.stringify(blockchain,"","\t"),function(err){
        if(err) console.log(err);
    });
}
function getLength(){
    return blockchain.length;
}
function clean(){
    fs.writeFile("blocks.txt","",function(err){
        if(err) console.log(err);
    });
    blockchain=[];
}
function init(){
    fs.exists("blocks.txt",function(exists) {
        if(!exists){
            fs.writeFile("blocks.txt","",function(err){
                if(err){
                    throw err;
                }
            })
        }
        else{
            fs.readFile("blocks.txt", 'utf-8', (err, data) => {
                if (err) throw err;
                if(data.length>0) blockchain=JSON.parse(data);
            });
        }
      });
}
module.exports={
    showAll:showAll,
    add:add,
    create:create,
    getLength:getLength,
    clean:clean,
    init:init
};