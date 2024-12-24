import Editor from "@monaco-editor/react";
import { auth, firestore } from '@/firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { AiFillDislike, AiFillLike, AiFillStar } from 'react-icons/ai';
import { BsCheck2Circle } from 'react-icons/bs';
import Split from 'react-split';
import { useAuthState } from "react-firebase-hooks/auth";
import Navbar from "@/components/Navbar/Navbar";

type indexProps = {
    
};

const index:React.FC<indexProps> = () => {
	const [user] = useAuthState(auth);
	const access = getUserAccess();
	const [loading, setLoading] = useState(true);
	

    const [difficultyClass, setDifficultyClass] = useState("text-white bg-white");
    const defaultCode = `<div class="mt-3"> </div>`
    const [inputs, setInputs] = useState({
        id:'',
        title:'',
        statement:'',
        difficulty:'',
        category:'',
        editorial:'',
        link:'',
        inputs:[""],
        outputs:[""],
        likes:0,
        dislikes:0,
    })

	const handleAddRow = () => {
		setInputs((prev) => ({
		  ...prev,
		  inputs: [...prev.inputs, ""],
		  outputs: [...prev.outputs, ""],
		}));
	};
	const handleRemoveRow = (index: number) => {
		setInputs((prev) => ({
		  ...prev,
		  inputs: prev.inputs.filter((_, i) => i !== index),
		  outputs: prev.outputs.filter((_, i) => i !== index),
		}));
	};
	const handleIOChange = (type: "inputs" | "outputs", index: number, value: string) =>{
		setInputs((prev) => {
			const updatedArray = [...prev[type]];
			updatedArray[index] = value;
			return { ...prev, [type]: updatedArray };
		  });
	}
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setInputs({...inputs, [e.target.name]: e.target.value})
      }
    useEffect(()=>{
        setDifficultyClass(
            inputs.difficulty === "Easy" ? "bg-olive text-olive" : 
            inputs.difficulty === "Medium" ? "bg-dark-yellow text-dark-yellow":
            inputs.difficulty === "Hard" ? "bg-[#dd4444] text-[#dd4444]":
            "bg-white text-white"
        )
        
    })
    
    const handleStatementChange = (value:string|undefined) =>{
        
        if(value){
            setInputs((prevInputs) => ({
                ...prevInputs,
                statement: value,
              }));
        }      
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        await setDoc(doc(firestore, "problems", inputs.id),inputs);
        alert("Saved to DB");
    }


    return <>
		{!user && (
			<div className="bg-dark-layer-2 min-h-screen text-center text-lg text-white py-10">You must be an admin to view this page</div>
		)}
		{!access && user && (
			<div className="bg-dark-layer-2 min-h-screen text-center text-lg text-white py-10">You must be an admin to view this page</div>
		)}
		{access && (
			<div className="bg-dark-layer-2 min-h-screen">
			<Navbar/>
			<Split className='split' minSize={0}>
    
			<div className='pl-4 overflow-y-scroll h-[calc(100vh-60px)] relative'>
				<form className='py-6 flex flex-col max-w-sm gap-3'>
				<input onChange={handleInputChange} type="text" placeholder='problem id' name='id' />
				<input onChange={handleInputChange} type="text" placeholder='title' name='title' />
				{/* <input className="h-[200px]  overflow-scroll" onChange={handleInputChange} type="text" placeholder='statement' name='statement' /> */}
				<input onChange={handleInputChange} type="text" placeholder='difficulty' name='difficulty' />
				<input onChange={handleInputChange} type="text" placeholder='category' name='category' />
				<input onChange={handleInputChange} type="text" placeholder='link?' name='link' />
				</form>
				<p className="text-white">Statement</p>
				<Editor
					height="calc(100vh - 320px)"
					width="100%"
					theme="vs-dark"
					defaultLanguage="html"
					defaultValue={defaultCode}
					value={inputs.statement}
					onChange={handleStatementChange}
				/>
		
				<div className="">
					<div className="text-white font-medium">Test Cases</div>
					{inputs.inputs.map((pair, index) => (
					<div
						key={index}
						style={{
						display: "flex",
						alignItems: "center",
						marginBottom: "8px",
						}}
					>
						{/*Input Box */}
						<input
						type="text"
						value={inputs.inputs[index]}
						onChange={(e) => handleIOChange("inputs", index, e.target.value)}
						placeholder="Input"
						style={{
							padding: "5px",
							fontSize: "16px",
							marginRight: "8px",
							width: "150px",
						}}
						/>
						{/* Output Box */}
						<input
						type="text"
						value={inputs.outputs[index]}
						onChange={(e) => handleIOChange("outputs", index, e.target.value)}
						placeholder="Expected Output"
						style={{
							padding: "5px",
							fontSize: "16px",
							marginRight: "8px",
							width: "150px",
						}}
						/>
						{/* Add Button */}
						<button
						onClick={handleAddRow}
						style={{
							padding: "5px 10px",
							marginRight: "8px",
							backgroundColor: "#4CAF50",
							color: "white",
							border: "none",
							cursor: "pointer",
						}}
						>
						+
						</button>
						{/* Remove Button */}
						{inputs.inputs.length > 1 && (
						<button
							onClick={() => handleRemoveRow(index)}
							style={{
							padding: "5px 10px",
							backgroundColor: "#f44336",
							color: "white",
							border: "none",
							cursor: "pointer",
							}}
						>
							-
						</button>
						)}
					</div>
					))}
					{/* Submit Button */}
					<button
					onClick={handleSubmit}
					style={{
						marginTop: "8px",
						padding: "10px 20px",
						backgroundColor: "#2196F3",
						color: "white",
						border: "none",
						cursor: "pointer",
						
					}}
					
					>
					Save to DB
					</button>
				</div>
		
			</div>
		
			{/* PREVIEW */}
			<div className='bg-dark-layer-1'>
				{/* TAB */}
				<div className='flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden'>
					<div className={"bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"}>
						Description
					</div>
				</div>
				
				<div className='flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto'>
					<div className='px-5'>
						{/* Problem heading */}
						<div className='w-full'>
							<div className='flex space-x-4'>
								<div className='flex-1 mr-2 text-lg text-white font-medium'>{inputs.title}</div>
							</div>
							
								<div className='flex items-center mt-3'>
									<div className={`inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize ${difficultyClass} `}>
										{inputs.difficulty}
									</div>
									
										<div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s'>
											<BsCheck2Circle />
										</div>
									
									<div
										className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6'
									>
										<AiFillLike />
		
		
										<span className='text-xs'>{inputs.likes}</span>
									</div>
									<div
										className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6'
									>
										<AiFillDislike/>
		
										<span className='text-xs'>{inputs.dislikes}</span>
									</div>
									<div
										className='cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 '
									>
										<AiFillStar/>
										
										
									</div>
								</div>
							
								
		
							{/* Problem Statement(paragraphs) */}
							<div className="text-white">
								<div dangerouslySetInnerHTML={{ __html: inputs.statement}} />
							</div>
							
						</div>
					</div>
				</div>
			</div>
			</Split>
			</div>
		)}
	</> 

	
}
export default index;

function getUserAccess(){
	const [data,setData] = useState(false);
	const [user] = useAuthState(auth);
	useEffect(()=>{
		const getIfUserAdmin = async() =>{
			const userRef = doc(firestore,"users",user!.uid);
			const userSnap = await getDoc(userRef);
			if(userSnap.exists()){
				const data = userSnap.data();
				const {isAdmin} = data;
				setData(isAdmin || false);
			}
		}
		if(user) getIfUserAdmin();
		return () => setData(false);
	},[user])
	return data;
}

