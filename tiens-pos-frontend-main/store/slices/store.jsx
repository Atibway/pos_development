import axiosInstance from "../../axios-instance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getCartegories = createAsyncThunk("/autocount/cartegories", async () => {
	const cartegories = await axiosInstance.get("/categories");
	const { data } = cartegories;
	const { status, payload } = data;
	if (status) return payload;
});


export const getStock = createAsyncThunk("/autocount/stock", async (
	page = 1,
) => {
	const stock = await axiosInstance.get("/stock?page=" + page);
	const { data } = stock;
	const { status, payload } = data;
	if (status) return payload;
});


export const getSales = createAsyncThunk("/autocount/sales", async (
	page = 1,
) => {
	const sales = await axiosInstance.get("/sales?page=" + page);
	const { data } = sales;
	const { status, payload } = data;
	if (status) return payload;
});

export const getTodaySales = createAsyncThunk("/autocount/todaySales", async () => {
	const today = new Date().toISOString().slice(0, 10);
	const sales = await axiosInstance.get("/sales/by-date?date=" + today);
	const { data } = sales;
	const { status, payload } = data;
	if (status) return payload;
});


export const getCustomers = createAsyncThunk("/autocount/customers", async () => {
	const customers = await axiosInstance.get("/customers");
	const { data } = customers;
	const { status, payload } = data;
	if (status) return payload;
});

export const getAllStock = createAsyncThunk("/autocount/allStock", async () => {
	const stock = await axiosInstance.get("/stock/all");
	const { data } = stock;
	const { status, payload } = data;
	if (status) return payload;
});

export const getBankReport = createAsyncThunk("/autocount/bankReport", async (
	{ startDate, endDate },
) => {
	const report = await axiosInstance.get("/sales/bank-report?startDate=" + startDate + "&endDate=" + endDate);
	const { data } = report;
	const { status, payload } = data;
	if (status) return payload;
});


export const getExpenseReport = createAsyncThunk("/autocount/expenseRport", async (
	{
		search = "",
		startDate = "",
		endDate = "",
		type = "",
	}
) => {
	const report = await axiosInstance.get("/expenses/search?search=" + search + "&startDate=" + startDate + "&endDate=" + endDate + "&type=" + type);
	const { data } = report;
	const { status, payload } = data;
	if (status) return payload;
});


export const getAccounts = createAsyncThunk("/autocount/accounts", async () => {
	const accounts = await axiosInstance.get("/accounts");
	const { data } = accounts;
	const { status, payload } = data;
	if (status) return payload;
});

export const getTopStock = createAsyncThunk("/autocount/topStock", async () => {
	const stock = await axiosInstance.get("/stock/top");
	const { data } = stock;
	const { status, payload } = data;
	if (status) return payload;
});

export const getStaff = createAsyncThunk("/autocount/staff", async () => {
	const staff = await axiosInstance.get("/staff");
	const { data } = staff;
	const { status, payload } = data;
	if (status) return payload;
});

