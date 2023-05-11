const { create } = require('../model/model');
let UploadDb = require('../model/model')
let Keywords = require('../model/stringmodel')

// Create new upload
console.log('soft');

exports.create = (req,res)=>{
    let store = req.body
    // Validate request
    const UploadObj =  {imagename:store.imagename,
    filename:store.filename,
    packname:store.packname,
    keywords:store.keywords,
    size:store.size}
    
        
    
    if(!store){
        res.status(400).send({message:"No Upload data"});
        return;
    }
    // New Uploads
    let Upload = new UploadDb(
        UploadObj
    )  
    Upload = [UploadObj]
    //Checking Tenary Operators
    Upload ? console.log('Upload dey') : console.log('Upload no dey');

    // save upload in the database
    Upload
    .save(Upload)
    .then(data=>{
        res.send(data)
    })
    .catch(err=>{
        res.status(500).send({
            message:err.message||"error while saving data"
        })
    })
    
}

exports.create2 = (req,res)=>{
    if (req.files === null){
        return res.status(400).json({msg:"I no see any file oo"})
    };
    const resp = req.data
    res.send(resp)


    const file = req.files.file;
    // const image = req.files.img;
    // const name = store.name  

    // console.log(name);


    file.mv(`${__dirname}/client/public/uploads/${file.name}`,err=>{
        if(err){
            console.error(err);
            return res.status(500).send();

        }
        // res.json({fileName:file.name,filePath:`uploads/${file.name}`})
    })
}

exports.getdata = (req,res)=>{
    if(req.query.id){
        const id = req.query.id;
        UploadDb.findById(id)
        .then(data=>{
            if(!data){
                res.status(404).send({
                    message:'Not found user'
                })
            }else{  
                res.send(data)
            }
        })
        .catch((err: any)=>{
            res.status(500).send({
                message:'Error getting user'
            })
        })

    }else{

        UploadDb.find()
        .then((user: any)=>{
           res.send(user) 
        })
        .catch(err=>{
            res.status(500).send({message:err.message||"Error Ocurred while retreiving data"})
        })
    }
}

exports.update = (req: { body: any; params: { id: any; }; },res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { message?: string; messsage?: string; }): void; new(): any; }; }; send: (arg0: any) => void; })=>{
    let store = req.body
    
    if(!store){
        return res
        .status(400)
        .send({message:"Please specify data"})
    }
     const id = req.params.id;
     UploadDb.findByIdAndUpdate(id,store,{new:true})
     .then(data=>{
        if(!data){
            res.status(404).send({messsage:"cannot update user"})
        }else{
            res.send(data)
        }
     })
     .catch(err=>{
        res.status(500).send({message:"Error updating user"})
     })
}

exports.delete = (req,res) =>
{
    const id = req.params.id;
    UploadDb.findByIdAndDelete(id)
    .then(data=>{
        if(!data){
            res.status(404).send({message:"Cannot find or delete user"})
        }else{
            res.send({
                message:'User deleted Successfully!!'
            })
        }
    })
    .catch(err=>{
        res.status(500).send({
            message:"Could not delete user with id:" + id
        })
    })
}

// const a = 'foo';
const b = 42;
const c = {};

// Shorthand property names
// const o = { a, b, c };
const a = 4;
!a ? console.log('softwork') : console.log('hardwork');

// In other words,
// console.log(o.a !== { a }.a); // true
let may:any
let julius:string
let justina:number
