import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import store from "./store";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import Root from "./routes/root";
import ErrorPage from "./errorPage";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import Email from "./views/auth/Email";
import Code from "./views/auth/Code";
import PasswordReset from "./views/auth/PasswordReset";
import EditCustomersForm from "./components/Customers/EditCustomersForm";
import DesktopLoading from "./components/DesktopLoading";
import Users from "./views/Users";
import Reports from "./views/Reports";
import Customers from "./views/Customers/Customers";
import AddcustomerForm from "./components/Customers/AddCustomerForm";
import Stock from "./views/Stock";
import Sales from "./views/Sales";
import RoleGuard from "./components/RoleGuard";
import ActivityLogsView from "./views/ActivityLogsView";
import IssueToShop from "./views/IssueToShop";
import Settings from "./views/Settings";
import Loans from "./views/Loans";
import HPSales from "./views/HPSales";

const router = createBrowserRouter([
  {
    path: "/email",
    element: <Email />,
  },
  {
    path: "/passwordReset",
    element: <PasswordReset />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/code",
    element: <Code />,
  },
  // component to show the user is in the wrong route
  {
    path: "/error-page",
    element: <ErrorPage />,
  },
  {
    path: "/desktop-loading-page",
    element: <DesktopLoading />,
  },
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/dashboard",
        element: (
          <RoleGuard allowedRoles={["admin", "reports"]}>
            <Dashboard />
          </RoleGuard>
        ),
      },
      {
        path: "/customers",
        element: (
          <RoleGuard allowedRoles={["admin"]}>
            <Customers />
          </RoleGuard>
        ),
      },
      {
        path: "/addCustomersForm",
        element: <AddcustomerForm />,
      },
      {
        path: "/editStudentsForm",
        element: <EditCustomersForm />,
      },
      {
        path: "/logs",
        element: <ActivityLogsView />,
      },
      {
        path: "/users",
        element: (
          <RoleGuard allowedRoles={["admin"]}>
            <Users />
          </RoleGuard>
        ),
      },
      {
        path: "/sales",
        element: (
          <RoleGuard allowedRoles={["admin", "sales"]}>
            <Sales />
          </RoleGuard>
        ),
      },
      {
        path: "/hpsales",
        element: (
          <RoleGuard allowedRoles={["admin", "sales"]}>
            <HPSales />
          </RoleGuard>
        ),
      },
      {
        path: "/settings",
        element: (
          <RoleGuard allowedRoles={["admin", "settings"]}>
            <Settings />
          </RoleGuard>
        ),
      },
      {
        path: "/issue-to-shop",
        element: (
          <RoleGuard allowedRoles={["admin", "sales"]}>
            <IssueToShop />
          </RoleGuard>
        ),
      },
      {
        path: "/reports",
        element: (
          <RoleGuard allowedRoles={["admin", "reports"]}>
            <Reports />
          </RoleGuard>
        ),
      },
      {
        path: "/stock",
        element: (
          <RoleGuard allowedRoles={["admin", "stock"]}>
            <Stock />
          </RoleGuard>
        ),
      },
      {
        path: "/loans",
        element: (
          <RoleGuard allowedRoles={["admin", "reports"]}>
           <Loans/>
          </RoleGuard>
        ),
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
