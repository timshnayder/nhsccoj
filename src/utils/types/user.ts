//Object Structure
export type User = {
    displayName:string,
    email:string,
    createdAt: number,
    updatedAt: number,
    dislikedProblems:[string], 
    likedProblems:[string], 
    solvedProblems:[string], 
    starredProblems:[string],
    isAdmin:Boolean,
}