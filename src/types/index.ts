export type MenuItems = {
    id:number,
    name:string,
    description:string,
    duration:string,
    price:number,
    img:string
}

export type OrederItem = MenuItems & {
    quantity:number
}