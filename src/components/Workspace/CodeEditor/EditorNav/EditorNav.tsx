import { auth, firestore } from '@/firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { AiOutlineFullscreen, AiOutlineSetting } from 'react-icons/ai';

type EditorNavProps = {
    userLang: string;
    setUserLang: React.Dispatch<React.SetStateAction<string>>;
    handleReset: ()=> void;
};

const EditorNav:React.FC<EditorNavProps> = ({setUserLang, userLang, handleReset}) => {
    const [user] = useAuthState(auth);


    useEffect(() => {
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
      }, [user]);

    const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>)=>{
        const newLang = e.target.value;
        setUserLang(newLang);


        if(user){
            try{
                const userDoc = doc(firestore, "users", user.uid);
                await updateDoc(userDoc, {
                    language: newLang,
                }) ;
                console.log("Language updated")
            }catch(err){
                console.error("Error updating languages");
            }
        }
        
    }


    return <div className='flex items-center justify-between bg-dark-layer-2 h-11 w-full overflow-y-hidden'>
        <div className='flex items-center text-white dropdown'>
            <select 
            name={userLang}
            id="language" 
            className='flex cursor-pointer items-center rounded text-left focus:outline-none bg-dark-fill-3 text-dark-label-2
            hover:bg-dark-fill-2 px-2 py-1.5 font-medium'
            value={userLang}
            onChange={handleLanguageChange}
            >             
                <option className="text-white bg-dark-layer-1" value="cpp">C++</option>
                <option className=" bg-dark-layer-1" value="python">Python</option>
                <option className=" bg-dark-layer-1" value="java">Java</option>

            </select>
            <button className='ml-4 flex cursor-pointer items-center rounded text-left focus:outline-none bg-dark-fill-3 text-dark-label-2
            hover:bg-dark-fill-2 px-2 py-1.5 font-medium'
            onClick={handleReset}
            >Reset</button>
        </div>
        
        
        {/* <div className='flex items-center m-2'>
            <button className='relative rounded px-3 py-1.5 font-medium items-center transition-all focus-outline-none inline-flex ml-auto p-1 mr-2
            hover:bg-dark-fill-3 gruop'>
                <div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
                    <AiOutlineSetting/>
                </div>
                <div className='absolute w-auto p-2 text-sm m-2 min-w-max translate-x-3 right-0 top-5 z-10 rounded-md shadow-md text-dark-layer-2
                bg-gray-200 origin-center scale-0 transition-all duration-100 ease-linear group-hover:scale-100'> 
                    Settings
                </div>
            </button>
        </div> */}
    </div>
}
export default EditorNav;

// function useGetCurLanguage(){
//     const [data, setData] = useState("cpp");
//     const [user] = useAuthState(auth);
//     useEffect(()=>{
//         const getUserCurrentLang = async() =>{
//             const userRef = doc(firestore,"users",user!.uid);
//             const userSnap = await getDoc(userRef);
//             if(userSnap.exists()){
//                 const data = userSnap.data();
//                 const {language} = data;
//                 setData(language);
//             }
//         }
//         if(user) getUserCurrentLang();
//         return () => setData("cpp");
//     },[user])
//     return data;
// }