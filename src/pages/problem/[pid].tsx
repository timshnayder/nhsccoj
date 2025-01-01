/// Imports
// Components 
import Navbar from '@/components/Navbar/Navbar'; 
import Workspace from '@/components/Workspace/Workspace';

// Modules
import React from 'react'; // React
import { GetStaticProps, GetStaticPaths } from 'next'; // Next Module
import { Problem } from '@/utils/types/problem';

// Database
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';


// import { db } from '@/firebase/firebaseAdmin'; // Import Firestore Admin SDK setup

type ProblemPageProps = { // Creates type based on Util Params
    problem: Problem; // based on Problem
};

const ProblemPage: React.FC<ProblemPageProps> = ({ problem }) => { // Func
    if(!problem){ // If there is no problem:
        return <div>Problem not found</div> // Change page to 404 page
    }
    return ( // Return the problem page
        <div className='overflow-y-hidden'> 
            <Navbar problemPage={true} />  {/* add NavBar object */}
            <Workspace problem={problem} /> {/* add Workspace object (adds code editor, problem, description, test cases) */}
        </div>
    );
};

export default ProblemPage; // Allows Problem Page to be exported to other Pages

// Fetch all problem IDs for getStaticPaths
export const getStaticPaths: GetStaticPaths = async () => {
    try {
        // Fetch all problem document IDs
        const problemsCollection = collection(firestore,"problems");
        const snapshot = await getDocs(problemsCollection);
        const paths = snapshot.docs.map((doc) => ({
            params: { pid: doc.id }, // The `pid` will be the document ID
        }));

        return {
            paths,
            fallback: false, // Pre-render all paths returned from Firebase
        };
    } catch (error) {
        console.error('Error fetching paths:', error);
        return { paths: [], fallback: false };
    }
};

// Fetch the problem data by ID for getStaticProps
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { pid } = params as { pid: string };

    try {
        // Fetch the specific problem document from Firestore using the pid
        const docRef = doc(firestore, 'problems', pid);
        const problemDoc = await getDoc(docRef);

        if (!problemDoc.exists) {
            return { notFound: true }; // If the document doesn't exist, return 404
        }

        // Extract the data from the document
        const problem = {
            id: problemDoc.id,
            ...problemDoc.data(),
        } as Problem;

        return {
            props: {
                problem, // Pass the problem data as props to the page component
            },
        };
    } catch (error) {
        console.error('Error fetching problem data:', error);
        return { notFound: true }; // If an error occurs, return 404
    }
};