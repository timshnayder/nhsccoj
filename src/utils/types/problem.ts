//local
export type Problem = {
    id:string,
    title:string,
    statement:string,
    difficulty:string,
    category:string,
    editorial?:string,
    link?:string,
    inputs:[string],
    outputs:[string],
    likes:number,
    dislikes:number,
}