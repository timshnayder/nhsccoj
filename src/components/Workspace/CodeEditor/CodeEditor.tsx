import React, { useEffect, useState } from 'react';
import EditorNav from './EditorNav/EditorNav';
import Split from 'react-split';

import Editor from "@monaco-editor/react";

// import CodeMirror from '@uiw/react-codemirror'
// import { tokyoNightStorm } from '@uiw/codemirror-theme-tokyo-night-storm';

import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import EditorFooter from './EditorFooter';
import { Problem } from '@/utils/types/problem';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import { auth, firestore } from '@/firebase/firebase';
import { useRouter } from 'next/router';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import Axios , {AxiosResponse, AxiosError} from 'axios';

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

    const [loading,setLoading] = useState(false);
    const [userCode, setUserCode] = useState("//some comment");
    const [userLang, setUserLang] = useState("cpp");
    const [testResults, setTestResults] = useState<any[]>([]);
    const [verdict, setVerdict] = useState("");
    const [userTheme, setUserTheme] = useState("vs-dark");
    const [fontSize, setFontSize] = useState("16");
    let boilerPlate;

    const options = {
        fontSize: fontSize
    }

    const [user] = useAuthState(auth);
    
    const {query: {pid}} = useRouter();
    const handleSubmit = async () => {

        setLoading(true);
        if(!user){
            toast.error("Please login to submit your code", {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });
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
            
            const res = await Axios.post(`http://localhost:8000/compile`, {
                code: userCode,
                language: userLang,
                pid: pid,
                inputs: problem.inputs,
                outputs: problem.outputs,
            })
            if(res){
                setTestResults(res.data.results);
                setVerdict(res.data.verdict);
                if(res.data.verdict === "AC"){
                    console.log("passed");
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
            }
        }catch(err){
            setVerdict("CE");

            console.error(err);
        }finally{
            setLoading(false);
        }
        
        
    }
    useEffect(()=>{
        const code=localStorage.getItem(`code-${pid}`);
        if(user){
            setUserCode(code?JSON.parse(code):boilerPlateCPP);
        }else{
            // boilerPlate=getBoilerPlateLang();
            setUserCode(boilerPlateCPP);
        }
    },[pid,user])
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
    const onChange = (value:string|undefined) =>{
        if(value){
            setUserCode(value);
        }
        localStorage.setItem(`code-${pid}`, JSON.stringify(value))
    }


    return (
        // issue with email appearing under is because of something here i think?! 
        // changing z to negative 10 makes it so u can see it, but then you cant click anything
        <div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>
            <EditorNav setUserLang={setUserLang} userLang={userLang}/>
            <Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60,40]} minSize={60}>
                <div className="w-full overflow-y-hidden">
                    <Editor
                         options={options}
                         height="calc(100vh - 50px)"
                         width="100%"
                         theme={userTheme}
                         language={userLang}
                         defaultValue={boilerPlate}
                         value={userCode}
                         onChange={onChange}
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

                                {(!loading && (verdict === "AC" || verdict === "WA"))  && (
                                        testResults.map((result, index) => {
                                            let caseClass = "text-white";  // default case
                                            if (result.status === "AC") {
                                                caseClass = "text-green-500";
                                            } else if (result.status === "WA") {
                                                caseClass = "text-red-500";
                                            } else if (result.status === "CE") {
                                                caseClass = "text-yellow-500";
                                            }
    
                                            if (result.status === 'CE') {
                                            return (
                                                <div key={index} className="">
                                                <h3>Compilation Error</h3>
                                                <p>{result.error}</p>
                                                </div>
                                            );
                                            }
                                            
                                            return (
                                            <div key={index} className="mt-2">
                                                Case# {index + 1}:
                                                
                                                <span className={`text-w ${caseClass}`}> {result.status}</span> 
                                                {result.status==="WA" && <p>Output: {result.output.output}</p>}
                                                
                                                
                                            </div>
                                            );
                                        })
                                )}
                                {(!loading && verdict ==="CE") && (
                                    <div className='whitespace-pre'>

                                        {testResults[0]?.output?.output}
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