export const autoCountSlices = createSlice({
	name: "AutoCountStore",
	initialState: {
		cartegories: [],
		stock: [],
		sales: [],
		todaySales: [],
		customers: [],
		allStock: [],
		bankReport: [],
		expenseReport: [],
		accounts: [],
		topStock: [],
		staff: [],
		loading: {
			cartegories: false,
			stock: false,
			sales: false,
			todaySales: false,
			customers: false,
			allStock: false,
			bankReport: false,
			expenseReport: false,
			accounts: false,
			topStock: false,
			staff: false,
		},
	},
	extraReducers: (builder) => {
		/* [getCartegories.pending]: (state) => {
			state.loading.cartegories = true;
		},
		[getCartegories.fulfilled]: (state, action) => {
			state.loading.cartegories = false;
			state.cartegories = action.payload;
		},
		[getCartegories.rejected]: (state) => {
			state.loading.cartegories = false;
		},
		[getStock.pending]: (state) => {
			state.loading.stock = true;
		},
		[getStock.fulfilled]: (state, action) => {
			state.loading.stock = false;
			state.stock = action.payload;
		},
		[getStock.rejected]: (state) => {
			state.loading.stock = false;
		},
		[getSales.pending]: (state) => {
			state.loading.sales = true;
		},
		[getSales.fulfilled]: (state, action) => {
			state.loading.sales = false;
			state.sales = action.payload;
		},
		[getSales.rejected]: (state) => {
			state.loading.sales = false;
		},
		[getTodaySales.pending]: (state) => {
			state.loading.todaySales = true;
		},
		[getTodaySales.fulfilled]: (state, action) => {
			state.loading.todaySales = false;
			state.todaySales = action.payload;
		},
		[getTodaySales.rejected]: (state) => {
			state.loading.todaySales = false;
		},
		[getCustomers.pending]: (state) => {
			state.loading.customers = true;
		},
		[getCustomers.fulfilled]: (state, action) => {
			state.loading.customers = false;
			state.customers = action.payload;
		},
		[getCustomers.rejected]: (state) => {
			state.loading.customers = false;
		},
		[getAllStock.pending]: (state) => {
			state.loading.allStock = true;
		},
		[getAllStock.fulfilled]: (state, action) => {
			state.loading.allStock = false;
			state.allStock = action.payload;
		},
		[getAllStock.rejected]: (state) => {
			state.loading.allStock = false;
		},
		[getBankReport.pending]: (state) => {
			state.loading.bankReport = true;
		},
		[getBankReport.fulfilled]: (state, action) => {
			state.loading.bankReport = false;
			state.bankReport = action.payload;
		},
		[getBankReport.rejected]: (state) => {
			state.loading.bankReport = false;
		},
		[getExpenseReport.pending]: (state) => {
			state.loading.expenseReport = true;
		},
		[getExpenseReport.fulfilled]: (state, action) => {
			state.loading.expenseReport = false;
			state.expenseReport = action.payload;
		},
		[getExpenseReport.rejected]: (state) => {
			state.loading.expenseReport = false;
		},
		[getAccounts.pending]: (state) => {
			state.loading.accounts = true;
		},
		[getAccounts.fulfilled]: (state, action) => {
			state.loading.accounts = false;
			state.accounts = action.payload;
		},
		[getAccounts.rejected]: (state) => {
			state.loading.accounts = false;
		},
		[getTopStock.pending]: (state) => {
			state.loading.topStock = true;
		},
		[getTopStock.fulfilled]: (state, action) => {
			state.loading.topStock = false;
			state.topStock = action.payload;
		},
		[getTopStock.rejected]: (state) => {
			state.loading.topStock = false;
		},
		[getStaff.pending]: (state) => {
			state.loading.staff = true;
		},
		[getStaff.fulfilled]: (state, action) => {
			state.loading.staff = false;
			state.staff = action.payload;
		},
		[getStaff.rejected]: (state) => {
			state.loading.staff = false;
		}, */

		builder.addCase(getCartegories.pending, (state) => {
			state.loading.cartegories = true;
		});

		builder.addCase(getCartegories.fulfilled, (state, action) => {
			state.loading.cartegories = false;
			state.cartegories = action.payload;
		});

		builder.addCase(getCartegories.rejected, (state) => {
			state.loading.cartegories = false;
		});

		builder.addCase(getStock.pending, (state) => {
			state.loading.stock = true;
		});

		builder.addCase(getStock.fulfilled, (state, action) => {
			state.loading.stock = false;
			state.stock = action.payload;
		});

		builder.addCase(getStock.rejected, (state) => {
			state.loading.stock = false;
		});

		builder.addCase(getSales.pending, (state) => {
			state.loading.sales = true;
		});

		builder.addCase(getSales.fulfilled, (state, action) => {
			state.loading.sales = false;
			state.sales = action.payload;
		});

		builder.addCase(getSales.rejected, (state) => {
			state.loading.sales = false;
		});

		builder.addCase(getTodaySales.pending, (state) => {
			state.loading.todaySales = true;
		});

		builder.addCase(getTodaySales.fulfilled, (state, action) => {
			state.loading.todaySales = false;
			state.todaySales = action.payload;
		});

		builder.addCase(getTodaySales.rejected, (state) => {
			state.loading.todaySales = false;
		});

		builder.addCase(getCustomers.pending, (state) => {
			state.loading.customers = true;
		});

		builder.addCase(getCustomers.fulfilled, (state, action) => {
			state.loading.customers = false;
			state.customers = action.payload;
		});

		builder.addCase(getCustomers.rejected, (state) => {
			state.loading.customers = false;
		});

		builder.addCase(getAllStock.pending, (state) => {
			state.loading.allStock = true;
		});

		builder.addCase(getAllStock.fulfilled, (state, action) => {
			state.loading.allStock = false;
			state.allStock = action.payload;
		});

		builder.addCase(getAllStock.rejected, (state) => {
			state.loading.allStock = false;
		});

		builder.addCase(getBankReport.pending, (state) => {
			state.loading.bankReport = true;
		});

		builder.addCase(getBankReport.fulfilled, (state, action) => {
			state.loading.bankReport = false;
			state.bankReport = action.payload;
		});

		builder.addCase(getBankReport.rejected, (state) => {
			state.loading.bankReport = false;
		});

		builder.addCase(getExpenseReport.pending, (state) => {
			state.loading.expenseReport = true;
		});

		builder.addCase(getExpenseReport.fulfilled, (state, action) => {
			state.loading.expenseReport = false;
			state.expenseReport = action.payload;
		});

		builder.addCase(getExpenseReport.rejected, (state) => {
			state.loading.expenseReport = false;
		});

		builder.addCase(getAccounts.pending, (state) => {
			state.loading.accounts = true;
		});

		builder.addCase(getAccounts.fulfilled, (state, action) => {
			state.loading.accounts = false;
			state.accounts = action.payload;
		});

		builder.addCase(getAccounts.rejected, (state) => {
			state.loading.accounts = false;
		});

		builder.addCase(getTopStock.pending, (state) => {
			state.loading.topStock = true;
		});

		builder.addCase(getTopStock.fulfilled, (state, action) => {
			state.loading.topStock = false;
			state.topStock = action.payload;
		});

		builder.addCase(getTopStock.rejected, (state) => {
			state.loading.topStock = false;
		});

		builder.addCase(getStaff.pending, (state) => {
			state.loading.staff = true;
		});

		builder.addCase(getStaff.fulfilled, (state, action) => {
			state.loading.staff = false;
			state.staff = action.payload;
		});

		builder.addCase(getStaff.rejected, (state) => {
			state.loading.staff = false;
		});

	}
});




export default autoCountSlices.reducer;
