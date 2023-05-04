import { createSlice } from "@reduxjs/toolkit"


const initialState = {names:['ovodo','dizzle','voski']}


const nameSlice = createSlice({

    name:'names',
    initialState,
    reducers:{
        addNames(state,action){
            state.names.push(action.payload)
        }
    }

})










export const {addNames} = nameSlice.actions

export default nameSlice.reducer