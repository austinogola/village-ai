const router=require('express').Router()
const answerQuery=require('../utils/openai')

// 2.0
let objectOrder=['Person','Headline','Work-Experience','Education','Skills','Volunteering']

router.post('/single',async(req,res)=>{
    let {profile,question,queryType,me}=req.body

    if(profile){
        if(typeof profile==='object'){
            if(!queryType){
                if(!question){
                    res.status(400).json({message:"missing BOTH 'queryType' AND 'question' in request body"})
                }
        
            }
            if(profile && (question || queryType)){
                let profileCopy=Object.create(profile)
                let profileString=''
                objectOrder.forEach(item=>{
                    if(profileCopy[item]){
                        if(item=='Work-Experience' || item=='Education' || item=='Skills' || item=='Volunteering'){
                            profileString+=`${item}:\n${profileCopy[item]}\n`
                        }
                        else{
                            profileString+=`${item}:${profileCopy[item]}\n`
                        }
                        
                        delete profileCopy[item]
                    }
                })
                Object.keys(profileCopy).forEach(key=>{
                    profileString+=`${key}:${profileCopy[key]}\n`
                })

                if(me){
                   profileString+='\nMe:\n'
                    Object.keys(me).forEach(key=>{
                        profileString+=`${key}:${me[key]}\n`
                    }) 
                }
                
        
                let gptPrompt=profileString+'\nGiven the information above,'

        
                if(queryType && singleQueryTypes[queryType]){
                    gptPrompt+=singleQueryTypes[queryType]
                }
                else{
                    if(!question){
                        res.status(400).json({message:"Invalid 'queryType' value AND missing 'question'"})
                        return
                    }else{
                        gptPrompt+=question
                    }
                    
                }

        
                let answer=await answerQuery(gptPrompt)
        
                if(typeof answer === "object"){
                    res.status(500).json({message:answer.err,markdown:gptPrompt})
        
                }else{
                    res.status(200).json({answer,markdown:gptPrompt})
                }
        
            }
        }
        else{
            res.status(400).json({message:'invalid format for profile data'})
        }

    }
    else{
        res.status(400).json({message:'missing profile data'})
    }


    
})

router.post('/multi',async(req,res)=>{
    let {profiles,question,queryType,me}=req.body

    if(profiles){
        if(Array.isArray(profiles)){
            if(profiles.length<2){
                res.status(400).json({message:`Not enough profiles (${profiles.length})`})
            }
            if(!queryType){
                if(!question){
                    res.status(400).json({message:'missing BOTH user query AND question'})
                }
        
            }

            if(profiles && (question || queryType)){
                let profileString=''
                profiles.forEach((prof,index)=>{
                    let profileCopy=Object.create(prof)
                    profileString+=`${index+1}.\n`
                    objectOrder.forEach(item=>{
                        if(profileCopy[item]){
                            if(item=='Work-Experience' || item=='Education' || item=='Skills' || item=='Volunteering'){
                                profileString+=`${item}:\n${profileCopy[item]}\n`
                            }
                            else{
                                profileString+=`${item}:${profileCopy[item]}\n`
                            }
                            
                            delete profileCopy[item]
                        }
                    })
                    Object.keys(profileCopy).forEach(key=>{
                        profileString+=`${key}:${profileCopy[key]}\n\n`
                    })
                    profileString+='\n\n'
                })

                if(me){
                   profileString+='\nMe\n'
                    Object.keys(me).forEach(key=>{
                        profileString+=`${key}:${me[key]}\n`
                    }) 
                }

        
                let gptPrompt=profileString+'\nGiven the information above,'


        
                
        
                if(queryType && multiQueryTypes[queryType]){
                    gptPrompt+=multiQueryTypes[queryType]
                    // console.log(gptPrompt);
                }
                else{
                    gptPrompt+=question
                }


                
                let answer=await answerQuery(gptPrompt)
        
                if(typeof answer === "object"){
                    res.status(500).json({message:answer.err,markdown:gptPrompt})
        
                }else{
                    res.status(200).json({answer,markdown:gptPrompt})
                }
        
        
            }

        }
        else{
            res.status(400).json({message:'Invalid format for profiles data'})
        }
        

    }
    else{
        res.status(400).json({message:'missing profiles data'})
    }

    
})

const singleQueryTypes={
    'salary':'make an estimate of the expected salary range of this person based on their most recent employer and the location of employment',
    'age':'people usually begin higher education aged 17-19 . Also people can only be employed after they turn 18. Based on the years this person attended schoolor started employment. Make an estimate of their age',
    'personality':"based on this person's career history and trajectory, what is their personality type?I know it’s hard to predict, but make an educated guess",
    'summary':"summarize this person's bio for a conference event into no more than 4 lines that explain their most recent role and the biggest accomplishments throughout their career. Start with a short catchy headline",
    'career accomplishments':'Summarize the major career jumps that this person did in their lives',
    'savings':"based on the average age at each position, location of each position, average cost of living & savings at each position, duration of each position, company growth during that period, and amount saved during each position, estimate the total savings they've kept throughout their career based on the job positions they've held",
    'draft email':'draft a cold email I can use to initiate communication with this person',
    'icebreakers':'what are some similarities or icebreakers that the second person could use to initiate communication with the first?',
    'compare':'what are the differences in career path between these people?',
}

const multiQueryTypes={
    'compare':'what are the differences in career path between these two people?',
    'icebreakers':' what are similarities or ice breakers that could be used to inititate communication between these two people?',
    'approach':"based on this person's career history and trajectory, what is their personality type?",
}

module.exports=router