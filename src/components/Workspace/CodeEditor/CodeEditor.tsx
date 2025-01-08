import React, { useEffect, useState } from 'react';
import EditorNav from './EditorNav/EditorNav';
import Split from 'react-split';

import Editor from "@monaco-editor/react";

// import CodeMirror from '@uiw/react-codemirror'
// import { tokyoNightStorm } from '@uiw/codemirror-theme-tokyo-night-storm';

import EditorFooter from './EditorFooter';
import { Problem } from '@/utils/types/problem';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import { auth, firestore } from '@/firebase/firebase';
import { useRouter } from 'next/router';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import Axios , {AxiosResponse, AxiosError} from 'axios';
import axios from 'axios';

type CodeEditorProps = {
    problem:Problem;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};

const CodeEditor:React.FC<CodeEditorProps> = ({problem, setSuccess, setSolved}) => {
    const boilerPlateCPP = `#include <bits/stdc++.h>

using namespace std;

int main() {
    return 0;
}`
const boilerPlatePython = ``;
const boilerPlateJava = `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) {

    }
}`;
    const languageMap = {
        "cpp": 54,
        "java": 62,
        "python": 71,
    }

    const [loading,setLoading] = useState(false);
    const [userCode, setUserCode] = useState("//some comment");
    const [userLang, setUserLang] = useState("cpp");
    const [testResults, setTestResults] = useState<any[]>([]);
    const [verdict, setVerdict] = useState("");
    const [userTheme, setUserTheme] = useState("vs-dark");
    const [fontSize, setFontSize] = useState(16);
    const numTestCases = problem.inputs.length;
    let boilerPlate;

    const editorOptions = {
        fontSize: fontSize
    }

    const [user] = useAuthState(auth);
    
    const {query: {pid}} = useRouter();
    
    function base64ToUnicode(base64String: string): string {
        // Decode Base64 into a byte array
        const binaryString = atob(base64String);
        const binaryLength = binaryString.length;
        const bytes = new Uint8Array(binaryLength);
      
        for (let i = 0; i < binaryLength; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
      
        // Decode the byte array into a Unicode string
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
    }

    function unicodeToBase64(utf8String: string): string {
        // Convert the UTF-8 string to a byte array
        const encoder = new TextEncoder();
        const byteArray = encoder.encode(utf8String);
      
        // Convert the byte array to a binary string
        let binaryString = '';
        byteArray.forEach((byte) => {
          binaryString += String.fromCharCode(byte);
        });
      
        // Encode the binary string as Base64
        return btoa(binaryString);
    }
    
    const sendSubmission = async () =>{
        const language_id = languageMap[userLang as keyof typeof languageMap]
        let options = {
            submissions:problem.inputs.map((input,index) =>({
                language_id: language_id,
                source_code: unicodeToBase64(userCode),
                stdin: unicodeToBase64(input),
                expected_output: unicodeToBase64(problem.outputs[index]),
            }))
        }
        // console.log("Options:")
        // console.log(options);
        return await Axios.post(`https://nhscc.dsoft.pro/submissions/batch?base64_encoded=true`, options)
    }
    const getOutput = async (tokens:any)=>{
        let url = `https://nhscc.dsoft.pro/submissions/batch?tokens=`;
        url += tokens.data[0].token
        for(let i = 1; i < numTestCases; i++){
            url += (","+tokens.data[i].token)
        }
        url+="&base64_encoded=true&fields=*"
        const res = await axios.get(url);
        setTestResults(res.data.submissions);
        if(res.data.submissions.some((submission:any) => submission.status.id <= 2)){
            return await getOutput(tokens);
        }
        return res;
    }

    const handleSubmit = async () => {
        setLoading(true);
        setTestResults([{output: {output:"ERROR"}}])
        // setLoading(true);
        if(!user){
            toast.error("Please login to submit your code", {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });
            setLoading(false);
            return;
        }
        if(userCode === ""){
            setVerdict("CE");
            setTestResults([{output: {output:"You must input some code to submit"}}])
            setLoading(false);
            return;
        }
        try{
            // Post request to compile endpoint  
            const tokens = await sendSubmission();
            // console.log(tokens);
            if(tokens){
                setLoading(false);
                setVerdict("Processing");
                const _res = await getOutput(tokens);
                const results = _res.data.submissions;
                console.log("Results: ")
                console.log(results);
                setTestResults(results);
                
                //full ac
                if(results.every((submission:any)=>submission.status_id===3)){
                    setVerdict("AC");
                    const userRef = doc(firestore, "users", user.uid);
                    await updateDoc(userRef, {
                        solvedProblems: arrayUnion(pid),
                    });
                    setSolved(true);
                    setSuccess(true);
					setTimeout(() => {
						setSuccess(false);
					}, 4000);
                }

                //at least 1 WA so not pass
                if(results.some((submission:any)=>(submission.status_id===4 || submission.status_id===5 || submission.status_id>=7))){
                    setVerdict("WA");
                }

                //at least 1 is CE (so all are CE)
                if(results.some((submission:any)=>submission.status_id===6)){
                    setVerdict("CE");
                }                
            }
        }catch(err){
            setVerdict("CE");
            console.error(err);
        }finally{
            setLoading(false);
        }
        
        
    }
    
    useEffect(()=>{
        const fetchUserLanguage = async () => {
            if (user) {
                try {
                    const userRef = doc(firestore, "users", user.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const { language } = userSnap.data();
                        setUserLang(language || "cpp");
                       
                    }
                } catch (err) {
                    console.error("Error fetching user language:", err);
                }
            }
        };
        fetchUserLanguage();
    },[user])
    useEffect(()=>{
        const code=localStorage.getItem(`code-${pid}`);
        if(user){
            setUserCode(code?JSON.parse(code):boilerPlateCPP);
        }else{
            setUserCode(boilerPlateCPP);
        }
    },[pid,user])

    const onChange = (value:string|undefined) =>{
        if(value){
            setUserCode(value);
        }
        localStorage.setItem(`code-${pid}`, JSON.stringify(value))
    }

    const handleReset = async () =>{
        if(userLang === "cpp"){
            setUserCode(boilerPlateCPP); 
        }else if(userLang === "java"){
            setUserCode(boilerPlateJava);
        }else if(userLang === "python"){
            setUserCode(boilerPlatePython)
        }
    }

    return (
        // issue with email appearing under is because of something here i think?! 
        // changing z to negative 10 makes it so u can see it, but then you cant click anything
        <div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>
            <EditorNav setUserLang={setUserLang} userLang={userLang} handleReset={handleReset}/>
            <Split className='h-[calc(100vh-96px)]' direction='vertical' sizes={[60,40]} minSize={60}>
                <div className="w-full overflow-y-hidden">
                    <Editor
                         options={editorOptions}
                        //  height="calc(100vh - 50px)"
                        //  width="100%"
                         theme={userTheme}
                         language={userLang}
                         defaultValue={boilerPlate}
                         value={userCode}
                         onChange={onChange}
                         loading={
                            <div className='flex justify-center align-middle pt-[10vh]'>
                            <svg className="spinner" viewBox="25 25 50 50">
                            <circle r="20" cy="50" cx="50"></circle>
                            </svg>
                            </div>
                        }
                    />
                        
                </div>
                <div className='w-full px-5 overflow-auto'>
                    <div className='font-semibold my-4 text-white'>
                            <div className='fixed text-md font-medium leading-5 text-white bg-[#1f1f1f] rounded-lg px-4 py-2'>Submission Results</div>
                        
                            <div className='pt-10'>
                                {loading && (
                                    <div className='flex justify-center align-middle pt-[10vh]'>
                                    <svg className="spinner" viewBox="25 25 50 50">
                                    <circle r="20" cy="50" cx="50"></circle>
                                    </svg>
                                    </div>
                                    )    
                                }  

                                {(!loading && (verdict === "AC" || verdict === "WA" || verdict === "Processing"))  && (
                                        testResults.map((result,index) => {
                                            let status;
                                            switch(result.status_id){
                                                case 1: 
                                                    status = "In Queue";
                                                    break;
                                                case 2:
                                                    status = "Processing";
                                                    break;
                                                case 3:
                                                    status = "AC";
                                                    break;
                                                case 4:
                                                    status = "WA";
                                                    break;
                                                case 5:
                                                    status = "TLE";
                                                    break;
                                                case 6:
                                                    status = "CE";
                                                    break;
                                                case 7:
                                                    status = "RTE";
                                                    break;
                                                case 8:
                                                    status = "RTE";
                                                    break;
                                                case 9:
                                                    status = "RTE";
                                                    break;
                                                case 10:
                                                    status = "RTE";
                                                    break;
                                                case 11:
                                                    status = "RTE";
                                                    break;
                                                case 12:
                                                    status = "RTE"
                                                    break;
                                                case 13:
                                                    status = "IE";
                                                    break;
                                                case 14:
                                                    status = "EFE";
                                                    break;
                                                default:
                                                    status = "ERROR"
                                            }

                                            let caseClass = "text-white";  // default case
                                            if (status === "AC") {
                                                caseClass = "text-green-500";
                                            } else if (status === "WA") {
                                                caseClass = "text-red-500";
                                            } else if (status === "CE") {
                                                caseClass = "text-stone-300";
                                            }else if (status === "RTE"){
                                                caseClass = "text-orange-800";
                                            }else if(status === "In Queue" || status === "Processing"){
                                                caseClass = "text-white";
                                            }else{
                                                caseClass = "text-rose-950";
                                            }
                            
                                            return (
                                            <div key={index} className="mt-2">
                                                Case# {index+1}:
                                                <span className={`text-w ${caseClass}`}> {status}</span> <span> &#91;{result.time}s, {result.memory}kb&#93;</span> 
                                                {status==="WA" && <p>Output: {base64ToUnicode(result.stdout)}</p>}
                                            </div>
                                            );
                                        })
                                )}
                                {(!loading && verdict ==="CE") && (
                                    <div className='mt-2 whitespace-pre-wrap'>
                                        Compilation Error:
                                        {
                                            base64ToUnicode(testResults[0].compile_output)
                                        }
                                    </div>
                                )}
                            </div>
                    </div>                    
                </div>
            </Split>
            <EditorFooter handleSubmit={handleSubmit}/>
        </div>
    )
}
export default CodeEditor;

// function getBoilerPlateLang(){
//     const boilerPlateCPP = 
//     `#include <bits/stdc++.h>

//     using namespace std;
    
//     int main() {
//         return 0;
//     }`
//     const boilerPlatePython = 
//     ``;
//     const boilerPlateJava = 
//     `import java.io.*;
//     import java.util.*;
    
//     public class Main {
//         public static void main(String[] args) {
    
//         }
//     }`;

//     const [data, setData] = useState("");
//     const [user] = useAuthState(auth);

//     useEffect(() => {
//         const getUserLang = async() =>{
//             const userRef = doc(firestore,"users",user!.uid);
//             const userSnap = await getDoc(userRef);
//             if(userSnap.exists()){
//                 const data = userSnap.data();
//                 const {language} = data;
//                 if(language === "cpp"){
//                     setData(boilerPlateCPP)
//                 }else if(language === "java"){
//                     console.log("got here")
//                     setData(boilerPlateJava)
//                 }else{
//                     setData(boilerPlatePython)
//                 }
//             }
//         }
//         if(user) getUserLang();
//         return () => setData(boilerPlateCPP);
//     },[user])
//     return data;
// }