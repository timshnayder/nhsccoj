/// Imports
// Components 
import Navbar from '@/components/Navbar/Navbar'; 

// Modules
import React from 'react'; // React
import { GetStaticProps, GetStaticPaths } from 'next'; // Next Module

// Database
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';
import Profile from '@/components/Profile/Profile';
import { User } from '@/utils/types/user';


// import { db } from '@/firebase/firebaseAdmin'; // Import Firestore Admin SDK setup

type ProblemPageProps = { // Creates type based on Util Params
    user: User; // based on Problem
};

const ProblemPage: React.FC<ProblemPageProps> = ({ user }) => { // Func
    if(!user){ // If there is no problem:
        return <div>User not found</div> // Change page to 404 page
    }
    return ( // Return the problem page
        <div className='overflow-y-hidden'> 
            <Navbar problemPage={true} />  {/* add NavBar object */}
            <Profile user={user} /> {/* add Workspace object (adds code editor, problem, description, test cases) */}
        </div>
    );
};

export default ProblemPage; // Allows Problem Page to be exported to other Pages

// Fetch all problem IDs for getStaticPaths
export const getStaticPaths: GetStaticPaths = async () => {
    try {
        // Fetch all problem document IDs
        const usersSnapshot = await getDocs(collection(firestore, 'users'));
        const paths = usersSnapshot.docs.map(doc => ({
            params: { displayName: doc.data().displayName },
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
    const { displayName } = params as { displayName: string };
    try {
        // Fetch the specific problem document from Firestore using the pid

        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('displayName', '==', displayName));
        const userSnapshot = await getDocs(q);

        if (userSnapshot.empty) {
            return { notFound: true };
        }

        // Extract the data from the document
        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();

        return {
            props: { user: userData }
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        return { notFound: true }; // If an error occurs, return 404
    }
};