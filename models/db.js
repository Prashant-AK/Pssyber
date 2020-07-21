const mongoose = require('mongoose');

// Connect Mongoose
mongoose.connect("mongodb://localhost:27017/studeebee", { useNewUrlParser: true, useUnifiedTopology: true },(err)=>{
    if(err) console.log(`Connection Error: ${err}`);
    else console.log('Connected Succesfully');  
});
mongoose.set('useCreateIndex', true);
