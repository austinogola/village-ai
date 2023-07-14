const router=require('express').Router()
const answerQuery=require('../utils/openai')
const fs = require('fs');
// const editJsonFile = require("edit-json-file");
const jsonFile=require('./queries.json')

// 2.0
let objectOrder=['Person','Headline','Work-Experience','Education','Skills','Volunteering']




const numberToMonth=jsonFile.numberToMonth
const singleQueryTypes=jsonFile.singleQueryTypes
const multiQueryTypes=jsonFile.multiQueryTypes

const stringEducation=(arr)=>{
    let num=1
    let educationString='Education History\n'
    arr.forEach(educationObj=>{
        let startDate
        let endDate

        if(educationObj.date_from){
            startDate=Object.values(educationObj.date_from)[0]
            if(educationObj.date_from.month && educationObj.date_from.year){
                startDate=`${numberToMonth[educationObj.date_from.month]} ${educationObj.date_from.year}`
            }
        }
        else{
            startDate=''
        }

        if(educationObj.date_to){
            endDate=Object.values(educationObj.date_to)[0]
            if(educationObj.date_to.month && educationObj.date_to.year){
                endDate=`${numberToMonth[educationObj.date_to.month]} ${educationObj.date_to.year}`
            }
        }
        else{
            endDate=''
        }
        
        educationString+=`${num}.${educationObj.field_of_study},${educationObj.major_program_certificate}-${educationObj.school_name}(${startDate}-${endDate || 'present'})\n`
        educationString=educationString.replaceAll('undefined','')
        educationString=educationString.replaceAll('null','present')
        num+=1
    })
    educationString+='\n'

    return educationString
}

const stringJobs=(arr)=>{
    let num=1
    let jobString=''
    arr.forEach(jobObj=>{
        let startDate
        let endDate
        if(jobObj.date_from){
            startDate=Object.values(jobObj.date_from)[0]
            if(jobObj.date_from.month && jobObj.date_from.year){
                startDate=`${numberToMonth[jobObj.date_from.month]} ${jobObj.date_from.year}`
            }
        }

        if(jobObj.date_to){
            endDate=Object.values(jobObj.date_to)[0]
            if(jobObj.date_to.month && jobObj.date_to.year){
                endDate=`${numberToMonth[jobObj.date_to.month]} ${jobObj.date_to.year}`
            }
        }
        
        jobString+=`${num}.${jobObj.position}-${jobObj.company_name}(${startDate}-${endDate || 'present'})\n`
        jobString=jobString.replaceAll('undefined','')
        jobString=jobString.replaceAll('null','')
        num+=1
    })
    jobString+='\n'

    return jobString
}

const stringSkills=(arr)=>{
    let num=1
    let skillString='Skills\n'
    arr.forEach(skill=>{
        skillString+=`${num}.${skill.name}\n`
        num+=1
    })
    skillString+='\n'

    return skillString
}

const arrangeProfileData=(profile)=>{
    let profileCopy={}
    profileCopy['Education history']=profile.education_history
    profileCopy['Job history']=profile.job_history
    profileCopy['Certifications']=profile.certifications
    profileCopy['Skills']=profile.skills
    profileCopy['Headline']=profile.headline
    profileCopy['Location']=profile.location?profile.location:profile.country

    let profileString='1.\n'


    profileString+=`Person:${profile.firstname} ${profile.lastname}\n\n`
    profileString+=`Headline:${profileCopy['Headline']}\n\n`

    profileString+=stringEducation(profileCopy['Education history'])
    profileString+=stringJobs(profileCopy['Job history'])
    profileString+=stringSkills(profileCopy['Skills'])
    profileString+=`Location:${profileCopy['Location']}\n\n`

    return profileString
}


router.post('/single',async(req,res)=>{
    let {profile,question,queryType}=req.body



    if(profile && typeof profile==='object'){

        let profileString=arrangeProfileData(profile)
        let gptPrompt=profileString+'\nGiven the information above,'
        
        
        if(question){
            gptPrompt+=question

            if(queryType){
                singleQueryTypes[queryType]==question

            }

            let answer=await answerQuery(gptPrompt)
    
            if(typeof answer === "object"){
                res.status(500).json({message:answer.err,markdown:gptPrompt})
    
            }else{
                res.status(200).json({answer,markdown:gptPrompt})
            }
        }else{
            if(queryType){
                if(singleQueryTypes[queryType]){
                    gptPrompt+=singleQueryTypes[queryType]

                    let answer=await answerQuery(gptPrompt)
    
                    if(typeof answer === "object"){
                        res.status(500).json({message:answer.err,markdown:gptPrompt})
            
                    }else{
                        res.status(200).json({answer,markdown:gptPrompt})
                    }
                }
                else{
                    res.status(400).json({message:"missing question and valid queryType"})
                    return
                    
                }
            }
        }
        // else{
        //     res.status(400).json({message:'invalid format for profile data'})
        // }

    }
    else{
        res.status(400).json({message:'missing profile data'})
    }


    
})

router.post('/multi',async(req,res)=>{
    let {profile,question,queryType}=req.body


    if(profile){
        if(Array.isArray(profile)){
            if(profile.length<2){
                res.status(400).json({message:`Not enough profiles (${profiles.length})`})
            }
            else{

                let profile1=profile[0]
                let profile2=profile[1]

                let profileString1=arrangeProfileData(profile1)
                let profileString2=arrangeProfileData(profile2)
                let gptPrompt=profileString1+profileString2+"the second profile is me\n"+'\nGiven the information above,'

                if(question){
                    gptPrompt+=question

                    if(queryType){
                        multiQueryTypes[queryType]==question
                    }


                let answer=await answerQuery(gptPrompt)
        
                if(typeof answer === "object"){
                    res.status(500).json({message:answer.err,markdown:gptPrompt})
        
                }else{
                    res.status(200).json({answer,markdown:gptPrompt})
                }
            }else{
                if(queryType){
                    if(multiQueryTypes[queryType]){
                        gptPrompt+=multiQueryTypes[queryType]

                        let answer=await answerQuery(gptPrompt)
        
                        if(typeof answer === "object"){
                            res.status(500).json({message:answer.err,markdown:gptPrompt})
                
                        }else{
                            res.status(200).json({answer,markdown:gptPrompt})
                        }
                    }
                    else{
                        res.status(400).json({message:"missing question and valid queryType"})
                        return
                        
                    }
                }
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


module.exports=router