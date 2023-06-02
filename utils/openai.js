require('dotenv').config()
const OpenAIApi=require("openai").OpenAIApi
const Configuration =require("openai").Configuration

const configuration = new Configuration({
    apiKey:process.env.openApiKey
});

const openai = new OpenAIApi(configuration)


const getAnswer=(gptQuery)=>{
    return new Promise(async (resolve,reject)=>{
        let trial=0
        let succeeded=false

        while(trial<3 && !succeeded){
            try {
                let resp=await openai.createChatCompletion({
                    "model":'gpt-3.5-turbo',
                    "messages":[
                        {
                            "role":"user",
                            "content":gptQuery
                         }
                    ],
                })
                let choices=resp.data.choices
                let answer=choices[0].message.content
                succeeded=true
                resolve(answer);
                
            } catch (error) {
                trial+=1
                if(trial==3){
                    console.log('code',error.code);
                    resolve({err:error.code})
                }
                
            }
        }
        
    })
}

module.exports=getAnswer