const parse = require('csv-parse')

module.exports = {
  parseCsvString: (text) => new Promise((resolve,reject)=>{
    parse(text, {columns:true, trim:true}, (err,records)=> err? reject(err): resolve(records))
  })
}
