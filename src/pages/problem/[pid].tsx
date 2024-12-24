import Navbar from '@/components/Navbar/Navbar';
import { GetStaticProps, GetStaticPaths } from 'next';
import Workspace from '@/components/Workspace/Workspace';
import React from 'react';
import { Problem } from '@/utils/types/problem';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';
// import { db } from '@/firebase/firebaseAdmin'; // Import Firestore Admin SDK setup

type ProblemPageProps = {
    problem: Problem;
};

const ProblemPage: React.FC<ProblemPageProps> = ({ problem }) => {
    if(!problem){
        return <div>Problem not found</div>
    }
    return (
        <div className='overflow-y-hidden'>
            <Navbar problemPage={true} />
            <Workspace problem={problem} />
        </div>
    );
};

export default ProblemPage;

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