import { configureStore } from "@reduxjs/toolkit";
import autoCoutReducer from "./slices/store";

const store = configureStore({
	reducer: { autocountStore: autoCoutReducer },
});
export default store;
