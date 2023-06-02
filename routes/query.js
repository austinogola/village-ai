const router=require('express').Router()
const answerQuery=require('../utils/openai')



router.post('/single',async(req,res)=>{
    let {profile,question,queryType}=req.body

    if(!profile){
        res.status(400).json({message:'missing profile data'})
    }
    if(!queryType){
        if(!question){
            res.status(400).json({message:'missing BOTH user query AND question'})
        }

    }
    

    if(profile && (question || queryType)){
        let profileString=''

        Object.keys(profile).forEach(key=>{
            profileString+=`${key}:${profile[key]}\n\n`
        })

        let gptPrompt=profileString+'\nGiven the information above,'

        if(queryType && singleQueryTypes[queryType]){
            gptPrompt+=singleQueryTypes[queryType]
        }
        else{
            console.log('No/Invalid query type. Resolving to user question');
            gptPrompt+=question
        }
        
        


        let answer=await answerQuery(gptPrompt)

        if(typeof answer === "object"){
            res.status(500).json({message:answer.err})

        }else{
            res.status(200).json({answer})
        }

    }

    
})

router.post('/multi',async(req,res)=>{
    let {profiles,question,queryType}=req.body

    if(!profiles){
        res.status(400).json({message:'missing profiles information'})
    }
    else if(profiles.length<2){
        res.status(400).json({message:`Not enough profiles (${profiles.length})`})
    }
    if(!queryType){
        if(!question){
            res.status(400).json({message:'missing BOTH user query AND question'})
        }

    }

    if(profiles && (question || queryType)){
        let profileString=''

        profiles.forEach(prof=>{
            Object.keys(prof).forEach(key=>{
                profileString+=`${key}:${prof[key]}\n\n`
            })
            profileString+='\n\n'
        })

        let gptPrompt=profileString+'\nGiven the information above,'

        

        if(queryType && multiQueryTypes[queryType]){
            gptPrompt+=multiQueryTypes[queryType]
        }
        else{
            console.log('missing/invalid query type. Resolving to user question');
            gptPrompt+=question
        }
        
        let answer=await answerQuery(gptPrompt)

        if(typeof answer === "object"){
            res.status(500).json({message:answer.err})

        }else{
            res.status(200).json({answer})
        }


    }

    
})

const singleQueryTypes={
    'salary':'Make an estimate of the expected salary range of this person based on their most recent employer and the location of employment',
    'age':'People usually begin higher education aged 17-19 . Also people can only be employed after they turn 18.Based on the years this person attended schoolor started employment. Make an estimate of their age',
    'personality':"Based on this person's career history and trajectory, what is their personality type?I know it’s hard to predict, but make an educated guess",
    'summary':"Summarize this person's bio for a conference event into no more than 4 lines that explain their most recent role and the biggest accomplishments throughout their career. Start with a short catchy headline",
    'career accomplishments':'Summarize the major career jumps that this person did in their lives',
    'savings':"Based on the average age at each position, location of each position, average cost of living & savings at each position, duration of each position, company growth during that period, and amount saved during each position, estimate the total savings they've kept throughout their career based on the job positions they've held",
    'draft email':'Draft a cold email I can use to initiate communication with this person'
}

const multiQueryTypes={
    'compare':'What are the differences in career path between these two people?',
    'icebreakers':' What are similarities or ice breakers that could be used on a call between these two people?',
    'approach':"Based on this person's career history and trajectory, what is their personality type?",
}

module.exports=router