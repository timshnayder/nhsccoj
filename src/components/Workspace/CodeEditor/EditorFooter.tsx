import React from 'react';
import { BsChevronUp } from 'react-icons/bs';

type EditorFooterProps = {
    handleSubmit: ()=> void;
};

const EditorFooter:React.FC<EditorFooterProps> = ({handleSubmit}) => {
    
    return (
        <div className='flex  absolute bottom-0 z-0 w-full'>
			<div className='mx-5 my-[10px] flex justify-between w-full'>
				<div className='ml-auto flex items-center space-x-4'>
					<button
						className='px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex text-sm text-white bg-dark-green-s hover:bg-green-3 rounded-lg'
						onClick={handleSubmit}
					>
						Submit
					</button>
				</div>
			</div>
		</div>
    )
}
export default EditorFooter;